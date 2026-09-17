from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Technology
from schemas.technologies import TechnologyResponse

router = APIRouter(prefix="/api", tags=["Technologies"])

@router.get("/technologies")
def get_technologies(db: Session = Depends(get_db)):
    technologies = db.query(Technology).all()
    return [TechnologyResponse.model_validate(t).model_dump(by_alias=True) for t in technologies]