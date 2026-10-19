import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaCoins, FaExclamationTriangle, FaFileInvoiceDollar, FaHandHoldingUsd, FaHourglassHalf, FaReceipt } from 'react-icons/fa';
import { bmsApi } from '../../../api';
import { AsyncSection } from '../../../components/ui';
import { useApiResource } from '../../../hooks';
import { formatCurrency } from '../../../utils/format';
import { useStaff } from '../StaffContext';
import { STOCK_STATE } from '../access';
import { PageHead, Stat, StatusTone } from '../ui';

const greeting = (hour = new Date().getHours()) => (hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');

export default function DashboardPage() {
  const { me, token } = useStaff();
  const { data, loading, error, reload } = useApiResource((o) => bmsApi.dashboard({ ...o, token }), { deps: [token] });

  return (
    <>
      <PageHead eyebrow={greeting()} title={me.name} subtitle="What needs attention today." />
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        {data ? (
          <>
            <div className="bms-grid bms-grid--stats">
              {data.awaitingQuotation !== undefined && <Stat icon={<FaHourglassHalf />} label="Orders awaiting a quotation" value={data.awaitingQuotation} />}
              {data.awaitingInvoice !== undefined && (
                <Stat icon={<FaReceipt />} label="Quoted, not yet invoiced" value={data.awaitingInvoice} tone={data.awaitingInvoice ? 'warn' : undefined} />
              )}
              {data.money && (
                <>
                  <Stat icon={<FaCoins />} label="Outstanding" value={formatCurrency(data.money.outstanding)} />
                  <Stat icon={<FaExclamationTriangle />} label={`Overdue (${data.money.overdueCount})`} value={formatCurrency(data.money.overdueAmount)}
                    tone={data.money.overdueCount ? 'bad' : undefined} />
                  <Stat icon={<FaFileInvoiceDollar />} label="Invoiced this month" value={formatCurrency(data.money.invoicedThisMonth)} />
                  <Stat icon={<FaHandHoldingUsd />} label="Collected this month" value={formatCurrency(data.money.collectedThisMonth)} />
                </>
              )}
              {data.openPurchaseOrders !== undefined && <Stat icon={<FaClipboardList />} label="Open purchase orders" value={data.openPurchaseOrders} />}
            </div>

            {data.awaitingInvoice > 0 && (
              <p><Link className="bms-link" to="/staff/invoices">Create the invoices that are waiting →</Link></p>
            )}

            {data.stock && (
              <section className="bms-panel">
                <h2>Stock needing attention ({data.stock.flaggedCount})</h2>
                {data.stock.items.length === 0 ? (
                  <p className="bms-sub mb-0">Everything is above its reorder level.</p>
                ) : (
                  <div className="bms-table-wrap" style={{ border: 0 }}>
                    <table className="bms-table">
                      <tbody>
                        {data.stock.items.map((p) => (
                          <tr key={p.id}>
                            <td>{p.name}</td>
                            <td className="num">{p.stock}</td>
                            <td><StatusTone map={STOCK_STATE} value={p.state} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="mt-2 mb-0"><Link className="bms-link" to="/staff/stock">Open stock →</Link></p>
              </section>
            )}
          </>
        ) : null}
      </AsyncSection>
    </>
  );
}
