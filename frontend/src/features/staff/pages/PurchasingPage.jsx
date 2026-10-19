import React, { useState } from 'react';
import { bmsApi } from '../../../api';
import { AsyncSection, Button, Field, Modal } from '../../../components/ui';
import { useApiResource } from '../../../hooks';
import { formatCurrency, formatDate } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useStaff } from '../StaffContext';
import { PO_STATUS } from '../access';
import { toPoRequest, validatePo } from '../purchaseForm';
import { Empty, PageHead, StatusTone } from '../ui';

const blank = () => ({ supplierId: '', expectedOn: '', notes: '', lines: [{ productId: '', quantity: '1', unitCost: '' }] });

export default function PurchasingPage() {
  const { token } = useStaff();
  const pos = useApiResource((o) => bmsApi.listPurchaseOrders({ ...o, token }), { deps: [token], initialData: [] });
  const suppliers = useApiResource((o) => bmsApi.listSuppliers({ ...o, token }), { deps: [token], initialData: [] });
  const stock = useApiResource((o) => bmsApi.listStock({ ...o, token }), { deps: [token], initialData: [] });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState('');

  const open = (po) => {
    setEditing(po || {});
    setForm(po ? {
      supplierId: String(po.supplierId), expectedOn: po.expectedOn || '', notes: po.notes || '',
      lines: po.lines.map((l) => ({ productId: String(l.productId), quantity: String(l.quantity), unitCost: String(l.unitCost) })),
    } : blank());
  };
  const setLine = (i, name, value) => setForm((f) => ({ ...f, lines: f.lines.map((l, n) => (n === i ? { ...l, [name]: value } : l)) }));
  const total = form.lines.reduce((sum, l) => sum + (parseInt(l.quantity, 10) || 0) * (Number(l.unitCost) || 0), 0);

  const save = async () => {
    const problem = validatePo(form);
    if (problem) return toastError(problem);
    setSaving(true);
    try {
      if (editing.id) await bmsApi.updatePurchaseOrder(editing.id, toPoRequest(form), { token });
      else await bmsApi.createPurchaseOrder(toPoRequest(form), { token });
      toastSuccess('Purchase order saved');
      setEditing(null);
      pos.reload();
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const act = async (po, action, message, confirm) => {
    if (confirm && !window.confirm(confirm)) return;
    setBusy(`${po.id}${action}`);
    try {
      await bmsApi.purchaseOrderAction(po.id, action, { token });
      toastSuccess(message);
      pos.reload();
      if (action === 'receive') stock.reload();
    } catch (err) {
      toastError(err.message);
    } finally {
      setBusy('');
    }
  };

  const activeSuppliers = (suppliers.data || []).filter((s) => s.isActive);

  return (
    <>
      <PageHead title="Purchasing" subtitle="Order from suppliers. Receiving an order adds it to stock.">
        <Button onClick={() => open(null)} disabled={activeSuppliers.length === 0}
          title={activeSuppliers.length === 0 ? 'Add a supplier first' : undefined}>New purchase order</Button>
      </PageHead>
      <AsyncSection loading={pos.loading} error={pos.error} onRetry={pos.reload}>
        {pos.data.length === 0 ? <Empty>No purchase orders yet.</Empty> : (
          <div className="bms-table-wrap">
            <table className="bms-table">
              <thead><tr><th>Order</th><th>Supplier</th><th>Expected</th><th className="num">Cost</th><th>Status</th><th /></tr></thead>
              <tbody>
                {pos.data.map((po) => (
                  <tr key={po.id}>
                    <td><strong>{po.number}</strong><div className="bms-sub">{po.lines.map((l) => `${l.quantity} × ${l.description}`).join(', ')}</div></td>
                    <td>{po.supplierName}</td><td>{po.expectedOn ? formatDate(po.expectedOn) : '—'}</td>
                    <td className="num">{formatCurrency(po.totalCost)}</td>
                    <td><StatusTone map={PO_STATUS} value={po.status} /></td>
                    <td className="num">
                      {po.status === 'draft' && <><Button size="sm" variant="outline" onClick={() => open(po)}>Edit</Button>{' '}
                        <Button size="sm" loading={busy === `${po.id}place`} onClick={() => act(po, 'place', 'Marked as ordered')}>Place order</Button>{' '}</>}
                      {po.status === 'ordered' && <><Button size="sm" loading={busy === `${po.id}receive`}
                        onClick={() => act(po, 'receive', 'Received into stock', 'Book the whole order into stock?')}>Receive</Button>{' '}</>}
                      {(po.status === 'draft' || po.status === 'ordered') && <Button size="sm" variant="outline"
                        onClick={() => act(po, 'cancel', 'Cancelled', 'Cancel this purchase order?')}>Cancel</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AsyncSection>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${editing.number}` : 'New purchase order'} size="lg" onSubmit={save} submitting={saving}>
        <div className="bms-form">
          <Field label="Supplier" as="select" value={form.supplierId} onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
            options={[{ value: '', label: 'Choose a supplier' }, ...activeSuppliers.map((s) => ({ value: String(s.id), label: s.name }))]} required />
          <Field label="Expected on" optional type="date" value={form.expectedOn} onChange={(e) => setForm((f) => ({ ...f, expectedOn: e.target.value }))} />
        </div>
        <table className="bms-lines" aria-label="Purchase lines">
          <thead><tr><th>Product</th><th style={{ width: '5rem' }}>Qty</th><th style={{ width: '8rem' }}>Unit cost</th><th /></tr></thead>
          <tbody>
            {form.lines.map((l, i) => (
              <tr key={i}>
                <td><select aria-label={`Product ${i + 1}`} className="bw-field__control" value={l.productId} onChange={(e) => setLine(i, 'productId', e.target.value)}>
                  <option value="">Choose a product</option>
                  {stock.data.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select></td>
                <td><input aria-label={`Quantity ${i + 1}`} type="number" min="1" value={l.quantity} onChange={(e) => setLine(i, 'quantity', e.target.value)} /></td>
                <td><input aria-label={`Unit cost ${i + 1}`} type="number" min="0" step="0.01" value={l.unitCost} onChange={(e) => setLine(i, 'unitCost', e.target.value)} /></td>
                <td>{form.lines.length > 1 && <Button size="sm" variant="outline" aria-label={`Remove line ${i + 1}`}
                  onClick={() => setForm((f) => ({ ...f, lines: f.lines.filter((_, n) => n !== i) }))}>×</Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button size="sm" variant="outline" onClick={() => setForm((f) => ({ ...f, lines: [...f.lines, { productId: '', quantity: '1', unitCost: '' }] }))}>Add a line</Button>
        <Field className="mt-3" label="Notes" optional as="textarea" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        <div className="bms-totals"><div className="grand"><span>Total cost</span><span>{formatCurrency(total)}</span></div></div>
      </Modal>
    </>
  );
}
