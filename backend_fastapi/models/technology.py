from sqlalchemy import Column, Integer, String, Text
from database import Base

class Technology(Base):
    __tablename__ = "technologies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String, default="FaCogs")
    image = Column(String)