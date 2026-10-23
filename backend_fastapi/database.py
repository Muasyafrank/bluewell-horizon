from sqlalchemy import create_engine, inspect, text
from sqlalchemy.engine import Connection
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


def _run(bind, sql: str) -> None:
    """Runs DDL on an engine (in its own transaction) or on a connection that is already in one,
    which is what a migration hands us."""
    if isinstance(bind, Connection):
        bind.execute(text(sql))
    else:
        with bind.begin() as connection:
            connection.execute(text(sql))


def ensure_index(name: str, table: str, columns: str, bind=None) -> None:
    """Creates an index if it is missing. `create_all` only builds indexes together with a
    new table, so an index added to a model later never reaches an existing database."""
    bind = bind if bind is not None else engine
    if table not in inspect(bind).get_table_names():
        return
    _run(bind, f"CREATE INDEX IF NOT EXISTS {name} ON {table} ({columns})")


def ensure_columns(table: str, columns: dict, bind=None) -> None:
    """Add any of `columns` ({name: SQL type}) the table is missing.

    `Base.metadata.create_all` creates new tables but never alters existing
    ones, so a column added to a model would otherwise break every query on a
    database created before the change. Only nullable columns are added, so
    existing rows are untouched, and running this repeatedly does nothing.
    """
    bind = bind if bind is not None else engine
    inspector = inspect(bind)
    if table not in inspector.get_table_names():
        return
    present = {column["name"] for column in inspector.get_columns(table)}
    for name, sql_type in columns.items():
        if name not in present:
            _run(bind, f"ALTER TABLE {table} ADD COLUMN {name} {sql_type}")
