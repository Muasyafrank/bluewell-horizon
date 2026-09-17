from pydantic import BaseModel, EmailStr
from typing import Optional
from schemas.base import CamelModel

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(CamelModel):
    id: int
    email: str

class CustomerRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

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