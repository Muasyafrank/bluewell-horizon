from sqlalchemy import Column, Integer, String, Text
from database import Base

class Gallery(Base):
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    image = Column(String, nullable=False)
    # Optional project details shown when a visitor opens a project.
    location = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
