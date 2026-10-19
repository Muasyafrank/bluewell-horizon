from datetime import date
from decimal import Decimal
from typing import List, Literal, Optional

from pydantic import EmailStr, Field

from schemas.base import TrimmedModel
from schemas.quotation import QuotationLine

PAYMENT_METHODS = ("mpesa", "bank", "cash", "cheque", "card", "other")
STAFF_ROLES = ("admin", "sales", "accounts", "stores")
STOCK_REASONS = ("adjustment", "damage", "return")


class InvoiceRequest(TrimmedModel):
    customerName: str = Field(min_length=1, max_length=120)
    customerEmail: Optional[EmailStr] = None
    customerPhone: Optional[str] = Field(default=None, max_length=30)
    companyName: Optional[str] = Field(default=None, max_length=150)
    kraPin: Optional[str] = Field(default=None, max_length=20)
    lines: List[QuotationLine] = Field(min_length=1, max_length=50)
    deliveryFee: Decimal = Field(default=Decimal("0"), ge=0, le=Decimal("99999999"), decimal_places=2)
    includeVat: bool = True
    dueOn: Optional[date] = None
    notes: Optional[str] = Field(default=None, max_length=1000)


class InvoiceFromOrder(TrimmedModel):
    dueOn: Optional[date] = None


class PaymentRequest(TrimmedModel):
    amount: Decimal = Field(gt=0, le=Decimal("99999999"), decimal_places=2)
    method: Literal["mpesa", "bank", "cash", "cheque", "card", "other"]
    reference: Optional[str] = Field(default=None, max_length=60)
    receivedOn: Optional[date] = None
    notes: Optional[str] = Field(default=None, max_length=200)


class SupplierRequest(TrimmedModel):
    name: str = Field(min_length=1, max_length=150)
    contactPerson: Optional[str] = Field(default=None, max_length=120)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=30)
    address: Optional[str] = Field(default=None, max_length=200)
    kraPin: Optional[str] = Field(default=None, max_length=20)
    notes: Optional[str] = Field(default=None, max_length=1000)
    isActive: bool = True


class StockAdjustment(TrimmedModel):
    change: int = Field(ge=-100000, le=100000)
    reason: Literal["adjustment", "damage", "return"]
    note: Optional[str] = Field(default=None, max_length=200)


class ReorderLevel(TrimmedModel):
    reorderLevel: Optional[int] = Field(default=None, ge=0, le=100000)


class PurchaseLine(TrimmedModel):
    productId: int
    quantity: int = Field(ge=1, le=100000)
    unitCost: Decimal = Field(ge=0, le=Decimal("99999999"), decimal_places=2)


class PurchaseOrderRequest(TrimmedModel):
    supplierId: int
    lines: List[PurchaseLine] = Field(min_length=1, max_length=50)
    expectedOn: Optional[date] = None
    notes: Optional[str] = Field(default=None, max_length=1000)


class NoteRequest(TrimmedModel):
    body: str = Field(min_length=1, max_length=2000)


class StaffCreate(TrimmedModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    role: Literal["admin", "sales", "accounts", "stores"]
    password: str = Field(min_length=12, max_length=72)


class StaffUpdate(TrimmedModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    role: Optional[Literal["admin", "sales", "accounts", "stores"]] = None
    isActive: Optional[bool] = None
    password: Optional[str] = Field(default=None, min_length=12, max_length=72)
