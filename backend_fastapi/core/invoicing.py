"""Invoice and stock rules shared by the business-system routers.

Money maths reuses `core.quotation` so an invoice always adds up exactly like
the quotation it came from.
"""
from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from core.quotation import money
from models import Invoice, Product, StockMovement

DEFAULT_TERMS_DAYS = 14


def invoice_number(invoice_id: int, issued_on: date) -> str:
    return f"INV-{issued_on:%Y}-{invoice_id:05d}"


def default_due(issued_on: date) -> date:
    return issued_on + timedelta(days=DEFAULT_TERMS_DAYS)


def balance(invoice: Invoice) -> Decimal:
    return money(invoice.total_amount) - money(invoice.amount_paid)


def payment_status(invoice: Invoice, today: date | None = None) -> str:
    """void | paid | partial | overdue | unpaid — derived, never stored."""
    if invoice.status == "void":
        return "void"
    due = balance(invoice)
    if due <= 0:
        return "paid"
    if invoice.due_on < (today or date.today()):
        return "overdue"
    return "partial" if money(invoice.amount_paid) > 0 else "unpaid"


class InsufficientStock(Exception):
    def __init__(self, shortages: list[str]):
        super().__init__("Not enough stock: " + ", ".join(shortages))
        self.shortages = shortages


def move_stock(db: Session, product: Product, change: int, reason: str,
               reference: str | None = None, note: str | None = None, by: str | None = None) -> StockMovement:
    """Applies `change` to the product and records why. Never lets stock go negative."""
    current = product.stock or 0
    if current + change < 0:
        raise InsufficientStock([f"{product.name} (have {current}, need {-change})"])
    product.stock = current + change
    movement = StockMovement(product_id=product.id, change=change, balance_after=product.stock,
                             reason=reason, reference=reference, note=note, created_by=by)
    db.add(movement)
    return movement


def render_invoice_email(invoice: Invoice, payment_methods: list[dict]) -> tuple[str, str]:
    """`(subject, html)` for emailing an invoice. Everything typed by a person is escaped."""
    from html import escape as e
    from core.quotation import COMPANY_ADDRESS, COMPANY_NAME, COMPANY_PHONES, _date, kes

    cell = "padding:8px 10px;border-bottom:1px solid #e8eef2;"
    rows = "".join(
        f'<tr><td style="{cell}">{e(line["description"])}</td>'
        f'<td style="{cell}text-align:center;">{int(line["quantity"])}</td>'
        f'<td style="{cell}text-align:right;">{e(kes(line["unitPrice"]))}</td>'
        f'<td style="{cell}text-align:right;">{e(kes(money(line["unitPrice"]) * int(line["quantity"])))}</td></tr>'
        for line in invoice.lines
    )

    def total_row(label: str, value: str, strong: bool = False) -> str:
        weight = "font-weight:bold;font-size:16px;" if strong else ""
        return (f'<tr><td colspan="3" style="padding:6px 10px;text-align:right;{weight}">{e(label)}</td>'
                f'<td style="padding:6px 10px;text-align:right;{weight}">{e(value)}</td></tr>')

    totals = total_row("Subtotal", kes(invoice.subtotal))
    if money(invoice.delivery_fee) > 0:
        totals += total_row("Delivery", kes(invoice.delivery_fee))
    if invoice.include_vat:
        totals += total_row("VAT (16%)", kes(invoice.vat_amount))
    totals += total_row("Total", kes(invoice.total_amount), strong=True)
    if money(invoice.amount_paid) > 0:
        totals += total_row("Paid", kes(invoice.amount_paid))
        totals += total_row("Balance due", kes(balance(invoice)), strong=True)

    pay = ""
    for method in payment_methods:
        details = "".join(
            f'<div style="margin:2px 0;"><span style="color:#5b6b7a;">{e(label)}:</span> <strong>{e(value)}</strong></div>'
            for label, value in method["details"]
        )
        pay += (f'<div style="border:1px solid #e8eef2;border-radius:8px;padding:12px 14px;margin:0 0 10px;">'
                f'<div style="font-weight:bold;margin-bottom:4px;">{e(method["label"])}</div>{details}</div>')

    pin = f"<br/>KRA PIN: {e(invoice.kra_pin)}" if invoice.kra_pin else ""
    company = f"<br/>{e(invoice.company_name)}" if invoice.company_name else ""
    html = f"""
<div style="font-family:Arial,Helvetica,sans-serif;color:#0b2540;max-width:640px;margin:0 auto;line-height:1.5;">
  <div style="background:#0b2540;color:#fff;padding:18px 22px;border-radius:10px 10px 0 0;">
    <div style="font-size:20px;font-weight:bold;">{e(COMPANY_NAME)}</div>
    <div style="color:#7dd3e3;">Invoice {e(invoice.number)}</div>
  </div>
  <div style="border:1px solid #e8eef2;border-top:0;padding:22px;border-radius:0 0 10px 10px;">
    <p>Dear {e(invoice.customer_name)},</p>
    <p>Please find your invoice below. It is due on <strong>{e(_date(invoice.due_on))}</strong>.</p>
    <p style="margin:0 0 14px;color:#5b6b7a;">Billed to: {e(invoice.customer_name)}{company}{pin}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead><tr style="background:#f4f8fa;"><th style="{cell}text-align:left;">Item</th><th style="{cell}">Qty</th>
        <th style="{cell}text-align:right;">Unit price</th><th style="{cell}text-align:right;">Amount</th></tr></thead>
      <tbody>{rows}</tbody><tfoot>{totals}</tfoot>
    </table>
    <h3 style="margin:24px 0 8px;">How to pay</h3>
    <p style="margin:0 0 10px;">Use <strong>{e(invoice.number)}</strong> as the payment reference.</p>
    {pay}
    <p style="margin:22px 0 0;">Questions? Call {e(' or '.join(COMPANY_PHONES))} or reply to this email.</p>
    <p style="margin:16px 0 0;">{e(COMPANY_NAME)}<br/><span style="color:#5b6b7a;">{e(COMPANY_ADDRESS)}</span></p>
  </div>
</div>
"""
    return f"Invoice {invoice.number} from {COMPANY_NAME}", html
