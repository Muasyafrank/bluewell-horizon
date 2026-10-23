import logging
import os

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from sqlalchemy import text

from database import engine
from schema import sync_schema
from routers.admin import UPLOAD_DIR
from routers import (
    auth, products, services, gallery, technologies, process_steps,
    company_info, orders, quotes, admin, contact, quotations,
    bms_people, bms_invoices, bms_stock, bms_reports,
)

logging.basicConfig(
    level=getattr(logging, settings.log_level, logging.INFO),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

IS_PRODUCTION = settings.environment == "production"

app = FastAPI(
    title="Bluewell Horizon API",
    description="Backend API for Bluewell Horizon Limited",
    version="1.0.0",
    # The interactive docs list every route; keep them off the public internet.
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)
sync_schema()

# CORS origins come from configuration rather than being hard-coded, so
# staging and production deployments don't silently inherit a localhost-only
# allow list.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request, call_next):
    """Headers that stop browsers guessing content types, framing the API, or leaking URLs."""
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    if IS_PRODUCTION:
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    if request.url.path.startswith("/api/"):
        # Admin, account and order responses are personal; never let a cache keep them.
        response.headers.setdefault("Cache-Control", "no-store")
    return response

# Serve uploaded images from the same directory the upload endpoint writes to.
# Mounted at /uploads rather than /images so it can never collide with the
# frontend's own bundled /images/ assets. The path is absolute, so it no longer
# depends on which directory the server was started from.
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(services.router)
app.include_router(gallery.router)
app.include_router(technologies.router)
app.include_router(process_steps.router)
app.include_router(company_info.router)
app.include_router(orders.router)
app.include_router(quotes.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(quotations.router)
for _router in (bms_people, bms_invoices, bms_stock, bms_reports):
    app.include_router(_router.router)

@app.get("/")
def read_root():
    """Liveness check: the process is up."""
    return {"message": "Bluewell Horizon API is running"}


@app.get("/health")
def health(response: Response):
    """Readiness check for uptime monitors and load balancers: also proves the database answers."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception:  # noqa: BLE001
        logging.getLogger(__name__).exception("Health check: database unreachable")
        response.status_code = 503
        return {"status": "unavailable"}
    return {"status": "ok"}


if __name__ == "__main__":
    # Development server only. In production run `uvicorn main:app` behind a
    # reverse proxy (see docs/deployment.md); never use reload there.
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=not IS_PRODUCTION)

