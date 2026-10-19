"""Tables for the business management system (invoices, stock, purchasing, CRM)."""
from sqlalchemy import JSON, Boolean, Column, Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Invoice(Base):
    """A tax invoice. Lines are a snapshot, like quotations, so an invoice never
    changes when a product does. Payment state is derived from `payments`."""
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)

    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=True, index=True)
    customer_phone = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    kra_pin = Column(String, nullable=True)

    lines = Column(JSON, nullable=False)  # [{description, quantity, unitPrice}]
    subtotal = Column(Numeric(12, 2), nullable=False)
    delivery_fee = Column(Numeric(12, 2), nullable=False, default=0)
    include_vat = Column(Boolean, nullable=False, default=True)
    vat_amount = Column(Numeric(12, 2), nullable=False, default=0)
    total_amount = Column(Numeric(12, 2), nullable=False)
    amount_paid = Column(Numeric(12, 2), nullable=False, default=0)

    issued_on = Column(Date, nullable=False)
    due_on = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="issued")  # issued | void
    emailed_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan",
                            order_by="Payment.received_on")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    method = Column(String, nullable=False)  # mpesa | bank | cash | cheque | card | other
    reference = Column(String, nullable=True)
    received_on = Column(Date, nullable=False)
    notes = Column(String, nullable=True)
    recorded_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    invoice = relationship("Invoice", back_populates="payments")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    kra_pin = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StockMovement(Base):
    """Every change to a product's stock, with who and why. `Product.stock` is
    always the sum of these (plus the opening quantity), never edited directly."""
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    change = Column(Integer, nullable=False)  # + in, - out
    balance_after = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)  # purchase | sale | return | adjustment | damage
    reference = Column(String, nullable=True)  # invoice or PO number
    note = Column(String, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    lines = Column(JSON, nullable=False)  # [{productId, description, quantity, unitCost}]
    total_cost = Column(Numeric(12, 2), nullable=False, default=0)
    expected_on = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="draft")  # draft | ordered | received | cancelled
    ordered_at = Column(DateTime(timezone=True), nullable=True)
    received_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    supplier = relationship("Supplier")


class CustomerNote(Base):
    """A free-text note on a customer, keyed by email because most customers
    are guests who never created an account."""
    __tablename__ = "customer_notes"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, index=True)
    body = Column(Text, nullable=False)
    author = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
