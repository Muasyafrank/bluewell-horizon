import React from 'react';
import { StatusBadge } from '../../../components/ui';
import { formatCurrency } from '../../../utils/format';

export default function OverviewPanel({ orders, contacts }) {
  return (
    <div className="row g-4">
      <div className="col-md-6">
        <div className="bw-card bw-card--tint">
          <h2 className="h6 mb-3">Recent orders</h2>
          {orders.slice(0, 5).map((order) => (
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom" key={order.id}>
              <div>
                <small className="d-block fw-semibold">{order.orderNumber}</small>
                <small className="text-muted">{order.customerName}</small>
              </div>
              <div className="text-end">
                <StatusBadge status={order.orderStatus} />
                <small className="d-block text-muted mt-1">{formatCurrency(order.totalAmount)}</small>
              </div>
            </div>
          ))}
          {orders.length === 0 ? <p className="text-muted text-center py-3 mb-0">No orders yet</p> : null}
        </div>
      </div>
      <div className="col-md-6">
        <div className="bw-card bw-card--tint">
          <h2 className="h6 mb-3">Recent inquiries</h2>
          {contacts.slice(0, 5).map((contact) => (
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom" key={contact.id}>
              <div>
                <small className="d-block fw-semibold">{contact.name}</small>
                <small className="text-muted">{contact.service}</small>
              </div>
              <div className="text-end">
                {!contact.isRead ? <span className="bw-badge bw-badge--danger">New</span> : null}
              </div>
            </div>
          ))}
          {contacts.length === 0 ? <p className="text-muted text-center py-3 mb-0">No inquiries yet</p> : null}
        </div>
      </div>
    </div>
  );
}
