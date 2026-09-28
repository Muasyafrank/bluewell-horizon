from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    message: str
