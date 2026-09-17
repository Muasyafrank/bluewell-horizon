from database import SessionLocal, engine, Base
from models import Technology

# Ensure tables exist
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("🌱 Seeding technologies...")

technologies_data = [
    {
        "name": "Reverse Osmosis (RO)",
        "description": "Advanced membrane filtration technology that removes up to 99% of dissolved salts, particles, colloids, organics, bacteria, and pyrogens from water.",
        "icon": "FaTint",
        "image": "/images/tech-ro.jpg"
    },
    {
        "name": "Ultrafiltration (UF)",
        "description": "Membrane filtration process that uses hydraulic pressure to force water against a semi-permeable membrane, removing pathogens and large molecules.",
        "icon": "FaFilter",
        "image": "/images/tech-uf.jpg"
    },
    {
        "name": "UV Sterilization",
        "description": "Chemical-free disinfection using ultraviolet light to destroy 99.99% of bacteria, viruses, and other microorganisms without adding chemicals.",
        "icon": "FaSun",
        "image": "/images/tech-uv.jpg"
    },
    {
        "name": "Electrodeionization (EDI)",
        "description": "Combines ion exchange resins and ion-selective membranes with DC electric field to produce high-purity water continuously without chemical regeneration.",
        "icon": "FaBolt",
        "image": "/images/tech-edi.jpg"
    },
    {
        "name": "Multimedia Filtration",
        "description": "Multi-layer filtration using sand, gravel, and anthracite to remove suspended solids, turbidity, and particulate matter from raw water sources.",
        "icon": "FaLayerGroup",
        "image": "/images/tech-multimedia.jpg"
    },
    {
        "name": "Ion Exchange Water Softening",
        "description": "Removes calcium and magnesium ions that cause water hardness by exchanging them with sodium ions, preventing scale buildup and protecting equipment.",
        "icon": "FaExchangeAlt",
        "image": "/images/tech-softening.jpg"
    },
    {
        "name": "Ozone Treatment",
        "description": "Powerful oxidation process using ozone gas to disinfect water, remove color, eliminate taste and odor, and break down organic compounds.",
        "icon": "FaCloud",
        "image": "/images/tech-ozone.jpg"
    },
    {
        "name": "Activated Carbon Filtration",
        "description": "Uses activated carbon to adsorb chlorine, volatile organic compounds (VOCs), and improve taste and odor by removing contaminants.",
        "icon": "FaLeaf",
        "image": "/images/tech-carbon.jpg"
    }
]

added_count = 0
for tech_data in technologies_data:
    # Check if technology already exists
    existing = db.query(Technology).filter(Technology.name == tech_data["name"]).first()
    if not existing:
        db.add(Technology(**tech_data))
        added_count += 1
        print(f"  ✅ Added: {tech_data['name']}")
    else:
        print(f"  ℹ️  Already exists: {tech_data['name']}")

db.commit()
print(f"\n🎉 Seeding complete! Added {added_count} technologies.")
db.close()