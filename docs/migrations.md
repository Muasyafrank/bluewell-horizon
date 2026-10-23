# Database migrations (Alembic)

Until now the app added missing tables, columns and indexes by itself on start-up
(`backend_fastapi/schema.py`). That is safe but can only add things. Anything else,
such as renaming or dropping a column, making a column required, or fixing existing
data, needs a migration: a small versioned file that is applied once, in order, and
recorded in the database.

## Day to day
Run from `backend_fastapi` with the virtualenv active (the address comes from `DATABASE_URL` in `.env`):

```
alembic upgrade head     # apply anything not yet applied (do this on every deploy, before restarting)
alembic current          # which revision this database is at
alembic history          # all revisions
```

**First time on an existing database** (your live one, or a development copy): just run
`alembic upgrade head`. The baseline revision (`0001`) only fills in what is missing, so
nothing is changed or lost. Back up first anyway (see `docs/deployment.md`).

## Changing the schema in future
1. Edit the model in `models/`.
2. Create a revision: `alembic revision -m "add delivery notes to orders"`.
3. Open the new file in `migrations/versions/` and write the change by hand in `upgrade()`
   (and the reverse in `downgrade()`), for example:
   ```python
   def upgrade() -> None:
       op.add_column("orders", sa.Column("delivery_notes", sa.Text(), nullable=True))

   def downgrade() -> None:
       op.drop_column("orders", "delivery_notes")
   ```
4. Try it on a copy of the data (`pg_dump` the live database into a test one), run
   `alembic upgrade head`, run the app and `python -m pytest`.
5. Commit the revision file with the model change. On the server: `alembic upgrade head`, then restart.

Prefer two steps for risky changes: add the new column and deploy; move the data; drop the old
column in a later release. Never edit a revision that has already been applied anywhere; add a new one.

## Notes
- `alembic revision --autogenerate` can draft a revision from the models, but always read what
  it wrote; it cannot see renames and may propose dropping data.
- `alembic upgrade head --sql` (print the SQL instead of running it) does not work for the
  baseline revision. Later revisions written with `op.*` calls do work with it.
- The app still runs `sync_schema()` at start-up. It only adds missing tables, nullable columns
  and indexes, so it never conflicts with a migration; it just makes a fresh install work without extra steps.
- The first migration test (`tests/test_migrations.py`) is skipped if Alembic is not installed;
  `pip install -r requirements.txt` installs it.
