"""
Brings a database up to the schema the models describe: missing tables, missing
nullable columns and missing indexes. Every step is safe to repeat.

It runs when the app starts (so a new or older database just works) and is the
body of the first migration, so `alembic upgrade head` does the same for a
database managed with migrations. Changes from here on, anything beyond adding a
table, nullable column or index (renames, drops, NOT NULL, data fixes), belong in
a new file under migrations/versions; see docs/migrations.md.
"""
from database import Base, engine, ensure_columns, ensure_index
import models  # noqa: F401  (registers every model with Base before create_all)


def sync_schema(bind=None) -> None:
    bind = bind if bind is not None else engine
    Base.metadata.create_all(bind=bind)
    ensure_columns("admins", {"name": "VARCHAR", "role": "VARCHAR", "is_active": "BOOLEAN"}, bind)
    ensure_columns("products", {"reorder_level": "INTEGER"}, bind)
    ensure_columns("gallery", {"location": "VARCHAR", "year": "INTEGER", "description": "TEXT"}, bind)
    # Lookups the admin screens and the customer's order history do constantly.
    ensure_index("ix_orders_customer_email", "orders", "customer_email", bind)
    ensure_index("ix_orders_customer_id", "orders", "customer_id", bind)
    ensure_index("ix_orders_created_at", "orders", "created_at", bind)
    ensure_index("ix_invoices_order_id", "invoices", "order_id", bind)
    ensure_index("ix_payments_received_on", "payments", "received_on", bind)
