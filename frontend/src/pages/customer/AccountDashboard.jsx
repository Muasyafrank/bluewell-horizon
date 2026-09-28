import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaEnvelope, FaPhone, FaShoppingBag, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { ordersApi } from '../../api';
import { useApiResource } from '../../hooks';
import { useCustomer } from '../../context/CustomerContext';
import { SEO, Image } from '../../components/common';
import { AsyncSection, Button, Card, EmptyState, StatusBadge } from '../../components/ui';
import { formatCurrency, formatDate, pluralise } from '../../utils/format';

export default function AccountDashboard() {
  const { token, user: customer, logout } = useCustomer();
  const navigate = useNavigate();

  const { data, loading, error, reload } = useApiResource(
    (options) => ordersApi.listMine({ ...options, token }),
    { initialData: [], enabled: Boolean(token) },
  );

  const orders = data || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <SEO title="My account" path="/account" noIndex />

      <div className="bw-page bw-section bw-section--tint">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-5">
            <div>
              <h1 className="h3 mb-1">My account</h1>
              <p className="text-muted mb-0">Welcome back, {customer?.name}.</p>
            </div>
            <Button variant="danger" icon={<FaSignOutAlt aria-hidden="true" />} onClick={handleLogout}>
              Sign out
            </Button>
          </div>

          <Card className="mb-4">
            <div className="row align-items-center g-4">
              <div className="col-md-8">
                <h2 className="h5 mb-4">Your details</h2>
                <dl className="row mb-0">
                  <dt className="col-sm-4 small text-muted fw-normal">Name</dt>
                  <dd className="col-sm-8 fw-semibold d-flex align-items-center gap-2">
                    <FaUser aria-hidden="true" style={{ color: 'var(--bw-teal)' }} />
                    {customer?.name}
                  </dd>
                  <dt className="col-sm-4 small text-muted fw-normal">Email</dt>
                  <dd className="col-sm-8 fw-semibold d-flex align-items-center gap-2">
                    <FaEnvelope aria-hidden="true" style={{ color: 'var(--bw-teal)' }} />
                    {customer?.email}
                  </dd>
                  {customer?.phone ? (
                    <>
                      <dt className="col-sm-4 small text-muted fw-normal">Phone</dt>
                      <dd className="col-sm-8 fw-semibold d-flex align-items-center gap-2 mb-0">
                        <FaPhone aria-hidden="true" style={{ color: 'var(--bw-teal)' }} />
                        {customer.phone}
                      </dd>
                    </>
                  ) : null}
                </dl>
              </div>
              <div className="col-md-4 text-md-end">
                <Button to="/shop" icon={<FaShoppingBag aria-hidden="true" />}>
                  Continue shopping
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="h5 mb-4">Order history</h2>

            <AsyncSection
              loading={loading}
              error={error}
              onRetry={reload}
              loadingText="Loading your orders"
              isEmpty={orders.length === 0}
              empty={
                <EmptyState
                  icon={<FaBox />}
                  title="No orders yet"
                  description="Once you place an order it will appear here with its delivery status."
                  action={<Button to="/shop">Browse the shop</Button>}
                />
              }
            >
              <div className="bw-table__scroll">
                <table className="bw-table">
                  <caption className="visually-hidden">Your past orders</caption>
                  <thead>
                    <tr>
                      <th scope="col">Order</th>
                      <th scope="col">Date</th>
                      <th scope="col">Items</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      // The API returns `items`; the old table read
                      // `order.OrderItems`, an undefined property, and crashed
                      // the whole page as soon as a customer had one order.
                      const items = order.items || [];
                      return (
                        <tr key={order.id}>
                          <td className="fw-semibold" style={{ color: 'var(--bw-teal-dark)' }}>
                            {order.orderNumber}
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            {items.length ? (
                              <div className="d-flex align-items-center">
                                {items.slice(0, 3).map((item, index) => (
                                  <Image
                                    key={item.id}
                                    src={item.image}
                                    alt=""
                                    className="bw-thumb bw-thumb--sm"
                                    style={{ marginLeft: index > 0 ? '-10px' : 0, zIndex: 3 - index }}
                                  />
                                ))}
                                {items.length > 3 ? (
                                  <span className="ms-2 small text-muted">
                                    +{items.length - 3} more
                                  </span>
                                ) : null}
                              </div>
                            ) : (
                              <span className="small text-muted">
                                {order.itemCount ?? 0} {pluralise(order.itemCount ?? 0, 'item')}
                              </span>
                            )}
                          </td>
                          <td className="fw-bold">{formatCurrency(order.totalAmount)}</td>
                          <td>
                            <StatusBadge status={order.orderStatus} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </AsyncSection>
          </Card>
        </div>
      </div>
    </>
  );
}
