"""
Test setup. Environment variables must be set *before* the app is imported,
because `config.py` reads them at import time and `main.py` creates tables.
Tests run against a throwaway SQLite file, never your real database.
"""
import os
import sys
import tempfile

_db_file = os.path.join(tempfile.mkdtemp(), "test.db")
os.environ["DATABASE_URL"] = f"sqlite:///{_db_file}"
os.environ["SECRET_KEY"] = "test-secret-key-that-is-long-enough-for-hs256"
os.environ.pop("EMAIL_USER", None)
os.environ.pop("EMAIL_PASS", None)
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from core.security import get_password_hash  # noqa: E402
from core.tokens import ROLE_ADMIN, ROLE_CUSTOMER, create_access_token  # noqa: E402
from database import Base, SessionLocal, engine  # noqa: E402
from main import app  # noqa: E402
from models import Admin, Customer, Product  # noqa: E402

# config.py also reads backend_fastapi/.env, which on a real machine holds the live Gmail
# settings. Tests must never send (or wait on) real email, so switch every route off here.
from config import settings  # noqa: E402
for _name in ("email_user", "email_pass", "gmail_client_id", "gmail_client_secret", "gmail_refresh_token"):
    setattr(settings, _name, None)


@pytest.fixture(autouse=True)
def fresh_rate_limits():
    """Counts are per process, so without this one test's sign-ins would count against the next."""
    from core import ratelimit
    ratelimit.reset()
    yield


@pytest.fixture(autouse=True)
def fresh_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def admin(db):
    row = Admin(email="admin@example.com", password=get_password_hash("correct-horse-battery"))
    db.add(row)
    db.commit()
    return row


@pytest.fixture
def customer(db, admin):
    # Created after `admin` so both rows have id 1: the exact collision that
    # used to let a customer token pass as an admin token.
    row = Customer(name="Cust", email="cust@example.com", phone="0700000000",
                   password=get_password_hash("correct-horse-battery"))
    db.add(row)
    db.commit()
    return row


@pytest.fixture
def admin_headers(admin):
    return {"Authorization": f"Bearer {create_access_token(admin.id, ROLE_ADMIN)}"}


@pytest.fixture
def customer_headers(customer):
    return {"Authorization": f"Bearer {create_access_token(customer.id, ROLE_CUSTOMER)}"}


@pytest.fixture
def product(db):
    row = Product(name="Filter", category="Filters", stock=10)
    db.add(row)
    db.commit()
    return row
