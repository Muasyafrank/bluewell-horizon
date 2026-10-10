from sqlalchemy import create_engine
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
