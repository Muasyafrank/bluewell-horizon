from sqlalchemy import Column, Integer, String, Text
from database import Base

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    short_desc = Column(String)
    description = Column(Text)
    icon = Column(String, default="FaTint")
    image = Column(String)
    features = Column(String)  # Store as JSON string
    applications = Column(String)  # Store as JSON string
    benefits = Column(Text)