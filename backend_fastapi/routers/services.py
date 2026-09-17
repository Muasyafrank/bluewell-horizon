from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Service
from schemas.services import ServiceResponse

router = APIRouter(prefix="/api", tags=["Services"])

@router.get("/services")
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return [ServiceResponse.model_validate(s).model_dump(by_alias=True) for s in services]