import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';

const CustomerProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useCustomer();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default CustomerProtectedRoute;