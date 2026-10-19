"""Who can reach which endpoints."""


def test_admin_endpoints_require_a_token(client):
    assert client.get("/api/admin/stats").status_code in (401, 403)


def test_admin_token_can_read_stats(client, admin_headers):
    response = client.get("/api/admin/stats", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["totalOrders"] == 0


def test_customer_token_cannot_use_admin_endpoints(client, customer_headers):
    # Regression: customer #1 used to be accepted as admin #1.
    assert client.get("/api/admin/stats", headers=customer_headers).status_code == 401
    assert client.get("/api/admin/orders", headers=customer_headers).status_code == 401


def test_admin_token_cannot_read_customer_orders(client, admin_headers, customer):
    assert client.get("/api/customers/orders", headers=admin_headers).status_code == 401


def test_customer_token_can_read_own_orders(client, customer_headers):
    response = client.get("/api/customers/orders", headers=customer_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_stats_report_popular_products_by_units_ordered(client, admin_headers, product):
    body = {
        "customerName": "Jane", "customerEmail": "jane@example.com", "customerPhone": "0712345678",
        "county": "Nairobi", "estate": "E", "streetAddress": "S", "paymentMethod": "cash",
        "items": [{"id": product.id, "quantity": 4, "price": 0}], "subtotal": 0, "totalAmount": 0,
    }
    assert client.post("/api/orders/checkout", json=body).status_code == 201
    stats = client.get("/api/admin/stats", headers=admin_headers).json()
    assert stats["popularProducts"] == [{"name": "Filter", "quantity": 4}]
    assert stats["totalOrders"] == 1


def test_product_without_a_price_can_be_edited_and_restocked(client, admin_headers, product):
    # Catalogue products have no price; editing one used to fail with a 422.
    body = {"name": "Filter", "category": "Filters", "description": None, "price": None, "stock": 25}
    assert client.put(f"/api/admin/products/{product.id}", json=body, headers=admin_headers).status_code == 200
    assert client.get(f"/api/products/{product.id}").json()["stock"] == 25
    assert client.put(f"/api/admin/products/{product.id}", json={**body, "stock": -1},
                      headers=admin_headers).status_code == 422


def test_public_product_list_works_for_products_without_a_price(client, product):
    # Regression: a NULL price used to fail response validation and return a 500,
    # which took down the shop and the whole admin dashboard.
    response = client.get("/api/products")
    assert response.status_code == 200
    assert "price" not in response.json()[0]
    assert client.get(f"/api/products/{product.id}").status_code == 200
