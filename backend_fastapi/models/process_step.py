from sqlalchemy import Column, Integer, String, Text
from database import Base

class ProcessStep(Base):
    __tablename__ = "process_steps"
    
    id = Column(Integer, primary_key=True, index=True)
    step_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)