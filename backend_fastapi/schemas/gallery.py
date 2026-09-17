from schemas.base import CamelModel

class GalleryResponse(CamelModel):
    id: int
    title: str
    category: str
    image: str