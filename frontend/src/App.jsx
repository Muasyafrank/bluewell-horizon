import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Solutions from './pages/Solutions';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
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
          </Route>

          {/* Admin Routes (No Layout/Navbar) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;