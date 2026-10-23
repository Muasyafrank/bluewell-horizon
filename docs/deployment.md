# Deploying Bluewell Horizon

One Linux server (Ubuntu 22.04+), nginx in front, PostgreSQL, the API run by systemd.
Replace `example.co.ke` with your domain and `/srv/bluewell` with your path.

## 1. Server packages
```
sudo apt install -y nginx postgresql python3-venv python3-pip certbot python3-certbot-nginx nodejs npm
```

## 2. Database
```
sudo -u postgres psql -c "CREATE USER bluewell WITH PASSWORD 'CHANGE-ME';"
sudo -u postgres psql -c "CREATE DATABASE bluewell OWNER bluewell;"
```
Tables are created by `alembic upgrade head` (step 3) and, as a fallback, on first start.

## 3. Backend
```
cd /srv/bluewell/backend_fastapi
python3 -m venv venv && ./venv/bin/pip install -r requirements.txt
cp .env.example .env     # then edit, see below
./venv/bin/python -m pytest          # must pass before going live
./venv/bin/alembic upgrade head      # brings the database schema up to date (see docs/migrations.md)
./venv/bin/python seed_admin.py      # creates the first administrator
```
Minimum `.env` for production:
```
ENVIRONMENT=production
DATABASE_URL=postgresql://bluewell:CHANGE-ME@localhost:5432/bluewell
SECRET_KEY=<python -c "import secrets; print(secrets.token_urlsafe(48))">
CORS_ORIGINS=https://example.co.ke,https://www.example.co.ke
SITE_URL=https://example.co.ke      # used in password-reset emails
TRUST_PROXY=true
EMAIL_USER=...            # plus EMAIL_PASS or the GMAIL_* values, see docs/email-setup.md
```
In production the app will not start if the secret is weak, the database is SQLite
or CORS is localhost-only; the error message says which.

systemd unit `/etc/systemd/system/bluewell.service`:
```
[Unit]
Description=Bluewell API
After=network.target postgresql.service

[Service]
User=www-data
WorkingDirectory=/srv/bluewell/backend_fastapi
Environment=TZ=Africa/Nairobi
ExecStart=/srv/bluewell/backend_fastapi/venv/bin/uvicorn main:app --host 127.0.0.1 --port 5000 --proxy-headers
Restart=always

[Install]
WantedBy=multi-user.target
```
```
sudo chown -R www-data /srv/bluewell/backend_fastapi/static
sudo systemctl enable --now bluewell
curl http://127.0.0.1:5000/health     # {"status":"ok"}
```
Run one worker (as above). With several, rate limits are counted per worker.

## 4. Frontend
```
cd /srv/bluewell/frontend
cp .env.example .env     # set REACT_APP_SITE_URL=https://example.co.ke ; leave REACT_APP_API_URL unset
npm ci && npm run build
```
Also replace the domain in `public/sitemap.xml` and `public/robots.txt` before building,
and the social links in the footer.

## 5. nginx
`/etc/nginx/sites-available/bluewell`:
```
server {
    server_name example.co.ke www.example.co.ke;
    root /srv/bluewell/frontend/build;
    index index.html;
    client_max_body_size 6m;

    location /api/     { proxy_pass http://127.0.0.1:5000; proxy_set_header Host $host;
                         proxy_set_header X-Forwarded-For $remote_addr;
                         proxy_set_header X-Forwarded-Proto $scheme; }
    location /uploads/ { proxy_pass http://127.0.0.1:5000; }
    location /health   { proxy_pass http://127.0.0.1:5000; }
    location /static/  { expires 1y; add_header Cache-Control "public, immutable"; }
    location /         { try_files $uri /index.html; }
}
```
```
sudo ln -s /etc/nginx/sites-available/bluewell /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d example.co.ke -d www.example.co.ke
```
The site and API share one origin, so the frontend needs no API URL.

## Updating an existing install
```
# apply the new patch (or git pull), then:
cd backend_fastapi && ./venv/bin/pip install -r requirements.txt && ./venv/bin/alembic upgrade head
./venv/bin/python -m pytest
cd ../frontend && npm ci && npm run build
sudo systemctl restart bluewell
```
Take a database backup first (section 6).

## 6. Backups
- Database, daily: `pg_dump -U bluewell bluewell | gzip > /backups/bluewell-$(date +%F).sql.gz`
- Product images: copy `backend_fastapi/static/uploads/` (uploaded files are not in the database).
- Test a restore once; an untested backup is a guess.

## 7. After going live: smoke test
- [ ] `https://example.co.ke/health` returns ok; `/docs` returns 404.
- [ ] "Forgot your password?" on the sign-in page emails a link that sets a new password.
- [ ] Register a customer, sign in, add to cart, check out; the order shows in `/admin`.
- [ ] Admin sets prices, sends a quotation; the email arrives (and is Cc'd to the business).
- [ ] `/staff`: create an invoice, record a payment, receive stock; the stock level moves.
- [ ] Ten wrong passwords in a row are answered with "Too many attempts".
- [ ] Phone check of Home, Shop, Cart and `/staff`.
- [ ] `https://www.ssllabs.com/ssltest/` gives A or better.

## Known limits (fine at small scale, plan for growth)
- Invoices, purchase orders and customers load one page at a time. The main `/admin` dashboard still reads the newest 1,000 orders, enquiries and quotes whole (its charts need them), so its charts cover those.
- Staff passwords have no self-service reset; an administrator changes them on the Team page.
- Schema changes beyond adding things need a migration file (`docs/migrations.md`); run `alembic upgrade head` on every deploy.
- Login tokens are kept in the browser (localStorage); keep the site free of third-party scripts.
- Rate limits are in memory, per worker, and reset on restart.
