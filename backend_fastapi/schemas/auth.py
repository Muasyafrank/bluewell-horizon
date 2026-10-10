from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from schemas.base import CamelModel

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(CamelModel):
    id: int
    email: str

class CustomerRegister(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    # bcrypt only reads the first 72 bytes of a password, so longer input would
    # be silently truncated (or rejected, depending on the bcrypt version).
    password: str = Field(min_length=8, max_length=72)

class CustomerLogin(BaseModel):
    email: EmailStr
    password: str

class CustomerResponse(CamelModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None

class TokenResponse(BaseModel):
    token: str
    customer: Optional[CustomerResponse] = None
    admin: Optional[AdminResponse] = None