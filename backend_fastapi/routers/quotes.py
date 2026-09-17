from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Quote
from schemas.quotes import QuoteRequest, QuoteResponse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["Quotes"])

@router.post("/quotes", response_model=dict, status_code=status.HTTP_201_CREATED)
def submit_quote(quote_data: QuoteRequest, db: Session = Depends(get_db)):
    try:
        # Save quote to database
        new_quote = Quote(
            name=quote_data.name,
            email=quote_data.email,
            phone=quote_data.phone,
            company_name=quote_data.companyName,
            service_type=quote_data.serviceType,
            project_details=quote_data.projectDetails,
            status="pending"
        )
        db.add(new_quote)
        db.commit()

        # Send email notification to admin (optional)
        try:
            send_quote_notification_email(new_quote)
        except Exception as e:
            print(f"Quote email notification failed: {e}")

        return {"message": "Quote request submitted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting quote: {str(e)}"
        )

def send_quote_notification_email(quote: Quote):
    """Send quote request notification to admin"""
    try:
        email_user = os.getenv("EMAIL_USER")
        email_pass = os.getenv("EMAIL_PASS")

        if not email_user or not email_pass:
            print("Email credentials not configured")
            return

        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = email_user  # Send to yourself
        msg['Subject'] = f"📋 New Quote Request: {quote.service_type} - {quote.company_name}"

        body = f"""
        <h2>New Quote Request Received</h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> {quote.name}</p>
          <p><strong>Company:</strong> {quote.company_name}</p>
          <p><strong>Email:</strong> {quote.email}</p>
          <p><strong>Phone:</strong> {quote.phone}</p>
          <p><strong>Service Needed:</strong> {quote.service_type}</p>
          <p><strong>Project Details:</strong></p>
          <p style="padding: 15px; background-color: #ffffff; border-left: 4px solid #2fa5b6; border-radius: 4px;">
            {quote.project_details}
          </p>
        </div>
        <p style="color: #718096; font-size: 14px;">
          Please review this request in your admin dashboard or reply directly to the client.
        </p>
        """

        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email_user, email_pass)
        server.send_message(msg)
        server.quit()

    except Exception as e:
        print(f"Error sending quote notification email: {e}")
        raise