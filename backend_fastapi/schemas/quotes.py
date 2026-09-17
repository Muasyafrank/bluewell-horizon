from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from schemas.base import CamelModel

class QuoteRequest(BaseModel):
    name: str
    email: str
    phone: str
    companyName: str
    serviceType: str
    projectDetails: str

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