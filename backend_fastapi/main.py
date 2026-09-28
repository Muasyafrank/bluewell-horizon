from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from config import settings
from database import Base, engine
from models import *  # noqa: F401,F403 — registers every model with Base before create_all
from routers import (
    auth, products, services, gallery, technologies, process_steps,
    company_info, orders, quotes, admin, contact,
)

app = FastAPI(
    title="Bluewell Horizon API",
    description="Backend API for Bluewell Horizon Limited",
    version="1.0.0",
)
Base.metadata.create_all(bind=engine)

# CORS origins come from configuration rather than being hard-coded, so
# staging and production deployments don't silently inherit a localhost-only
# allow list.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images. Mounted at /uploads rather than /images so it can
# never collide with the frontend's own bundled /images/ assets — see the
# note in routers/admin.py's upload handler for why that collision mattered.
os.makedirs("static/uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="static/uploads"), name="uploads")

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

# Health check route
@app.get("/")
def read_root():
    return {"message": "Bluewell Horizon FastAPI Backend is Running! 🚀"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)