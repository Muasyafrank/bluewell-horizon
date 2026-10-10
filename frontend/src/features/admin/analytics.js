/** Derives chart data from the orders list. */

const toTotal = (order) => Number(order.totalAmount) || 0;

/**
 * Orders and order value per day for the last `days` days, oldest first.
 * Orders are bucketed once up front instead of re-filtering the whole list
 * for every day.
 */
export function ordersOverTime(orders, days = 30, now = new Date()) {
  const buckets = new Map();
  orders.forEach((order) => {
    if (!order.createdAt) return;
    const key = new Date(order.createdAt).toDateString();
    const bucket = buckets.get(key) || { orders: 0, value: 0 };
    bucket.orders += 1;
    bucket.value += toTotal(order);
    buckets.set(key, bucket);
  });

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - index));
    const bucket = buckets.get(date.toDateString()) || { orders: 0, value: 0 };
    return {
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      ...bucket,
    };
  });
}

/** `[{ name: 'shipped', value: 3 }, ...]` for the status pie chart. */
export function ordersByStatus(orders) {
  const counts = orders.reduce((result, order) => {
    const status = order.orderStatus || 'processing';
    result[status] = (result[status] || 0) + 1;
    return result;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/** Orders that still need someone to act on them. */
export const needsAttention = (order) =>
  order.orderStatus === 'processing' || order.orderStatus === 'confirmed';
