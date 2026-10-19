"""Admin quotations: price an order, email it with payment details."""
from datetime import date, timedelta

import pytest

from config import settings
from models import Order, Quotation
from routers import quotations as quotations_router

from .test_checkout import order_body


@pytest.fixture
def order(client, db, product):
    client.post("/api/orders/checkout", json=order_body(product.id, quantity=2))
    return db.query(Order).one()


@pytest.fixture
def payments(monkeypatch):
    monkeypatch.setattr(settings, "mpesa_paybill_number", "123456")
    monkeypatch.setattr(settings, "bank_name", "Example Bank")
    monkeypatch.setattr(settings, "bank_account_number", "0011223344")
    monkeypatch.setattr(settings, "cash_on_delivery_enabled", True)


@pytest.fixture
def mail(monkeypatch):
    """Pretends email is configured and records what would be sent."""
    sent = []
    monkeypatch.setattr(settings, "email_user", "shop@example.com")
    monkeypatch.setattr(settings, "email_pass", "secret")
    monkeypatch.setattr(quotations_router, "send_email", lambda **kwargs: sent.append(kwargs))
    return sent


def body(**overrides):
    data = {
        "lines": [{"description": "RO plant", "quantity": 2, "unitPrice": 100000}],
        "deliveryFee": 5000,
        "includeVat": True,
        "validUntil": (date.today() + timedelta(days=14)).isoformat(),
        "paymentMethods": ["mpesa_paybill", "bank_transfer"],
        "notes": "Delivery within 5 working days.",
    }
    data.update(overrides)
    return data


def url(order, suffix=""):
    return f"/api/admin/orders/{order.id}/quotation{suffix}"


def test_only_admins_can_use_quotations(client, order, customer_headers):
    assert client.get(url(order)).status_code in (401, 403)
    assert client.post(url(order, "/send"), json=body(), headers=customer_headers).status_code == 401


def test_form_starts_from_the_ordered_items(client, order, admin_headers, payments):
    data = client.get(url(order), headers=admin_headers).json()
    assert data["quotation"] is None
    assert data["suggestedLines"][0]["description"] == "Filter"
    assert data["suggestedLines"][0]["quantity"] == 2
    assert {m["key"] for m in data["paymentMethods"]} == {"mpesa_paybill", "bank_transfer", "cash_on_delivery"}


def test_methods_without_details_are_not_offered(client, admin_headers, monkeypatch):
    monkeypatch.setattr(settings, "mpesa_paybill_number", None)
    monkeypatch.setattr(settings, "mpesa_till_number", None)
    monkeypatch.setattr(settings, "bank_name", None)
    keys = [m["key"] for m in client.get("/api/admin/payment-methods", headers=admin_headers).json()["paymentMethods"]]
    assert keys == ["cash_on_delivery"]


def test_totals_are_computed_by_the_server(client, order, admin_headers, payments):
    saved = client.put(url(order), json=body(), headers=admin_headers).json()["quotation"]
    assert saved["subtotal"] == 200000
    assert saved["vatAmount"] == 32800  # 16% of 200,000 + 5,000
    assert saved["totalAmount"] == 237800
    assert saved["status"] == "draft"


def test_vat_can_be_left_out(client, order, admin_headers, payments):
    saved = client.put(url(order), json=body(includeVat=False), headers=admin_headers).json()["quotation"]
    assert saved["vatAmount"] == 0
    assert saved["totalAmount"] == 205000


def test_unknown_payment_method_is_rejected(client, order, admin_headers, payments):
    response = client.put(url(order), json=body(paymentMethods=["bitcoin"]), headers=admin_headers)
    assert response.status_code == 422


def test_a_quotation_needs_priced_lines_and_a_payment_method(client, order, admin_headers, payments):
    assert client.put(url(order), json=body(lines=[]), headers=admin_headers).status_code == 422
    assert client.put(url(order), json=body(paymentMethods=[]), headers=admin_headers).status_code == 422
    bad = [{"description": "RO plant", "quantity": 1, "unitPrice": 0}]
    assert client.put(url(order), json=body(lines=bad), headers=admin_headers).status_code == 422


def test_past_valid_until_date_is_rejected(client, order, admin_headers, payments):
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    assert client.put(url(order), json=body(validUntil=yesterday), headers=admin_headers).status_code == 422


def test_preview_returns_the_email_and_saves_nothing(client, db, order, admin_headers, payments):
    data = client.post(url(order, "/preview"), json=body(), headers=admin_headers).json()
    assert order.order_number in data["subject"]
    assert "M-Pesa Paybill" in data["html"] and "123456" in data["html"]
    assert "0011223344" in data["html"]
    assert db.query(Quotation).count() == 0


def test_sending_emails_the_customer_and_updates_the_order(client, db, order, admin_headers, payments, mail):
    response = client.post(url(order, "/send"), json=body(), headers=admin_headers)
    assert response.status_code == 200

    [message] = mail
    assert message["to"] == "jane@example.com"
    assert message["cc"] == "shop@example.com"
    assert "237,800.00" in message["body"]
    assert "Delivery within 5 working days." in message["body"]
    assert order.order_number in message["body"]  # the payment reference

    db.expire_all()
    quotation = db.query(Quotation).one()
    assert quotation.status == "sent" and quotation.sent_at is not None
    refreshed = db.get(Order, order.id)
    assert refreshed.order_status == "quoted"
    assert float(refreshed.total_amount) == 237800


def test_sending_does_not_move_an_order_that_is_already_further_along(client, db, order, admin_headers, payments, mail):
    order.order_status = "shipped"
    db.commit()
    client.post(url(order, "/send"), json=body(), headers=admin_headers)
    db.expire_all()
    assert db.get(Order, order.id).order_status == "shipped"


def test_resending_updates_the_same_quotation(client, db, order, admin_headers, payments, mail):
    client.post(url(order, "/send"), json=body(), headers=admin_headers)
    client.post(url(order, "/send"), json=body(deliveryFee=0), headers=admin_headers)
    assert db.query(Quotation).count() == 1
    assert len(mail) == 2


def test_nothing_is_sent_when_email_is_not_configured(client, db, order, admin_headers, payments, monkeypatch):
    monkeypatch.setattr(settings, "email_user", None)
    response = client.post(url(order, "/send"), json=body(), headers=admin_headers)
    assert response.status_code == 503
    assert db.query(Quotation).count() == 0


def test_a_mail_failure_keeps_the_draft_and_the_order_status(client, db, order, admin_headers, payments, mail, monkeypatch):
    def fail(**kwargs):
        raise OSError("smtp down")

    monkeypatch.setattr(quotations_router, "send_email", fail)
    response = client.post(url(order, "/send"), json=body(), headers=admin_headers)
    assert response.status_code == 502

    db.expire_all()
    assert db.query(Quotation).one().status == "draft"
    assert db.get(Order, order.id).order_status == "processing"


def test_customer_text_is_escaped_in_the_email(client, order, admin_headers, payments):
    lines = [{"description": "<script>alert(1)</script>", "quantity": 1, "unitPrice": 1000}]
    html = client.post(url(order, "/preview"), json=body(lines=lines), headers=admin_headers).json()["html"]
    assert "<script>" not in html


def test_deleting_an_order_removes_its_quotation(client, db, order, admin_headers, payments):
    client.put(url(order), json=body(), headers=admin_headers)
    assert client.delete(f"/api/admin/orders/{order.id}", headers=admin_headers).status_code == 200
    assert db.query(Quotation).count() == 0
