from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    
    # Kenyan address fields
    county = Column(String, nullable=False)
    constituency = Column(String, nullable=True)
    estate = Column(String, nullable=False)
    street_address = Column(String, nullable=False)
    building_name = Column(String, nullable=True)
    apartment_number = Column(String, nullable=True)
    po_box = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Delivery options
    delivery_method = Column(String, default="standard")
    delivery_fee = Column(Numeric(10, 2), default=0)
    
    # Payment
    payment_method = Column(String, nullable=False)
    mpesa_phone = Column(String, nullable=True)
    mpesa_reference = Column(String, nullable=True)
    
    # Order details
    subtotal = Column(Numeric(10, 2), nullable=False)
    vat_amount = Column(Numeric(10, 2), default=0)
    total_amount = Column(Numeric(10, 2), nullable=False)
    order_status = Column(String, default="processing")
    notes = Column(String, nullable=True)
    
    # Business info
    company_name = Column(String, nullable=True)
    kra_pin = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")