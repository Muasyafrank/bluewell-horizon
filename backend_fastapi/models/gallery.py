from sqlalchemy import Column, Integer, String
from database import Base

class Gallery(Base):
    __tablename__ = "gallery"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    image = Column(String, nullable=False)