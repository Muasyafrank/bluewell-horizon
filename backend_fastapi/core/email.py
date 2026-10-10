"""
Outbound email, shared by contact, quote and order notifications.

Use `send_email_safely` from request handlers (via FastAPI's BackgroundTasks):
it never raises, so a mail-server problem cannot fail the request that
triggered it, and it runs after the response has been sent.
"""
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config import settings

logger = logging.getLogger(__name__)

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_TIMEOUT_SECONDS = 15


def _single_line(value: str) -> str:
    """Header values must not contain line breaks (header injection)."""
    return " ".join(value.splitlines())


def send_email(subject: str, body: str, to: str | None = None) -> None:
    """Sends an HTML email via Gmail SMTP. Does nothing if EMAIL_USER / EMAIL_PASS
    are not configured. Raises on SMTP errors; prefer `send_email_safely`."""
    if not settings.email_user or not settings.email_pass:
        logger.info("Email not sent: EMAIL_USER/EMAIL_PASS are not configured")
        return

    message = MIMEMultipart()
    message["From"] = settings.email_user
    message["To"] = _single_line(to or settings.email_user)
    message["Subject"] = _single_line(subject)
    message.attach(MIMEText(body, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=SMTP_TIMEOUT_SECONDS) as server:
        server.starttls()
        server.login(settings.email_user, settings.email_pass)
        server.send_message(message)


def send_email_safely(subject: str, body: str, to: str | None = None) -> None:
    """`send_email` that logs failures instead of raising them."""
    try:
        send_email(subject=subject, body=body, to=to)
    except Exception:  # noqa: BLE001 — notification is best-effort by design
        logger.exception("Failed to send email %r", subject)
