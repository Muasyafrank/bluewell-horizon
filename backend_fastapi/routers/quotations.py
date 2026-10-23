"""Admin: prepare a quotation for an order and email it to the customer.

Flow: the customer places an order -> the admin opens it, prices the lines,
picks the payment methods to offer and sends the quotation -> the customer
receives it by email and pays using the order number as the reference.
"""
import logging
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.email import business_address, email_is_configured, send_email
from core.payments import available_payment_methods
from core.quotation import compute_totals, money, quote_number_for, render_quotation_email
from core.security import get_current_admin
from database import get_db
from models import Admin, Order, OrderItem, Product, Quotation
from schemas.quotation import QuotationRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["Quotations"])


def _order_or_404(db: Session, order_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def _serialise(quotation: Quotation) -> dict:
    return {
        "id": quotation.id,
        "quoteNumber": quotation.quote_number,
        "status": quotation.status,
        "lines": quotation.lines,
        "paymentMethods": [method["key"] for method in quotation.payment_methods],
        "subtotal": float(quotation.subtotal),
        "deliveryFee": float(quotation.delivery_fee),
        "includeVat": quotation.include_vat,
        "vatAmount": float(quotation.vat_amount),
        "totalAmount": float(quotation.total_amount),
        "validUntil": quotation.valid_until.isoformat(),
        "notes": quotation.notes,
        "sentAt": quotation.sent_at.isoformat() if quotation.sent_at else None,
    }


def _prepare(request: QuotationRequest) -> dict:
    """Validates the request and works out the figures and payment details."""
    if request.validUntil < date.today():
        raise HTTPException(status_code=422, detail="The quotation's valid-until date is in the past.")

    available = {method["key"]: method for method in available_payment_methods()}
    unknown = [key for key in request.paymentMethods if key not in available]
    if unknown:
        raise HTTPException(
            status_code=422,
            detail="These payment methods are not set up: " + ", ".join(unknown),
        )
    chosen = [available[key] for key in dict.fromkeys(request.paymentMethods)]  # de-duplicated, in order

    lines = [
        {"description": line.description, "quantity": line.quantity, "unitPrice": float(money(line.unitPrice))}
        for line in request.lines
    ]
    try:
        totals = compute_totals(lines, request.deliveryFee, request.includeVat)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error))
    return {"lines": lines, "totals": totals, "payment_methods": chosen}


def _render(order: Order, quote_number: str, request: QuotationRequest, prepared: dict):
    return render_quotation_email(
        quote_number=quote_number,
        order_number=order.order_number,
        customer_name=order.customer_name,
        company_name=order.company_name,
        lines=prepared["lines"],
        totals=prepared["totals"],
        include_vat=request.includeVat,
        valid_until=request.validUntil,
        issued_on=date.today(),
        payment_methods=prepared["payment_methods"],
        notes=request.notes,
    )


def _save(db: Session, order: Order, request: QuotationRequest, prepared: dict) -> Quotation:
    totals = prepared["totals"]
    quotation = order.quotation or Quotation(order_id=order.id, quote_number=quote_number_for(order.order_number))
    quotation.lines = prepared["lines"]
    quotation.payment_methods = prepared["payment_methods"]
    quotation.subtotal = totals["subtotal"]
    quotation.delivery_fee = totals["deliveryFee"]
    quotation.include_vat = request.includeVat
    quotation.vat_amount = totals["vatAmount"]
    quotation.total_amount = totals["totalAmount"]
    quotation.valid_until = request.validUntil
    quotation.notes = request.notes or None
    quotation.status = "draft"  # editing a quotation that was sent makes it a draft again until re-sent
    db.add(quotation)
    db.commit()
    db.refresh(quotation)
    return quotation


@router.get("/payment-methods")
def list_payment_methods(admin: Admin = Depends(get_current_admin)):
    return {"paymentMethods": available_payment_methods(), "emailConfigured": email_is_configured()}


@router.get("/orders/{order_id}/quotation")
def get_quotation(order_id: int, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    order = _order_or_404(db, order_id)

    # Starting point for the form: one line per product ordered. Catalogue
    # prices are not shown on the shop, so the unit price is usually blank.
    rows = (
        db.query(OrderItem, Product)
        .outerjoin(Product, Product.id == OrderItem.product_id)
        .filter(OrderItem.order_id == order.id)
        .all()
    )
    suggested = [
        {
            "description": product.name if product else "Product",
            "quantity": item.quantity,
            "unitPrice": float(item.price) if item.price else None,
        }
        for item, product in rows
    ]
    return {
        "quotation": _serialise(order.quotation) if order.quotation else None,
        "suggestedLines": suggested,
        "deliveryFee": float(order.delivery_fee or 0),
        "paymentMethods": available_payment_methods(),
        "emailConfigured": email_is_configured(),
    }


@router.put("/orders/{order_id}/quotation")
def save_quotation(
    order_id: int,
    request: QuotationRequest,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    order = _order_or_404(db, order_id)
    quotation = _save(db, order, request, _prepare(request))
    return {"quotation": _serialise(quotation)}


@router.post("/orders/{order_id}/quotation/preview")
def preview_quotation(
    order_id: int,
    request: QuotationRequest,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """The email exactly as the customer will receive it. Nothing is saved."""
    order = _order_or_404(db, order_id)
    subject, html = _render(order, quote_number_for(order.order_number), request, _prepare(request))
    return {"subject": subject, "html": html}


@router.post("/orders/{order_id}/quotation/send")
def send_quotation(
    order_id: int,
    request: QuotationRequest,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    order = _order_or_404(db, order_id)
    if not email_is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email is not set up on the server (EMAIL_USER and EMAIL_PASS), so the quotation cannot be sent.",
        )

    prepared = _prepare(request)
    # Saved before sending, so a mail-server failure never loses the admin's work.
    quotation = _save(db, order, request, prepared)
    subject, html = _render(order, quotation.quote_number, request, prepared)

    try:
        # Sent inside the request (not in the background) because the admin
        # needs to know whether it actually went. A copy goes to the company.
        send_email(subject=subject, body=html, to=order.customer_email, cc=business_address())
    except Exception:  # noqa: BLE001 — any SMTP failure is reported the same way
        logger.exception("Could not send quotation %s", quotation.quote_number)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The email could not be sent. Your quotation is saved as a draft; please try again.",
        )

    totals = prepared["totals"]
    quotation.status = "sent"
    quotation.sent_at = datetime.now(timezone.utc)
    # The order now carries the agreed figures (the checkout stored estimates).
    order.subtotal = totals["subtotal"]
    order.delivery_fee = totals["deliveryFee"]
    order.vat_amount = totals["vatAmount"]
    order.total_amount = totals["totalAmount"]
    if order.order_status == "processing":
        order.order_status = "quoted"
    db.commit()
    db.refresh(quotation)
    return {"message": f"Quotation sent to {order.customer_email}", "quotation": _serialise(quotation)}
