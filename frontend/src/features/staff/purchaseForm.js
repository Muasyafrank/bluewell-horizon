/** Pure helpers behind the purchase-order form. The server recomputes costs. */

export function validatePo(form) {
  if (!form.supplierId) return 'Choose a supplier.';
  if (form.lines.some((l) => !l.productId || !(parseInt(l.quantity, 10) >= 1) || l.unitCost === '' || Number(l.unitCost) < 0)) {
    return 'Every line needs a product, a quantity and a unit cost.';
  }
  return null;
}

export function toPoRequest(form) {
  return {
    supplierId: Number(form.supplierId), expectedOn: form.expectedOn || null, notes: form.notes.trim() || null,
    lines: form.lines.map((l) => ({ productId: Number(l.productId), quantity: parseInt(l.quantity, 10), unitCost: Number(l.unitCost) })),
  };
}
