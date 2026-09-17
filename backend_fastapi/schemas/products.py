from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from schemas.base import CamelModel

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    image: Optional[str] = None
    stock: int = 0

class ProductCreate(ProductBase):
    pass

class ProductResponse(CamelModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    category: str
    image: Optional[str] = None
    stock: int = 0
    created_at: Optional[datetime] = None