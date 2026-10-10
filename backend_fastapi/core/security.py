"""Password hashing and the FastAPI dependencies that guard protected routes."""
from typing import Optional

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from core.tokens import ROLE_ADMIN, ROLE_CUSTOMER, create_access_token, decode_subject
from database import get_db
from models import Admin, Customer

__all__ = [
    "create_access_token",
    "get_current_admin",
    "get_current_customer",
    "get_current_customer_optional",
    "get_password_hash",
    "verify_password",
]

# `security` rejects requests with no Authorization header. Guest checkout must
# accept those, so `optional_security` is the same scheme without auto_error.
security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except ValueError:
        # A malformed stored hash should read as "wrong password", not a 500.
        return False


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> Admin:
    admin_id = decode_subject(credentials.credentials, ROLE_ADMIN)
    admin = db.get(Admin, admin_id) if admin_id is not None else None
    if admin is None:
        raise _unauthorized()
    return admin


def get_current_customer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> Customer:
    customer_id = decode_subject(credentials.credentials, ROLE_CUSTOMER)
    customer = db.get(Customer, customer_id) if customer_id is not None else None
    if customer is None:
        raise _unauthorized()
    return customer


def get_current_customer_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security),
    db: Session = Depends(get_db),
) -> Optional[Customer]:
    """Returns the signed-in customer if a valid token was sent, else None.

    Checkout must work for guests but should link the order to an account when
    one is signed in. Any problem with the token (missing, expired, wrong role,
    unknown customer) is treated as "no one is signed in" rather than an error,
    since checkout itself never required authentication.
    """
    if credentials is None:
        return None
    customer_id = decode_subject(credentials.credentials, ROLE_CUSTOMER)
    return db.get(Customer, customer_id) if customer_id is not None else None
