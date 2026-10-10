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
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

from config import settings

ROLE_ADMIN = "admin"
ROLE_CUSTOMER = "customer"


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
