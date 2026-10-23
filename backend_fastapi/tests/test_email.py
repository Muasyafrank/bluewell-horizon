"""Outbound email: Gmail SMTP by default, Gmail's web API over HTTPS when authorised."""
import base64
import email as stdlib_email
import io
import json
import urllib.error
import urllib.parse

import pytest

import gmail_authorize
from config import settings
from core import email as mail


@pytest.fixture(autouse=True)
def clean(monkeypatch):
    for name in ("email_user", "email_pass", "gmail_client_id", "gmail_client_secret", "gmail_refresh_token"):
        monkeypatch.setattr(settings, name, None)
    mail._token_cache.update(value=None, expires_at=0.0)


def authorised(monkeypatch):
    monkeypatch.setattr(settings, "email_user", "shop@example.com")
    monkeypatch.setattr(settings, "gmail_client_id", "cid")
    monkeypatch.setattr(settings, "gmail_client_secret", "csecret")
    monkeypatch.setattr(settings, "gmail_refresh_token", "refresh")


class Response:
    def __init__(self, payload=b"{}"):
        self.payload = payload

    def __enter__(self): return self
    def __exit__(self, *a): return False
    def read(self): return self.payload


def fake_google(monkeypatch, calls, token_status=200, send_status=200):
    def urlopen(request, timeout):
        calls.append(request)
        if request.full_url == mail.TOKEN_URL:
            if token_status != 200:
                raise urllib.error.HTTPError(request.full_url, token_status, "x", {}, io.BytesIO(b'{"error":"invalid_grant"}'))
            return Response(json.dumps({"access_token": "tok", "expires_in": 3600}).encode())
        if send_status != 200:
            raise urllib.error.HTTPError(request.full_url, send_status, "x", {}, io.BytesIO(b'{"error":"denied"}'))
        return Response()
    monkeypatch.setattr(mail.urllib.request, "urlopen", urlopen)
    monkeypatch.setattr(mail.smtplib, "SMTP", lambda *a, **k: pytest.fail("SMTP must not be used"))


def test_nothing_is_configured_by_default():
    assert mail.email_is_configured() is False


def test_smtp_needs_both_user_and_password(monkeypatch):
    monkeypatch.setattr(settings, "email_user", "shop@example.com")
    assert mail.email_is_configured() is False
    monkeypatch.setattr(settings, "email_pass", "secret")
    assert mail.email_is_configured() is True


def test_the_web_api_needs_all_three_google_values_and_a_sender(monkeypatch):
    monkeypatch.setattr(settings, "gmail_client_id", "cid")
    monkeypatch.setattr(settings, "gmail_client_secret", "csecret")
    assert mail.email_is_configured() is False
    monkeypatch.setattr(settings, "gmail_refresh_token", "refresh")
    assert mail.email_is_configured() is False  # no EMAIL_USER
    monkeypatch.setattr(settings, "email_user", "shop@example.com")
    assert mail.email_is_configured() is True


def test_the_web_api_sends_a_real_message_over_https(monkeypatch):
    authorised(monkeypatch)
    calls = []
    fake_google(monkeypatch, calls)

    mail.send_email("Quotation\nQT-1 — ready", "<p>Hi “Amina”</p>", to="buyer@example.com", cc="shop@example.com")

    token_call, send_call = calls
    form = urllib.parse.parse_qs(token_call.data.decode())
    assert form["grant_type"] == ["refresh_token"] and form["refresh_token"] == ["refresh"]
    assert send_call.full_url == mail.SEND_URL
    assert send_call.get_header("Authorization") == "Bearer tok"
    sent = stdlib_email.message_from_bytes(base64.urlsafe_b64decode(json.loads(send_call.data)["raw"]))
    assert sent["To"] == "buyer@example.com" and sent["Cc"] == "shop@example.com"
    assert sent["From"] == "shop@example.com"
    assert "\n" not in str(sent["Subject"])
    assert "Hi “Amina”" in sent.get_payload(decode=True).decode("utf-8")
    assert sent.get_content_type() == "text/html"


def test_the_access_token_is_reused_until_it_expires(monkeypatch):
    authorised(monkeypatch)
    calls = []
    fake_google(monkeypatch, calls)
    mail.send_email("One", "<p>1</p>", to="a@example.com")
    mail.send_email("Two", "<p>2</p>", to="b@example.com")
    assert [c.full_url for c in calls] == [mail.TOKEN_URL, mail.SEND_URL, mail.SEND_URL]


def test_a_rejected_refresh_token_is_reported(monkeypatch):
    authorised(monkeypatch)
    fake_google(monkeypatch, [], token_status=400)
    with pytest.raises(RuntimeError, match="Google sign-in failed.*400.*invalid_grant"):
        mail.send_email("Hi", "<p>x</p>", to="buyer@example.com")


def test_a_rejected_send_is_reported_and_drops_the_cached_token(monkeypatch):
    authorised(monkeypatch)
    fake_google(monkeypatch, [], send_status=403)
    with pytest.raises(RuntimeError, match="Gmail send failed.*403"):
        mail.send_email("Hi", "<p>x</p>", to="buyer@example.com")
    assert mail._token_cache["value"] is None


def test_nothing_happens_when_unconfigured():
    mail.send_email("Hi", "<p>x</p>", to="buyer@example.com")  # must not raise or connect


def test_smtp_still_works_with_an_app_password(monkeypatch):
    monkeypatch.setattr(settings, "email_user", "shop@example.com")
    monkeypatch.setattr(settings, "email_pass", "secret")
    log = []

    class Server:
        def __init__(self, host, port, timeout): log.append(("connect", host, port))
        def __enter__(self): return self
        def __exit__(self, *a): return False
        def starttls(self): log.append("tls")
        def login(self, user, password): log.append(("login", user))
        def send_message(self, message): log.append(("send", message["To"], message["Subject"]))

    monkeypatch.setattr(mail.smtplib, "SMTP", Server)
    mail.send_email("Hello", "<p>x</p>", to="buyer@example.com")
    assert log == [("connect", "smtp.gmail.com", 587), "tls", ("login", "shop@example.com"),
                   ("send", "buyer@example.com", "Hello")]


# ---- the one-time authorisation script ------------------------------------------

def test_the_authorisation_link_asks_only_for_permission_to_send():
    url = gmail_authorize.build_auth_url("cid", "st")
    query = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    assert query["scope"] == ["https://www.googleapis.com/auth/gmail.send"]
    assert query["access_type"] == ["offline"] and query["state"] == ["st"]


def test_the_redirect_must_carry_our_state_and_a_code():
    good = "http://localhost:8765/?code=abc&state=st"
    assert gmail_authorize.code_from_redirect(good, "st") == "abc"
    for bad in ("http://localhost:8765/?code=abc&state=other", "http://localhost:8765/?state=st",
                "http://localhost:8765/?error=access_denied&state=st"):
        with pytest.raises(SystemExit):
            gmail_authorize.code_from_redirect(bad, "st")
