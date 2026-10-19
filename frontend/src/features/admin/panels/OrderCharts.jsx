import React, { useMemo } from 'react';
import {
  CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { formatCurrency, titleCase } from '../../../utils/format';
import { ordersByStatus, ordersOverTime } from '../analytics';

// Recharts draws into SVG and needs literal colours; these mirror the design
// tokens in styles/tokens.css (teal, info, success, warning, danger…).
const SERIES = { orders: '#2fa5b6', value: '#1d4ed8' };
const STATUS_COLOURS = {
  processing: '#a16207',
  quoted: '#7c3aed',
  confirmed: '#1d4ed8',
  shipped: '#2fa5b6',
  delivered: '#15803d',
  cancelled: '#b91c1c',
};
const FALLBACK_COLOUR = '#64748b';

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e8eef2',
  borderRadius: 10,
  fontSize: 13,
};

/**
 * "Orders over the last 30 days" and "Order status" charts.
 * Kept in its own file so the charting library is only pulled in by the
 * dashboard, never by the public site.
 */
export default function OrderCharts({ orders }) {
  const series = useMemo(() => ordersOverTime(orders, 30), [orders]);
  const statuses = useMemo(() => ordersByStatus(orders), [orders]);

  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-xl-8">
        <div className="bw-card bw-card--tint h-100">
          <h2 className="h6 mb-1">Orders overview</h2>
          <p className="text-muted small">Orders and order value over the last 30 days</p>
          <div className="bw-chart" role="img" aria-label="Line chart of orders and order value over the last 30 days">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eef2" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                <YAxis yAxisId="orders" allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                <YAxis yAxisId="value" orientation="right" tick={{ fontSize: 11 }} width={56} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) =>
                    name === 'Order value' ? [formatCurrency(value), name] : [value, name]
                  }
                />
                <Legend />
                <Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke={SERIES.orders} strokeWidth={2} dot={false} />
                <Line yAxisId="value" type="monotone" dataKey="value" name="Order value" stroke={SERIES.value} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="bw-card bw-card--tint h-100">
          <h2 className="h6 mb-1">Order status</h2>
          <p className="text-muted small">Current order distribution</p>
          {statuses.length === 0 ? (
            <p className="text-muted text-center py-5 mb-0">No orders yet</p>
          ) : (
            <div className="bw-chart" role="img" aria-label="Pie chart of orders by status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statuses} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {statuses.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLOURS[entry.name] || FALLBACK_COLOUR} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value, titleCase(name)]} />
                  <Legend formatter={(name) => titleCase(name)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
