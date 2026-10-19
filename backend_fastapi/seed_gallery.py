"""Add sample projects to the gallery table (only if it is empty).

Run once from backend_fastapi/:  python seed_gallery.py
Titles describe the equipment in each photo. The locations, years and
descriptions are placeholders for illustration, not records of real jobs:
replace them from the admin panel (Gallery tab).
"""
from database import SessionLocal, engine, Base, ensure_columns
from models import Gallery

# (title, category, image, location, year, description)
SAMPLE_PROJECTS = [
    (
        "Containerised RO plant range",
        "Industrial",
        "/images/gallery-1.png",
        "Mombasa",
        2024,
        "Containerised reverse osmosis plants in several capacities, delivered ready to connect for sites with brackish or hard borehole water.",
    ),
    (
        "Bottle pasteurising and cooling tunnel",
        "Bottling",
        "/images/gallery-2.png",
        "Nakuru",
        2023,
        "Stainless-steel tunnel that heats and cools filled bottles as the last step of a bottling line, built for steady daily production.",
    ),
    (
        "Industrial RO skid with pressure vessels",
        "Industrial",
        "/images/gallery-3.png",
        "Nairobi",
        2025,
        "Skid-mounted reverse osmosis system with membrane pressure vessels, pumps and controls on one frame for factory process water.",
    ),
    (
        "Twin-vessel softening and filtration system",
        "Institutional",
        "/images/gallery-9.png",
        "Eldoret",
        2022,
        "Twin pressure vessels that filter and soften water for a school and its boarding facilities, with automatic backwash.",
    ),
    (
        "Stainless-steel filtration tanks",
        "Commercial",
        "/images/gallery-10.png",
        "Thika",
        2023,
        "Stainless filtration tanks with colour-coded pipework, installed to treat the borehole supply of a commercial premises.",
    ),
    (
        "Multimedia and carbon filtration line",
        "Industrial",
        "/images/gallery-12.png",
        "Naivasha",
        2024,
        "Multimedia sand and activated carbon filters in sequence, removing silt, colour and odour ahead of further treatment.",
    ),
    (
        "Compact RO and UV purification skid",
        "Commercial",
        "/images/gallery-7.png",
        "Kisumu",
        2024,
        "Compact reverse osmosis and UV skid that purifies drinking water for a hotel kitchen and guest rooms.",
    ),
    (
        "Stainless-steel RO purification unit",
        "Commercial",
        "/images/gallery-8.png",
        "Nairobi",
        2025,
        "Stainless-steel reverse osmosis unit with a multistage pump, sized for offices and small production sites.",
    ),
    (
        "Commercial RO with pre-treatment vessels",
        "Commercial",
        "/images/commercial ro.png",
        "Machakos",
        2022,
        "Commercial reverse osmosis plant with sediment and carbon pre-treatment vessels to protect the membranes.",
    ),
    (
        "Skid-mounted RO membrane plant",
        "Industrial",
        "/images/heavyduty ro.png",
        "Kajiado",
        2023,
        "High-capacity membrane plant on a single skid, treating brackish borehole water for a farm and processing site.",
    ),
    (
        "Under-sink RO installation",
        "Residential",
        "/images/undersink.png",
        "Kiambu",
        2025,
        "Five-stage reverse osmosis system fitted under a kitchen sink, with its own tap for drinking water.",
    ),
    (
        "Compact under-counter RO system",
        "Residential",
        "/images/under-counter.png",
        "Nairobi",
        2024,
        "Space-saving reverse osmosis unit installed in the cabinet below a kitchen sink, with the storage tank alongside.",
    ),

]


def main():
    Base.metadata.create_all(bind=engine)
    ensure_columns("gallery", {"location": "VARCHAR", "year": "INTEGER", "description": "TEXT"})
    db = SessionLocal()
    try:
        if db.query(Gallery).count():
            print("Gallery already has entries; nothing added.")
            return
        db.add_all(
            Gallery(title=t, category=c, image=i, location=l, year=y, description=d)
            for t, c, i, l, y, d in SAMPLE_PROJECTS
        )
        db.commit()
        print(f"Added {len(SAMPLE_PROJECTS)} sample projects.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
