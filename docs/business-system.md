# Business management system

Staff open it at `/staff` (sign in with a staff account). It shares the website's
database and API (`/api/bms/*`) but has its own layout and sign-in page.

## Roles

| Role | Can open |
|---|---|
| Administrator | everything, including the website admin dashboard and Team |
| Sales | dashboard, customers, invoices |
| Accounts | dashboard, customers, invoices, payments, reports |
| Stores | dashboard, stock, suppliers, purchasing |

Only administrators can use the website's admin dashboard. The first administrator
is created with `python seed_admin.py`; add the rest in Team. Existing admin rows
(created before roles existed) count as administrators. Deactivated staff are
locked out immediately, even with an unexpired token.

## What it does

- **Invoices:** create from an order whose quotation was sent, or by hand; email the
  invoice with the payment methods; void (only while no payments are recorded).
- **Payments:** record M-Pesa, bank, cash, cheque or card payments, with a reference
  for everything but cash. Overpaying is refused. Status is derived: paid, part paid,
  unpaid, overdue.
- **Stock:** every change goes through one function and leaves a log row with who,
  why and a reference. Orders take stock when placed; cancelling returns exactly
  what the order took, and reopening takes it again.
- **Purchasing:** suppliers and purchase orders (draft, ordered, received,
  cancelled). Receiving books the whole order into stock.
- **Customers:** one row per email across accounts, orders and invoices, with notes.
- **Reports:** invoiced, collected, VAT, ageing, payment methods, top customers and
  products, plus a CSV export (formula-safe).

Stock and purchasing screens never show prices.

## Upgrading an existing database

New tables are created at startup. New columns on existing tables (`admins.name`,
`admins.role`, `admins.is_active`, `products.reorder_level`) are added by
`ensure_columns`, so no manual migration is needed.
