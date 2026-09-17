from sqlalchemy import Column, Integer, String, Text
from database import Base

class CompanyInfo(Base):
    __tablename__ = "company_info"
    
    id = Column(Integer, primary_key=True, index=True)
    about_us = Column(Text, nullable=True)
    mission = Column(Text, nullable=True)
    vision = Column(Text, nullable=True)
    email = Column(String, nullable=True)
    phone1 = Column(String, nullable=True)
    phone2 = Column(String, nullable=True)
    address = Column(String, nullable=True)
    website = Column(String, nullable=True)