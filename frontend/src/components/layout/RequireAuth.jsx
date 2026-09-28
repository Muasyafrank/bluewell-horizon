import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useCustomer } from '../../context/CustomerContext';

/**
 * Route guard for both audiences.
 *
 * There used to be two nearly identical guard components. This one also
 * remembers where the visitor was headed, so after signing in they land on the
 * page they asked for instead of the home page.
 */
export default function RequireAuth({ audience = 'customer', children }) {
  const location = useLocation();
  const customer = useCustomer();
  const admin = useAdmin();

  const { isAuthenticated } = audience === 'admin' ? admin : customer;
  const loginPath = audience === 'admin' ? '/admin/login' : '/login';

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
