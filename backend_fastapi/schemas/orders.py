from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from schemas.base import CamelModel

class OrderItemBase(BaseModel):
    id: int
    quantity: int
    price: float
    name: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None

class CheckoutRequest(BaseModel):
    customerName: str
    customerEmail: str
    customerPhone: str
    companyName: Optional[str] = None
    kraPin: Optional[str] = None
    county: str
    constituency: Optional[str] = None
    estate: str
    streetAddress: str
    buildingName: Optional[str] = None
    apartmentNumber: Optional[str] = None
    poBox: Optional[str] = None
    postalCode: Optional[str] = None
    deliveryMethod: str = "standard"
    paymentMethod: str
    mpesaPhone: Optional[str] = None
    mpesaReference: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemBase]
    subtotal: float
    deliveryFee: float = 0
    vatAmount: float = 0
    totalAmount: float

class OrderItemDetail(BaseModel):
    id: int
    productId: int
    quantity: int
    price: float
    name: str
    image: Optional[str] = None
    category: Optional[str] = None


class OrderResponse(CamelModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    county: str
    estate: str
    street_address: str
    delivery_method: str
    payment_method: str
    subtotal: float
    delivery_fee: float
    vat_amount: float
    total_amount: float
    order_status: str
    created_at: Optional[datetime] = None
    # Populated by the router from each order's line items; not on the ORM
    # model directly, so it defaults to empty rather than failing validation.
    items: List[OrderItemDetail] = []

class CheckoutResponse(BaseModel):
    message: str
    orderNumber: str