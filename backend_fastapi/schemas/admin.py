from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Stats ---
class PopularProduct(BaseModel):
    name: str
    quantity: int


class DashboardStats(BaseModel):
    totalOrders: int = 0
    pendingOrders: int = 0
    completedOrders: int = 0
    totalInquiries: int = 0
    unreadInquiries: int = 0
    totalProducts: int = 0
    totalRevenue: float = 0
    monthlyRevenue: float = 0
    popularProducts: List[PopularProduct] = []

# --- Order Management ---
class OrderItemResponse(BaseModel):
    id: int
    orderId: int
    productId: int
    quantity: int
    price: float
    Product: Optional[dict] = None

    class Config:
        from_attributes = True

class OrderDetailResponse(BaseModel):
    order: dict
    items: List[OrderItemResponse]

class StatusUpdate(BaseModel):
    status: str

# --- Contact Management ---
class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    service: str
    message: str
    isRead: bool = False
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- CRUD Schemas ---
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    # Optional because the catalogue is quote-based: seeded products have no
    # price, so requiring one made every edit (including a stock adjustment)
    # fail validation.
    price: Optional[float] = Field(default=None, ge=0)
    category: str
    image: Optional[str] = None
    stock: int = Field(default=0, ge=0)

class ServiceCreate(BaseModel):
    title: str
    shortDesc: Optional[str] = None
    description: Optional[str] = None
    icon: str = "FaTint"
    image: Optional[str] = None
    features: Optional[List[str]] = None
    applications: Optional[List[dict]] = None
    benefits: Optional[str] = None

class GalleryCreate(BaseModel):
    title: str
    category: str
    image: str
    location: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None

class TechnologyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: str = "FaCogs"
    image: Optional[str] = None

class ProcessStepCreate(BaseModel):
    stepNumber: int
    title: str
    description: Optional[str] = None

# --- Quote Management ---
class QuoteResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    companyName: str
    serviceType: str
    projectDetails: str
    status: str
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True