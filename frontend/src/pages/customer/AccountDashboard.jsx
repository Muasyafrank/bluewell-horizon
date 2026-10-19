import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox } from 'react-icons/fa';
import { ordersApi } from '../../api';
import { useApiResource } from '../../hooks';
import { useCustomer } from '../../context/CustomerContext';
import { useWishlist } from '../../context/WishlistContext';
import { SEO } from '../../components/common';
import { AsyncSection, Button, EmptyState } from '../../components/ui';
import { toastInfo } from '../../utils/toast';
import AccountOverview from './account/AccountOverview';
import OrderCard from './account/OrderCard';
import ProfileHero from './account/ProfileHero';
import { summariseOrders } from './account/orderSummary';

export default function AccountDashboard() {
  const { token, user: customer, logout } = useCustomer();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const { data, loading, error, reload } = useApiResource(
    (options) => ordersApi.listMine({ ...options, token }),
    { initialData: [], enabled: Boolean(token) },
  );

  const orders = useMemo(() => data || [], [data]);
  const summary = useMemo(() => summariseOrders(orders), [orders]);

  // An expired token shows up as a 401. Sign out with an explanation so the
  // route guard sends the customer to the login page.
  const sessionExpired = Boolean(error?.isUnauthorized);
  useEffect(() => {
    if (!sessionExpired) return;
    toastInfo('Your session has expired. Please sign in again.');
    logout();
  }, [sessionExpired, logout]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <SEO title="My account" path="/account" noIndex />

      <div className="bw-page bw-section bw-section--tint bw-account">
        <div className="container">
          <ProfileHero customer={customer} onLogout={handleLogout} />
          <AccountOverview summary={summary} wishlistCount={wishlistCount} />

          <section aria-labelledby="order-history-heading" className="bw-account-orders">
            <h2 id="order-history-heading" className="bw-account-orders__title">
              Order history
            </h2>

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
              <div className="bw-account-orders__list">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </AsyncSection>
          </section>
        </div>
      </div>
    </>
  );
}
