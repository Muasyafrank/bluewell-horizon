"""Business management system: roles, invoices, payments, stock, purchasing, reports."""
from datetime import date, timedelta

import pytest

from core.security import get_password_hash
from core.tokens import ROLE_ADMIN, create_access_token
from models import Admin, Invoice, Order, Product, Quotation

from .test_checkout import order_body


def staff_headers(db, role, email=None):
    member = Admin(email=email or f"{role}@example.com", name=role.title(), role=role, is_active=True,
                   password=get_password_hash("correct-horse-battery"))
    db.add(member)
    db.commit()
    return {"Authorization": f"Bearer {create_access_token(member.id, ROLE_ADMIN)}"}


@pytest.fixture
def stocked(db):
    row = Product(name="RO membrane", category="Filters", stock=10, reorder_level=3)
    db.add(row)
    db.commit()
    return row


@pytest.fixture
def order(client, db, stocked):
    client.post("/api/orders/checkout", json=order_body(stocked.id, quantity=4))
    return db.query(Order).one()


def quote(db, order, status="sent"):
    db.add(Quotation(
        order_id=order.id, quote_number=f"QT-{order.order_number}",
        lines=[{"description": "RO membrane", "quantity": 4, "unitPrice": 1000}],
        payment_methods=[], subtotal=4000, delivery_fee=0, include_vat=True, vat_amount=640,
        total_amount=4640, valid_until=date.today() + timedelta(days=7), status=status,
    ))
    db.commit()


def manual_invoice(**overrides):
    data = {
        "customerName": "Acme Ltd", "customerEmail": "buyer@acme.co.ke",
        "lines": [{"description": "Service call", "quantity": 1, "unitPrice": 1000}],
        "deliveryFee": 0, "includeVat": True,
    }
    data.update(overrides)
    return data


# ------------------------------------------------------------------ roles

def test_roles_see_only_their_modules(client, db):
    sales, stores = staff_headers(db, "sales"), staff_headers(db, "stores")
    assert client.get("/api/bms/invoices", headers=sales).status_code == 200
    assert client.get("/api/bms/stock", headers=sales).status_code == 403
    assert client.get("/api/bms/stock", headers=stores).status_code == 200
    assert client.get("/api/bms/invoices", headers=stores).status_code == 403
    assert client.get("/api/bms/staff", headers=sales).status_code == 403


def test_me_lists_the_modules_of_the_role(client, db):
    data = client.get("/api/bms/me", headers=staff_headers(db, "accounts")).json()
    assert data["role"] == "accounts"
    assert "payments" in data["modules"] and "stock" not in data["modules"]


def test_older_admins_without_a_role_are_administrators(client, admin_headers):
    assert client.get("/api/bms/me", headers=admin_headers).json()["role"] == "admin"
    assert client.get("/api/bms/staff", headers=admin_headers).status_code == 200


def test_non_admin_staff_cannot_use_the_website_admin_api(client, db):
    headers = staff_headers(db, "sales")
    assert client.get("/api/admin/products", headers=headers).status_code == 403
    assert client.get("/api/admin/payment-methods", headers=headers).status_code == 403


def test_customers_cannot_use_the_business_system(client, customer_headers):
    assert client.get("/api/bms/me", headers=customer_headers).status_code == 401
    assert client.get("/api/bms/invoices").status_code in (401, 403)


def test_deactivated_staff_are_locked_out(client, db, admin_headers):
    created = client.post("/api/bms/staff", headers=admin_headers, json={
        "name": "Wanjiru", "email": "w@example.com", "role": "sales", "password": "a-long-enough-password"}).json()
    login = client.post("/api/admin/login", json={"email": "w@example.com", "password": "a-long-enough-password"})
    assert login.status_code == 200
    token = {"Authorization": f"Bearer {login.json()['token']}"}
    assert login.json()["admin"]["role"] == "sales"

    client.patch(f"/api/bms/staff/{created['id']}", headers=admin_headers, json={"isActive": False})
    assert client.get("/api/bms/me", headers=token).status_code == 401
    assert client.post("/api/admin/login", json={"email": "w@example.com",
                                                 "password": "a-long-enough-password"}).status_code == 403


def test_the_last_administrator_cannot_be_removed(client, admin, admin_headers):
    assert client.patch(f"/api/bms/staff/{admin.id}", headers=admin_headers, json={"role": "sales"}).status_code == 409
    assert client.patch(f"/api/bms/staff/{admin.id}", headers=admin_headers, json={"isActive": False}).status_code == 409


def test_staff_passwords_must_be_long(client, admin_headers):
    response = client.post("/api/bms/staff", headers=admin_headers, json={
        "name": "X", "email": "x@example.com", "role": "sales", "password": "short"})
    assert response.status_code == 422


# --------------------------------------------------------------- invoices

def test_invoice_totals_are_computed_by_the_server(client, admin_headers):
    data = client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice()).json()
    assert data["total"] == 1160.0 and data["balance"] == 1160.0
    assert data["number"].startswith("INV-") and data["paymentStatus"] == "unpaid"


def test_invoice_from_order_needs_a_sent_quotation(client, db, order, admin_headers):
    url = f"/api/bms/invoices/from-order/{order.id}"
    assert client.post(url, headers=admin_headers).status_code == 409
    quote(db, order, status="draft")
    assert client.post(url, headers=admin_headers).status_code == 409


def test_invoice_from_order_confirms_the_order_and_leaves_stock_alone(client, db, order, stocked, admin_headers):
    quote(db, order)
    response = client.post(f"/api/bms/invoices/from-order/{order.id}", headers=admin_headers)
    assert response.status_code == 201
    assert response.json()["total"] == 4640.0 and response.json()["orderId"] == order.id
    db.refresh(stocked)
    db.refresh(order)
    assert stocked.stock == 6  # already set aside when the order was placed
    assert order.order_status == "confirmed"
    assert client.post(f"/api/bms/invoices/from-order/{order.id}", headers=admin_headers).status_code == 409


def test_ready_list_has_only_quoted_uninvoiced_orders(client, db, order, admin_headers):
    assert client.get("/api/bms/invoices/ready", headers=admin_headers).json() == []
    quote(db, order)
    ready = client.get("/api/bms/invoices/ready", headers=admin_headers).json()
    assert [r["orderId"] for r in ready] == [order.id]
    client.post(f"/api/bms/invoices/from-order/{order.id}", headers=admin_headers)
    assert client.get("/api/bms/invoices/ready", headers=admin_headers).json() == []


def test_voiding_an_invoice_allows_invoicing_the_order_again(client, db, order, admin_headers):
    quote(db, order)
    invoice = client.post(f"/api/bms/invoices/from-order/{order.id}", headers=admin_headers).json()
    voided = client.post(f"/api/bms/invoices/{invoice['id']}/void", headers=admin_headers).json()
    assert voided["paymentStatus"] == "void"
    assert client.post(f"/api/bms/invoices/{invoice['id']}/void", headers=admin_headers).status_code == 409
    assert client.post(f"/api/bms/invoices/from-order/{order.id}", headers=admin_headers).status_code == 201


# ------------------------------------------------- order stock and cancelling

def set_status(client, headers, order, status):
    return client.put(f"/api/admin/orders/{order.id}/status", headers=headers, json={"status": status})


def test_placing_an_order_is_logged_in_the_stock_history(client, order, stocked, admin_headers):
    log = client.get(f"/api/bms/stock/{stocked.id}/movements", headers=admin_headers).json()
    assert log[0]["change"] == -4 and log[0]["balanceAfter"] == 6 and log[0]["reference"] == order.order_number


def test_cancelling_an_order_returns_its_stock_and_reopening_takes_it_again(client, db, order, stocked, admin_headers):
    assert set_status(client, admin_headers, order, "cancelled").status_code == 200
    db.refresh(stocked)
    assert stocked.stock == 10
    assert set_status(client, admin_headers, order, "processing").status_code == 200
    db.refresh(stocked)
    assert stocked.stock == 6


def test_cancelling_returns_only_what_the_order_actually_took(client, db, order, stocked, admin_headers):
    # Stock ran short when the order was placed: only 1 of the 4 units existed.
    from models import StockMovement
    stocked.stock = 1
    for m in db.query(StockMovement).filter(StockMovement.reference == order.order_number).all():
        m.change = -1
    db.commit()
    assert set_status(client, admin_headers, order, "cancelled").status_code == 200
    db.refresh(stocked)
    assert stocked.stock == 2


def test_an_order_with_a_live_invoice_cannot_be_cancelled(client, db, order, stocked, admin_headers):
    quote(db, order)
    invoice = client.post(f"/api/bms/invoices/from-order/{order.id}", headers=admin_headers).json()
    assert set_status(client, admin_headers, order, "cancelled").status_code == 409
    client.post(f"/api/bms/invoices/{invoice['id']}/void", headers=admin_headers)
    assert set_status(client, admin_headers, order, "cancelled").status_code == 200


# --------------------------------------------------------------- payments

def pay(client, headers, invoice_id, **overrides):
    data = {"amount": 500, "method": "mpesa", "reference": "QWE123"}
    data.update(overrides)
    return client.post(f"/api/bms/invoices/{invoice_id}/payments", headers=headers, json=data)


def test_partial_then_full_payment(client, admin_headers):
    invoice = client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice()).json()
    first = pay(client, admin_headers, invoice["id"]).json()
    assert first["paymentStatus"] == "partial" and first["balance"] == 660.0
    last = pay(client, admin_headers, invoice["id"], amount=660, reference="BNK9").json()
    assert last["paymentStatus"] == "paid" and last["balance"] == 0


def test_cannot_overpay_or_pay_without_a_reference(client, admin_headers):
    invoice = client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice()).json()
    assert pay(client, admin_headers, invoice["id"], amount=2000).status_code == 422
    assert pay(client, admin_headers, invoice["id"], reference=None).status_code == 422
    assert pay(client, admin_headers, invoice["id"], method="cash", reference=None).status_code == 201


def test_sales_can_invoice_but_not_record_payments(client, db, admin_headers):
    sales = staff_headers(db, "sales")
    invoice = client.post("/api/bms/invoices", headers=sales, json=manual_invoice()).json()
    assert pay(client, sales, invoice["id"]).status_code == 403
    assert pay(client, staff_headers(db, "accounts"), invoice["id"]).status_code == 201


def test_removing_a_payment_restores_the_balance(client, admin_headers):
    invoice = client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice()).json()
    paid = pay(client, admin_headers, invoice["id"]).json()
    payment_id = paid["payments"][0]["id"]
    again = client.delete(f"/api/bms/invoices/{invoice['id']}/payments/{payment_id}", headers=admin_headers).json()
    assert again["balance"] == 1160.0 and again["payments"] == []


def test_a_paid_invoice_with_payments_cannot_be_voided(client, admin_headers):
    invoice = client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice()).json()
    pay(client, admin_headers, invoice["id"])
    assert client.post(f"/api/bms/invoices/{invoice['id']}/void", headers=admin_headers).status_code == 409


def test_overdue_status(client, db, admin_headers):
    invoice = client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice()).json()
    row = db.get(Invoice, invoice["id"])
    row.due_on = date.today() - timedelta(days=5)
    db.commit()
    assert client.get(f"/api/bms/invoices/{invoice['id']}", headers=admin_headers).json()["paymentStatus"] == "overdue"


# ------------------------------------------------------------------ stock

def test_stock_adjustments_are_logged_and_never_go_negative(client, stocked, admin_headers):
    url = f"/api/bms/stock/{stocked.id}/adjust"
    assert client.post(url, headers=admin_headers, json={"change": -20, "reason": "damage"}).status_code == 409
    assert client.post(url, headers=admin_headers, json={"change": 5, "reason": "damage"}).status_code == 422
    assert client.post(url, headers=admin_headers, json={"change": 3, "reason": "adjustment"}).status_code == 422
    ok = client.post(url, headers=admin_headers, json={"change": -8, "reason": "damage", "note": "Dropped"}).json()
    assert ok["stock"] == 2 and ok["state"] == "low"
    log = client.get(f"/api/bms/stock/{stocked.id}/movements", headers=admin_headers).json()
    assert log[0]["change"] == -8 and log[0]["balanceAfter"] == 2 and log[0]["by"]


def test_stock_screen_has_no_prices(client, stocked, admin_headers):
    assert "price" not in client.get("/api/bms/stock", headers=admin_headers).json()[0]


# ------------------------------------------------------- suppliers and POs

def make_po(client, headers, product):
    supplier = client.post("/api/bms/suppliers", headers=headers, json={"name": "AquaParts Ltd"}).json()
    return client.post("/api/bms/purchase-orders", headers=headers, json={
        "supplierId": supplier["id"], "lines": [{"productId": product.id, "quantity": 5, "unitCost": 800}]})


def test_purchase_order_lifecycle_adds_stock_on_receipt(client, db, stocked, admin_headers):
    po = make_po(client, admin_headers, stocked).json()
    assert po["status"] == "draft" and po["totalCost"] == 4000.0 and po["number"].startswith("PO-")
    assert client.post(f"/api/bms/purchase-orders/{po['id']}/receive", headers=admin_headers).status_code == 409
    client.post(f"/api/bms/purchase-orders/{po['id']}/place", headers=admin_headers)
    received = client.post(f"/api/bms/purchase-orders/{po['id']}/receive", headers=admin_headers).json()
    assert received["status"] == "received"
    db.refresh(stocked)
    assert stocked.stock == 15
    assert client.post(f"/api/bms/purchase-orders/{po['id']}/receive", headers=admin_headers).status_code == 409
    assert client.post(f"/api/bms/purchase-orders/{po['id']}/cancel", headers=admin_headers).status_code == 409


def test_only_drafts_are_editable_and_suppliers_must_be_active(client, stocked, admin_headers):
    po = make_po(client, admin_headers, stocked).json()
    client.post(f"/api/bms/purchase-orders/{po['id']}/place", headers=admin_headers)
    edit = {"supplierId": po["supplierId"], "lines": [{"productId": stocked.id, "quantity": 1, "unitCost": 1}]}
    assert client.put(f"/api/bms/purchase-orders/{po['id']}", headers=admin_headers, json=edit).status_code == 409
    supplier = client.put(f"/api/bms/suppliers/{po['supplierId']}", headers=admin_headers,
                          json={"name": "AquaParts Ltd", "isActive": False}).json()
    assert supplier["isActive"] is False
    assert client.post("/api/bms/purchase-orders", headers=admin_headers, json=edit).status_code == 422


def test_stores_staff_can_purchase_but_not_invoice(client, db, stocked):
    stores = staff_headers(db, "stores")
    assert make_po(client, stores, stocked).status_code == 201
    assert client.post("/api/bms/invoices", headers=stores, json=manual_invoice()).status_code == 403


# ------------------------------------------------------ customers, reports

def test_customer_directory_combines_orders_and_invoices(client, db, order, admin_headers):
    client.post("/api/bms/invoices", headers=admin_headers,
                json=manual_invoice(customerEmail=order.customer_email))
    rows = client.get("/api/bms/customers", headers=admin_headers).json()["items"]
    mine = next(r for r in rows if r["email"] == order.customer_email.lower())
    assert mine["orders"] == 1 and mine["invoices"] == 1 and mine["outstanding"] == 1160.0

    detail = client.get("/api/bms/customers/detail", params={"email": order.customer_email}, headers=admin_headers)
    assert detail.status_code == 200 and detail.json()["orders"][0]["orderNumber"] == order.order_number
    client.post("/api/bms/customers/notes", params={"email": order.customer_email}, headers=admin_headers,
                json={"body": "Prefers calls after 4pm"})
    notes = client.get("/api/bms/customers/detail", params={"email": order.customer_email},
                       headers=admin_headers).json()["notes"]
    assert notes[0]["body"] == "Prefers calls after 4pm"


def test_reports_add_up(client, db, admin_headers):
    one = client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice()).json()
    client.post("/api/bms/invoices", headers=admin_headers,
                json=manual_invoice(customerName="Beta", customerEmail="b@beta.co.ke",
                                    lines=[{"description": "Filter", "quantity": 2, "unitPrice": 500}]))
    pay(client, admin_headers, one["id"])
    data = client.get("/api/bms/reports/summary", headers=admin_headers).json()
    assert data["invoiced"] == 2320.0 and data["vat"] == 320.0 and data["invoiceCount"] == 2
    assert data["collected"] == 500.0 and data["outstanding"] == 1820.0
    assert data["ageing"]["notDue"] == 1820.0
    assert data["paymentMethods"] == [{"method": "mpesa", "amount": 500.0}]
    assert data["months"][-1]["invoiced"] == 2320.0


def test_reports_are_for_accounts_and_admins(client, db):
    assert client.get("/api/bms/reports/summary", headers=staff_headers(db, "sales")).status_code == 403
    assert client.get("/api/bms/reports/summary", headers=staff_headers(db, "accounts")).status_code == 200


def test_report_range_is_validated(client, admin_headers):
    response = client.get("/api/bms/reports/summary", params={"start": "2026-02-01", "end": "2026-01-01"},
                          headers=admin_headers)
    assert response.status_code == 422


def test_csv_export_neutralises_formulas(client, admin_headers):
    client.post("/api/bms/invoices", headers=admin_headers, json=manual_invoice(customerName="=HYPERLINK(1)"))
    response = client.get("/api/bms/reports/invoices.csv", headers=admin_headers)
    assert response.status_code == 200 and "text/csv" in response.headers["content-type"]
    assert "'=HYPERLINK(1)" in response.text and ",=HYPERLINK" not in response.text


def test_dashboard_only_includes_what_the_role_may_see(client, db, stocked, order):
    stores = client.get("/api/bms/dashboard", headers=staff_headers(db, "stores")).json()
    assert set(stores) == {"stock", "openPurchaseOrders"}
    sales = client.get("/api/bms/dashboard", headers=staff_headers(db, "sales")).json()
    assert set(sales) == {"awaitingQuotation", "awaitingInvoice"} and sales["awaitingQuotation"] == 1
    accounts = client.get("/api/bms/dashboard", headers=staff_headers(db, "accounts")).json()
    assert "money" in accounts and "stock" not in accounts
