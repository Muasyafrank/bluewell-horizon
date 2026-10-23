"""List endpoints return one page at a time, with search and status filters run in the database."""
from datetime import date, timedelta

from core.invoicing import payment_status
from models import Invoice

from .test_bms import make_po, manual_invoice, pay, stocked  # noqa: F401  (stocked is a fixture)


def make_invoices(client, headers, count, **overrides):
    return [client.post("/api/bms/invoices", headers=headers,
                        json=manual_invoice(customerName=f"Client {n}", customerEmail=f"c{n}@example.com", **overrides)).json()
            for n in range(count)]


def test_invoices_come_back_one_page_at_a_time(client, admin_headers):
    make_invoices(client, admin_headers, 30)
    first = client.get("/api/bms/invoices", headers=admin_headers).json()
    assert first["total"] == 30 and first["pages"] == 2 and first["page"] == 1 and first["pageSize"] == 25
    assert len(first["items"]) == 25
    second = client.get("/api/bms/invoices", params={"page": 2}, headers=admin_headers).json()
    assert len(second["items"]) == 5
    assert not {i["id"] for i in first["items"]} & {i["id"] for i in second["items"]}
    small = client.get("/api/bms/invoices", params={"pageSize": 10}, headers=admin_headers).json()
    assert len(small["items"]) == 10 and small["pages"] == 3


def test_page_size_and_number_are_bounded(client, admin_headers):
    for params in ({"pageSize": 0}, {"pageSize": 101}, {"page": 0}):
        assert client.get("/api/bms/invoices", params=params, headers=admin_headers).status_code == 422
    beyond = client.get("/api/bms/invoices", params={"page": 9}, headers=admin_headers).json()
    assert beyond["items"] == [] and beyond["total"] == 0 and beyond["pages"] == 1


def test_invoice_search_matches_name_number_and_email_and_treats_wildcards_literally(client, admin_headers):
    made = make_invoices(client, admin_headers, 3)
    by_name = client.get("/api/bms/invoices", params={"q": "client 1"}, headers=admin_headers).json()
    assert [i["id"] for i in by_name["items"]] == [made[1]["id"]]
    by_number = client.get("/api/bms/invoices", params={"q": made[2]["number"].lower()}, headers=admin_headers).json()
    assert [i["id"] for i in by_number["items"]] == [made[2]["id"]]
    by_email = client.get("/api/bms/invoices", params={"q": "C0@EXAMPLE"}, headers=admin_headers).json()
    assert [i["id"] for i in by_email["items"]] == [made[0]["id"]]
    for wildcard in ("%", "_"):
        assert client.get("/api/bms/invoices", params={"q": wildcard}, headers=admin_headers).json()["total"] == 0


def test_status_filter_agrees_with_the_derived_payment_status(client, db, admin_headers):
    made = make_invoices(client, admin_headers, 5)
    pay(client, admin_headers, made[0]["id"], amount=1160)            # paid
    pay(client, admin_headers, made[1]["id"], amount=500)             # part paid
    # made[2] stays unpaid
    late = db.get(Invoice, made[3]["id"])
    late.due_on = date.today() - timedelta(days=3)                    # overdue
    db.commit()
    client.post(f"/api/bms/invoices/{made[4]['id']}/void", headers=admin_headers)  # void

    for name in ("paid", "partial", "unpaid", "overdue", "void"):
        expected = {i.id for i in db.query(Invoice).all() if payment_status(i) == name}
        got = client.get("/api/bms/invoices", params={"status": name, "pageSize": 100}, headers=admin_headers).json()
        assert {i["id"] for i in got["items"]} == expected and got["total"] == len(expected), name
        assert len(expected) == 1, name
    assert client.get("/api/bms/invoices", params={"status": "bogus"}, headers=admin_headers).status_code == 422


def test_status_filter_and_search_combine_and_keep_the_total_honest(client, admin_headers):
    made = make_invoices(client, admin_headers, 4)
    pay(client, admin_headers, made[0]["id"], amount=1160)
    result = client.get("/api/bms/invoices", params={"status": "unpaid", "q": "client"}, headers=admin_headers).json()
    assert result["total"] == 3 and len(result["items"]) == 3


def test_purchase_orders_are_paged_and_filterable(client, stocked, admin_headers):  # noqa: F811
    for _ in range(3):
        assert make_po(client, admin_headers, stocked).status_code == 201
    page = client.get("/api/bms/purchase-orders", params={"pageSize": 2}, headers=admin_headers).json()
    assert page["total"] == 3 and page["pages"] == 2 and len(page["items"]) == 2
    drafts = client.get("/api/bms/purchase-orders", params={"status": "draft"}, headers=admin_headers).json()
    assert drafts["total"] == 3
    assert client.get("/api/bms/purchase-orders", params={"status": "received"}, headers=admin_headers).json()["total"] == 0


def test_customers_are_paged_and_searchable(client, admin_headers):
    make_invoices(client, admin_headers, 7)
    page = client.get("/api/bms/customers", params={"pageSize": 5}, headers=admin_headers).json()
    assert page["total"] == 7 and page["pages"] == 2 and len(page["items"]) == 5
    found = client.get("/api/bms/customers", params={"q": "CLIENT 3"}, headers=admin_headers).json()
    assert [c["email"] for c in found["items"]] == ["c3@example.com"]
    assert isinstance(found["items"][0]["billed"], float)
