import React from 'react';
import { formatCurrency, pluralise } from '../../utils/format';

/**
 * Price breakdown shared by the cart and checkout pages, which previously kept
 * two separate copies that disagreed about whether VAT was included.
 */
export default function OrderSummary({ rows, total, itemCount, children }) {
  return (
    <div className="bw-card bw-card--tint bw-sticky-aside">
      <h2 className="h5 mb-4">Order summary</h2>

      {children}

      {rows.map((row) => (
        <div className="bw-summary-row" key={row.label}>
          <span className="text-muted">
            {row.label}
            {row.label === 'Subtotal' && itemCount != null
              ? ` (${itemCount} ${pluralise(itemCount, 'item')})`
              : ''}
          </span>
          <span className="fw-semibold">
            {typeof row.value === 'number' ? formatCurrency(row.value) : row.value}
          </span>
        </div>
      ))}

      <div className="bw-summary-row bw-summary-row--total">
        <span>Total</span>
        <span className="bw-price">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
