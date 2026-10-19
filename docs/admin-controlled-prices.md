# Admin-controlled prices

Customers never see or send prices. The catalogue price is internal: it only
pre-fills the unit price when the admin prepares a quotation. The server is
authoritative; any price a browser sends at checkout is ignored.

- Public `/api/products` has no `price`; admins use `GET /api/admin/products`.
- Orders are created unpriced; totals are set when the quotation is sent.
- Customers' order responses omit prices and totals.
- Admin Orders shows "Awaiting quotation" until priced.
