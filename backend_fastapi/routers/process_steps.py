from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import ProcessStep
from schemas.process_steps import ProcessStepResponse

router = APIRouter(prefix="/api", tags=["Process Steps"])

@router.get("/process-steps")
def get_process_steps(db: Session = Depends(get_db)):
    steps = db.query(ProcessStep).order_by(ProcessStep.step_number).all()
    return [ProcessStepResponse.model_validate(s).model_dump(by_alias=True) for s in steps]