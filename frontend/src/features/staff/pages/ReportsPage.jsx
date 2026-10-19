import React, { useState } from 'react';
import { FaCoins, FaFileInvoiceDollar, FaHandHoldingUsd, FaPercent } from 'react-icons/fa';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { bmsApi, downloadFile } from '../../../api';
import { AsyncSection, Button } from '../../../components/ui';
import { useApiResource } from '../../../hooks';
import { formatCurrency } from '../../../utils/format';
import { toastError } from '../../../utils/toast';
import { useStaff } from '../StaffContext';
import { methodLabel } from '../access';
import { Empty, PageHead, Stat } from '../ui';

const AGEING = [['notDue', 'Not yet due'], ['1-30', '1–30 days late'], ['31-60', '31–60 days late'], ['61+', 'Over 60 days late']];
const shortMonth = (m) => new Date(`${m}-01T00:00:00`).toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
const thousands = (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v);

export default function ReportsPage() {
  const { token } = useStaff();
  const year = new Date().getFullYear();
  const [range, setRange] = useState({ start: `${year}-01-01`, end: new Date().toISOString().slice(0, 10) });
  const { data, loading, error, reload } = useApiResource((o) => bmsApi.summary(range, { ...o, token }), { deps: [token, range.start, range.end] });
  const [exporting, setExporting] = useState(false);

  const exportCsv = async () => {
    setExporting(true);
    try {
      await downloadFile(bmsApi.invoicesCsvPath(range), { token, filename: `invoices-${range.start}-to-${range.end}.csv` });
    } catch (err) {
      toastError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const months = (data?.months || []).map((m) => ({ ...m, label: shortMonth(m.month) }));
  const owedTotal = data ? Object.values(data.ageing).reduce((a, b) => a + b, 0) : 0;

  return (
    <>
      <PageHead title="Reports" subtitle="Sales and money owed for the period you choose.">
        <Button variant="outline" loading={exporting} onClick={exportCsv}>Export invoices (CSV)</Button>
      </PageHead>
      <div className="bms-toolbar">
        <label className="small">From <input type="date" value={range.start} max={range.end} onChange={(e) => e.target.value && setRange((r) => ({ ...r, start: e.target.value }))} /></label>
        <label className="small">To <input type="date" value={range.end} min={range.start} onChange={(e) => e.target.value && setRange((r) => ({ ...r, end: e.target.value }))} /></label>
      </div>
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        {data ? (
          <>
            <div className="bms-grid bms-grid--stats">
              <Stat icon={<FaFileInvoiceDollar />} label={`Invoiced (${data.invoiceCount})`} value={formatCurrency(data.invoiced)} />
              <Stat icon={<FaHandHoldingUsd />} label="Collected" value={formatCurrency(data.collected)} />
              <Stat icon={<FaPercent />} label="VAT on invoices" value={formatCurrency(data.vat)} />
              <Stat icon={<FaCoins />} label="Owed to us now" value={formatCurrency(data.outstanding)} />
            </div>

            <section className="bms-panel mb-3">
              <h2>Invoiced and collected by month</h2>
              {months.length === 0 ? <Empty>No activity in this period.</Empty> : (
                <div style={{ width: '100%', height: 280 }} role="img" aria-label="Bar chart of invoiced and collected amounts by month">
                  <ResponsiveContainer>
                    <BarChart data={months} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" tickLine={false} />
                      <YAxis tickFormatter={thousands} tickLine={false} axisLine={false} width={44} />
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                      <Legend />
                      <Bar dataKey="invoiced" name="Invoiced" fill="#0b2540" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="collected" name="Collected" fill="#2fa5b6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <div className="bms-grid bms-grid--2">
              <section className="bms-panel">
                <h2>Who owes what, by how late</h2>
                {AGEING.map(([key, label]) => (
                  <div key={key} className="mb-2">
                    <div className="d-flex justify-content-between small"><span>{label}</span><strong>{formatCurrency(data.ageing[key])}</strong></div>
                    <div className="bms-bar" aria-hidden="true"><i style={{ width: `${owedTotal ? (data.ageing[key] / owedTotal) * 100 : 0}%` }} /></div>
                  </div>
                ))}
              </section>
              <section className="bms-panel">
                <h2>How customers paid</h2>
                {data.paymentMethods.length === 0 ? <p className="bms-sub mb-0">No payments in this period.</p> : (
                  <table className="bms-table"><tbody>
                    {data.paymentMethods.map((m) => <tr key={m.method}><td>{methodLabel(m.method)}</td><td className="num">{formatCurrency(m.amount)}</td></tr>)}
                  </tbody></table>
                )}
              </section>
              <section className="bms-panel">
                <h2>Top customers</h2>
                {data.topCustomers.length === 0 ? <p className="bms-sub mb-0">No invoices in this period.</p> : (
                  <table className="bms-table"><tbody>
                    {data.topCustomers.map((c) => <tr key={c.name}><td>{c.name}<div className="bms-sub">{c.invoices} invoice{c.invoices === 1 ? '' : 's'}</div></td><td className="num">{formatCurrency(c.invoiced)}</td></tr>)}
                  </tbody></table>
                )}
              </section>
              <section className="bms-panel">
                <h2>Top products and services</h2>
                {data.topProducts.length === 0 ? <p className="bms-sub mb-0">No invoices in this period.</p> : (
                  <table className="bms-table"><tbody>
                    {data.topProducts.map((p) => <tr key={p.name}><td>{p.name}<div className="bms-sub">{p.quantity} sold</div></td><td className="num">{formatCurrency(p.revenue)}</td></tr>)}
                  </tbody></table>
                )}
              </section>
            </div>
          </>
        ) : null}
      </AsyncSection>
    </>
  );
}
