from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Admin, Customer
from schemas.auth import AdminLogin, CustomerRegister, CustomerLogin, TokenResponse, CustomerResponse, AdminResponse
from core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api", tags=["Authentication"])

# --- Admin Routes ---

@router.post("/admin/login", response_model=TokenResponse)
def admin_login(login_data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == login_data.email).first()
    if not admin or not verify_password(login_data.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token(data={"sub": str(admin.id)})
    return {
        "token": token,
        "admin": AdminResponse.model_validate(admin)
    }

# --- Customer Routes ---

@router.post("/customers/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def customer_register(register_data: CustomerRegister, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_customer = db.query(Customer).filter(Customer.email == register_data.email).first()
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new customer
    new_customer = Customer(
        name=register_data.name,
        email=register_data.email,
        phone=register_data.phone,
        password=get_password_hash(register_data.password)
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    
    token = create_access_token(data={"sub": str(new_customer.id)})
    return {
        "token": token,
        "customer": CustomerResponse.model_validate(new_customer)
    }

@router.post("/customers/login", response_model=TokenResponse)
def customer_login(login_data: CustomerLogin, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.email == login_data.email).first()
    if not customer or not verify_password(login_data.password, customer.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token(data={"sub": str(customer.id)})
    return {
        "token": token,
        "customer": CustomerResponse.model_validate(customer)
    }