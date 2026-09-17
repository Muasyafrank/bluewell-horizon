from database import SessionLocal, engine, Base
from models import Admin, CompanyInfo, Product, Service, ProcessStep
from core.security import get_password_hash

# Ensure tables exist
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("🌱 Starting database seeding...")

# 1. Admin User
if not db.query(Admin).filter(Admin.email == "admin@bluewellhorizon.com").first():
    db.add(Admin(
        email="admin@bluewellhorizon.com",
        password=get_password_hash("Admin123!")
    ))
    print(" Admin user created.")

# 2. Company Information
if not db.query(CompanyInfo).first():
    db.add(CompanyInfo(
        about_us="Bluewell Horizon Limited is a trusted provider of innovative and reliable water treatment technologies. We specialize in designing, supplying, installing, and maintaining high-quality water systems for residential, commercial, institutional, and industrial clients.",
        mission="To design, supply, and maintain reliable, innovative water treatment systems for residential, commercial, and industrial clients — ensuring access to safe, clean water at every level.",
        vision="To become the leading and most trusted provider of water treatment solutions in the region, recognized as a reliable partner in delivering advanced, sustainable, and innovative water systems.",
        email="bluewellsynergy@gmail.com",
        phone1="0721-633-223",
        phone2="0731-836-349",
        address="Harambee Estate, Nairobi, Kenya",
        website="www.bluewellhorizonlimited.com"
    ))
    print(" Company Info seeded.")

# 3. Products
products_data = [
    {"name": "UltraPure Water System (EDI)", "description": "Advanced EDI systems ensure high-purity water through automated monitoring, efficient filtration, and reliable performance. Ideal for laboratories, pharmaceutical industries, and medical facilities.", "price": 350000.00, "category": "UltraPure Water", "image": "/images/gallery-2.png", "stock": 3},
    {"name": "Water Softening System", "description": "Designed to remove hardness minerals, prevent scaling, protect equipment, and improve water efficiency. Features automatic regeneration and durable FRP tanks.", "price": 85000.00, "category": "Water Softening", "image": "/images/gallery-2.png", "stock": 10},
    {"name": "Multimedia Filtration System", "description": "Removes sediment, turbidity, chlorine, and suspended impurities from raw water sources. Ideal for borehole water treatment and industrial pretreatment.", "price": 65000.00, "category": "Filtration", "image": "/images/gallery-2.png", "stock": 15},
    {"name": "Commercial Reverse Osmosis (RO) System", "description": "Comprehensive purification utilizing advanced RO technology to effectively eliminate bacteria, viruses, chemicals, and heavy metals.", "price": 120000.00, "category": "Water Purification", "image": "/images/gallery-2.png", "stock": 8},
    {"name": "UV Sterilization System", "description": "Effective water disinfection using UV technology to eliminate harmful microorganisms and pathogens, ensuring safe and hygienic water.", "price": 35000.00, "category": "Water Disinfection", "image": "/images/gallery-2.png", "stock": 20}
]

for p in products_data:
    if not db.query(Product).filter(Product.name == p["name"]).first():
        db.add(Product(**p))
print(f" {len(products_data)} Products seeded.")

# 4. Services
services_data = [
    {"title": "Water Diagnosis & System Design", "short_desc": "Comprehensive water quality analysis and custom system design.", "description": "We conduct thorough water quality testing and analysis to design customized treatment systems tailored to your specific needs and local water conditions.", "icon": "FaMicroscope", "image": "/images/service-diagnosis.jpg"},
    {"title": "Water Bottling Plant Solutions", "short_desc": "Complete turnkey solutions for commercial water bottling.", "description": "From source to seal, we provide complete bottling plant packages including purification, filling, capping, and labeling machinery with installation and training.", "icon": "FaTint", "image": "/images/service-bottling.jpg"},
    {"title": "Desalination Systems", "short_desc": "Advanced seawater and brackish water treatment.", "description": "High-efficiency reverse osmosis desalination systems designed to convert seawater or brackish water into safe, potable drinking water for coastal communities and industries.", "icon": "FaWater", "image": "/images/service-desalination.jpg"}
]

for s in services_data:
    if not db.query(Service).filter(Service.title == s["title"]).first():
        db.add(Service(**s))
print(f"{len(services_data)} Services seeded.")

# 5. Process Steps
steps_data = [
    {"step_number": 1, "title": "Consultation & Assessment", "description": "We analyze your water quality and understand your specific requirements."},
    {"step_number": 2, "title": "Custom System Design", "description": "Our engineers design a tailored water treatment solution for your needs."},
    {"step_number": 3, "title": "Professional Installation", "description": "Expert installation by our certified technicians with minimal disruption."},
    {"step_number": 4, "title": "Testing & Commissioning", "description": "Rigorous testing to ensure the system meets all quality and safety standards."},
    {"step_number": 5, "title": "Ongoing Maintenance", "description": "Reliable after-sales support, regular servicing, and genuine spare parts."}
]

for step in steps_data:
    if not db.query(ProcessStep).filter(ProcessStep.step_number == step["step_number"]).first():
        db.add(ProcessStep(**step))
print(f" {len(steps_data)} Process Steps seeded.")

db.commit()
db.close()
print(" Database seeding completed successfully!")