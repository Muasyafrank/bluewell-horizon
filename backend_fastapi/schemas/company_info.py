from typing import Optional
from schemas.base import CamelModel

class CompanyInfoResponse(CamelModel):
    id: Optional[int] = None
    about_us: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    email: Optional[str] = None
    phone1: Optional[str] = None
    phone2: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None