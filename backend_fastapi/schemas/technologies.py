from typing import Optional
from schemas.base import CamelModel

class TechnologyResponse(CamelModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: str = "FaCogs"
    image: Optional[str] = None