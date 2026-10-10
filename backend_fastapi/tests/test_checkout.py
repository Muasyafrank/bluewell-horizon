"""Checkout validation and stock handling."""
from models import Product


def order_body(product_id, quantity=1, **overrides):
    body = {
        "customerName": "Jane Doe", "customerEmail": "jane@example.com",
        "customerPhone": "0712345678", "county": "Nairobi", "estate": "Harambee",
        "streetAddress": "1 Water Rd", "paymentMethod": "cash",
        "items": [{"id": product_id, "quantity": quantity, "price": 0}],
        "subtotal": 0, "totalAmount": 0,
    }
    body.update(overrides)
    return body


def test_checkout_creates_order_and_reduces_stock(client, db, product):
    response = client.post("/api/orders/checkout", json=order_body(product.id, quantity=3))
    assert response.status_code == 201
    assert response.json()["orderNumber"].startswith("BW-")
    db.expire_all()
    assert db.get(Product, product.id).stock == 7


def test_negative_quantity_is_rejected_and_cannot_inflate_stock(client, db, product):
    response = client.post("/api/orders/checkout", json=order_body(product.id, quantity=-50))
    assert response.status_code == 422
    db.expire_all()
    assert db.get(Product, product.id).stock == 10


def test_empty_cart_is_rejected(client, product):
    assert client.post("/api/orders/checkout", json=order_body(product.id, items=[])).status_code == 422


def test_unknown_product_is_a_clean_400(client):
    response = client.post("/api/orders/checkout", json=order_body(9999))
    assert response.status_code == 400
    assert "no longer available" in response.json()["detail"]


def test_same_product_on_two_lines_reduces_stock_by_the_total(client, db, product):
    items = [{"id": product.id, "quantity": 2, "price": 0}, {"id": product.id, "quantity": 3, "price": 0}]
    assert client.post("/api/orders/checkout", json=order_body(product.id, items=items)).status_code == 201
    db.expire_all()
    assert db.get(Product, product.id).stock == 5


def test_signed_in_customer_order_is_linked_to_account(client, customer_headers):
    # Uses the customer's own order list as the observable.
    from database import SessionLocal
    from models import Product as P
    db = SessionLocal()
    p = P(name="X", category="Y", stock=5)
    db.add(p); db.commit(); pid = p.id; db.close()
    assert client.post("/api/orders/checkout", json=order_body(pid), headers=customer_headers).status_code == 201
    orders = client.get("/api/customers/orders", headers=customer_headers).json()
    assert len(orders) == 1
