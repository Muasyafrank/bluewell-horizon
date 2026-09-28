"""
Centralised configuration.

Previously every module that needed an environment variable called
`load_dotenv()` and read `os.getenv(...)` itself (database.py, core/security.py,
routers/orders.py, routers/quotes.py all did this independently), so there was
no single place to see what configuration the app needed or to validate it.
This module loads the .env file once and exposes typed, validated settings.
"""
import os
from dotenv import load_dotenv

load_dotenv()


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

    # CORS: comma-separated list of allowed origins
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]


settings = Settings()
