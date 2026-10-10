"""Token rules, tested without the web framework or a database."""
import os
import sys
from datetime import timedelta

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key-that-is-long-enough-for-hs256")
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jose import jwt  # noqa: E402

from config import settings  # noqa: E402
from core.tokens import ROLE_ADMIN, ROLE_CUSTOMER, create_access_token, decode_subject  # noqa: E402


def test_each_role_accepts_its_own_token():
    assert decode_subject(create_access_token(7, ROLE_ADMIN), ROLE_ADMIN) == 7
    assert decode_subject(create_access_token(7, ROLE_CUSTOMER), ROLE_CUSTOMER) == 7


def test_customer_token_is_rejected_as_admin():
    # Customer #1 and admin #1 both exist; the old code let this through.
    assert decode_subject(create_access_token(1, ROLE_CUSTOMER), ROLE_ADMIN) is None


def test_admin_token_is_rejected_as_customer():
    assert decode_subject(create_access_token(1, ROLE_ADMIN), ROLE_CUSTOMER) is None


def test_legacy_token_without_role_is_rejected():
    legacy = jwt.encode({"sub": "1"}, settings.secret_key, algorithm=settings.algorithm)
    assert decode_subject(legacy, ROLE_ADMIN) is None
    assert decode_subject(legacy, ROLE_CUSTOMER) is None


def test_tampered_wrongly_signed_expired_and_garbage_tokens_are_rejected():
    good = create_access_token(1, ROLE_ADMIN)
    assert decode_subject(good[:-3] + "abc", ROLE_ADMIN) is None
    other_key = jwt.encode({"sub": "1", "role": "admin"}, "another-key", algorithm=settings.algorithm)
    assert decode_subject(other_key, ROLE_ADMIN) is None
    expired = create_access_token(1, ROLE_ADMIN, expires_delta=timedelta(seconds=-5))
    assert decode_subject(expired, ROLE_ADMIN) is None
    assert decode_subject("not.a.jwt", ROLE_ADMIN) is None


def test_non_integer_subject_is_rejected():
    token = jwt.encode({"sub": "abc", "role": "admin"}, settings.secret_key, algorithm=settings.algorithm)
    assert decode_subject(token, ROLE_ADMIN) is None
