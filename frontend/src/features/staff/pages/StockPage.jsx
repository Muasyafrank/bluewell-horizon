import React, { useMemo, useState } from 'react';
import { bmsApi } from '../../../api';
import { AsyncSection, Button, Field, Modal, TablePager } from '../../../components/ui';
import { useApiResource, usePagedRows } from '../../../hooks';
import { formatDate } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useStaff } from '../StaffContext';
import { STOCK_STATE } from '../access';
import { Empty, PageHead, StatusTone } from '../ui';

const REASONS = [
  { value: 'adjustment', label: 'Stock count correction' },
  { value: 'damage', label: 'Damaged or lost' },
  { value: 'return', label: 'Customer return' },
];

function History({ product, token, onClose }) {
  const { data, loading, error, reload } = useApiResource((o) => bmsApi.stockMovements(product.id, { ...o, token }), { deps: [product.id] });
  return (
    <Modal open onClose={onClose} title={`${product.name}: stock history`} size="lg" footer={<Button variant="outline" onClick={onClose}>Close</Button>}>
      <AsyncSection loading={loading} error={error} onRetry={reload} isEmpty={!data?.length} empty={<Empty>No movements yet.</Empty>}>
        <div className="bms-table-wrap" style={{ border: 0 }}>
          <table className="bms-table">
            <thead><tr><th>When</th><th>Reason</th><th>Reference</th><th className="num">Change</th><th className="num">Balance</th><th>By</th></tr></thead>
            <tbody>
              {(data || []).map((m) => (
                <tr key={m.id}><td>{formatDate(m.at)}</td><td>{m.reason}{m.note ? <div className="bms-sub">{m.note}</div> : null}</td>
                  <td>{m.reference || '—'}</td><td className="num">{m.change > 0 ? `+${m.change}` : m.change}</td>
                  <td className="num">{m.balanceAfter}</td><td className="bms-sub">{m.by}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncSection>
    </Modal>
  );
}

export default function StockPage() {
  const { token } = useStaff();
  const { data, loading, error, reload, setData } = useApiResource((o) => bmsApi.listStock({ ...o, token }), { deps: [token], initialData: [] });
  const [query, setQuery] = useState('');
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [adjusting, setAdjusting] = useState(null);
  const [form, setForm] = useState({ change: '', reason: 'adjustment', note: '' });
  const [reorder, setReorder] = useState('');
  const [history, setHistory] = useState(null);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || []).filter((p) => (!onlyFlagged || p.state !== 'ok') && (!q || `${p.name} ${p.category}`.toLowerCase().includes(q)));
  }, [data, query, onlyFlagged]);
  const pager = usePagedRows(rows, { resetKey: `${query}|${onlyFlagged}` });

  const replace = (product) => setData((list) => list.map((p) => (p.id === product.id ? product : p)));

  const open = (product) => {
    setAdjusting(product);
    setForm({ change: '', reason: 'adjustment', note: '' });
    setReorder(product.reorderLevel ?? '');
  };

  const save = async () => {
    setSaving(true);
    try {
      let product = adjusting;
      const change = parseInt(form.change, 10);
      if (form.change !== '' && change) {
        product = await bmsApi.adjustStock(product.id, { change, reason: form.reason, note: form.note.trim() || null }, { token });
      }
      const level = reorder === '' ? null : parseInt(reorder, 10);
      if (level !== (product.reorderLevel ?? null)) product = await bmsApi.setReorderLevel(product.id, level, { token });
      replace(product);
      toastSuccess('Stock updated');
      setAdjusting(null);
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHead title="Stock" subtitle="Every change is logged with who made it and why. Counts are never typed over." />
      <div className="bms-toolbar">
        <input type="search" placeholder="Search products" aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="d-flex align-items-center gap-2 small"><input type="checkbox" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} /> Low or out only</label>
      </div>
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        {rows.length === 0 ? <Empty>No products match.</Empty> : (
          <div className="bms-table-wrap">
            <table className="bms-table">
              <thead><tr><th>Product</th><th className="num">In stock</th><th className="num">Reorder at</th><th>Status</th><th /></tr></thead>
              <tbody>
                {pager.visible.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}<div className="bms-sub">{p.category}</div></td>
                    <td className="num">{p.stock}</td><td className="num">{p.reorderLevel ?? '—'}</td>
                    <td><StatusTone map={STOCK_STATE} value={p.state} /></td>
                    <td className="num">
                      <Button size="sm" variant="outline" onClick={() => open(p)}>Adjust</Button>{' '}
                      <Button size="sm" variant="outline" onClick={() => setHistory(p)}>History</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePager pager={pager} />
          </div>
        )}
      </AsyncSection>

      <Modal open={Boolean(adjusting)} onClose={() => setAdjusting(null)} title={adjusting ? `Adjust ${adjusting.name}` : ''} onSubmit={save} submitting={saving}>
        {adjusting ? (
          <div className="bms-form">
            <Field className="full" label="Change (units)" type="number" value={form.change} optional
              onChange={(e) => setForm((f) => ({ ...f, change: e.target.value }))}
              hint={`Now ${adjusting.stock}. Use a minus to remove, for example -2.`} />
            <Field label="Reason" as="select" options={REASONS} value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
            <Field label="Reorder level" type="number" min="0" optional value={reorder} onChange={(e) => setReorder(e.target.value)} hint="Warn when stock falls to this." />
            <Field className="full" label="Note" optional value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              hint="Required for a stock count correction." />
          </div>
        ) : null}
      </Modal>
      {history ? <History product={history} token={token} onClose={() => setHistory(null)} /> : null}
    </>
  );
}
