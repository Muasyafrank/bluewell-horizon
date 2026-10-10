import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Badge, Button, StatusBadge } from '../../../components/ui';
import { formatCurrency } from '../../../utils/format';
import { STOCK_LEVELS, stockLevel } from '../stock';
import OrderCharts from './OrderCharts';

const ALERT_LIMIT = 6;

/** Landing tab: trends, what sells, what needs restocking, and recent activity. */
export default function OverviewPanel({ orders, contacts, products, popularProducts, onNavigate }) {
  const stockAlerts = products
    .filter((product) => stockLevel(product.stock) !== 'in')
    .sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0));

  return (
    <>
      <OrderCharts orders={orders} />

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-7">
          <div className="bw-card bw-card--tint h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 className="h6 mb-1">Popular products</h2>
                <p className="text-muted small mb-0">Products by units ordered</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onNavigate('products')}>
                View products
              </Button>
            </div>
            {popularProducts.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">Product sales will appear here once orders come in.</p>
            ) : (
              <table className="bw-table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col" className="text-end">Units ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {popularProducts.map((product) => (
                    <tr key={product.name}>
                      <td className="fw-semibold">{product.name}</td>
                      <td className="text-end">{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="bw-card bw-card--tint h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 className="h6 mb-1">Inventory alerts</h2>
                <p className="text-muted small mb-0">Products that need restocking</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onNavigate('inventory')}>
                Manage
              </Button>
            </div>
            {stockAlerts.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">Every product is well stocked.</p>
            ) : (
              <>
                {stockAlerts.slice(0, ALERT_LIMIT).map((product) => {
                  const level = STOCK_LEVELS[stockLevel(product.stock)];
                  return (
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom" key={product.id}>
                      <div>
                        <small className="d-block fw-semibold">{product.name}</small>
                        <small className="text-muted">{Number(product.stock) || 0} left</small>
                      </div>
                      <Badge tone={level.tone} icon={<FaExclamationTriangle />}>
                        {level.label}
                      </Badge>
                    </div>
                  );
                })}
                {stockAlerts.length > ALERT_LIMIT ? (
                  <p className="small text-muted mt-2 mb-0">
                    and {stockAlerts.length - ALERT_LIMIT} more — see Inventory.
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

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
                {!contact.isRead ? <Badge tone="danger">New</Badge> : null}
              </div>
            ))}
            {contacts.length === 0 ? <p className="text-muted text-center py-3 mb-0">No inquiries yet</p> : null}
          </div>
        </div>
      </div>
    </>
  );
}
