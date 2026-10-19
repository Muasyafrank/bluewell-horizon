from datetime import date
from decimal import Decimal
from typing import List, Optional

from pydantic import Field

from schemas.base import TrimmedModel


class QuotationLine(TrimmedModel):
    description: str = Field(min_length=1, max_length=200)
    quantity: int = Field(ge=1, le=100000)
    unitPrice: Decimal = Field(gt=0, le=Decimal("99999999"), decimal_places=2)


class QuotationRequest(TrimmedModel):
    lines: List[QuotationLine] = Field(min_length=1, max_length=50)
    deliveryFee: Decimal = Field(default=Decimal("0"), ge=0, le=Decimal("99999999"), decimal_places=2)
    includeVat: bool = True
    validUntil: date
    paymentMethods: List[str] = Field(min_length=1, max_length=10)
    notes: Optional[str] = Field(default=None, max_length=1000)
