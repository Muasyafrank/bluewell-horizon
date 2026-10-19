"""Business system: invoices and the payments recorded against them.

An invoice is created from an order whose quotation was sent (the usual path)
or typed in by hand (walk-in and phone sales). Stock is not touched here: goods
are set aside when the order is placed (and returned if it is cancelled).
Manual invoices are for work or goods outside the website's orders; record any
stock they use with a stock adjustment.
"""
import logging
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.email import email_is_configured, send_email
from config import settings
from core.invoicing import balance, default_due, invoice_number, payment_status, render_invoice_email
from core.payments import available_payment_methods
from core.permissions import require
from core.quotation import compute_totals, money
from database import get_db
from models import Admin, Invoice, Order, Payment
from schemas.bms import InvoiceFromOrder, InvoiceRequest, PaymentRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/bms", tags=["Invoices"])


def serialise_payment(payment: Payment) -> dict:
    return {
        "id": payment.id, "amount": float(payment.amount), "method": payment.method,
        "reference": payment.reference, "receivedOn": payment.received_on.isoformat(),
        "notes": payment.notes, "recordedBy": payment.recorded_by,
    }


def serialise_invoice(invoice: Invoice, detail: bool = False) -> dict:
    data = {
        "id": invoice.id, "number": invoice.number, "orderId": invoice.order_id,
        "customerName": invoice.customer_name, "customerEmail": invoice.customer_email,
        "companyName": invoice.company_name, "status": invoice.status,
        "paymentStatus": payment_status(invoice),
        "total": float(invoice.total_amount), "paid": float(invoice.amount_paid),
        "balance": float(balance(invoice)),
        "issuedOn": invoice.issued_on.isoformat(), "dueOn": invoice.due_on.isoformat(),
        "emailedAt": invoice.emailed_at.isoformat() if invoice.emailed_at else None,
    }
    if detail:
        data.update({
            "customerPhone": invoice.customer_phone, "kraPin": invoice.kra_pin,
            "lines": invoice.lines, "subtotal": float(invoice.subtotal),
            "deliveryFee": float(invoice.delivery_fee), "includeVat": invoice.include_vat,
            "vatAmount": float(invoice.vat_amount), "notes": invoice.notes,
            "payments": [serialise_payment(p) for p in invoice.payments],
        })
    return data


def _get(db: Session, invoice_id: int) -> Invoice:
    invoice = db.get(Invoice, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


def _create(db: Session, admin: Admin, *, order_id, name, email, phone, company, kra_pin, lines,
            delivery_fee, include_vat, due_on, notes) -> Invoice:
    try:
        totals = compute_totals(lines, delivery_fee, include_vat)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))
    issued = date.today()
    due = due_on or default_due(issued)
    if due < issued:
        raise HTTPException(status_code=422, detail="The due date is before today.")
    invoice = Invoice(
        number="PENDING", order_id=order_id, customer_name=name, customer_email=email,
        customer_phone=phone, company_name=company, kra_pin=kra_pin, lines=lines,
        subtotal=totals["subtotal"], delivery_fee=totals["deliveryFee"], include_vat=include_vat,
        vat_amount=totals["vatAmount"], total_amount=totals["totalAmount"], amount_paid=0,
        issued_on=issued, due_on=due, notes=notes or None, status="issued",
        created_by=admin.display_name,
    )
    db.add(invoice)
    db.flush()  # need the id for the number
    invoice.number = invoice_number(invoice.id, issued)
    return invoice


@router.get("/invoices")
def list_invoices(admin: Admin = Depends(require("invoices")), db: Session = Depends(get_db)):
    rows = db.query(Invoice).order_by(Invoice.id.desc()).all()
    return [serialise_invoice(i) for i in rows]


@router.get("/invoices/ready")
def orders_ready_to_invoice(admin: Admin = Depends(require("invoices")), db: Session = Depends(get_db)):
    """Orders whose quotation has gone out and that have no live invoice yet."""
    invoiced = {i.order_id for i in db.query(Invoice).filter(Invoice.status != "void") if i.order_id}
    rows = []
    for order in db.query(Order).filter(Order.order_status != "cancelled").order_by(Order.id.desc()).all():
        quotation = order.quotation
        if quotation is None or quotation.status != "sent" or order.id in invoiced:
            continue
        rows.append({
            "orderId": order.id, "orderNumber": order.order_number, "customerName": order.customer_name,
            "companyName": order.company_name, "quoteNumber": quotation.quote_number,
            "total": float(quotation.total_amount),
            "sentAt": quotation.sent_at.isoformat() if quotation.sent_at else None,
        })
    return rows


@router.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: int, admin: Admin = Depends(require("invoices")), db: Session = Depends(get_db)):
    return serialise_invoice(_get(db, invoice_id), detail=True)


@router.post("/invoices", status_code=status.HTTP_201_CREATED)
def create_invoice(request: InvoiceRequest, admin: Admin = Depends(require("invoices")),
                   db: Session = Depends(get_db)):
    lines = [{"description": l.description, "quantity": l.quantity, "unitPrice": float(money(l.unitPrice))}
             for l in request.lines]
    invoice = _create(
        db, admin, order_id=None, name=request.customerName,
        email=request.customerEmail.lower() if request.customerEmail else None,
        phone=request.customerPhone, company=request.companyName, kra_pin=request.kraPin,
        lines=lines, delivery_fee=request.deliveryFee, include_vat=request.includeVat,
        due_on=request.dueOn, notes=request.notes,
    )
    db.commit()
    db.refresh(invoice)
    return serialise_invoice(invoice, detail=True)


@router.post("/invoices/from-order/{order_id}", status_code=status.HTTP_201_CREATED)
def invoice_from_order(order_id: int, request: InvoiceFromOrder = InvoiceFromOrder(),
                       admin: Admin = Depends(require("invoices")), db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    quotation = order.quotation
    if quotation is None or quotation.status != "sent":
        raise HTTPException(status_code=409, detail="Send the customer a quotation before invoicing this order.")
    if order.order_status == "cancelled":
        raise HTTPException(status_code=409, detail="This order was cancelled.")
    existing = db.query(Invoice).filter(Invoice.order_id == order.id, Invoice.status != "void").first()
    if existing:
        raise HTTPException(status_code=409, detail=f"This order is already invoiced ({existing.number}).")

    invoice = _create(
        db, admin, order_id=order.id, name=order.customer_name, email=order.customer_email.lower(),
        phone=order.customer_phone, company=order.company_name, kra_pin=order.kra_pin,
        lines=quotation.lines, delivery_fee=quotation.delivery_fee, include_vat=quotation.include_vat,
        due_on=request.dueOn, notes=quotation.notes,
    )

    if order.order_status in ("processing", "quoted"):
        order.order_status = "confirmed"
    db.commit()
    db.refresh(invoice)
    return serialise_invoice(invoice, detail=True)


@router.post("/invoices/{invoice_id}/void")
def void_invoice(invoice_id: int, admin: Admin = Depends(require("invoices")), db: Session = Depends(get_db)):
    invoice = _get(db, invoice_id)
    if invoice.status == "void":
        raise HTTPException(status_code=409, detail="This invoice is already void.")
    if invoice.payments:
        raise HTTPException(status_code=409, detail="Payments are recorded on this invoice. Remove them first.")
    invoice.status = "void"
    db.commit()
    db.refresh(invoice)
    return serialise_invoice(invoice, detail=True)


@router.post("/invoices/{invoice_id}/send")
def send_invoice(invoice_id: int, admin: Admin = Depends(require("invoices")), db: Session = Depends(get_db)):
    invoice = _get(db, invoice_id)
    if invoice.status == "void":
        raise HTTPException(status_code=409, detail="A void invoice cannot be sent.")
    if not invoice.customer_email:
        raise HTTPException(status_code=422, detail="This invoice has no customer email address.")
    if not email_is_configured():
        raise HTTPException(status_code=503, detail="Email is not set up on the server (EMAIL_USER and EMAIL_PASS).")
    subject, html = render_invoice_email(invoice, available_payment_methods())
    try:
        send_email(subject=subject, body=html, to=invoice.customer_email, cc=settings.email_user)
    except Exception:  # noqa: BLE001
        logger.exception("Could not send invoice %s", invoice.number)
        raise HTTPException(status_code=502, detail="The email could not be sent. Please try again.")
    invoice.emailed_at = datetime.now(timezone.utc)
    db.commit()
    return serialise_invoice(invoice, detail=True)


@router.post("/invoices/{invoice_id}/payments", status_code=status.HTTP_201_CREATED)
def record_payment(invoice_id: int, request: PaymentRequest, admin: Admin = Depends(require("payments")),
                   db: Session = Depends(get_db)):
    invoice = _get(db, invoice_id)
    if invoice.status == "void":
        raise HTTPException(status_code=409, detail="This invoice is void.")
    amount = money(request.amount)
    if amount > balance(invoice):
        raise HTTPException(status_code=422, detail=f"That is more than the balance due (KES {balance(invoice):,.2f}).")
    if request.method != "cash" and not request.reference:
        raise HTTPException(status_code=422, detail="Enter the payment reference (M-Pesa code, bank slip or cheque number).")
    received = request.receivedOn or date.today()
    if received > date.today():
        raise HTTPException(status_code=422, detail="The payment date is in the future.")

    db.add(Payment(invoice_id=invoice.id, amount=amount, method=request.method, reference=request.reference,
                   received_on=received, notes=request.notes, recorded_by=admin.display_name))
    invoice.amount_paid = money(invoice.amount_paid) + amount
    db.commit()
    db.refresh(invoice)
    return serialise_invoice(invoice, detail=True)


@router.delete("/invoices/{invoice_id}/payments/{payment_id}")
def remove_payment(invoice_id: int, payment_id: int, admin: Admin = Depends(require("payments")),
                   db: Session = Depends(get_db)):
    invoice = _get(db, invoice_id)
    payment = next((p for p in invoice.payments if p.id == payment_id), None)
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    invoice.amount_paid = money(invoice.amount_paid) - money(payment.amount)
    invoice.payments.remove(payment)  # delete-orphan removes the row
    db.commit()
    db.refresh(invoice)
    return serialise_invoice(invoice, detail=True)
