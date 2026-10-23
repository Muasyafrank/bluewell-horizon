"""
Outbound email, shared by contact, quote, order, quotation and invoice mail.

Two ways to reach the same Gmail account:

* SMTP with an app password (`EMAIL_USER` + `EMAIL_PASS`), the default.
* Gmail's web API over HTTPS (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`,
  `GMAIL_REFRESH_TOKEN`). Used when all three are set, for networks and hosts
  that block the SMTP ports. Mail is still sent from, and stored in, that
  Gmail account.

Use `send_email_safely` from request handlers (via FastAPI's BackgroundTasks):
it never raises, so a mail-server problem cannot fail the request that
triggered it, and it runs after the response has been sent.
"""
import base64
import json
import logging
import smtplib
import time
import urllib.error
import urllib.parse
import urllib.request
from email.message import EmailMessage

from config import settings

logger = logging.getLogger(__name__)

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_TIMEOUT_SECONDS = 15

TOKEN_URL = "https://oauth2.googleapis.com/token"
SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"

_token_cache: dict = {"value": None, "expires_at": 0.0}


def _single_line(value: str) -> str:
    """Header values must not contain line breaks (header injection)."""
    return " ".join(value.splitlines())


def business_address() -> str | None:
    """The address mail is sent from, and copied to so the business keeps a record."""
    return settings.email_user


def _uses_gmail_api() -> bool:
    return bool(settings.gmail_client_id and settings.gmail_client_secret and settings.gmail_refresh_token)


def email_is_configured() -> bool:
    if _uses_gmail_api():
        return bool(settings.email_user)
    return bool(settings.email_user and settings.email_pass)


def _build_message(subject: str, body: str, to: str, cc: str | None) -> EmailMessage:
    message = EmailMessage()
    message["From"] = settings.email_user
    message["To"] = _single_line(to)
    if cc:
        message["Cc"] = _single_line(cc)
    message["Subject"] = _single_line(subject)
    message.set_content(body, subtype="html")
    return message


def _post(url: str, data: bytes, headers: dict, what: str) -> dict:
    request = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=SMTP_TIMEOUT_SECONDS) as response:
            raw = response.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "replace")[:300]
        raise RuntimeError(f"{what} failed ({error.code}): {detail}") from error


def _access_token() -> str:
    """A short-lived Gmail access token, refreshed from the long-lived refresh token."""
    if _token_cache["value"] and time.time() < _token_cache["expires_at"] - 60:
        return _token_cache["value"]
    form = urllib.parse.urlencode({
        "client_id": settings.gmail_client_id,
        "client_secret": settings.gmail_client_secret,
        "refresh_token": settings.gmail_refresh_token,
        "grant_type": "refresh_token",
    }).encode()
    data = _post(TOKEN_URL, form, {"content-type": "application/x-www-form-urlencoded"}, "Google sign-in")
    _token_cache["value"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + int(data.get("expires_in", 3600))
    return _token_cache["value"]


def _send_via_gmail_api(message: EmailMessage) -> None:
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode("ascii")
    headers = {"authorization": f"Bearer {_access_token()}", "content-type": "application/json"}
    try:
        _post(SEND_URL, json.dumps({"raw": raw}).encode(), headers, "Gmail send")
    except RuntimeError:
        _token_cache["value"] = None  # a rejected token must not be reused
        raise


def send_email(subject: str, body: str, to: str | None = None, cc: str | None = None) -> None:
    """Sends an HTML email. Does nothing if email is not configured. Raises on
    errors; prefer `send_email_safely` in request handlers."""
    if not email_is_configured():
        logger.info("Email not sent: email is not configured")
        return

    message = _build_message(subject, body, to or settings.email_user, cc)
    if _uses_gmail_api():
        _send_via_gmail_api(message)
        return

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=SMTP_TIMEOUT_SECONDS) as server:
        server.starttls()
        server.login(settings.email_user, settings.email_pass)
        server.send_message(message)


def send_email_safely(subject: str, body: str, to: str | None = None) -> None:
    """`send_email` that logs failures instead of raising them."""
    try:
        send_email(subject=subject, body=body, to=to)
    except Exception:  # noqa: BLE001 — notification is best-effort by design
        logger.exception("Failed to send email %r", subject)
