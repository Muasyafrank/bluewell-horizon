from typing import Optional
from schemas.base import CamelModel

class ServiceBase(CamelModel):
    title: str
    short_desc: Optional[str] = None
    description: Optional[str] = None
    icon: str = "FaTint"
    image: Optional[str] = None
    features: Optional[str] = None
    applications: Optional[str] = None
    benefits: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(CamelModel):
    id: int
    title: str
    short_desc: Optional[str] = None
    description: Optional[str] = None
    icon: str = "FaTint"
    image: Optional[str] = None
    features: Optional[str] = None
    applications: Optional[str] = None
    benefits: Optional[str] = None