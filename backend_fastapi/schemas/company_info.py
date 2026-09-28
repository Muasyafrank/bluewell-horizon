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


class CompanyInfoUpdate(CamelModel):
    """Admin edit form payload. The frontend sends camelCase (`aboutUs`); the
    ORM model's columns are snake_case (`about_us`). The previous handler took
    a raw `dict` and set attributes using the *incoming* key names directly,
    so every field silently failed to save — `hasattr(existing, "aboutUs")`
    is always False. CamelModel's alias mapping does the translation."""
    about_us: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    email: Optional[str] = None
    phone1: Optional[str] = None
    phone2: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None