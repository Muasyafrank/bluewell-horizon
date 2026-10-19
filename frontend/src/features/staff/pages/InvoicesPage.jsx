import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bmsApi } from '../../../api';
import { AsyncSection, Button } from '../../../components/ui';
import { useApiResource } from '../../../hooks';
import { formatCurrency, formatDate } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';
import InvoiceFormModal from '../InvoiceFormModal';
import { useStaff } from '../StaffContext';
import { PAYMENT_STATUS } from '../access';
import { Empty, PageHead, StatusTone } from '../ui';

export default function InvoicesPage() {
  const { token } = useStaff();
  const navigate = useNavigate();
  const invoices = useApiResource((o) => bmsApi.listInvoices({ ...o, token }), { deps: [token], initialData: [] });
  const ready = useApiResource((o) => bmsApi.readyToInvoice({ ...o, token }), { deps: [token], initialData: [] });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (invoices.data || []).filter((i) =>
      (status === 'all' || i.paymentStatus === status) &&
      (!q || [i.number, i.customerName, i.companyName, i.customerEmail].some((v) => (v || '').toLowerCase().includes(q))));
  }, [invoices.data, query, status]);

  const invoiceOrder = async (orderId) => {
    setBusy(orderId);
    try {
      const invoice = await bmsApi.invoiceFromOrder(orderId, {}, { token });
      toastSuccess(`Invoice ${invoice.number} created`);
      navigate(`/staff/invoices/${invoice.id}`);
    } catch (error) {
      toastError(error.message);
      setBusy(null);
    }
  };

  return (
    <>
      <PageHead title="Invoices" subtitle="Bill customers and follow what is still owed.">
        <Button onClick={() => setCreating(true)}>New invoice</Button>
      </PageHead>

      {ready.data?.length > 0 && (
        <section className="bms-panel mb-3" aria-label="Ready to invoice">
          <h2>Quoted orders ready to invoice ({ready.data.length})</h2>
          <div className="bms-table-wrap" style={{ border: 0 }}>
            <table className="bms-table">
              <tbody>
                {ready.data.map((o) => (
                  <tr key={o.orderId}>
                    <td><strong>{o.orderNumber}</strong><div className="bms-sub">{o.customerName}{o.companyName ? ` · ${o.companyName}` : ''}</div></td>
                    <td className="bms-sub">{o.quoteNumber}</td>
                    <td className="num">{formatCurrency(o.total)}</td>
                    <td className="num"><Button size="sm" loading={busy === o.orderId} onClick={() => invoiceOrder(o.orderId)}>Create invoice</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="bms-toolbar">
        <input type="search" placeholder="Search invoices" aria-label="Search invoices" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {Object.entries(PAYMENT_STATUS).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <AsyncSection loading={invoices.loading} error={invoices.error} onRetry={invoices.reload}>
        {rows.length === 0 ? (
          <Empty>{invoices.data?.length ? 'No invoices match.' : 'No invoices yet. Create one above, or from a quoted order.'}</Empty>
        ) : (
          <div className="bms-table-wrap">
            <table className="bms-table">
              <thead><tr><th>Invoice</th><th>Customer</th><th>Issued</th><th>Due</th><th className="num">Total</th><th className="num">Balance</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((i) => (
                  <tr key={i.id} className="is-click" onClick={() => navigate(`/staff/invoices/${i.id}`)}>
                    <td><button type="button" className="bms-link" onClick={(e) => { e.stopPropagation(); navigate(`/staff/invoices/${i.id}`); }}>{i.number}</button></td>
                    <td>{i.customerName}{i.companyName ? <div className="bms-sub">{i.companyName}</div> : null}</td>
                    <td>{formatDate(i.issuedOn)}</td>
                    <td>{formatDate(i.dueOn)}</td>
                    <td className="num">{formatCurrency(i.total)}</td>
                    <td className="num">{formatCurrency(i.balance)}</td>
                    <td><StatusTone map={PAYMENT_STATUS} value={i.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AsyncSection>

      <InvoiceFormModal open={creating} onClose={() => setCreating(false)} token={token}
        onCreated={(invoice) => { setCreating(false); navigate(`/staff/invoices/${invoice.id}`); }} />
    </>
  );
}
