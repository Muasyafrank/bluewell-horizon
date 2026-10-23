"""Alembic migrations: the baseline works on empty and older databases and can be repeated."""
import os

import pytest

pytest.importorskip("alembic", reason="pip install -r requirements.txt to run the migration tests")

from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from alembic.script import ScriptDirectory  # noqa: E402
from sqlalchemy import inspect, text  # noqa: E402

from database import Base, engine  # noqa: E402

BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def alembic_config() -> Config:
    config = Config(os.path.join(BACKEND, "alembic.ini"))
    config.set_main_option("script_location", os.path.join(BACKEND, "migrations"))
    config.attributes["configure_logger"] = False  # leave pytest's logging alone
    return config


@pytest.fixture
def empty_database():
    Base.metadata.drop_all(bind=engine)
    with engine.begin() as connection:
        connection.execute(text("DROP TABLE IF EXISTS alembic_version"))
    yield
    with engine.begin() as connection:
        connection.execute(text("DROP TABLE IF EXISTS alembic_version"))


def version() -> str | None:
    with engine.connect() as connection:
        return connection.execute(text("SELECT version_num FROM alembic_version")).scalar()


def test_there_is_exactly_one_head():
    assert ScriptDirectory.from_config(alembic_config()).get_heads() == ["0001"]


def test_upgrade_builds_every_table_on_an_empty_database(empty_database):
    command.upgrade(alembic_config(), "head")
    assert set(Base.metadata.tables) <= set(inspect(engine).get_table_names())
    assert version() == "0001"


def test_upgrade_can_be_run_again_without_changes(empty_database):
    command.upgrade(alembic_config(), "head")
    command.upgrade(alembic_config(), "head")
    assert version() == "0001"


def test_an_older_database_keeps_its_rows_and_gains_the_new_columns(empty_database):
    with engine.begin() as connection:
        connection.execute(text("CREATE TABLE admins (id INTEGER PRIMARY KEY, email VARCHAR NOT NULL, password VARCHAR NOT NULL)"))
        connection.execute(text("INSERT INTO admins (email, password) VALUES ('boss@example.com', 'hash')"))

    command.upgrade(alembic_config(), "head")

    columns = {c["name"] for c in inspect(engine).get_columns("admins")}
    assert {"name", "role", "is_active"} <= columns
    with engine.connect() as connection:
        assert connection.execute(text("SELECT email FROM admins")).scalar() == "boss@example.com"


def test_the_baseline_refuses_to_be_downgraded(empty_database):
    command.upgrade(alembic_config(), "head")
    with pytest.raises(RuntimeError, match="baseline"):
        command.downgrade(alembic_config(), "base")
