from database import SessionLocal, engine, Base
from models import CompanyInfo, Product, Service, ProcessStep

# Ensure tables exist
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("🌱 Starting database seeding...")

# 1. Admin users are created with `python seed_admin.py`, which never stores a
#    password in source.

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

    # --- Domestic Municipal Water Filters -------------------------------

    {
        "name": "Under-Sink Municipal Water Filter",
        "description": "Compact 3-stage filter fitted under the kitchen sink to remove chlorine, sediment and odour from municipal tap water.",
        "category": "Domestic Municipal Water Filters",
        "image": "/images/undersink.png",
        "stock": 25,
    },

    {
        "name": "Whole House Sediment Filter",
        "description": "Point-of-entry filter that protects every tap in the home from sediment, rust and sand carried in municipal supply lines.",
        "category": "Domestic Municipal Water Filters",
        "image": "/images/sedimentfilter.png",
        "stock": 18,
    },

    {
        "name": "Countertop Carbon Water Filter",
        "description": "No-installation countertop unit with activated carbon block, ideal for renters on municipal supply.",
        "category": "Domestic Municipal Water Filters",
        "image": "/images/carbonfilter.png",
        "stock": 30,
    },


    # --- Domestic & Commercial RO Systems -------------------------------

    {
        "name": "5-Stage Domestic RO System",
        "description": "Under-sink reverse osmosis system with mineral re-mineralisation stage, sized for a typical household.",
        "category": "Domestic & Commercial RO Systems",
        "image": "/images/domestic ro.png",
        "stock": 20,
    },

    {
        "name": "Commercial 500 LPH RO System",
        "description": "Skid-mounted commercial RO plant producing 500 litres of purified water per hour, for offices and small plants.",
        "category": "Domestic & Commercial RO Systems",
        "image": "/images/commercial ro.png",
        "stock": 5,
    },

    {
        "name": "Compact Under-Counter RO Unit",
        "description": "Space-saving RO unit built for small kitchens and studio apartments without sacrificing purification stages.",
        "category": "Domestic & Commercial RO Systems",
        "image": "/images/under-counter.png",
        "stock": 22,
    },

    {
        "name": "Heavy-Duty Commercial RO Plant",
        "description": "High-capacity RO plant for hotels, schools and factories with continuous high-purity water demand.",
        "category": "Domestic & Commercial RO Systems",
        "image": "/images/heavyduty ro.png",
        "stock": 3,
    },


    # --- Water Softeners -------------------------------------------------

    {
        "name": "Automatic Water Softener (Residential)",
        "description": "Timer-controlled softener that removes hardness minerals and protects household pipework and appliances.",
        "category": "Water Softeners",
        "image": "/images/gallery-9.png",
        "stock": 12,
    },

    {
        "name": "Twin-Tank Commercial Water Softener",
        "description": "Alternating twin-tank design gives continuous soft water supply with no downtime during regeneration.",
        "category": "Water Softeners",
        "image": "/images/gallery-10.png",
        "stock": 6,
    },

    {
        "name": "Salt-Free Water Conditioner",
        "description": "Template-assisted crystallisation conditioner that reduces scale without adding sodium to the water.",
        "category": "Water Softeners",
        "image": "/images/gallery-11.png",
        "stock": 10,
    },

    {
        "name": "Industrial Water Softening Unit",
        "description": "High-flow softening system built for boiler feed water and industrial process lines.",
        "category": "Water Softeners",
        "image": "/images/gallery-12.png",
        "stock": 4,
    },


    # --- Bottling Equipment ---------------------------------------------

    {
        "name": "Semi-Automatic Bottle Filling Machine",
        "description": "4-nozzle semi-automatic filler for small-scale bottled water production lines.",
        "category": "Bottling Equipment",
        "image": "/images/gallery-1.png",
        "stock": 4,
    },

    {
        "name": "Automatic Bottle Capping Machine",
        "description": "Rotary capping machine that seals bottles consistently at production-line speed.",
        "category": "Bottling Equipment",
        "image": "/images/gallery-2.png",
        "stock": 5,
    },

    {
        "name": "Bottle Rinsing & Filling Line",
        "description": "Combined rinse-fill-cap monobloc unit for a full small bottling line in a single footprint.",
        "category": "Bottling Equipment",
        "image": "/images/gallery-3.png",
        "stock": 2,
    },

    {
        "name": "5-Gallon Jar Filling Machine",
        "description": "Purpose-built filler for 18.9-litre refill jars, with automatic jar washing and capping.",
        "category": "Bottling Equipment",
        "image": "/images/gallery-4.png",
        "stock": 3,
    },


    # --- UV Disinfection Chambers ---------------------------------------

    {
        "name": "Inline UV Disinfection Chamber",
        "description": "Stainless steel inline chamber that inactivates bacteria and viruses without adding chemicals.",
        "category": "UV Disinfection Chambers",
        "image": "/images/gallery-5.png",
        "stock": 15,
    },

    {
        "name": "High-Flow UV Sterilization Unit",
        "description": "High-capacity UV chamber for commercial systems needing consistent disinfection at higher flow rates.",
        "category": "UV Disinfection Chambers",
        "image": "/images/gallery-6.png",
        "stock": 8,
    },

    {
        "name": "Compact UV Water Purifier Chamber",
        "description": "Small-footprint UV chamber suited to under-sink and point-of-use residential installations.",
        "category": "UV Disinfection Chambers",
        "image": "/images/gallery-7.png",
        "stock": 20,
    },

    {
        "name": "Industrial UV Disinfection System",
        "description": "Multi-lamp UV disinfection system rated for continuous industrial-scale water treatment.",
        "category": "UV Disinfection Chambers",
        "image": "/images/gallery-8.png",
        "stock": 3,
    },


    # --- Filter Housings -------------------------------------------------

    {
        "name": "Single Cartridge Filter Housing",
        "description": "Standard 10-inch single-cartridge housing for household point-of-use filtration.",
        "category": "Filter Housings",
        "image": "/images/gallery-9.png",
        "stock": 50,
    },

    {
        "name": 'Big Blue Filter Housing (20")',
        "description": "High-capacity 20-inch housing for whole-house filtration with longer cartridge life.",
        "category": "Filter Housings",
        "image": "/images/gallery-10.png",
        "stock": 28,
    },

    {
        "name": "Multi-Cartridge Filter Housing (Triple)",
        "description": "Three-stage manifold housing for sediment, carbon and polishing cartridges in one assembly.",
        "category": "Filter Housings",
        "image": "/images/gallery-11.png",
        "stock": 14,
    },

    {
        "name": "Stainless Steel Filter Housing",
        "description": "Corrosion-resistant stainless steel housing for industrial and high-pressure applications.",
        "category": "Filter Housings",
        "image": "/images/gallery-12.png",
        "stock": 9,
    },


    # --- Accessories -----------------------------------------------------

    {
        "name": "Pressure Gauge Kit",
        "description": "Panel-mount pressure gauges for monitoring inlet and outlet pressure across filtration stages.",
        "category": "Accessories",
        "image": "/images/gallery-1.png",
        "stock": 60,
    },

    {
        "name": "Water Flow Meter",
        "description": "Mechanical inline flow meter for tracking treated water output over time.",
        "category": "Accessories",
        "image": "/images/gallery-2.png",
        "stock": 35,
    },

    {
        "name": "TDS Meter (Digital)",
        "description": "Handheld digital meter for checking total dissolved solids before and after treatment.",
        "category": "Accessories",
        "image": "/images/gallery-3.png",
        "stock": 70,
    },

    {
        "name": "Quick-Connect Fitting Set",
        "description": "Assorted push-fit fittings and tubing for connecting filter housings, membranes and tanks.",
        "category": "Accessories",
        "image": "/images/gallery-4.png",
        "stock": 45,
    },


    # --- RO Membranes ----------------------------------------------------

    {
        "name": "100 GPD RO Membrane",
        "description": "Standard residential replacement membrane rated at 100 gallons per day.",
        "category": "RO Membranes",
        "image": "/images/gallery-5.png",
        "stock": 40,
    },

    {
        "name": "200 GPD RO Membrane",
        "description": "Higher-output residential/light-commercial membrane for larger households.",
        "category": "RO Membranes",
        "image": "/images/gallery-6.png",
        "stock": 25,
    },

    {
        "name": "Commercial 4040 RO Membrane",
        "description": "Standard 4040-size commercial membrane element for mid-sized RO plants.",
        "category": "RO Membranes",
        "image": "/images/gallery-7.png",
        "stock": 12,
    },

    {
        "name": "Industrial 8040 RO Membrane",
        "description": "Large-format 8040 membrane element for industrial and high-capacity RO systems.",
        "category": "RO Membranes",
        "image": "/images/gallery-8.png",
        "stock": 6,
    },
]


for p in products_data:
    existing_product = db.query(Product).filter(
        Product.name == p["name"]
    ).first()

    if not existing_product:
        db.add(Product(**p))
        print(f" Added product: {p['name']}")
    else:
        print(f" Product already exists: {p['name']}")

print(f" {len(products_data)} products processed.")

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