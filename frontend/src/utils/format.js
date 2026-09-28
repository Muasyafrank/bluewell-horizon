/**
 * Formatting helpers.
 * Currency was previously formatted ad hoc with `toLocaleString()` calls that
 * produced inconsistent output (sometimes with decimals, sometimes without, and
 * crashing on string prices coming back from the API).
 */

const KES = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Coerces API values (which may arrive as strings) to a finite number. */
export function toNumber(value, fallback = 0) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatCurrency(value) {
  return KES.format(toNumber(value));
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function pluralise(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

export function titleCase(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
