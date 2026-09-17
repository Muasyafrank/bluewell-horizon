from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import CompanyInfo
from schemas.company_info import CompanyInfoResponse

router = APIRouter(prefix="/api", tags=["Company Info"])

@router.get("/company-info")
def get_company_info(db: Session = Depends(get_db)):
    info = db.query(CompanyInfo).first()
    if not info:
        return {}
    return CompanyInfoResponse.model_validate(info).model_dump(by_alias=True)