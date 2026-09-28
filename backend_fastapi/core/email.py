"""
Outbound email, shared by contact, quote and order notifications.

The old code defined an almost identical SMTP function three times — once in
routers/orders.py, once in routers/quotes.py, and now needed again for
routers/contact.py — each with its own `load_dotenv()` call and its own typo
risk. There is now one implementation.
"""
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config import settings


def send_email(subject: str, body: str, to: str | None = None) -> None:
    """Sends an HTML email via Gmail SMTP.

    Silently does nothing if EMAIL_USER / EMAIL_PASS are not configured —
    callers should still wrap this in their own try/except, since a mail
    server hiccup should never fail the request that triggered it (placing an
    order, submitting a quote).
    """
    if not settings.email_user or not settings.email_pass:
        print("Email not sent: EMAIL_USER/EMAIL_PASS are not configured")
        return

    message = MIMEMultipart()
    message["From"] = settings.email_user
    message["To"] = to or settings.email_user
    message["Subject"] = subject
    message.attach(MIMEText(body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.email_user, settings.email_pass)
        server.send_message(message)
