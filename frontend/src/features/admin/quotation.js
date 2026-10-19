import { VAT_RATE } from '../../utils/kenyanData';

/** Pure helpers behind the quotation form, kept apart so they can be tested. */

const toCents = (value) => Math.round((Number(value) || 0) * 100);

/**
 * Subtotal, VAT and total for the form's lines. The server recomputes these
 * from the same inputs when it saves or sends; this is only the live preview.
 * VAT covers goods and delivery together, as the shop's checkout does.
 */
export function computeTotals(lines, deliveryFee, includeVat) {
  const subtotal = lines.reduce(
    (sum, line) => sum + toCents(line.unitPrice) * (parseInt(line.quantity, 10) || 0),
    0,
  );
  const delivery = toCents(deliveryFee);
  const vat = includeVat ? Math.round((subtotal + delivery) * VAT_RATE) : 0;
  return {
    subtotal: subtotal / 100,
    deliveryFee: delivery / 100,
    vatAmount: vat / 100,
    totalAmount: (subtotal + delivery + vat) / 100,
  };
}

/** `YYYY-MM-DD`, `days` after `from`, in the viewer's own calendar. */
export function defaultValidUntil(days = 14, from = new Date()) {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const blankLine = () => ({ description: '', quantity: '1', unitPrice: '' });

/**
 * Starting values for the form: the saved quotation if there is one, otherwise
 * one line per product ordered with the price left for the admin to fill in.
 */
export function initialForm(data, today = new Date()) {
  const available = (data.paymentMethods || []).map((method) => method.key);
  const saved = data.quotation;

  if (saved) {
    return {
      lines: saved.lines.map((line) => ({
        description: line.description,
        quantity: String(line.quantity),
        unitPrice: String(line.unitPrice),
      })),
      deliveryFee: saved.deliveryFee ? String(saved.deliveryFee) : '',
      includeVat: saved.includeVat,
      validUntil: saved.validUntil,
      paymentMethods: saved.paymentMethods.filter((key) => available.includes(key)),
      notes: saved.notes || '',
    };
  }

  const lines = (data.suggestedLines || []).map((line) => ({
    description: line.description,
    quantity: String(line.quantity),
    unitPrice: line.unitPrice ? String(line.unitPrice) : '',
  }));
  return {
    lines: lines.length ? lines : [blankLine()],
    deliveryFee: data.deliveryFee ? String(data.deliveryFee) : '',
    includeVat: true,
    validUntil: defaultValidUntil(14, today),
    paymentMethods: available,
    notes: '',
  };
}

export { blankLine };

/** The first problem with the form, as a sentence, or `null` when it can be sent. */
export function validateForm(form, today = new Date()) {
  if (form.lines.length === 0) return 'Add at least one item.';
  for (const [index, line] of form.lines.entries()) {
    const row = index + 1;
    if (!line.description.trim()) return `Item ${row} needs a description.`;
    if (!(parseInt(line.quantity, 10) >= 1)) return `Item ${row} needs a quantity of 1 or more.`;
    if (!(Number(line.unitPrice) > 0)) return `Item ${row} needs a unit price.`;
  }
  if (form.deliveryFee !== '' && !(Number(form.deliveryFee) >= 0)) return 'Delivery must be 0 or more.';
  if (!form.validUntil) return 'Choose a valid-until date.';
  if (form.validUntil < defaultValidUntil(0, today)) return 'The valid-until date is in the past.';
  if (form.paymentMethods.length === 0) return 'Choose at least one payment method.';
  return null;
}

/** The request body the API expects. */
export function toRequest(form) {
  return {
    lines: form.lines.map((line) => ({
      description: line.description.trim(),
      quantity: parseInt(line.quantity, 10),
      unitPrice: Number(line.unitPrice),
    })),
    deliveryFee: Number(form.deliveryFee) || 0,
    includeVat: form.includeVat,
    validUntil: form.validUntil,
    paymentMethods: form.paymentMethods,
    notes: form.notes.trim() || null,
  };
}
