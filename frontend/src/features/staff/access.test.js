import { homeFor, visibleNav, methodLabel } from './access';

test('a role sees only the sections its modules unlock', () => {
  const nav = visibleNav(['dashboard', 'stock', 'suppliers', 'purchasing']).map((n) => n.label);
  expect(nav).toEqual(['Dashboard', 'Stock', 'Suppliers', 'Purchasing']);
});

test('nobody is shown Team unless they have the staff module', () => {
  expect(visibleNav(['dashboard', 'invoices']).some((n) => n.label === 'Team')).toBe(false);
  expect(visibleNav(['dashboard', 'staff']).some((n) => n.label === 'Team')).toBe(true);
});

test('landing page is the first section available', () => {
  expect(homeFor(['dashboard', 'invoices'])).toBe('/staff');
  expect(homeFor([])).toBe('/staff');
});

test('payment methods have readable labels', () => {
  expect(methodLabel('mpesa')).toBe('M-Pesa');
  expect(methodLabel('unknown')).toBe('unknown');
});
