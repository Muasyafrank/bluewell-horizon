"""Public quote requests."""
import logging
from html import escape

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.email import send_email_safely
from core.ratelimit import rate_limit
from database import get_db
from models import Quote
from schemas.quotes import QuoteRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Quotes"])


@router.post("/quotes", status_code=status.HTTP_201_CREATED, dependencies=[Depends(rate_limit("quote", limit=10, window_seconds=3600))])
def submit_quote(
    quote_data: QuoteRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    try:
        db.add(Quote(
            name=quote_data.name,
            email=quote_data.email,
            phone=quote_data.phone,
            company_name=quote_data.companyName,
            service_type=quote_data.serviceType,
            project_details=quote_data.projectDetails,
            status="pending",
        ))
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Could not save quote request")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We couldn't submit your quote request. Please try again.",
        )

    background_tasks.add_task(
        send_email_safely,
        subject=f"New quote request: {quote_data.serviceType} — {quote_data.companyName}",
        body=f"""
        <h2>New quote request received</h2>
        <p><strong>Name:</strong> {escape(quote_data.name)}</p>
        <p><strong>Company:</strong> {escape(quote_data.companyName)}</p>
        <p><strong>Email:</strong> {escape(quote_data.email)}</p>
        <p><strong>Phone:</strong> {escape(quote_data.phone)}</p>
        <p><strong>Service needed:</strong> {escape(quote_data.serviceType)}</p>
        <p><strong>Project details:</strong></p>
        <p style="padding: 15px; background-color: #ffffff; border-left: 4px solid #2fa5b6;">
            {escape(quote_data.projectDetails)}
        </p>
        """,
    )
    return {"message": "Quote request submitted successfully"}
