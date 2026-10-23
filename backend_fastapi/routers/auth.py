from html import escape

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from core.ratelimit import rate_limit
from database import get_db
from models import Admin, Customer
from schemas.auth import ForgotPassword, ResetPassword, AdminLogin, CustomerRegister, CustomerLogin, TokenResponse, CustomerResponse, AdminResponse
from core.security import create_access_token, get_password_hash, verify_password
from config import settings
from core.email import send_email_safely
from core.tokens import ROLE_ADMIN, ROLE_CUSTOMER, create_reset_token, decode_reset_token, reset_token_matches

router = APIRouter(prefix="/api", tags=["Authentication"])

# --- Admin Routes ---

# A password guess costs the attacker one request, so sign-in is limited per address.
_login_limit = Depends(rate_limit("login", limit=10, window_seconds=300))
# Fixed hash checked when the email is unknown, so "no such user" takes as long as
# "wrong password" and response time cannot be used to discover which emails exist.
_DUMMY_HASH = get_password_hash("not-a-real-password")


@router.post("/admin/login", response_model=TokenResponse, dependencies=[_login_limit])
def admin_login(login_data: AdminLogin, db: Session = Depends(get_db)):
    # Emails are stored lower-case (seed_admin and Team lower-case them), so match the same way.
    admin = db.query(Admin).filter(func.lower(Admin.email) == login_data.email.strip().lower()).first()
    password_ok = verify_password(login_data.password, admin.password if admin else _DUMMY_HASH)
    if not admin or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not admin.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Ask an administrator."
        )

    token = create_access_token(admin.id, ROLE_ADMIN)
    return {
        "token": token,
        "admin": AdminResponse.model_validate(admin)
    }

# --- Customer Routes ---

@router.post("/customers/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(rate_limit("register", limit=10, window_seconds=3600))])
def customer_register(register_data: CustomerRegister, db: Session = Depends(get_db)):
    # Emails are compared and stored lower-case, so Jane@x.com and jane@x.com are one person.
    email = register_data.email.strip().lower()
    existing_customer = db.query(Customer).filter(func.lower(Customer.email) == email).first()
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new customer
    new_customer = Customer(
        name=register_data.name,
        email=email,
        phone=register_data.phone,
        password=get_password_hash(register_data.password)
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    
    token = create_access_token(new_customer.id, ROLE_CUSTOMER)
    return {
        "token": token,
        "customer": CustomerResponse.model_validate(new_customer)
    }

@router.post("/customers/login", response_model=TokenResponse, dependencies=[_login_limit])
def customer_login(login_data: CustomerLogin, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(func.lower(Customer.email) == login_data.email.strip().lower()).first()
    password_ok = verify_password(login_data.password, customer.password if customer else _DUMMY_HASH)
    if not customer or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token(customer.id, ROLE_CUSTOMER)
    return {
        "token": token,
        "customer": CustomerResponse.model_validate(customer)
    }


@router.post("/customers/forgot-password", dependencies=[Depends(rate_limit("forgot", limit=5, window_seconds=3600))])
def forgot_password(data: ForgotPassword, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Emails a reset link. The answer is the same whether or not the address is registered."""
    customer = db.query(Customer).filter(func.lower(Customer.email) == data.email.strip().lower()).first()
    if customer:
        link = f"{settings.site_url}/reset-password?token={create_reset_token(customer.id, customer.password)}"
        body = (
            f"<p>Hello {escape(customer.name)},</p>"
            "<p>We received a request to reset your Bluewell Horizon password. "
            f'<a href="{escape(link)}">Choose a new password</a>. The link works once and expires in one hour.</p>'
            "<p>If you did not ask for this, ignore this email; your password stays the same.</p>"
        )
        background_tasks.add_task(send_email_safely, "Reset your Bluewell Horizon password", body, customer.email)
    return {"message": "If that email is registered, a reset link is on its way."}


@router.post("/customers/reset-password", dependencies=[Depends(rate_limit("reset", limit=10, window_seconds=3600))])
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    invalid = HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="This reset link is invalid or has expired. Please request a new one.")
    decoded = decode_reset_token(data.token)
    if decoded is None:
        raise invalid
    customer_id, fingerprint = decoded
    customer = db.get(Customer, customer_id)
    if customer is None or not reset_token_matches(fingerprint, customer.password):
        raise invalid
    customer.password = get_password_hash(data.password)
    db.commit()
    return {"message": "Password updated. You can now sign in."}
