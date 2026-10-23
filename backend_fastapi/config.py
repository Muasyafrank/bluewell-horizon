"""
Centralised configuration.

Previously every module that needed an environment variable called
`load_dotenv()` and read `os.getenv(...)` itself (database.py, core/security.py,
routers/orders.py, routers/quotes.py all did this independently), so there was
no single place to see what configuration the app needed or to validate it.
This module loads the .env file once and exposes typed, validated settings.
"""
import logging
import os

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


def _require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            f"Copy .env.example to .env and fill it in."
        )
    return value


class Settings:
    # "production" turns on the strict checks below and hides the API docs.
    environment: str = os.getenv("ENVIRONMENT", "development").strip().lower()
    log_level: str = os.getenv("LOG_LEVEL", "INFO").strip().upper()
    # Read the client address from X-Forwarded-For (set true only behind your own reverse proxy).
    trust_proxy: bool = os.getenv("TRUST_PROXY", "false").lower() in ("1", "true", "yes")
    rate_limit_enabled: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() not in ("0", "false", "no")

    # Database
    database_url: str = _require("DATABASE_URL")

    # Auth
    secret_key: str = _require("SECRET_KEY")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # Outbound email (optional — order and quote emails are skipped, not
    # failed, when these are unset)
    email_user: str | None = os.getenv("EMAIL_USER") or None
    email_pass: str | None = os.getenv("EMAIL_PASS") or None
    # Sending through Gmail's web API (HTTPS, port 443) instead of SMTP, for
    # networks and hosts that block mail ports. Set up with gmail_authorize.py;
    # see docs/email-setup.md. When all three are set it is used instead of SMTP.
    gmail_client_id: str | None = os.getenv("GMAIL_CLIENT_ID") or None
    gmail_client_secret: str | None = os.getenv("GMAIL_CLIENT_SECRET") or None
    gmail_refresh_token: str | None = os.getenv("GMAIL_REFRESH_TOKEN") or None

    # Payment details printed on quotations. Each method appears on a quotation
    # only when its details are filled in (cash on delivery needs none). See
    # .env.example.
    mpesa_paybill_number: str | None = os.getenv("PAYMENT_MPESA_PAYBILL_NUMBER") or None
    mpesa_paybill_account: str = os.getenv("PAYMENT_MPESA_PAYBILL_ACCOUNT") or "Your order number"
    mpesa_till_number: str | None = os.getenv("PAYMENT_MPESA_TILL_NUMBER") or None
    mpesa_till_name: str | None = os.getenv("PAYMENT_MPESA_TILL_NAME") or None
    bank_name: str | None = os.getenv("PAYMENT_BANK_NAME") or None
    bank_account_name: str | None = os.getenv("PAYMENT_BANK_ACCOUNT_NAME") or None
    bank_account_number: str | None = os.getenv("PAYMENT_BANK_ACCOUNT_NUMBER") or None
    bank_branch: str | None = os.getenv("PAYMENT_BANK_BRANCH") or None
    cash_on_delivery_enabled: bool = os.getenv("PAYMENT_COD_ENABLED", "true").lower() not in ("0", "false", "no")

    # CORS: comma-separated list of allowed origins
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]


    # Public address of the website, used for links in emails (password reset).
    site_url: str = (os.getenv("SITE_URL") or "").rstrip("/")


settings = Settings()
if not settings.site_url:
    settings.site_url = settings.cors_origins[0].rstrip("/")
is_production = settings.environment == "production"

_PLACEHOLDER_SECRETS = ("changeme", "change-me", "your-secret", "secret", "replace", "example", "test-secret")

if is_production:
    # Refuse to start with settings that would be unsafe on the public internet,
    # rather than logging a warning nobody reads.
    problems = []
    if len(settings.secret_key) < 32 or any(p in settings.secret_key.lower() for p in _PLACEHOLDER_SECRETS):
        problems.append("SECRET_KEY must be a random value of at least 32 characters "
                        "(python -c \"import secrets; print(secrets.token_urlsafe(48))\")")
    if settings.database_url.startswith("sqlite"):
        problems.append("DATABASE_URL must point at PostgreSQL, not SQLite")
    if all("localhost" in o or "127.0.0.1" in o for o in settings.cors_origins):
        problems.append("CORS_ORIGINS must list your website's address (https://...), not localhost")
    if problems:
        raise RuntimeError("Unsafe production configuration:\n- " + "\n- ".join(problems))
elif len(settings.secret_key) < 32:
    logger.warning(
        "SECRET_KEY is shorter than 32 characters; anyone who can guess it can forge "
        "login tokens. Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
    )
