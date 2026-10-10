from datetime import datetime
from typing import Optional

from pydantic import EmailStr, Field

from schemas.base import CamelModel, TrimmedModel


class QuoteRequest(TrimmedModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    companyName: str = Field(min_length=1, max_length=160)
    serviceType: str = Field(min_length=1, max_length=120)
    projectDetails: str = Field(min_length=1, max_length=5000)


class QuoteResponse(CamelModel):
    id: int
    name: str
    email: str
    phone: str
    company_name: str
    service_type: str
    project_details: str
    status: str
    created_at: Optional[datetime] = None