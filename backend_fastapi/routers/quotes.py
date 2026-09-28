from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Quote
from schemas.quotes import QuoteRequest
from core.email import send_email

router = APIRouter(prefix="/api", tags=["Quotes"])


@router.post("/quotes", status_code=status.HTTP_201_CREATED)
def submit_quote(quote_data: QuoteRequest, db: Session = Depends(get_db)):
    try:
        new_quote = Quote(
            name=quote_data.name,
            email=quote_data.email,
            phone=quote_data.phone,
            company_name=quote_data.companyName,
            service_type=quote_data.serviceType,
            project_details=quote_data.projectDetails,
            status="pending",
        )
        db.add(new_quote)
        db.commit()

        try:
            send_email(
                subject=f"New quote request: {quote_data.serviceType} — {quote_data.companyName}",
                body=f"""
                <h2>New quote request received</h2>
                <p><strong>Name:</strong> {quote_data.name}</p>
                <p><strong>Company:</strong> {quote_data.companyName}</p>
                <p><strong>Email:</strong> {quote_data.email}</p>
                <p><strong>Phone:</strong> {quote_data.phone}</p>
                <p><strong>Service needed:</strong> {quote_data.serviceType}</p>
                <p><strong>Project details:</strong></p>
                <p style="padding: 15px; background-color: #ffffff; border-left: 4px solid #2fa5b6;">
                    {quote_data.projectDetails}
                </p>
                """,
            )
        except Exception as exc:  # pragma: no cover — email is best-effort
            print(f"Quote email notification failed: {exc}")

        return {"message": "Quote request submitted successfully"}

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting quote: {exc}",
        )
