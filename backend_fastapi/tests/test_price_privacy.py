"""Prices belong to the admin: they are not public, and the browser cannot set them."""
from models import Order, OrderItem, Product

from .test_checkout import order_body


def priced_product(db, price=1000):
    row = Product(name="RO plant", category="RO", stock=10, price=price)
    db.add(row)
    db.commit()
    return row


def test_public_catalogue_does_not_expose_prices(client, db):
    row = priced_product(db)
    assert "price" not in client.get("/api/products").json()[0]
    assert "price" not in client.get(f"/api/products/{row.id}").json()


def test_admin_catalogue_includes_prices(client, db, admin_headers):
    priced_product(db, price=2500)
    [product] = client.get("/api/admin/products", headers=admin_headers).json()
    assert product["price"] == 2500


def test_admin_catalogue_needs_an_admin(client, db, customer_headers):
    priced_product(db)
    assert client.get("/api/admin/products").status_code in (401, 403)
    assert client.get("/api/admin/products", headers=customer_headers).status_code == 401


def test_checkout_uses_the_admins_price_not_the_browsers(client, db):
    row = priced_product(db, price=1000)
    body = order_body(row.id, quantity=3)
    body["items"][0]["price"] = 1  # a tampered price
    body["subtotal"] = 1
    body["totalAmount"] = 1
    body["vatAmount"] = 99999
    assert client.post("/api/orders/checkout", json=body).status_code == 201

    db.expire_all()
    item = db.query(OrderItem).one()
    order = db.query(Order).one()
    assert float(item.price) == 1000
    assert float(order.subtotal) == 3000
    assert float(order.total_amount) == 3000
    assert float(order.vat_amount) == 0


def test_checkout_works_without_any_prices_in_the_request(client, db):
    row = priced_product(db)
    body = order_body(row.id)
    body["items"] = [{"id": row.id, "quantity": 1}]
    del body["subtotal"], body["totalAmount"]
    assert client.post("/api/orders/checkout", json=body).status_code == 201


def test_customers_do_not_see_prices_on_their_orders(client, db, customer_headers):
    row = priced_product(db)
    client.post("/api/orders/checkout", json=order_body(row.id), headers=customer_headers)

    [order] = client.get("/api/customers/orders", headers=customer_headers).json()
    for hidden in ("subtotal", "deliveryFee", "vatAmount", "totalAmount"):
        assert hidden not in order
    assert "price" not in order["items"][0]


def test_quotation_form_starts_from_the_admins_price(client, db, admin_headers):
    row = priced_product(db, price=1500)
    client.post("/api/orders/checkout", json=order_body(row.id, quantity=2))
    order = db.query(Order).one()
    [line] = client.get(f"/api/admin/orders/{order.id}/quotation", headers=admin_headers).json()["suggestedLines"]
    assert line["unitPrice"] == 1500
    assert line["quantity"] == 2
