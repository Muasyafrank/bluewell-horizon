# Bluewell Horizon — Review & Refactor Notes

This is the original project with its code quality, UI/UX, performance and
structure reviewed and reworked. Functionality is unchanged for the visitor;
what changed is how reliably it works, how consistent it looks, and how the
code is organised. This file explains what changed and why.

## How to run it

**Backend**
```
cd backend_fastapi
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # fill in DATABASE_URL and SECRET_KEY at minimum
python seed_admin.py      # creates the first admin login
uvicorn main:app --reload
```

**Frontend**
```
cd frontend
npm install
npm start                 # set REACT_APP_API_URL if the backend isn't on localhost:5000
```

Both `npm run build` (frontend) and a full request-level test pass (backend,
via FastAPI's TestClient) were run against this exact tree before delivery —
see "Verification" at the bottom.

---

## Bugs fixed (things that didn't work before)

These aren't style opinions — each one is a request that failed, a page that
crashed, or a feature that silently did nothing.

1. **Admin sign-in was broken.** The login form posted to `/api/auth/login`;
   the server only exposes `/api/admin/login`. Every admin login 404'd.
   `frontend/src/features/admin/AdminLogin.jsx`, `backend_fastapi/routers/auth.py`

2. **The contact form went nowhere.** `/api/contact` didn't exist on the
   backend at all — messages vanished with no server-side error. Added
   `backend_fastapi/routers/contact.py` + `schemas/contact.py`.

3. **Customer order history crashed the account page.** The API returns
   order items differently than the page expected (`order.OrderItems` /
   `item.Product` don't exist on the response), so `.slice()` on `undefined`
   took out the whole page for any customer with an order. Fixed the backend
   response shape (`backend_fastapi/routers/orders.py`) and the page
   (`frontend/src/pages/customer/AccountDashboard.jsx`).

4. **Orders were never linked to the account that placed them.** The
   frontend sent a bearer token at checkout; the backend never read it, so
   `customer_id` was always null and "My orders" was always empty.
   `backend_fastapi/routers/orders.py`, `core/security.py`
   (added `get_current_customer_optional` so checkout still works for guests).

5. **Order numbers collided under load.** `order_number = f"BW-{int(time.time())}"`
   has one-second resolution; two checkouts in the same second got the same
   number and the second one failed with a `UNIQUE constraint` 500. Numbers
   are now derived from the database-assigned row id, which is unique by
   construction. Verified with 11 back-to-back checkouts in the same second.

6. **Company info could never be saved.** Two separate bugs stacked: the
   admin dashboard PUT the *public* read-only endpoint (405), and even fixed,
   the handler matched raw incoming keys (`aboutUs`) against snake_case model
   attributes (`about_us`) with `hasattr()`, so nothing ever matched. Added a
   proper `CompanyInfoUpdate` schema that does the translation, and pointed
   the frontend at `/api/admin/company-info`.

7. **The cart badge never updated.** Two parallel cart implementations
   existed — `CartContext` (used by the shop) and a `utils/cart.js` module
   (used by the cart and checkout pages) — writing different localStorage
   keys and firing differently-named custom events. There is now exactly one
   cart (`frontend/src/context/CartContext.jsx`).

8. **Admin dashboard forms lost focus on every keystroke.** Several
   components (`ImageUploadField`, the modals, the action buttons) were
   declared *inside* the dashboard's render function, so React saw a new
   component type on every render and remounted the whole subtree — typing a
   product name meant one character per click. Every component now lives at
   module scope.

9. **`OrderSuccess` invented a fake order number** if you opened the URL
   directly (no real order), which looked exactly like a real confirmation.
   It now redirects to the shop unless it received a real order number from
   checkout.

10. **A ripple animation was silently broken.** `WaterLoader.css` declared
    `@keyframes ripple` twice; the second definition overrode the first, so
    the large loader animated at the small loader's size. Consolidated into
    `frontend/src/styles/loader.css` with a size custom property.

11. **Missing dependency.** `email-validator` is required by pydantic's
    `EmailStr` (used throughout the auth schemas) but was never listed
    anywhere — installs would fail unless it happened to already be present.
    Added to `requirements.txt`.

12. **No 404 route, no error boundary.** An unknown URL rendered the layout
    with a blank body; a render error anywhere showed a blank white page.
    Added `frontend/src/pages/NotFound.jsx` and
    `frontend/src/components/common/ErrorBoundary.jsx`.

13. **Footer links pointed at hash fragments that don't exist**
    (`#home`, `#services`, ...). They're real routes now.

14. **Error messages were always "undefined."** FastAPI returns errors as
    `detail`; every frontend catch block read `data.message`. Centralised in
    `frontend/src/api/client.js`, which also unpacks Pydantic's validation
    error arrays into readable field-level messages.

## Security

- **`backend_fastapi/.env` was committed to the repo**, with a live
  `SECRET_KEY`, database URL and Gmail app password. It has been removed
  from this tree and replaced with `.env.example`. **Rotate all three
  credentials** — being in git history means they're compromised regardless
  of this change; deleting the file doesn't undo a past exposure.
- Three separate copies of the SMTP-sending code (orders, quotes, and now
  contact) are consolidated into `backend_fastapi/core/email.py`, and CORS
  origins now come from `CORS_ORIGINS` in `.env` instead of being
  hard-coded to `localhost`.

---

## Structure

**Backend** — no functional rewrite, just centralised what was duplicated:
- `config.py` — one place for environment configuration (previously four
  different files each called `load_dotenv()` and read `os.getenv()`
  independently).
- `core/email.py` — one SMTP sender (previously defined three times).
- `requirements.txt` + `.env.example` — didn't exist before.

**Frontend** — reorganised around a small set of reusable primitives instead
of one-off inline styles and hand-rolled modals per page:

```
src/
  api/            one HTTP client + endpoint map (was: fetch() calls with
                   hard-coded localhost URLs scattered across ~15 files)
  styles/          design tokens + component classes (was: inline style
                   objects repeated across ~40 components)
  components/ui/   Button, Card, Field, Modal, Badge, Loader, EmptyState,
                   ErrorState, AsyncSection... (was: bespoke markup per page)
  components/      common/ (SEO, Image, ErrorBoundary), layout/ (Navbar,
                   Footer, route guard), marketing/, services/, shop/,
                   checkout/ — grouped by what they're for
  hooks/           useApiResource (loading/error/retry/abort), plus
                   debounce, outside-click, scroll and body-scroll-lock
  context/         one CartContext; AdminContext and CustomerContext built
                   from a shared factory instead of two near-duplicate files
  features/admin/  the 960-line AdminDashboard.jsx is now a tab shell over
                   a schema (contentSchemas.js) and per-section panels —
                   one generic ContentPanel replaces five hand-written
                   CRUD tables, one ContentFormModal replaces ten
                   hand-written add/edit modals
  pages/           one file per route, each assembled from the above
```

Removed: dead components that nothing imported (`Technologies.jsx`,
`Contact.jsx` importing a `data/data.js` file that didn't exist), and
`data/services.js` / `data/technologies.js`, which the pages no longer read
now that Solutions/Home pull from the API with proper loading and error
states instead of static content pretending to be live.

## Accessibility

- Every modal now traps focus, closes on Escape, and returns focus to
  what opened it (`components/ui/Modal.jsx`).
- Icon-only buttons all have `aria-label`s (`IconButton`); form fields are
  correctly associated with their labels and error text
  (`aria-describedby`, `aria-invalid`) via `Field`.
- Loading states use `role="status"`; a skip-to-content link was added;
  focus-visible outlines are consistent instead of relying on (or removing)
  the browser default.
- Fixed several text/background contrast failures where navy or dark text
  sat directly on a photo with no scrim.

## Performance

- Route-level code splitting (`React.lazy`) — each page's JS only loads
  when visited, rather than one bundle for the whole app.
- `react-icons/fa` is now imported by name in one place
  (`utils/icons.js`) instead of `import * as FaIcons` per page, which pulled
  in the whole icon set.
- The shop's filter/search/sort is computed with `useMemo` instead of a
  `useState` + `useEffect` pair, so it no longer double-renders the grid on
  every keystroke; search is debounced.
- Native `loading="lazy"` on images instead of a hand-rolled
  IntersectionObserver per image.
- The scroll listener behind the navbar's "scrolled" state is
  `requestAnimationFrame`-throttled instead of running on every scroll
  event.

---

## Verification

- `npm run build` — compiles cleanly, no warnings, no errors.
- Backend: imported cleanly, then driven end-to-end via FastAPI's
  `TestClient` covering admin login, product creation, customer
  registration, checkout (as a guest and as a signed-in customer), order
  history, admin order detail, order status updates, contact and quote
  submission, and company-info updates — all passing, including an
  11-checkout-in-one-second stress test for the order-number fix.
- Not covered by this pass: a real PostgreSQL connection (tests ran against
  SQLite, since no live database was available here), and the email-sending
  path itself (runs in a "not configured, skipped" mode without real SMTP
  credentials — verified it degrades gracefully rather than crashing the
  request).

---

## Shop page redesign (catalogue layout)

The shop was rebuilt around a category-sidebar catalogue layout: a sticky
left sidebar listing categories with live counts, a "Product Center"
breadcrumb header, a search/sort toolbar, a 4-across product grid, and
numbered pagination (12 products per page). New files:
`components/shop/CategorySidebar.jsx`, `components/ui/Pagination.jsx`;
`ProductCard.jsx` and `pages/Shop.jsx` were rewritten; catalogue-specific
styles added to `styles/components.css`.

This was checked with a real headless-browser render (Playwright against a
built, served copy of the app), not just a code read — which caught two bugs
that a build check alone would have missed:

1. **Product and gallery images 404'd.** `assetUrl()` rewrote every path
   starting with `/images/` to point at the API server, on the assumption
   that `/images/...` always meant a backend-hosted upload. But the
   frontend's own bundled assets (fallback product photos, seed data,
   banner images) also live under `/images/...` in `public/`, so they got
   incorrectly redirected to a URL that doesn't exist on the API host.
   Fixed by moving backend uploads to their own `/uploads/` prefix
   (`main.py`'s static mount, the upload endpoint in `routers/admin.py`,
   and `assetUrl()` in `api/client.js`) so the two can never collide.
   Confirmed via the browser render: all six fallback product images now
   load with a 200 instead of a 404.

2. **Page content rendered partly under the fixed navbar, worst on mobile.**
   `.bw-page` sets `padding-top`; `.bw-section` sets `padding-block`
   (a shorthand that also touches `padding-top`). Both are plain
   single-class rules with equal specificity, so whichever is declared
   later in the stylesheet wins — and `.bw-section` was declared after
   `.bw-page`, silently overriding its navbar clearance down to
   `clamp(3rem, 8vw, 6rem)`, which shrinks close to its 3rem floor on
   narrow viewports. This affected five pages that combine both classes:
   Shop, the customer account dashboard, the admin dashboard,
   order-success, and 404. Fixed with a compound `.bw-page.bw-section`
   rule, which has higher specificity than either class alone and so wins
   regardless of declaration order. Confirmed on both Shop and the 404
   page at a 390px mobile width — content now clears the navbar cleanly on
   both.
