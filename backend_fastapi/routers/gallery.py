from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Gallery
from schemas.gallery import GalleryResponse

router = APIRouter(prefix="/api", tags=["Gallery"])

@router.get("/gallery")
def get_gallery(db: Session = Depends(get_db)):
    gallery = db.query(Gallery).all()
    return [GalleryResponse.model_validate(g).model_dump(by_alias=True) for g in gallery]