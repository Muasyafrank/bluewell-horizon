from database import SessionLocal, engine, Base
from models import Admin
from core.security import get_password_hash

# Ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if admin exists
admin = db.query(Admin).filter(Admin.email == "admin@bluewellhorizon.com").first()

if not admin:
    new_admin = Admin(
        email="admin@bluewellhorizon.com",
        password=get_password_hash("Admin123!")
    )
    db.add(new_admin)
    db.commit()
    print(" Admin user created successfully!")
    print("   Email: admin@bluewellhorizon.com")
    print("   Password: Admin123!")
else:
    print("ℹAdmin user already exists.")

db.close()