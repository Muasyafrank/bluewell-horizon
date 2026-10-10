from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

from schemas.base import CamelModel, TrimmedModel


class OrderItemBase(TrimmedModel):
    id: int
    # A quantity below 1 used to be accepted, and a negative one *added* stock
    # back to the product when the order was processed.
    quantity: int = Field(ge=1, le=1000)
    price: float = Field(ge=0)
    name: Optional[str] = Field(default=None, max_length=200)
    image: Optional[str] = Field(default=None, max_length=500)
    category: Optional[str] = Field(default=None, max_length=200)


class CheckoutRequest(TrimmedModel):
    customerName: str = Field(min_length=1, max_length=120)
    customerEmail: EmailStr
    customerPhone: str = Field(min_length=5, max_length=30)
    companyName: Optional[str] = Field(default=None, max_length=160)
    kraPin: Optional[str] = Field(default=None, max_length=30)
    county: str = Field(min_length=1, max_length=80)
    constituency: Optional[str] = Field(default=None, max_length=80)
    estate: str = Field(min_length=1, max_length=120)
    streetAddress: str = Field(min_length=1, max_length=200)
    buildingName: Optional[str] = Field(default=None, max_length=200)
    apartmentNumber: Optional[str] = Field(default=None, max_length=50)
    poBox: Optional[str] = Field(default=None, max_length=50)
    postalCode: Optional[str] = Field(default=None, max_length=20)
    deliveryMethod: str = Field(default="standard", max_length=40)
    paymentMethod: str = Field(min_length=1, max_length=40)
    mpesaPhone: Optional[str] = Field(default=None, max_length=30)
    mpesaReference: Optional[str] = Field(default=None, max_length=60)
    notes: Optional[str] = Field(default=None, max_length=1000)
    items: List[OrderItemBase] = Field(min_length=1, max_length=100)
    subtotal: float = Field(ge=0)
    deliveryFee: float = Field(default=0, ge=0)
    vatAmount: float = Field(default=0, ge=0)
    totalAmount: float = Field(ge=0)


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