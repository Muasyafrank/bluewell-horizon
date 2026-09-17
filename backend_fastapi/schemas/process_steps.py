from typing import Optional
from schemas.base import CamelModel

class ProcessStepResponse(CamelModel):
    id: int
    step_number: int
    title: str
    description: Optional[str] = None