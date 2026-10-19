"""Gallery projects: optional location, year and description."""


def test_admin_can_add_a_project_with_details(client, admin_headers):
    response = client.post(
        "/api/admin/gallery",
        headers=admin_headers,
        json={
            "title": "RO plant",
            "category": "Industrial",
            "image": "/images/gallery-3.png",
            "location": "Nairobi",
            "year": 2025,
            "description": "Skid-mounted RO system.",
        },
    )
    assert response.status_code == 200

    [project] = client.get("/api/gallery").json()
    assert project["location"] == "Nairobi"
    assert project["year"] == 2025
    assert project["description"] == "Skid-mounted RO system."


def test_details_are_optional(client, admin_headers):
    client.post(
        "/api/admin/gallery",
        headers=admin_headers,
        json={"title": "RO plant", "category": "Industrial", "image": "/images/gallery-3.png"},
    )
    [project] = client.get("/api/gallery").json()
    assert project["location"] is None
    assert project["year"] is None
    assert project["description"] is None


def test_details_can_be_updated_and_cleared(client, admin_headers):
    created = client.post(
        "/api/admin/gallery",
        headers=admin_headers,
        json={"title": "RO plant", "category": "Industrial", "image": "/i.png", "location": "Nairobi", "year": 2024},
    ).json()

    client.put(
        f"/api/admin/gallery/{created['id']}",
        headers=admin_headers,
        json={"title": "RO plant", "category": "Industrial", "image": "/i.png", "location": "", "year": 2025},
    )
    [project] = client.get("/api/gallery").json()
    assert project["location"] is None
    assert project["year"] == 2025
