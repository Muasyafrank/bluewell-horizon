# Bluewell Horizon

Water-treatment company site: public catalogue and shop, customer accounts,
quotes and contact forms, and an admin dashboard.

| Part | Stack | Folder |
| --- | --- | --- |
| Frontend | React 19 (Create React App), React Router 7, Bootstrap, Recharts | `frontend/` |
| Backend | FastAPI, SQLAlchemy 2, PostgreSQL, JWT auth | `backend_fastapi/` |

## Run it locally

**Backend** (Python 3.12+)

```bash
cd backend_fastapi
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then fill in DATABASE_URL and SECRET_KEY
python seed_data.py             # company info, products, services, process steps
python seed_admin.py            # prompts for the admin email and password
python main.py                  # http://localhost:5000  (API docs at /docs)
```

**Frontend** (Node 18+)

```bash
cd frontend
npm install
npm start                       # http://localhost:3000
```

## Tests

```bash
cd backend_fastapi && pip install -r requirements-dev.txt && pytest -q
cd frontend && CI=true npm test -- --watchAll=false
cd frontend && CI=true npm run build     # fails on any lint warning
```

## Layout

```
backend_fastapi/
  core/        tokens.py (JWT + roles), security.py (guards, hashing), email.py
  routers/     one module per resource; admin.py holds the protected CRUD
  schemas/     request/response models, with input limits
  models/      SQLAlchemy tables
  tests/       pytest suite (SQLite, no external services)
frontend/src/
  api/         one client for every request (errors, auth header, asset URLs)
  components/  ui/ (buttons, modals, fields), common/, layout/, home/, shop/
  context/     auth, cart and wishlist providers
  features/admin/   dashboard shell, panels (overview, inventory, orders, …)
  pages/       route components
  styles/      design tokens, base and component CSS
```

## Notes for operators

- **Never commit `.env`.** `.gitignore` covers it, but a file that was already
  tracked must be removed with `git rm --cached`.
- The shop shows products from the database and falls back to the bundled
  catalogue (`frontend/src/data/products.js`, same as `seed_data.py`) only when
  the API is unreachable or returns none.
- Uploaded images are stored in `backend_fastapi/static/uploads/` and served at
  `/uploads/`. Back this folder up; it is not in the database.
- Login tokens carry a role (`admin` or `customer`). Changing `SECRET_KEY`
  signs everyone out.
