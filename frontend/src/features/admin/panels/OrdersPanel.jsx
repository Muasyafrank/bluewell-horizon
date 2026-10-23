import React, { useState } from 'react';
import { FaEdit, FaEye, FaFileInvoice, FaTrash, FaUser, FaShoppingCart } from 'react-icons/fa';
import { adminApi } from '../../../api';
import { Button, Field, Modal, StatusBadge, TablePager, ORDER_STATUSES } from '../../../components/ui';
import { Image } from '../../../components/common';
import { usePagedRows } from '../../../hooks';
import QuotationModal from './QuotationModal';
import { formatCurrency, formatDateTime } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';

/**
 * Order management: list, view detail, update status, delete.
 * Status updates used to `await res.json()` without checking `res.ok`, so a
 * failed update showed no error and silently left the order unchanged.
 */
export default function OrdersPanel({ orders, token, onChanged }) {
  const pager = usePagedRows(orders);
  const [viewing, setViewing] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [status, setStatus] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [quoting, setQuoting] = useState(null);
  const [saving, setSaving] = useState(false);

  // The order list has no line items; the detail endpoint does. The previous
  // view button set the list row directly, so the modal never had anything to
  // show under "Items".
  const openView = async (order) => {
    setLoadingDetail(true);
    try {
      const detail = await adminApi.getOrder(order.id, { token });
      setViewing({ ...detail.order, items: detail.items });
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const openStatus = (order) => {
    setStatusTarget(order);
    setStatus(order.orderStatus);
  };

  const handleStatusSubmit = async () => {
    setSaving(true);
    try {
      await adminApi.updateOrderStatus(statusTarget.id, status, { token });
      toastSuccess('Order status updated');
      setStatusTarget(null);
      onChanged();
    } catch (error) {
      toastError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteOrder(deleting.id, { token });
      toastSuccess('Order deleted');
      setDeleting(null);
      onChanged();
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <>
      <h2 className="h5 mb-3">Manage orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted text-center py-5 mb-0">No orders received yet.</p>
      ) : (
        <div className="bw-table__scroll">
          <table className="bw-table">
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Customer</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Payment</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ width: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pager.visible.map((order) => (
                <tr key={order.id}>
                  <td className="fw-semibold">{order.orderNumber}</td>
                  <td>
                    <span className="d-block fw-semibold small">{order.customerName}</span>
                    <span className="d-block text-muted small">{order.customerEmail}</span>
                  </td>
                  <td className="small">{formatDateTime(order.createdAt)}</td>
                  <td className="fw-bold bw-price">
                    {order.totalAmount > 0 ? formatCurrency(order.totalAmount) : <span className="text-muted fw-normal">Awaiting quotation</span>}
                  </td>
                  <td>
                    <span className="text-uppercase small">{order.paymentMethod}</span>
                  </td>
                  <td>
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="bw-icon-btn"
                        aria-label="View order"
                        onClick={() => openView(order)}
                        disabled={loadingDetail}
                      >
                        <FaEye />
                      </button>
                      <button
                        type="button"
                        className="bw-icon-btn"
                        aria-label={`Quotation for ${order.orderNumber}`}
                        title="Prepare and send a quotation"
                        onClick={() => setQuoting(order)}
                      >
                        <FaFileInvoice />
                      </button>
                      <button type="button" className="bw-icon-btn" aria-label="Update status" onClick={() => openStatus(order)}>
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="bw-icon-btn bw-icon-btn--danger"
                        aria-label="Delete order"
                        onClick={() => setDeleting(order)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePager pager={pager} />
        </div>
      )}

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing ? `Order ${viewing.orderNumber}` : ''}
        size="xl"
        footer={
          viewing ? (
            <>
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
              <Button
                icon={<FaFileInvoice aria-hidden="true" />}
                onClick={() => {
                  setQuoting(viewing);
                  setViewing(null);
                }}
              >
                Prepare quotation
              </Button>
            </>
          ) : null
        }
      >
        {viewing ? (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="bw-card bw-card--tint">
                <h3 className="h6 d-flex align-items-center gap-2 mb-3">
                  <FaUser aria-hidden="true" /> Customer
                </h3>
                <p className="mb-1"><strong>Name:</strong> {viewing.customerName}</p>
                <p className="mb-1"><strong>Email:</strong> {viewing.customerEmail}</p>
                <p className="mb-1"><strong>Phone:</strong> {viewing.customerPhone}</p>
                <p className="mb-0">
                  <strong>Address:</strong> {viewing.streetAddress}, {viewing.estate}, {viewing.county}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="bw-card bw-card--tint">
                <h3 className="h6 d-flex align-items-center gap-2 mb-3">
                  <FaShoppingCart aria-hidden="true" /> Order
                </h3>
                <p className="mb-1"><strong>Payment:</strong> <span className="text-uppercase">{viewing.paymentMethod}</span></p>
                <p className="mb-1"><strong>Status:</strong> <StatusBadge status={viewing.orderStatus} /></p>
                <p className="mb-0">
                  <strong>Total:</strong>{' '}
                  {viewing.totalAmount > 0 ? <span className="bw-price">{formatCurrency(viewing.totalAmount)}</span> : <span className="text-muted">Awaiting quotation</span>}
                </p>
              </div>
            </div>
            <div className="col-12">
              <h3 className="h6 mb-3">Items</h3>
              <div className="bw-table__scroll">
                <table className="bw-table">
                  <thead>
                    <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {(viewing.items || []).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Image src={item.Product?.image} alt="" className="bw-thumb bw-thumb--sm" />
                            <span className="fw-semibold">{item.Product?.name || 'Product'}</span>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.price > 0 ? formatCurrency(item.price) : <span className="text-muted">Not set</span>}</td>
                        <td className="fw-bold">{item.price > 0 ? formatCurrency(item.price * item.quantity) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {viewing.notes ? (
              <div className="col-12">
                <div className="bw-alert bw-alert--info mb-0">Customer notes: {viewing.notes}</div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {quoting ? (
        <QuotationModal order={quoting} token={token} onClose={() => setQuoting(null)} onChanged={onChanged} />
      ) : null}

      <Modal
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        title="Update order status"
        submitLabel="Update status"
        submitting={saving}
        onSubmit={handleStatusSubmit}
      >
        {statusTarget ? (
          <>
            <p className="mb-1"><strong>Order:</strong> {statusTarget.orderNumber}</p>
            <p className="mb-4"><strong>Customer:</strong> {statusTarget.customerName}</p>
            <Field
              label="New status"
              name="status"
              as="select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={ORDER_STATUSES.map((value) => ({ value, label: value }))}
              className="mb-0"
            />
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this order?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="mb-0">This permanently removes order {deleting?.orderNumber}.</p>
      </Modal>
    </>
  );
}
