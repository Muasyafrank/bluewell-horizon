/** Pure helpers behind the account page, kept separate so they can be tested. */

/** The happy path an order moves along, in order. */
export const PROGRESS_STEPS = [
  { key: 'processing', label: 'Received' },
  { key: 'quoted', label: 'Quotation sent' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'On the way' },
  { key: 'delivered', label: 'Delivered' },
];

const normalise = (status) => (status || 'processing').toLowerCase();
const IN_PROGRESS = new Set(['processing', 'quoted', 'confirmed', 'shipped']);

/** Counts for the stat tiles. Cancelled orders count towards the total only. */
export function summariseOrders(orders) {
  return orders.reduce(
    (summary, order) => {
      const status = normalise(order.orderStatus);
      summary.total += 1;
      if (IN_PROGRESS.has(status)) summary.inProgress += 1;
      if (status === 'delivered') summary.delivered += 1;
      return summary;
    },
    { total: 0, inProgress: 0, delivered: 0 },
  );
}

/**
 * Index into PROGRESS_STEPS for an order's status, or -1 when the order is
 * not on the path (cancelled, or a status this page does not know about).
 */
export function progressIndex(status) {
  return PROGRESS_STEPS.findIndex((step) => step.key === normalise(status));
}

/** "Francis Muasya" -> "FM"; "Francis" -> "F"; nothing -> "?". */
export function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const letters = parts.length === 1 ? [parts[0]] : [parts[0], parts[parts.length - 1]];
  return letters.map((part) => part[0].toUpperCase()).join('');
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** The first word of a full name, for a friendlier greeting. */
export const firstName = (name) => (name || '').trim().split(/\s+/)[0] || '';
