import React from 'react';
import { Badge } from '../../../components/ui';
import { formatDateTime } from '../../../utils/format';

/** Read-only list of quote requests — the dashboard fetched these but never
 *  displayed them anywhere. */
export default function QuotesPanel({ quotes }) {
  return (
    <>
      <h2 className="h5 mb-3">Quote requests</h2>

      {quotes.length === 0 ? (
        <p className="text-muted text-center py-5 mb-0">No quote requests yet.</p>
      ) : (
        <div className="bw-table__scroll">
          <table className="bw-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Company</th>
                <th scope="col">Service</th>
                <th scope="col">Contact</th>
                <th scope="col">Received</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id}>
                  <td className="fw-semibold">{quote.name}</td>
                  <td>{quote.companyName}</td>
                  <td><Badge tone="neutral">{quote.serviceType}</Badge></td>
                  <td>
                    <span className="d-block small">{quote.email}</span>
                    <span className="d-block text-muted small">{quote.phone}</span>
                  </td>
                  <td className="small">{formatDateTime(quote.createdAt)}</td>
                  <td><Badge tone={quote.status === 'pending' ? 'warning' : 'success'}>{quote.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
