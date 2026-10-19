from sqlalchemy import JSON, Boolean, Column, Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Quotation(Base):
    """The priced quotation the admin sends for an order.

    The lines and payment methods are stored as they were sent (a snapshot), so
    a quotation still reads the same if a product or a payment detail changes
    later. One quotation per order; re-sending updates it.
    """
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    quote_number = Column(String, unique=True, nullable=False)

    lines = Column(JSON, nullable=False)            # [{description, quantity, unitPrice}]
    payment_methods = Column(JSON, nullable=False)  # [{key, label, details}] as sent
    subtotal = Column(Numeric(12, 2), nullable=False)
    delivery_fee = Column(Numeric(12, 2), nullable=False, default=0)
    include_vat = Column(Boolean, nullable=False, default=True)
    vat_amount = Column(Numeric(12, 2), nullable=False, default=0)
    total_amount = Column(Numeric(12, 2), nullable=False)
    valid_until = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)

    status = Column(String, nullable=False, default="draft")  # draft | sent
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    order = relationship("Order", back_populates="quotation")
