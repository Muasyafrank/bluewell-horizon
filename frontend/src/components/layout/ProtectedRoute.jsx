import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;