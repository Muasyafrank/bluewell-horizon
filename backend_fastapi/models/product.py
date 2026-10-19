# from inflect import engine
from sqlalchemy import Column, Integer, String, DateTime,Numeric
from sqlalchemy.sql import func
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Numeric(10,2))
    category = Column(String, nullable=False)
    image = Column(String)
    stock = Column(Integer, default=0)
    reorder_level = Column(Integer, nullable=True)  # low-stock alert threshold; empty = no alert
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Base.metadata.create_all(bind=engine)