import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { bmsApi } from '../../../api';
import { AsyncSection, Button, Field, Modal } from '../../../components/ui';
import { useApiResource } from '../../../hooks';
import { formatCurrency, formatDate } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useStaff } from '../StaffContext';
import { PAYMENT_METHODS, PAYMENT_STATUS, methodLabel } from '../access';
import { BackLink, PageHead, StatusTone } from '../ui';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const { token, can } = useStaff();
  const { data: invoice, loading, error, reload, setData } = useApiResource(
    (o) => bmsApi.getInvoice(id, { ...o, token }), { deps: [id, token] });
  const [paying, setPaying] = useState(false);
  const [payment, setPayment] = useState({ amount: '', method: 'mpesa', reference: '', receivedOn: '', notes: '' });
  const [busy, setBusy] = useState('');

  const run = async (key, action, success) => {
    setBusy(key);
    try {
      const updated = await action();
      if (updated) setData(updated);
      if (success) toastSuccess(success);
      return true;
    } catch (err) {
      toastError(err.message);
      return false;
    } finally {
      setBusy('');
    }
  };

  const submitPayment = async () => {
    const ok = await run('pay', () => bmsApi.recordPayment(id, {
      amount: Number(payment.amount), method: payment.method,
      reference: payment.reference.trim() || null, receivedOn: payment.receivedOn || null, notes: payment.notes.trim() || null,
    }, { token }), 'Payment recorded');
    if (ok) {
      setPaying(false);
      setPayment({ amount: '', method: 'mpesa', reference: '', receivedOn: '', notes: '' });
    }
  };

  const inv = invoice;
  return (
    <>
      <BackLink to="/staff/invoices">All invoices</BackLink>
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        {inv ? (
          <>
            <PageHead title={inv.number} subtitle={`${inv.customerName}${inv.companyName ? ` · ${inv.companyName}` : ''}`}>
              <StatusTone map={PAYMENT_STATUS} value={inv.paymentStatus} />
              {inv.status !== 'void' && (
                <Button variant="outline" loading={busy === 'send'} disabled={!inv.customerEmail}
                  title={inv.customerEmail ? undefined : 'This invoice has no customer email'}
                  onClick={() => run('send', () => bmsApi.sendInvoice(id, { token }), 'Invoice emailed')}>
                  {inv.emailedAt ? 'Resend by email' : 'Email to customer'}
                </Button>
              )}
              {inv.status !== 'void' && can('payments') && inv.balance > 0 && <Button onClick={() => setPaying(true)}>Record payment</Button>}
              {inv.status !== 'void' && inv.payments.length === 0 && (
                <Button variant="danger" loading={busy === 'void'}
                  onClick={() => window.confirm('Void this invoice? It stays on record but no longer counts.') &&
                    run('void', () => bmsApi.voidInvoice(id, { token }), 'Invoice voided')}>Void</Button>
              )}
            </PageHead>

            <div className="bms-grid bms-grid--2">
              <section className="bms-panel">
                <h2>Details</h2>
                <dl className="bms-kv">
                  <dt>Issued</dt><dd>{formatDate(inv.issuedOn)}</dd>
                  <dt>Due</dt><dd>{formatDate(inv.dueOn)}</dd>
                  <dt>Email</dt><dd>{inv.customerEmail || '—'}</dd>
                  <dt>Phone</dt><dd>{inv.customerPhone || '—'}</dd>
                  <dt>KRA PIN</dt><dd>{inv.kraPin || '—'}</dd>
                  <dt>Emailed</dt><dd>{inv.emailedAt ? formatDate(inv.emailedAt) : 'Not yet'}</dd>
                  {inv.notes ? (<><dt>Notes</dt><dd>{inv.notes}</dd></>) : null}
                </dl>
              </section>
              <section className="bms-panel">
                <h2>Amounts</h2>
                <div className="bms-totals" style={{ marginLeft: 0 }}>
                  <div><span>Subtotal</span><span>{formatCurrency(inv.subtotal)}</span></div>
                  {inv.deliveryFee > 0 && <div><span>Delivery</span><span>{formatCurrency(inv.deliveryFee)}</span></div>}
                  {inv.includeVat && <div><span>VAT (16%)</span><span>{formatCurrency(inv.vatAmount)}</span></div>}
                  <div className="grand"><span>Total</span><span>{formatCurrency(inv.total)}</span></div>
                  <div><span>Paid</span><span>{formatCurrency(inv.paid)}</span></div>
                  <div className="grand"><span>Balance due</span><span>{formatCurrency(inv.balance)}</span></div>
                </div>
              </section>
            </div>

            <section className="bms-panel mt-3">
              <h2>Items</h2>
              <div className="bms-table-wrap" style={{ border: 0 }}>
                <table className="bms-table">
                  <thead><tr><th>Item</th><th className="num">Qty</th><th className="num">Unit price</th><th className="num">Amount</th></tr></thead>
                  <tbody>
                    {inv.lines.map((l, i) => (
                      <tr key={i}><td>{l.description}</td><td className="num">{l.quantity}</td>
                        <td className="num">{formatCurrency(l.unitPrice)}</td><td className="num">{formatCurrency(l.unitPrice * l.quantity)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bms-panel mt-3">
              <h2>Payments</h2>
              {inv.payments.length === 0 ? <p className="bms-sub mb-0">No payments recorded.</p> : (
                <div className="bms-table-wrap" style={{ border: 0 }}>
                  <table className="bms-table">
                    <thead><tr><th>Date</th><th>Method</th><th>Reference</th><th className="num">Amount</th><th>Recorded by</th><th /></tr></thead>
                    <tbody>
                      {inv.payments.map((p) => (
                        <tr key={p.id}>
                          <td>{formatDate(p.receivedOn)}</td><td>{methodLabel(p.method)}</td><td>{p.reference || '—'}</td>
                          <td className="num">{formatCurrency(p.amount)}</td><td className="bms-sub">{p.recordedBy}</td>
                          <td className="num">
                            {can('payments') && (
                              <button type="button" className="bms-link" onClick={() => window.confirm('Remove this payment?') &&
                                run(`rm${p.id}`, () => bmsApi.removePayment(id, p.id, { token }), 'Payment removed')}>Remove</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <Modal open={paying} onClose={() => setPaying(false)} title="Record payment" onSubmit={submitPayment}
              submitLabel="Record payment" submitting={busy === 'pay'}>
              <div className="bms-form">
                <Field label="Amount (KES)" type="number" min="0" step="0.01" value={payment.amount}
                  onChange={(e) => setPayment((p) => ({ ...p, amount: e.target.value }))} hint={`Balance due ${formatCurrency(inv.balance)}`} required />
                <Field label="Method" as="select" value={payment.method} options={PAYMENT_METHODS}
                  onChange={(e) => setPayment((p) => ({ ...p, method: e.target.value }))} />
                <Field label="Reference" optional={payment.method === 'cash'} value={payment.reference}
                  onChange={(e) => setPayment((p) => ({ ...p, reference: e.target.value }))} hint="M-Pesa code, bank slip or cheque number." />
                <Field label="Date received" optional type="date" value={payment.receivedOn}
                  onChange={(e) => setPayment((p) => ({ ...p, receivedOn: e.target.value }))} />
                <Field className="full" label="Notes" optional value={payment.notes}
                  onChange={(e) => setPayment((p) => ({ ...p, notes: e.target.value }))} />
              </div>
            </Modal>
          </>
        ) : null}
      </AsyncSection>
    </>
  );
}
