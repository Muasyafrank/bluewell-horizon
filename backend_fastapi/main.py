from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# from flask_cors import CORS
from database import Base,engine
from models import*
from routers import auth,products,services,gallery,technologies,process_steps,company_info,orders,quotes,admin



app = FastAPI(
    title="Bluewell Horizon API",
    description="Backend API for Bluewell Horizon Limited",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)
# CORS Configuration (Allow your React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://127.0.0.1:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (for uploaded images)
os.makedirs("static/uploads", exist_ok=True)
app.mount("/images", StaticFiles(directory="static/uploads"), name="images")

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(services.router)
app.include_router(gallery.router)
app.include_router(technologies.router)
app.include_router(process_steps.router)
app.include_router(company_info.router)
app.include_router(orders.router)
app.include_router(quotes.router)
app.include_router(admin.router)

# Health check route
@app.get("/")
def read_root():
    return {"message": "Bluewell Horizon FastAPI Backend is Running! 🚀"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)