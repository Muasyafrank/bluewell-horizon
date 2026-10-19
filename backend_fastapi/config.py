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


settings = Settings()

if len(settings.secret_key) < 32:
    logger.warning(
        "SECRET_KEY is shorter than 32 characters; anyone who can guess it can forge "
        "login tokens. Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
    )
