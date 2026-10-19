from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from schemas.base import CamelModel

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    category: str
    image: Optional[str] = None
    stock: int = 0

class ProductCreate(ProductBase):
    pass

class ProductResponse(CamelModel):
    id: int
    name: str
    description: Optional[str] = None
    # Prices are not part of the public catalogue: the shop is quote-based and
    # the admin sets prices while preparing each quotation. See
    # AdminProductResponse for the admin's view.
    category: str
    image: Optional[str] = None
    # Rows created before the column had a default can hold NULL.
    stock: Optional[int] = 0
    created_at: Optional[datetime] = None


class AdminProductResponse(ProductResponse):
    """What the admin panel sees: the public fields plus the internal price.
    NULL is allowed (a product with no price yet); declaring it as a required
    float once made every product response fail validation and return a 500."""
    price: Optional[float] = None