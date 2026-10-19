/** What each part of the staff app is called and which module unlocks it. */
export const NAV = [
  { to: '/staff', label: 'Dashboard', module: 'dashboard', end: true },
  { to: '/staff/invoices', label: 'Invoices', module: 'invoices' },
  { to: '/staff/customers', label: 'Customers', module: 'customers' },
  { to: '/staff/stock', label: 'Stock', module: 'stock' },
  { to: '/staff/suppliers', label: 'Suppliers', module: 'suppliers' },
  { to: '/staff/purchasing', label: 'Purchasing', module: 'purchasing' },
  { to: '/staff/reports', label: 'Reports', module: 'reports' },
  { to: '/staff/team', label: 'Team', module: 'staff' },
];

export function visibleNav(modules = []) {
  return NAV.filter((item) => modules.includes(item.module));
}

/** Where a person lands after signing in: the first thing their role can open. */
export function homeFor(modules = []) {
  return visibleNav(modules)[0]?.to || '/staff';
}

export const PAYMENT_METHODS = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
];

export const methodLabel = (value) => PAYMENT_METHODS.find((m) => m.value === value)?.label || value;

export const PAYMENT_STATUS = {
  paid: { label: 'Paid', tone: 'success' },
  partial: { label: 'Part paid', tone: 'info' },
  unpaid: { label: 'Unpaid', tone: 'neutral' },
  overdue: { label: 'Overdue', tone: 'danger' },
  void: { label: 'Void', tone: 'muted' },
};

export const STOCK_STATE = {
  ok: { label: 'In stock', tone: 'success' },
  low: { label: 'Low', tone: 'warning' },
  out: { label: 'Out of stock', tone: 'danger' },
};

export const PO_STATUS = {
  draft: { label: 'Draft', tone: 'neutral' },
  ordered: { label: 'Ordered', tone: 'info' },
  received: { label: 'Received', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
};
