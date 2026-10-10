from pydantic import EmailStr, Field

from schemas.base import TrimmedModel


class ContactCreate(TrimmedModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    service: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=1, max_length=5000)
