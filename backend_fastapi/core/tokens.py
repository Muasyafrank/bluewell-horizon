"""
JWT creation and verification.

Kept separate from `core/security.py` (which depends on FastAPI, the database
and the ORM models) so the token rules can be unit-tested on their own.

Every token carries a `role` claim. Before this existed, admin and customer
tokens were both just `{"sub": "<id>"}` signed with the same key, and each
guard simply looked that id up in its own table. A customer whose id happened
to equal an admin's id (customer #1 and admin #1, for example) therefore held
a perfectly valid admin token. Anyone can register as a customer, so that was
a privilege-escalation hole. The role claim makes each guard reject tokens
that were issued for the other audience.
"""
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

from config import settings

ROLE_ADMIN = "admin"
ROLE_CUSTOMER = "customer"
ROLE_PASSWORD_RESET = "password-reset"
RESET_TOKEN_MINUTES = 60


def create_access_token(
    subject: int | str,
    role: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Signs a token for `subject` (a user id) that is only valid for `role`."""
    expires = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    claims = {"sub": str(subject), "role": role, "exp": expires}
    return jwt.encode(claims, settings.secret_key, algorithm=settings.algorithm)


def decode_subject(token: str, role: str) -> Optional[int]:
    """Returns the user id inside `token`, or None if it should not be trusted.

    A token is rejected when its signature is bad, it has expired, it was
    issued for a different role, or its subject is not an integer id.
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None

    if payload.get("role") != role:
        return None

    try:
        return int(payload.get("sub"))
    except (TypeError, ValueError):
        return None


def _password_fingerprint(password_hash: str) -> str:
    return hashlib.sha256(password_hash.encode("utf-8")).hexdigest()[:24]


def create_reset_token(customer_id: int, password_hash: str) -> str:
    """A one-hour token for the emailed reset link.

    It carries a fingerprint of the current password hash, so it stops working the
    moment the password changes: each link can be used once, with nothing stored.
    """
    expires = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_MINUTES)
    claims = {"sub": str(customer_id), "role": ROLE_PASSWORD_RESET,
              "fp": _password_fingerprint(password_hash), "exp": expires}
    return jwt.encode(claims, settings.secret_key, algorithm=settings.algorithm)


def decode_reset_token(token: str) -> Optional[tuple[int, str]]:
    """(customer id, password fingerprint) from a valid reset token, else None."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        if payload.get("role") != ROLE_PASSWORD_RESET:
            return None
        return int(payload["sub"]), str(payload["fp"])
    except (JWTError, KeyError, TypeError, ValueError):
        return None


def reset_token_matches(fingerprint: str, password_hash: str) -> bool:
    return fingerprint == _password_fingerprint(password_hash)
