# Changes in this review

Scope: code quality, UI/UX, performance and structure, keeping behaviour the
same unless it was a bug. Every item below names what was wrong, what changed,
and how it was checked. A final section lists what was **not** verified.

## Security

| Problem | Fix |
| --- | --- |
| **Privilege escalation.** Admin and customer tokens were both `{"sub": "<id>"}`, and each guard just looked the id up in its own table. A self-registered customer whose id matched an admin's (customer #1 / admin #1) held a valid admin token. | Tokens carry a `role` claim; each guard rejects the other role's tokens. `core/tokens.py`, `core/security.py`. |
| `backend_fastapi/.env` was committed to git (database URL, secret key, email password). | Removed from the delivered tree, `.gitignore` added, real `.env.example` written. **Rotate all three secrets**; the history still contains them. |
| Two seed scripts created admins with passwords written in source. | `seed_admin.py` reads `ADMIN_EMAIL`/`ADMIN_PASSWORD` or prompts. `seed_data.py` no longer creates an admin. **Delete the old seeded admins.** |
| Visitor-supplied text inserted unescaped into HTML emails sent to the business. | Escaped with `html.escape`; header values stripped of line breaks. |
| No input limits; a negative checkout quantity added stock; raw exception text returned to clients. | Length/range limits on every public schema, `quantity >= 1`, unknown products give a clean 400, generic 500 messages with the detail logged server-side. |
| Uploads accepted any file type and size, under the client's filename. | Allow-list (JPEG/PNG/WebP/GIF), 5 MB cap, random filenames. |
| Weak `SECRET_KEY` went unnoticed. | Warning logged if shorter than 32 characters. |

## Bugs fixed

- **Admin image upload never worked** (server expected form field `file`, client sent `image`).
- **Editing a product, or changing its stock, failed validation** because `price` was required but catalogue products have none. Now optional; the admin form no longer demands it.
- **The shop ignored the API** (hard-wired to the static list, debug logs left in), so admin product edits never reached customers. Restored API-first with the bundled catalogue as fallback; categories created in admin now appear.
- **"Popular products" on the dashboard was always empty** (it read line items the orders list never returns). Now one SQL aggregate in `/api/admin/stats`.
- **The fallback image `/images/placeholder.png` did not exist**, so missing images showed a broken icon. Added `placeholder.svg`; `Image` also retries when its `src` changes.
- **Order numbers** came from a timestamp and could collide; now built from the database id.
- The old dashboard hard-coded `http://localhost:5000`, which breaks any deployment.
- `App.test.js` could never run (React Router 7 vs the Jest bundled with CRA 5). Fixed with a `moduleNameMapper` and a `TextEncoder` polyfill.

## Structure

- **Admin dashboard:** the 6,255-line `pages/admin/AdminDashboard.jsx` is deleted. The modular `features/admin/` version is now the one in use, with the features the monolith had and it lacked ported over: **Inventory** tab (add / remove / set stock), **Overview charts** (orders over 30 days, order status), inventory alerts, and attention counts on tabs. Stock rules and chart data are pure functions (`stock.js`, `analytics.js`) with tests.
- **30 unreferenced files removed** (duplicate Navbar/Footer/Hero/SEO/modals, old admin login, unused checkout components, `utils/cart.js`, unused data files, `App.css`). Found by building the import graph from `src/index.js` and cross-checking by name.
- Backend: shared safe email sender (`core/email.py`) replaces four copies of try/except-print; `routers/contact.py` and `quotes.py` rewritten to the same pattern; uploads path is absolute and defined once; `declarative_base` imported from its non-deprecated location.
- Added: root `README.md`, `.gitignore`, `backend_fastapi/.env.example`, `frontend/.env.example`, `requirements-dev.txt`.

## Performance

- `/api/admin/stats` computes totals in SQL; it used to load every order into memory.
- Order detail is one joined query instead of one product lookup per line item.
- Status emails, contact/quote notifications and order confirmations run as background tasks with a 15 s SMTP timeout, so responses no longer wait on a mail server.
- Admin saves refresh in place instead of replacing the whole tab with a spinner.
- `pool_pre_ping` on the database engine.

## UX

- Session expiry in admin signs out with an explanation instead of leaving a dashboard that cannot load.
- Inventory sorted lowest-stock-first with search and level filter; tab badges show orders needing attention, unread inquiries and low-stock count.
- Chart frames have text alternatives.

## Behaviour changes to be aware of

1. **Everyone is signed out once** (old tokens have no role).
2. The old default admin logins no longer exist in the seed scripts.
3. The shop reads the database. If it was not seeded with the current catalogue, customers will see what is in the database.
4. `/shop`, `/contact` and `/quote` require customer sign-in. That was already true in your working tree (uncommitted changes); it is not new, but HEAD had them public.

## Verification

Run in the review environment:

- Frontend lint: 13 warnings before, **0** after.
- `CI=true react-scripts build` (warnings are errors): **passes**.
- Jest: **21 tests pass** (20 new, plus the previously unrunnable `App.test.js`).
- Browser: the production build was loaded in headless Chromium with a mocked API. Checked: Overview charts and tab badges render; Inventory sorts and the stock modal sends a complete product with the right new stock; an expired session returns to login and clears the token; the shop shows API products including a new admin category; no broken images or JavaScript errors.
- Backend token rules: 6 tests executed and pass, including customer-token-as-admin.
- Backend everything else: compiles and passes a static undefined/unused-name check.

**Not verified** (no FastAPI or package index was available):

- The backend was never started, and the backend test suite in `backend_fastapi/tests/` was **never run**. Run `pytest -q` before deploying and treat a failure as a bug to fix.
- The new SQL (`func.extract`, the popular-products join) is untested against PostgreSQL.
- Email sending was not exercised.
- The mocked-API browser check does not prove the real endpoints return the shapes the UI expects.

## Not changed (worth doing next)

- No rate limiting on login, registration or the public forms.
- Order totals come from the client. Harmless while prices are hidden; recompute server-side before showing prices.
- Customer pages do not yet handle an expired token the way admin now does.
- Existing tables are created with `create_all`; there are no migrations.

## Follow-up changes (after first delivery)

- **Fixed a 500 on `GET /api/products`.** `ProductResponse.price` was a required float, but catalogue products have no price (NULL). Every product response failed validation, which blanked the admin dashboard and, once the shop used the live API, the shop. `price` and `stock` are now optional in the response schema; regression test added.
- **Redesigned the customer account page** (`pages/customer/AccountDashboard.jsx` and `pages/customer/account/`): a personal hero with initials avatar and greeting, stat tiles (orders, in progress, delivered, saved items), quick links, and an order card per order with a Received → Confirmed → On the way → Delivered tracker, product thumbnails and an expandable item list. Cancelled orders show a clear note instead of a tracker. Respects `prefers-reduced-motion`, has visible focus states, and works at phone width. An expired session now signs the customer out with a message, as the admin dashboard does. Styles are in `styles/account.css`; the logic is in a tested pure module (`orderSummary.js`).
- **Fixed sideways scrolling on phones** on every page (Bootstrap's `g-5` gutter overflowed the container): `overflow-x: clip` on the root element and the footer.
- **Redesigned the About page** (`pages/About.jsx` and `pages/about/`): hero with an overlapping stat strip (reusing the existing `COMPANY_STATS`), a story section with a photo collage and a compact capability list, a six-step "How we work" timeline built from the chain already described in the copy, mission and vision as contrasting panels, the eight values as numbered tiles, and a stronger closing call to action. All wording is the existing site copy; nothing new is claimed. Sections fade in on scroll via `hooks/useReveal.js`, which shows everything immediately for visitors who prefer reduced motion or whose browser lacks `IntersectionObserver`. Mission and vision now have real headings.
- **Redesigned Home, Solutions and Contact to match About.** One shared set of building blocks in `components/marketing/` (`PageHero`, `StatStrip`, `ProcessTimeline`/`ProcessList`, `MissionVision`, `ValuesSection`, `CtaBand`, `ProjectTile`) and `styles/marketing.css` now drives all four pages, so the site reads as one design. Home: taller photo hero with sector chips and the overlapping stat strip, services, a "Projects and installations" grid, mission/vision, values and a closing call to action. Solutions: photo hero, service cards with a hover accent, technology cards, and the project process as a timeline (it adapts to however many steps the admin adds, and stacks vertically beyond six). Contact: four contact cards overlapping a plain hero, the form in its own card, the map, and a three-step "what happens next". The contact form's validation, submit and error handling are unchanged, now in `pages/contact/ContactForm.jsx` with tests. All wording is existing site copy or taken directly from the pages' own promises (reply within one working day, free test and consultation).
- **Removed** the old `Hero`, `Marquee` and `ValueGrid` components and the ~2.7 KB of CSS only they used.
- **Contrast.** Audited every rendered text element on Home, About, Solutions, Contact and Account against WCAG AA. Added `--bw-teal-text` for small teal text and darkened `--bw-text-muted`, `--bw-text-soft` and `--bw-text-on-dark-faint` slightly; these tokens are used site-wide, so some grey text elsewhere is a shade darker. Only the decorative, screen-reader-hidden numerals on the values tiles remain below 4.5:1, by design.
