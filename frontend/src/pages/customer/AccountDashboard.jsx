import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import { FaSignOutAlt, FaShoppingBag, FaUser, FaBox, FaCheckCircle, FaTruck, FaClock, FaTimesCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

const AccountDashboard = () => {
  const { token, customer, logout } = useCustomer();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customers/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const styles = {
      processing: { bg: '#fff3cd', color: '#856404', icon: FaClock },
      confirmed: { bg: '#cce5ff', color: '#004085', icon: FaCheckCircle },
      shipped: { bg: '#d4edda', color: '#155724', icon: FaTruck },
      delivered: { bg: '#d1e7dd', color: '#0f5132', icon: FaCheckCircle },
      cancelled: { bg: '#f8d7da', color: '#721c24', icon: FaTimesCircle }
    };
    const s = styles[status] || styles.processing;
    const Icon = s.icon;
    return (
      <span className="badge px-3 py-2" style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: '600' }}>
        <Icon className="me-1" size={12} /> {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc', paddingTop: '120px' }}>
      <div className="container py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: '#0b2540' }}>My Account</h2>
            <p className="text-muted mb-0">Welcome back, {customer?.name}!</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-3">
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Profile Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <small className="text-muted d-block">Full Name</small>
                  <p className="mb-0 fw-semibold"><FaUser className="me-2" style={{color: '#2fa5b6'}} />{customer?.name}</p>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Email Address</small>
                  <p className="mb-0 fw-semibold"><FaEnvelope className="me-2" style={{color: '#2fa5b6'}} />{customer?.email}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/shop" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }}>
                <FaShoppingBag className="me-2" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="p-4 rounded-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
          <h5 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Order History</h5>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-3">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <FaBox size={48} className="mb-3" style={{ color: '#cbd5e0' }} />
              <h5 className="fw-bold" style={{ color: '#0b2540' }}>No orders yet</h5>
              <p className="text-muted mb-4">You haven't placed any orders with us yet.</p>
              <Link to="/shop" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="fw-semibold" style={{ color: '#2fa5b6' }}>{order.orderNumber}</td>
                      <td><small>{new Date(order.createdAt).toLocaleDateString()}</small></td>
                      <td>
                        <div className="d-flex align-items-center">
                          {order.OrderItems.slice(0, 3).map((item, i) => (
                            <img key={i} src={`http://localhost:5000${item.Product?.image || '/images/placeholder.jpg'}`} alt="" 
                              style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #fff', marginLeft: i > 0 ? '-10px' : '0', zIndex: 3 - i }} />
                          ))}
                          {order.OrderItems.length > 3 && <span className="ms-2 small text-muted">+{order.OrderItems.length - 3} more</span>}
                        </div>
                      </td>
                      <td className="fw-bold">KES {parseFloat(order.totalAmount).toLocaleString()}</td>
                      <td>{getStatusBadge(order.orderStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;