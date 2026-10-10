"""Admin image uploads."""
import os

from routers.admin import MAX_UPLOAD_BYTES, UPLOAD_DIR

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32


def test_png_upload_is_stored_under_a_random_name(client, admin_headers):
    response = client.post("/api/admin/upload", headers=admin_headers,
                           files={"image": ("../../evil name.png", PNG, "image/png")})
    assert response.status_code == 200
    path = response.json()["imagePath"]
    assert path.startswith("/uploads/") and path.endswith(".png")
    assert "evil" not in path and ".." not in path
    stored = os.path.join(UPLOAD_DIR, os.path.basename(path))
    assert os.path.exists(stored)
    os.remove(stored)


def test_html_and_svg_uploads_are_refused(client, admin_headers):
    for name, mime in (("x.html", "text/html"), ("x.svg", "image/svg+xml")):
        response = client.post("/api/admin/upload", headers=admin_headers,
                               files={"image": (name, b"<script>alert(1)</script>", mime)})
        assert response.status_code == 415


def test_oversized_upload_is_refused(client, admin_headers):
    big = b"\x00" * (MAX_UPLOAD_BYTES + 1)
    response = client.post("/api/admin/upload", headers=admin_headers,
                           files={"image": ("big.png", big, "image/png")})
    assert response.status_code == 413


def test_upload_requires_admin(client, customer_headers):
    response = client.post("/api/admin/upload", headers=customer_headers,
                           files={"image": ("a.png", PNG, "image/png")})
    assert response.status_code == 401
