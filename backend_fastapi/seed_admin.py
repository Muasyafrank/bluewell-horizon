"""
Creates (or leaves alone) an administrator account.

Usage:
    python seed_admin.py                       # prompts for email and password
    ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' python seed_admin.py

No credentials live in this file. The previous version created an admin with a
password written in the source, which anyone with repository access could read.
"""
import getpass
import os
import sys

from core.security import get_password_hash
from database import Base, SessionLocal, engine
from models import Admin

MIN_PASSWORD_LENGTH = 12


def read_credentials() -> tuple[str, str]:
    email = (os.getenv("ADMIN_EMAIL") or input("Admin email: ")).strip().lower()
    password = os.getenv("ADMIN_PASSWORD") or getpass.getpass("Admin password: ")
    if "@" not in email:
        sys.exit("That does not look like an email address.")
    if len(password) < MIN_PASSWORD_LENGTH:
        sys.exit(f"Use a password of at least {MIN_PASSWORD_LENGTH} characters.")
    return email, password


def main() -> None:
    email, password = read_credentials()
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(Admin).filter(Admin.email == email).first():
            print(f"An admin with email {email} already exists; nothing changed.")
            return
        db.add(Admin(email=email, name="Administrator", role="admin", is_active=True,
                      password=get_password_hash(password)))
        db.commit()
        print(f"Admin {email} created.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
