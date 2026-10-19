from typing import Optional

from schemas.base import CamelModel

class GalleryResponse(CamelModel):
    id: int
    title: str
    category: str
    image: str
    location: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None
