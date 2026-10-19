import React, { useState } from 'react';
import { bmsApi } from '../../api';
import { Button, Field, Modal } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { toastError, toastSuccess } from '../../utils/toast';
import { blankInvoice, blankLine, invoiceTotals, toInvoiceRequest, validateInvoice } from './invoiceForm';

/** A hand-typed invoice for walk-in, phone and project work that did not come through the shop. */
export default function InvoiceFormModal({ open, onClose, token, onCreated }) {
  const [form, setForm] = useState(blankInvoice);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const totals = invoiceTotals(form);

  const set = (name) => (event) => setForm((f) => ({ ...f, [name]: event.target.value }));
  const setLine = (index, name, value) =>
    setForm((f) => ({ ...f, lines: f.lines.map((l, i) => (i === index ? { ...l, [name]: value } : l)) }));

  const submit = async () => {
    const found = validateInvoice(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      const invoice = await bmsApi.createInvoice(toInvoiceRequest(form), { token });
      toastSuccess(`Invoice ${invoice.number} created`);
      setForm(blankInvoice());
      onCreated(invoice);
    } catch (error) {
      toastError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New invoice" size="lg" onSubmit={submit} submitLabel="Create invoice" submitting={saving}>
      <div className="bms-form">
        <Field label="Customer name" value={form.customerName} onChange={set('customerName')} error={errors.customerName} required />
        <Field label="Company" optional value={form.companyName} onChange={set('companyName')} />
        <Field label="Email" optional type="email" value={form.customerEmail} onChange={set('customerEmail')} error={errors.customerEmail}
          hint="Needed to email the invoice." />
        <Field label="Phone" optional value={form.customerPhone} onChange={set('customerPhone')} />
        <Field label="KRA PIN" optional value={form.kraPin} onChange={set('kraPin')} />
        <Field label="Due date" optional type="date" value={form.dueOn} onChange={set('dueOn')} hint="Defaults to 14 days." />
      </div>

      <table className="bms-lines" aria-label="Invoice lines">
        <thead><tr><th>Item</th><th style={{ width: '5rem' }}>Qty</th><th style={{ width: '8rem' }}>Unit price</th><th /></tr></thead>
        <tbody>
          {form.lines.map((line, i) => (
            <tr key={i}>
              <td><input aria-label={`Item ${i + 1}`} value={line.description} onChange={(e) => setLine(i, 'description', e.target.value)}
                aria-invalid={errors.lines?.[i]?.description ? true : undefined} /></td>
              <td><input aria-label={`Quantity ${i + 1}`} type="number" min="1" value={line.quantity} onChange={(e) => setLine(i, 'quantity', e.target.value)} /></td>
              <td><input aria-label={`Unit price ${i + 1}`} type="number" min="0" step="0.01" value={line.unitPrice}
                onChange={(e) => setLine(i, 'unitPrice', e.target.value)} aria-invalid={errors.lines?.[i]?.unitPrice ? true : undefined} /></td>
              <td>
                {form.lines.length > 1 && (
                  <Button size="sm" variant="outline" onClick={() => setForm((f) => ({ ...f, lines: f.lines.filter((_, n) => n !== i) }))}
                    aria-label={`Remove item ${i + 1}`}>×</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {errors.lines ? <p className="text-danger small">Complete every line: a description, a quantity and a price.</p> : null}
      <Button size="sm" variant="outline" onClick={() => setForm((f) => ({ ...f, lines: [...f.lines, blankLine()] }))}>Add a line</Button>

      <div className="bms-form mt-3">
        <Field label="Delivery fee" optional type="number" min="0" step="0.01" value={form.deliveryFee} onChange={set('deliveryFee')} />
        <label className="d-flex align-items-center gap-2 mt-4">
          <input type="checkbox" checked={form.includeVat} onChange={(e) => setForm((f) => ({ ...f, includeVat: e.target.checked }))} />
          Add VAT (16%)
        </label>
        <Field className="full" label="Notes" optional as="textarea" rows={2} value={form.notes} onChange={set('notes')} />
      </div>

      <div className="bms-totals" aria-live="polite">
        <div><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
        {totals.deliveryFee > 0 && <div><span>Delivery</span><span>{formatCurrency(totals.deliveryFee)}</span></div>}
        {form.includeVat && <div><span>VAT (16%)</span><span>{formatCurrency(totals.vatAmount)}</span></div>}
        <div className="grand"><span>Total</span><span>{formatCurrency(totals.totalAmount)}</span></div>
      </div>
      {saving ? <span className="visually-hidden">Saving</span> : null}
    </Modal>
  );
}
