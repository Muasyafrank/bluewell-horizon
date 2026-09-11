import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

import { AdminProvider } from './context/AdminContext';
import { CustomerProvider } from './context/CustomerContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CustomerProtectedRoute from './components/layout/CustomerProtectedRoute';
import Layout from './components/layout/Layout';
import StructuredData from './components/StructuredData';
import WaterLoader from './components/WaterLoader'; // <-- ADD THIS

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CustomerLogin = lazy(() => import('./pages/customer/CustomerLogin'));
const CustomerRegister = lazy(() => import('./pages/customer/CustomerRegister'));
const AccountDashboard = lazy(() => import('./pages/customer/AccountDashboard'));
const Quote = lazy(() => import('./pages/Quote'));

// Replace LoadingSpinner with WaterLoader
const LoadingFallback = () => <WaterLoader text="Loading..." />;

function App() {
  return (
    <HelmetProvider>
      <AdminProvider>
        <CustomerProvider>
          <Router>
            <StructuredData />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Solutions />} />
                  <Route path="technologies" element={<Navigate to="/services" replace />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-success" element={<OrderSuccess />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="quote" element={<Quote />} />
                </Route>

                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/register" element={<CustomerRegister />} />
                <Route path="/account" element={
                  <CustomerProtectedRoute>
                    <AccountDashboard />
                  </CustomerProtectedRoute>
                } />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
            
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </Router>
        </CustomerProvider>
      </AdminProvider>
    </HelmetProvider>
  );
}

export default App;