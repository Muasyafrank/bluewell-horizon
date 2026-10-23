"""Sign-in limits, headers, health check and the strict production start-up checks."""
import os
import subprocess
import sys

from core import ratelimit

BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def test_repeated_wrong_passwords_are_throttled(client, admin):
    attempt = {"email": "admin@example.com", "password": "wrong-password-123"}
    codes = [client.post("/api/admin/login", json=attempt).status_code for _ in range(12)]
    assert codes[:10] == [401] * 10
    assert codes[10:] == [429, 429]


def test_the_throttle_does_not_block_a_correct_password_for_other_addresses(client, admin, monkeypatch):
    monkeypatch.setattr(ratelimit.settings, "trust_proxy", True)
    attempt = {"email": "admin@example.com", "password": "wrong-password-123"}
    for _ in range(10):
        client.post("/api/admin/login", json=attempt, headers={"X-Forwarded-For": "203.0.113.5"})
    blocked = client.post("/api/admin/login", json=attempt, headers={"X-Forwarded-For": "203.0.113.5"})
    other = client.post("/api/admin/login", json={"email": "admin@example.com", "password": "correct-horse-battery"},
                        headers={"X-Forwarded-For": "198.51.100.9"})
    assert blocked.status_code == 429 and other.status_code == 200


def test_429_says_when_to_retry(client, admin):
    attempt = {"email": "admin@example.com", "password": "wrong-password-123"}
    for _ in range(10):
        client.post("/api/admin/login", json=attempt)
    response = client.post("/api/admin/login", json=attempt)
    assert response.status_code == 429 and int(response.headers["Retry-After"]) > 0


def test_customer_emails_are_case_insensitive(client, db):
    body = {"name": "Amina", "email": "Amina@Example.com", "phone": "0712345678", "password": "long-enough-pass"}
    assert client.post("/api/customers/register", json=body).status_code == 201
    again = client.post("/api/customers/register", json={**body, "email": "amina@example.com"})
    assert again.status_code == 400
    login = client.post("/api/customers/login", json={"email": "AMINA@example.com", "password": "long-enough-pass"})
    assert login.status_code == 200
    assert login.json()["customer"]["email"] == "amina@example.com"


def test_api_responses_carry_security_headers_and_are_not_cached(client):
    response = client.get("/api/products")
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["Cache-Control"] == "no-store"


def test_health_check_reports_the_database(client):
    response = client.get("/health")
    assert response.status_code == 200 and response.json() == {"status": "ok"}


def _start_up(**env):
    """Imports config in a fresh interpreter with the given environment."""
    clean = {k: v for k, v in os.environ.items() if k not in ("ENVIRONMENT", "SECRET_KEY", "DATABASE_URL", "CORS_ORIGINS")}
    clean.update(env)
    return subprocess.run([sys.executable, "-c", "import config"], cwd=BACKEND, env=clean, capture_output=True, text=True)


GOOD = dict(ENVIRONMENT="production", DATABASE_URL="postgresql://u:p@db/bluewell",
            SECRET_KEY="k7Vq3-Zp9xW2mR8tY5uB1nC6dF4gH0jLsAaEeIiOoUuXxZz", CORS_ORIGINS="https://www.example.co.ke")


def test_production_starts_with_safe_settings():
    assert _start_up(**GOOD).returncode == 0


def test_production_refuses_a_weak_secret():
    result = _start_up(**{**GOOD, "SECRET_KEY": "changeme"})
    assert result.returncode != 0 and "SECRET_KEY" in result.stderr


def test_production_refuses_sqlite_and_localhost_cors():
    assert "PostgreSQL" in _start_up(**{**GOOD, "DATABASE_URL": "sqlite:///x.db"}).stderr
    assert "CORS_ORIGINS" in _start_up(**{**GOOD, "CORS_ORIGINS": "http://localhost:3000"}).stderr


def test_development_still_starts_with_local_settings():
    result = _start_up(ENVIRONMENT="development", DATABASE_URL="sqlite:///x.db",
                       SECRET_KEY="short", CORS_ORIGINS="http://localhost:3000")
    assert result.returncode == 0


# ---- password reset -------------------------------------------------------------

def _capture_reset_email(monkeypatch):
    from routers import auth as auth_router
    sent = []
    monkeypatch.setattr(auth_router, "send_email_safely", lambda subject, body, to=None: sent.append((subject, body, to)))
    return sent


def _token_from(body):
    import re
    return re.search(r"reset-password\?token=([\w.\-]+)", body).group(1)


def test_forgot_password_emails_a_link_and_hides_whether_the_address_exists(client, customer, monkeypatch):
    sent = _capture_reset_email(monkeypatch)
    known = client.post("/api/customers/forgot-password", json={"email": customer.email.upper()})
    unknown = client.post("/api/customers/forgot-password", json={"email": "nobody@example.com"})
    assert known.status_code == unknown.status_code == 200
    assert known.json() == unknown.json()
    assert len(sent) == 1 and sent[0][2] == customer.email


def test_a_reset_link_sets_a_new_password_once(client, customer, monkeypatch):
    sent = _capture_reset_email(monkeypatch)
    client.post("/api/customers/forgot-password", json={"email": customer.email})
    token = _token_from(sent[0][1])

    ok = client.post("/api/customers/reset-password", json={"token": token, "password": "brand-new-pass"})
    assert ok.status_code == 200
    assert client.post("/api/customers/login", json={"email": customer.email, "password": "brand-new-pass"}).status_code == 200

    again = client.post("/api/customers/reset-password", json={"token": token, "password": "another-pass-1"})
    assert again.status_code == 400  # the link died when the password changed


def test_bad_or_foreign_reset_tokens_are_refused(client, customer):
    from core.tokens import ROLE_CUSTOMER, create_access_token
    for token in ("garbage-token-value", create_access_token(customer.id, ROLE_CUSTOMER)):
        response = client.post("/api/customers/reset-password", json={"token": token, "password": "brand-new-pass"})
        assert response.status_code == 400


def test_forgot_password_is_rate_limited(client):
    codes = [client.post("/api/customers/forgot-password", json={"email": "a@example.com"}).status_code for _ in range(6)]
    assert codes[:5] == [200] * 5 and codes[5] == 429


def test_the_startup_schema_step_can_run_twice_on_a_live_database():
    import schema
    schema.sync_schema()
    schema.sync_schema()
