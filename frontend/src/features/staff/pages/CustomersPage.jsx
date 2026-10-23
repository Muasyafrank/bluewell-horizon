import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { bmsApi } from '../../../api';
import { AsyncSection, Button, Field, Modal, TablePager } from '../../../components/ui';
import { useApiResource, useDebouncedValue, usePagedResource } from '../../../hooks';
import { formatCurrency, formatDate } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useStaff } from '../StaffContext';
import { PAYMENT_STATUS } from '../access';
import { Empty, PageHead, StatusTone } from '../ui';

function CustomerDetail({ email, token, can, onClose }) {
  const { data, loading, error, reload } = useApiResource((o) => bmsApi.getCustomer(email, { ...o, token }), { deps: [email, token] });
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const addNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await bmsApi.addNote(email, note.trim(), { token });
      setNote('');
      toastSuccess('Note added');
      reload();
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const removeNote = async (id) => {
    try { await bmsApi.deleteNote(id, { token }); reload(); } catch (err) { toastError(err.message); }
  };

  return (
    <Modal open onClose={onClose} title={data?.name || 'Customer'} size="lg" footer={<Button variant="outline" onClick={onClose}>Close</Button>}>
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        {data ? (
          <>
            <dl className="bms-kv mb-3">
              <dt>Email</dt><dd>{data.email}</dd>
              <dt>Phone</dt><dd>{data.phone || '—'}</dd>
              <dt>Company</dt><dd>{data.company || '—'}</dd>
              <dt>KRA PIN</dt><dd>{data.kraPin || '—'}</dd>
              <dt>Website account</dt><dd>{data.hasAccount ? 'Yes' : 'Guest'}</dd>
            </dl>

            <h3 className="h6">Orders ({data.orders.length})</h3>
            {data.orders.length === 0 ? <p className="bms-sub">None.</p> : (
              <ul className="list-unstyled small">
                {data.orders.map((o) => <li key={o.id}>{o.orderNumber} · {o.status} · {formatDate(o.createdAt)}</li>)}
              </ul>
            )}

            {can('invoices') && (
              <>
                <h3 className="h6">Invoices ({data.invoices.length})</h3>
                {data.invoices.length === 0 ? <p className="bms-sub">None.</p> : (
                  <ul className="list-unstyled small">
                    {data.invoices.map((i) => (
                      <li key={i.id} className="d-flex gap-2 align-items-center flex-wrap">
                        <Link className="bms-link" to={`/staff/invoices/${i.id}`}>{i.number}</Link>
                        <span>{formatCurrency(i.total)}</span><StatusTone map={PAYMENT_STATUS} value={i.paymentStatus} />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            <h3 className="h6 mt-3">Notes</h3>
            {data.notes.map((n) => (
              <div key={n.id} className="bms-note">
                {n.body}
                <div className="bms-sub">{n.author} · {formatDate(n.createdAt)} ·{' '}
                  <button type="button" className="bms-link" onClick={() => removeNote(n.id)}>Delete</button></div>
              </div>
            ))}
            <Field label="Add a note" as="textarea" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
              hint="Follow-ups, preferences, anything the next person should know." />
            <Button size="sm" loading={saving} onClick={addNote} disabled={!note.trim()}>Save note</Button>
          </>
        ) : null}
      </AsyncSection>
    </Modal>
  );
}

export default function CustomersPage() {
  const { token, can } = useStaff();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  const search = useDebouncedValue(query.trim(), 300);
  const { rows, pager, loading, error, reload } = usePagedResource(
    (params, o) => bmsApi.listCustomers(params, { ...o, token }),
    { filters: { q: search }, deps: [token] },
  );

  return (
    <>
      <PageHead title="Customers" subtitle="Everyone who has ordered, been invoiced or registered, one row per email." />
      <div className="bms-toolbar">
        <input type="search" placeholder="Search customers" aria-label="Search customers" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        {rows.length === 0 ? <Empty>{search ? 'No customers match.' : 'No customers yet.'}</Empty> : (
          <div className="bms-table-wrap">
            <table className="bms-table">
              <thead><tr><th>Customer</th><th>Phone</th><th className="num">Orders</th>{can('invoices') && <><th className="num">Billed</th><th className="num">Owing</th></>}<th>Last order</th></tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.email} className="is-click" onClick={() => setOpen(c.email)}>
                    <td><button type="button" className="bms-link" onClick={(e) => { e.stopPropagation(); setOpen(c.email); }}>{c.name}</button>
                      <div className="bms-sub">{c.company ? `${c.company} · ` : ''}{c.email}</div></td>
                    <td>{c.phone || '—'}</td><td className="num">{c.orders}</td>
                    {can('invoices') && <><td className="num">{formatCurrency(c.billed)}</td><td className="num">{c.outstanding > 0 ? formatCurrency(c.outstanding) : '—'}</td></>}
                    <td>{c.lastOrderAt ? formatDate(c.lastOrderAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePager pager={pager} />
          </div>
        )}
      </AsyncSection>
      {open ? <CustomerDetail email={open} token={token} can={can} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
