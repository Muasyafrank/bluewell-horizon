# Bluewell Horizon

Website and online shop for Bluewell Horizon Limited, a Kenyan water treatment company. Visitors can browse services and products, request quotes, save products to a wishlist, and place orders. Staff manage content and orders from an admin dashboard.

## Features

**Public site**
- Home, About, Solutions (services, technologies, process), Gallery, Contact
- Quote request form for larger projects

**Shop**
- Category sidebar with live product counts, search, sort and pagination
- Add to cart and add to wishlist
- Checkout with county-based delivery pricing, and M-Pesa, bank transfer or cash on delivery
- Guest checkout, or sign in to see order history

**Customer accounts**
- Register, sign in, view past orders

**Admin dashboard** (`/admin/login`)
- Manage products, services, technologies, process steps and gallery
- View orders and update their status, read inquiries and quote requests
- Edit company information and upload images

## Tech stack

| Layer    | Tools                                                                  |
| -------- | ---------------------------------------------------------------------- |
| Frontend | React 18, React Router, Bootstrap, react-helmet-async, react-toastify  |
| Backend  | FastAPI, SQLAlchemy, Pydantic, JWT auth (python-jose), bcrypt          |
| Database | PostgreSQL                                                             |

## Project structure

```
bluewell-horizon/
├── backend_fastapi/
│   ├── main.py            # App entry point, CORS, router registration
│   ├── config.py          # Environment settings
│   ├── database.py        # SQLAlchemy engine and session
│   ├── core/              # security.py (auth), email.py (SMTP helper)
│   ├── models/            # Database models
│   ├── routers/           # API routes (auth, products, orders, admin, ...)
│   ├── schemas/           # Pydantic request/response schemas
│   ├── static/uploads/    # Admin-uploaded images, served at /uploads
│   ├── seed_*.py          # Seed scripts
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── api/           # HTTP client and endpoint map
        ├── components/    # ui, common, layout, shop, checkout, ...
        ├── context/       # Cart, Wishlist, Admin and Customer state
        ├── data/          # Categories, fallback products, company info
        ├── features/admin # Admin dashboard
        ├── hooks/         # Reusable hooks
        ├── pages/         # One file per route
        ├── styles/        # Design tokens and component styles
        └── utils/         # Formatting, validation, delivery data
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+ (20 recommended)
- PostgreSQL

### 1. Database

```bash
sudo -u postgres psql <<'SQL'
CREATE USER bluewell WITH PASSWORD 'devpassword';
CREATE DATABASE bluewell OWNER bluewell;
SQL
```

### 2. Backend

```bash
cd backend_fastapi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env      # then edit .env, see below
python seed_admin.py      # creates the first admin account
python seed_data.py       # optional: sample services and gallery content
uvicorn main:app --reload --port 5000
```

API docs are available at http://localhost:5000/docs.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The app runs at http://localhost:3000. If the backend is not on `localhost:5000`, create `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:5001
```

## Environment variables

Set these in `backend_fastapi/.env`.

| Variable                      | Required | Default                 | Notes                                          |
| ----------------------------- | -------- | ----------------------- | ---------------------------------------------- |
| `DATABASE_URL`                | Yes      |                         | e.g. `postgresql://user:pass@localhost/bluewell` |
| `SECRET_KEY`                  | Yes      |                         | Signs login tokens. Use a long random value    |
| `ALGORITHM`                   | No       | `HS256`                 |                                                |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No       | `1440`                  |                                                |
| `EMAIL_USER` / `EMAIL_PASS`   | No       | empty                   | Gmail SMTP. If blank, emails are skipped       |
| `CORS_ORIGINS`                | No       | `http://localhost:3000` | Comma-separated list of allowed frontend URLs  |

Generate a secret key with:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Default admin login

`seed_admin.py` creates `admin@bluewellhorizon.com` with the password `Admin123!`. Change this password before sharing or deploying the project.

## Working with the shop

- **Categories** are defined in `frontend/src/data/categories.js`. The sidebar shows exactly this list.
- **Fallback products** live in `frontend/src/data/products.js` and show when the API has no products. A product's `category` must match a category name exactly, or it won't appear under any sidebar entry.
- **Prices** are stored on each product and used for cart and checkout totals, but are not shown on the shop grid.
- **Wishlist and cart** are saved in the browser's localStorage. They are not tied to a customer account.
- **Images** uploaded through the admin dashboard are saved to `backend_fastapi/static/uploads/` and served from `/uploads/`. Images bundled with the frontend live in `frontend/public/images/`.

## Scripts

Frontend, from `frontend/`:

```bash
npm start        # Development server
npm run build    # Production build in build/
npm test         # Test runner
```

Backend, from `backend_fastapi/` with the venv active:

```bash
uvicorn main:app --reload --port 5000
```

## Troubleshooting

**`Address already in use` when starting the backend.** Something is already using port 5000. Free it with `sudo fuser -k 5000/tcp`, or run on another port and set `REACT_APP_API_URL` to match.

**`RuntimeError: Missing required environment variable`.** `DATABASE_URL` or `SECRET_KEY` is missing from `.env`.

**Browser shows CORS errors.** Add the frontend's URL to `CORS_ORIGINS` in `.env` and restart the backend.

## License

Proprietary. All rights reserved by Bluewell Horizon Limited.
