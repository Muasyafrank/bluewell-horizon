import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AdminProvider } from './context/AdminContext';
import { CustomerProvider } from './context/CustomerContext';
import { CartProvider } from './context/CartContext';
import { Layout, RequireAuth } from './components/layout';
import { ErrorBoundary, StructuredData } from './components/common';
import { Loader } from './components/ui';
import { WishlistProvider } from "./context/WishlistContext";

// Route-level code splitting: each page only downloads when it is visited.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Quote = lazy(() => import('./pages/Quote'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const NotFound = lazy(() => import('./pages/NotFound'));

const CustomerLogin = lazy(() => import('./pages/customer/CustomerLogin'));
const CustomerRegister = lazy(() => import('./pages/customer/CustomerRegister'));
const AccountDashboard = lazy(() => import('./pages/customer/AccountDashboard'));

const AdminLogin = lazy(() => import('./features/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard'));
const Wishlist = lazy(()=> import('./pages/Wishlist'))

function PageFallback() {
  return <Loader text="Loading" fullPage />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AdminProvider>
          <CustomerProvider>
            <CartProvider>
              <WishlistProvider>
              <BrowserRouter>
                <StructuredData />
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="about" element={<About />} />
                      <Route path="services" element={<Solutions />} />
                      {/* Old marketing links pointed at /technologies before the
                          services and technologies pages merged. */}
                      <Route path="technologies" element={<Navigate to="/services" replace />} />
                      <Route path="gallery" element={<Gallery />} />
                      <Route path="shop" element={<Shop />} />
                      <Route path="wishlist" element={<Wishlist />} />                      
                      <Route path="cart" element={<Cart />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="order-success" element={<OrderSuccess />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="quote" element={<Quote />} />

                      <Route path="login" element={<CustomerLogin />} />
                      <Route path="register" element={<CustomerRegister />} />
                      <Route
                        path="account"
                        element={
                          <RequireAuth audience="customer">
                            <AccountDashboard />
                          </RequireAuth>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                    </Route>

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <RequireAuth audience="admin">
                          <AdminDashboard />
                        </RequireAuth>
                      }
                    />
                  </Routes>
                </Suspense>

                <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover theme="colored" />
              </BrowserRouter>
              </WishlistProvider>
            </CartProvider>
          </CustomerProvider>
        </AdminProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
