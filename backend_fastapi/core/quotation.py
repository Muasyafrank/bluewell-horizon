"""Quotation maths and the quotation email.

Pure functions (no database, no web framework), so they are easy to test and
the figures sent to a customer are always computed here on the server rather
than trusted from the browser.
"""
from datetime import date
from decimal import ROUND_HALF_UP, Decimal
from html import escape

VAT_RATE = Decimal("0.16")
MONEY = Decimal("0.01")
# Order totals are stored as NUMERIC(10, 2).
MAX_TOTAL = Decimal("99999999.99")

COMPANY_NAME = "Bluewell Horizon Solutions Limited"
COMPANY_ADDRESS = "Harambee Estate, Nairobi, Kenya"
COMPANY_PHONES = ("0721 633 223", "0731 836 349")
COMPANY_EMAIL = "bluewellsynergy@gmail.com"


def money(value) -> Decimal:
    return Decimal(str(value)).quantize(MONEY, rounding=ROUND_HALF_UP)


def quote_number_for(order_number: str) -> str:
    """BW-20261016-00042 -> QT-BW-20261016-00042"""
    return f"QT-{order_number}"


def compute_totals(lines, delivery_fee, include_vat: bool) -> dict:
    """Subtotal, VAT and total for `lines` (each with `quantity` and `unitPrice`).

    VAT applies to goods and delivery together, as the shop's own checkout does.
    Raises ValueError if the total would not fit in the orders table.
    """
    subtotal = sum((money(line["unitPrice"]) * int(line["quantity"]) for line in lines), Decimal("0"))
    fee = money(delivery_fee)
    vat = money((subtotal + fee) * VAT_RATE) if include_vat else Decimal("0.00")
    total = subtotal + fee + vat
    if total > MAX_TOTAL:
        raise ValueError("The quotation total is too large.")
    return {"subtotal": money(subtotal), "deliveryFee": fee, "vatAmount": vat, "totalAmount": money(total)}


def kes(value) -> str:
    return f"KES {money(value):,.2f}"


def _date(value: date) -> str:
    return f"{value.day} {value:%B %Y}"


def render_quotation_email(
    *,
    quote_number: str,
    order_number: str,
    customer_name: str,
    company_name: str | None,
    lines: list[dict],
    totals: dict,
    include_vat: bool,
    valid_until: date,
    issued_on: date,
    payment_methods: list[dict],
    notes: str | None,
) -> tuple[str, str]:
    """Returns `(subject, html)`. Every value that came from a person is escaped."""
    e = escape
    cell = "padding:8px 10px;border-bottom:1px solid #e8eef2;"

    rows = "".join(
        f'<tr><td style="{cell}">{e(line["description"])}</td>'
        f'<td style="{cell}text-align:center;">{int(line["quantity"])}</td>'
        f'<td style="{cell}text-align:right;">{e(kes(line["unitPrice"]))}</td>'
        f'<td style="{cell}text-align:right;">{e(kes(money(line["unitPrice"]) * int(line["quantity"])))}</td></tr>'
        for line in lines
    )

    def total_row(label: str, value: str, strong: bool = False) -> str:
        weight = "font-weight:bold;font-size:16px;" if strong else ""
        return (
            f'<tr><td colspan="3" style="padding:6px 10px;text-align:right;{weight}">{e(label)}</td>'
            f'<td style="padding:6px 10px;text-align:right;{weight}">{e(value)}</td></tr>'
        )

    totals_rows = total_row("Subtotal", kes(totals["subtotal"]))
    if totals["deliveryFee"] > 0:
        totals_rows += total_row("Delivery", kes(totals["deliveryFee"]))
    if include_vat:
        totals_rows += total_row("VAT (16%)", kes(totals["vatAmount"]))
    totals_rows += total_row("Total", kes(totals["totalAmount"]), strong=True)

    payments = ""
    for method in payment_methods:
        details = "".join(
            f'<div style="margin:2px 0;"><span style="color:#5b6b7a;">{e(label)}:</span> <strong>{e(value)}</strong></div>'
            for label, value in method["details"]
        )
        payments += (
            f'<div style="border:1px solid #e8eef2;border-radius:8px;padding:12px 14px;margin:0 0 10px;">'
            f'<div style="font-weight:bold;margin-bottom:4px;">{e(method["label"])}</div>{details}</div>'
        )

    notes_html = f'<p style="margin:16px 0 0;">{e(notes).replace(chr(10), "<br/>")}</p>' if notes else ""
    billed_to = f"{e(customer_name)}" + (f"<br/>{e(company_name)}" if company_name else "")

    html = f"""
<div style="font-family:Arial,Helvetica,sans-serif;color:#0b2540;max-width:640px;margin:0 auto;line-height:1.5;">
  <div style="background:#0b2540;color:#fff;padding:18px 22px;border-radius:10px 10px 0 0;">
    <div style="font-size:20px;font-weight:bold;">{e(COMPANY_NAME)}</div>
    <div style="color:#7dd3e3;">Quotation {e(quote_number)}</div>
  </div>
  <div style="border:1px solid #e8eef2;border-top:0;padding:22px;border-radius:0 0 10px 10px;">
    <p>Dear {e(customer_name)},</p>
    <p>Thank you for your order <strong>{e(order_number)}</strong>. Here is our quotation for the items you requested.</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 14px;font-size:14px;">
      <tr><td style="padding:2px 0;color:#5b6b7a;">Quotation number</td><td>{e(quote_number)}</td>
          <td style="padding:2px 0;color:#5b6b7a;">Issued</td><td>{e(_date(issued_on))}</td></tr>
      <tr><td style="padding:2px 0;color:#5b6b7a;">Prepared for</td><td>{billed_to}</td>
          <td style="padding:2px 0;color:#5b6b7a;">Valid until</td><td>{e(_date(valid_until))}</td></tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead><tr style="background:#f4f8fa;">
        <th style="{cell}text-align:left;">Item</th><th style="{cell}">Qty</th>
        <th style="{cell}text-align:right;">Unit price</th><th style="{cell}text-align:right;">Amount</th>
      </tr></thead>
      <tbody>{rows}</tbody>
      <tfoot>{totals_rows}</tfoot>
    </table>
    <h3 style="margin:24px 0 8px;">How to pay</h3>
    <p style="margin:0 0 10px;">Use <strong>{e(order_number)}</strong> as the payment reference, then reply to this email with your payment confirmation so we can confirm your order.</p>
    {payments}
    {notes_html}
    <p style="margin:22px 0 0;">Questions? Call {e(' or '.join(COMPANY_PHONES))} or reply to this email.</p>
    <p style="margin:16px 0 0;">Best regards,<br/>{e(COMPANY_NAME)}<br/><span style="color:#5b6b7a;">{e(COMPANY_ADDRESS)}</span></p>
  </div>
</div>
"""
    return f"Quotation {quote_number} for your order {order_number}", html
