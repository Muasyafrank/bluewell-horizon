"""
Public contact form submissions.

This endpoint did not exist before: the frontend posted to /api/contact, the
admin dashboard fetched and displayed /api/admin/contacts, and the Contact
model already existed — but nothing ever wrote a row, so every message a
visitor sent disappeared silently.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Contact
from schemas.contact import ContactCreate
from core.email import send_email

router = APIRouter(prefix="/api", tags=["Contact"])


@router.post("/contact", status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    try:
        new_contact = Contact(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            service=payload.service,
            message=payload.message,
            is_read=False,
        )
        db.add(new_contact)
        db.commit()

        try:
            send_email(
                subject=f"New enquiry: {payload.service} — {payload.name}",
                body=f"""
                <h2>New contact form submission</h2>
                <p><strong>Name:</strong> {payload.name}</p>
                <p><strong>Email:</strong> {payload.email}</p>
                <p><strong>Phone:</strong> {payload.phone}</p>
                <p><strong>Service:</strong> {payload.service}</p>
                <p><strong>Message:</strong></p>
                <p style="padding: 15px; background-color: #ffffff; border-left: 4px solid #2fa5b6;">
                    {payload.message}
                </p>
                """,
            )
        except Exception as exc:  # pragma: no cover — email is best-effort
            print(f"Contact email notification failed: {exc}")

        return {"message": "Message sent successfully"}

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting message: {exc}",
        )
