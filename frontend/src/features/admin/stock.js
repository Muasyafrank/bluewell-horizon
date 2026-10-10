/**
 * Stock rules shared by the inventory panel and the overview alerts.
 * Pure functions, so the thresholds live in exactly one place.
 */

/** A product with this many units or fewer (but more than zero) is "low". */
export const LOW_STOCK_THRESHOLD = 5;

export const STOCK_ACTIONS = {
  add: { label: 'Add stock', verb: 'Add', hint: 'Units to add to the current stock.' },
  remove: { label: 'Remove stock', verb: 'Remove', hint: 'Units to take away from the current stock.' },
  set: { label: 'Set stock', verb: 'Set', hint: 'The new total number of units in stock.' },
};

const toUnits = (stock) => Number(stock) || 0;

/** Classifies a stock level as 'out', 'low' or 'in'. */
export function stockLevel(stock) {
  const units = toUnits(stock);
  if (units <= 0) return 'out';
  return units <= LOW_STOCK_THRESHOLD ? 'low' : 'in';
}

export const STOCK_LEVELS = {
  out: { label: 'Out of stock', tone: 'danger' },
  low: { label: 'Low stock', tone: 'warning' },
  in: { label: 'In stock', tone: 'success' },
};

/** Counts products at each level. */
export function summariseStock(products) {
  const summary = { total: products.length, in: 0, low: 0, out: 0 };
  products.forEach((product) => {
    summary[stockLevel(product.stock)] += 1;
  });
  return summary;
}

/**
 * The stock a product should have after an adjustment.
 * Returns `null` when `quantity` is not a whole number of at least zero.
 */
export function nextStock(current, action, quantity) {
  const units = Number(quantity);
  if (quantity === '' || !Number.isInteger(units) || units < 0) return null;

  const base = toUnits(current);
  if (action === 'add') return base + units;
  if (action === 'remove') return Math.max(0, base - units);
  return units;
}
