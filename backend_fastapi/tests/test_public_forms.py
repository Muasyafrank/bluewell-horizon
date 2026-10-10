"""Contact and quote forms: validation, and visitor text never reaches an email as HTML."""
import routers.contact as contact_router

CONTACT = {"name": "Eve", "email": "eve@example.com", "phone": "0712345678",
           "service": "Installation", "message": "Hello"}


def test_contact_message_is_saved(client, admin_headers):
    assert client.post("/api/contact", json=CONTACT).status_code == 201
    contacts = client.get("/api/admin/contacts", headers=admin_headers).json()
    assert len(contacts) == 1


def test_blank_and_oversized_fields_are_rejected(client):
    assert client.post("/api/contact", json={**CONTACT, "message": "   "}).status_code == 422
    assert client.post("/api/contact", json={**CONTACT, "message": "x" * 5001}).status_code == 422
    assert client.post("/api/contact", json={**CONTACT, "email": "not-an-email"}).status_code == 422


def test_html_in_a_message_is_escaped_in_the_notification_email(client, monkeypatch):
    sent = []
    monkeypatch.setattr(contact_router, "send_email_safely", lambda **kw: sent.append(kw))
    payload = {**CONTACT, "message": '<a href="http://evil.example">click</a>'}
    assert client.post("/api/contact", json=payload).status_code == 201
    assert len(sent) == 1
    assert "<a href" not in sent[0]["body"]
    assert "&lt;a href" in sent[0]["body"]


def test_quote_requires_a_valid_email(client):
    body = {"name": "A", "email": "nope", "phone": "0712345678", "companyName": "Co",
            "serviceType": "Install", "projectDetails": "Details"}
    assert client.post("/api/quotes", json=body).status_code == 422
