from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from config import settings

# pool_pre_ping discards connections the database has dropped while idle,
# instead of failing the first request after a quiet period.
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Yields a database session and always closes it, even if the request raises."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_columns(table: str, columns: dict) -> None:
    """Add any of `columns` ({name: SQL type}) the table is missing.

    `Base.metadata.create_all` creates new tables but never alters existing
    ones, so a column added to a model would otherwise break every query on a
    database created before the change. Only nullable columns are added, so
    existing rows are untouched, and running this repeatedly does nothing.
    """
    inspector = inspect(engine)
    if table not in inspector.get_table_names():
        return
    present = {column["name"] for column in inspector.get_columns(table)}
    with engine.begin() as connection:
        for name, sql_type in columns.items():
            if name not in present:
                connection.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {sql_type}"))
