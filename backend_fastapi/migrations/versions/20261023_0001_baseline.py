"""Baseline: the schema the app had before migrations were introduced.

Revision ID: 0001
Revises:
Create Date: 2026-10-23

It does what the app has always done at start-up (create missing tables, add
missing nullable columns and indexes), and every step is safe to repeat, so the
same revision works on an empty database and on one that is already in use.
An existing database is simply brought to this point by `alembic upgrade head`.
"""
from alembic import op

from schema import sync_schema

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    sync_schema(op.get_bind())


def downgrade() -> None:
    raise RuntimeError("The baseline cannot be undone. Restore the database from a backup instead.")
