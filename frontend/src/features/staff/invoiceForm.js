import { computeTotals } from '../admin/quotation';

/** Pure helpers behind the manual-invoice form. The server recomputes every figure. */

export const blankLine = () => ({ description: '', quantity: '1', unitPrice: '' });

export const blankInvoice = () => ({
  customerName: '', customerEmail: '', customerPhone: '', companyName: '', kraPin: '',
  lines: [blankLine()], deliveryFee: '', includeVat: true, dueOn: '', notes: '',
});

export function validateInvoice(form) {
  const errors = {};
  if (!form.customerName.trim()) errors.customerName = 'Enter the customer name.';
  if (form.customerEmail && !/^\S+@\S+\.\S+$/.test(form.customerEmail.trim())) errors.customerEmail = 'Enter a valid email address.';
  const lines = form.lines.map((line) => {
    const problems = {};
    if (!line.description.trim()) problems.description = 'Describe the item.';
    if (!(parseInt(line.quantity, 10) >= 1)) problems.quantity = 'At least 1.';
    if (!(Number(line.unitPrice) >= 0) || line.unitPrice === '') problems.unitPrice = 'Enter a price.';
    return problems;
  });
  if (lines.some((p) => Object.keys(p).length)) errors.lines = lines;
  return errors;
}

export function toInvoiceRequest(form) {
  const optional = (value) => (value && value.trim() ? value.trim() : null);
  return {
    customerName: form.customerName.trim(),
    customerEmail: optional(form.customerEmail),
    customerPhone: optional(form.customerPhone),
    companyName: optional(form.companyName),
    kraPin: optional(form.kraPin),
    lines: form.lines.map((line) => ({
      description: line.description.trim(),
      quantity: parseInt(line.quantity, 10),
      unitPrice: Number(line.unitPrice),
    })),
    deliveryFee: Number(form.deliveryFee) || 0,
    includeVat: form.includeVat,
    dueOn: form.dueOn || null,
    notes: optional(form.notes),
  };
}

export const invoiceTotals = (form) => computeTotals(form.lines, form.deliveryFee, form.includeVat);
