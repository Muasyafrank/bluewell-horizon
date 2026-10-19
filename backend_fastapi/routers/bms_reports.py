"""Business system: the dashboard and the reports."""
import csv
import io
from collections import defaultdict
from datetime import date, timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from core.invoicing import balance, payment_status
from core.permissions import modules_for, require
from core.quotation import money
from database import get_db
from models import Admin, Invoice, Order, Payment, Product, PurchaseOrder
from routers.bms_stock import serialise_product, stock_state

router = APIRouter(prefix="/api/bms", tags=["Reports"])


def _f(value) -> float:
    return float(money(value))


@router.get("/dashboard")
def dashboard(admin: Admin = Depends(require("dashboard")), db: Session = Depends(get_db)):
    """Only the sections this role may see, so the page never shows figures behind a 403."""
    allowed = set(modules_for(admin.effective_role))
    data: dict = {}
    today = date.today()

    if "invoices" in allowed:
        invoiced_orders = {i.order_id for i in db.query(Invoice).filter(Invoice.status != "void") if i.order_id}
        orders = db.query(Order).filter(Order.order_status != "cancelled").all()
        data["awaitingQuotation"] = sum(1 for o in orders if o.quotation is None and o.order_status == "processing")
        data["awaitingInvoice"] = sum(
            1 for o in orders if o.quotation is not None and o.quotation.status == "sent" and o.id not in invoiced_orders
        )

    if "payments" in allowed or "reports" in allowed:
        live = db.query(Invoice).filter(Invoice.status != "void").all()
        month_start = today.replace(day=1)
        overdue = [i for i in live if payment_status(i, today) == "overdue"]
        data["money"] = {
            "outstanding": _f(sum((balance(i) for i in live), Decimal("0"))),
            "overdueCount": len(overdue),
            "overdueAmount": _f(sum((balance(i) for i in overdue), Decimal("0"))),
            "invoicedThisMonth": _f(sum((money(i.total_amount) for i in live if i.issued_on >= month_start), Decimal("0"))),
            "collectedThisMonth": _f(sum(
                (money(p.amount) for p in db.query(Payment).filter(Payment.received_on >= month_start)), Decimal("0"))),
        }

    if "stock" in allowed:
        products = db.query(Product).order_by(Product.name).all()
        flagged = [serialise_product(p) for p in products if stock_state(p) != "ok"]
        flagged.sort(key=lambda p: (p["state"] != "out", p["stock"]))
        data["stock"] = {"flaggedCount": len(flagged), "items": flagged[:8]}

    if "purchasing" in allowed:
        data["openPurchaseOrders"] = db.query(PurchaseOrder).filter(PurchaseOrder.status.in_(("draft", "ordered"))).count()

    return data


def _range(start: date | None, end: date | None) -> tuple[date, date]:
    end = end or date.today()
    start = start or date(end.year, 1, 1)
    if start > end:
        raise HTTPException(status_code=422, detail="The start date is after the end date.")
    if (end - start).days > 731:
        raise HTTPException(status_code=422, detail="Choose a range of two years or less.")
    return start, end


@router.get("/reports/summary")
def summary(start: date | None = None, end: date | None = None,
            admin: Admin = Depends(require("reports")), db: Session = Depends(get_db)):
    start, end = _range(start, end)
    today = date.today()

    invoices = [i for i in db.query(Invoice).filter(Invoice.status != "void").all()]
    in_range = [i for i in invoices if start <= i.issued_on <= end]
    payments = db.query(Payment).filter(Payment.received_on >= start, Payment.received_on <= end).all()

    months: dict[str, dict] = {}
    cursor = start.replace(day=1)
    while cursor <= end:
        months[f"{cursor:%Y-%m}"] = {"month": f"{cursor:%Y-%m}", "invoiced": Decimal("0"), "collected": Decimal("0")}
        cursor = (cursor.replace(day=28) + timedelta(days=4)).replace(day=1)
    for i in in_range:
        months[f"{i.issued_on:%Y-%m}"]["invoiced"] += money(i.total_amount)
    for p in payments:
        months[f"{p.received_on:%Y-%m}"]["collected"] += money(p.amount)

    customers: dict[str, dict] = defaultdict(lambda: {"name": "", "invoiced": Decimal("0"), "invoices": 0})
    products: dict[str, dict] = defaultdict(lambda: {"quantity": 0, "revenue": Decimal("0")})
    for i in in_range:
        key = (i.customer_email or i.customer_name).lower()
        row = customers[key]
        row["name"], row["invoices"] = i.customer_name, row["invoices"] + 1
        row["invoiced"] += money(i.total_amount)
        for line in i.lines:
            p = products[line["description"]]
            p["quantity"] += int(line["quantity"])
            p["revenue"] += money(line["unitPrice"]) * int(line["quantity"])

    methods: dict[str, Decimal] = defaultdict(Decimal)
    for p in payments:
        methods[p.method] += money(p.amount)

    # Ageing is "as of today": what is owed now and how late it is.
    buckets = {"notDue": Decimal("0"), "1-30": Decimal("0"), "31-60": Decimal("0"), "61+": Decimal("0")}
    for i in invoices:
        owed = balance(i)
        if owed <= 0:
            continue
        late = (today - i.due_on).days
        key = "notDue" if late <= 0 else "1-30" if late <= 30 else "31-60" if late <= 60 else "61+"
        buckets[key] += owed

    top_customers = sorted(customers.values(), key=lambda r: r["invoiced"], reverse=True)[:8]
    top_products = sorted(products.items(), key=lambda kv: kv[1]["revenue"], reverse=True)[:8]
    return {
        "start": start.isoformat(), "end": end.isoformat(),
        "invoiced": _f(sum((money(i.total_amount) for i in in_range), Decimal("0"))),
        "vat": _f(sum((money(i.vat_amount) for i in in_range), Decimal("0"))),
        "invoiceCount": len(in_range),
        "collected": _f(sum((money(p.amount) for p in payments), Decimal("0"))),
        "outstanding": _f(sum((balance(i) for i in invoices), Decimal("0"))),
        "months": [{"month": m["month"], "invoiced": _f(m["invoiced"]), "collected": _f(m["collected"])}
                   for m in months.values()],
        "ageing": {k: _f(v) for k, v in buckets.items()},
        "paymentMethods": [{"method": k, "amount": _f(v)} for k, v in sorted(methods.items(), key=lambda kv: -kv[1])],
        "topCustomers": [{"name": r["name"], "invoices": r["invoices"], "invoiced": _f(r["invoiced"])} for r in top_customers],
        "topProducts": [{"name": k, "quantity": v["quantity"], "revenue": _f(v["revenue"])} for k, v in top_products],
    }


@router.get("/reports/invoices.csv")
def invoices_csv(start: date | None = None, end: date | None = None,
                 admin: Admin = Depends(require("reports")), db: Session = Depends(get_db)):
    start, end = _range(start, end)
    rows = (db.query(Invoice).filter(Invoice.issued_on >= start, Invoice.issued_on <= end)
            .order_by(Invoice.issued_on, Invoice.id).all())
    out = io.StringIO()
    writer = csv.writer(out)
    writer.writerow(["Invoice", "Issued", "Due", "Customer", "Company", "KRA PIN", "Subtotal", "Delivery",
                     "VAT", "Total", "Paid", "Balance", "Status"])
    for i in rows:
        # A leading =,+,-,@ would run as a formula when opened in Excel.
        def safe(text):
            text = text or ""
            return "'" + text if text and text[0] in "=+-@" else text
        writer.writerow([i.number, i.issued_on, i.due_on, safe(i.customer_name), safe(i.company_name), safe(i.kra_pin),
                         i.subtotal, i.delivery_fee, i.vat_amount, i.total_amount, i.amount_paid, balance(i),
                         payment_status(i)])
    return Response(out.getvalue(), media_type="text/csv",
                    headers={"Content-Disposition": f'attachment; filename="invoices-{start}-to-{end}.csv"'})
