import React from 'react';
import { FaChartLine, FaClock, FaEnvelope, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

const TILES = [
  { key: 'totalOrders', label: 'Total orders', icon: <FaShoppingCart />, tone: '#2fa5b6' },
  { key: 'pendingOrders', label: 'Processing orders', icon: <FaClock />, tone: '#a16207' },
  { key: 'totalRevenue', label: 'Total revenue', icon: <FaMoneyBillWave />, tone: '#15803d', currency: true },
  { key: 'unreadInquiries', label: 'Unread inquiries', icon: <FaEnvelope />, tone: '#1d4ed8' },
];

export default function StatCards({ stats }) {
  return (
    <div className="row g-3 mb-4">
      {TILES.map((tile) => (
        <div className="col-sm-6 col-lg-3" key={tile.key}>
          <div className="bw-stat-tile">
            <span
              className="bw-stat-tile__icon"
              aria-hidden="true"
              style={{ backgroundColor: `${tile.tone}1a`, color: tile.tone }}
            >
              <FaChartLine style={{ display: 'none' }} />
              {tile.icon}
            </span>
            <p className="bw-stat-tile__value">
              {tile.currency ? formatCurrency(stats[tile.key] || 0) : stats[tile.key] || 0}
            </p>
            <p className="bw-stat-tile__label">{tile.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
