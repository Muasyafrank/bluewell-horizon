"""Public contact form submissions."""
import logging
from html import escape

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.email import send_email_safely
from core.ratelimit import rate_limit
from database import get_db
from models import Contact
from schemas.contact import ContactCreate

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Contact"])


@router.post("/contact", status_code=status.HTTP_201_CREATED, dependencies=[Depends(rate_limit("contact", limit=10, window_seconds=3600))])
def submit_contact(
    payload: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    try:
        db.add(Contact(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            service=payload.service,
            message=payload.message,
            is_read=False,
        ))
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Could not save contact message")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We couldn't send your message. Please try again.",
        )

    # Everything below comes from the visitor, so it is escaped before being
    # placed in an HTML email addressed to the business.
    background_tasks.add_task(
        send_email_safely,
        subject=f"New enquiry: {payload.service} — {payload.name}",
        body=f"""
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> {escape(payload.name)}</p>
        <p><strong>Email:</strong> {escape(payload.email)}</p>
        <p><strong>Phone:</strong> {escape(payload.phone)}</p>
        <p><strong>Service:</strong> {escape(payload.service)}</p>
        <p><strong>Message:</strong></p>
        <p style="padding: 15px; background-color: #ffffff; border-left: 4px solid #2fa5b6;">
            {escape(payload.message)}
        </p>
        """,
    )
    return {"message": "Message sent successfully"}
