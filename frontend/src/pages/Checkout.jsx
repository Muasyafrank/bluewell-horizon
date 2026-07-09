import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaPhone } from 'react-icons/fa';
import { useCustomer } from '../context/CustomerContext';

const Checkout = () => {
  const { token, isAuthenticated, customer } = useCustomer();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    paymentMethod: 'mpesa',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/shop');
    }
  }, [navigate]);

  // Auto-fill form if customer is logged in
  useEffect(() => {
    if (isAuthenticated && customer) {
      setFormData(prev => ({
        ...prev,
        customerName: customer.name || '',
        customerEmail: customer.email || '',
        customerPhone: customer.phone || ''
      }));
    }
  }, [isAuthenticated, customer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...formData, items: cart }) // Fixed: cart instead of cartItems
      });

      const data = await res.json(); // Fixed: res instead of response

      if (res.ok) { // Fixed: res instead of response
        localStorage.removeItem('cart');
        navigate('/order-success', { state: { orderNumber: data.orderNumber } });
      } else {
        alert(data.message || 'Error placing order. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#0b2540' }}>
            <span className="fst-italic" style={{ color: '#2fa5b6' }}>Checkout</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568' }}>
            Complete your order by filling in your details below.
          </p>
        </div>
      </section>

      {/* Checkout Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit}>
                <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Contact Information</h4>
                <div className="row g-3 mb-5">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="+254 7XX XXX XXX"
                      required
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                </div>

                <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Shipping Address</h4>
                <div className="row g-3 mb-5">
                  <div className="col-12">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Street Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                </div>

                <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Payment Method</h4>
                <div className="mb-5">
                  <div className="form-check p-3 mb-3 rounded-3" style={{ backgroundColor: formData.paymentMethod === 'mpesa' ? '#f0f9fa' : '#f8fafc', border: `1px solid ${formData.paymentMethod === 'mpesa' ? '#2fa5b6' : '#e2e8f0'}` }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={formData.paymentMethod === 'mpesa'}
                      onChange={handleChange}
                      id="mpesa"
                    />
                    <label className="form-check-label w-100 ms-2" htmlFor="mpesa">
                      <div className="d-flex align-items-center gap-2">
                        <FaPhone style={{ color: '#2fa5b6' }} />
                        <div>
                          <strong className="d-block" style={{ color: '#0b2540' }}>M-Pesa</strong>
                          <small className="text-muted">Pay with M-Pesa (Paybill or Till Number)</small>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="form-check p-3 mb-3 rounded-3" style={{ backgroundColor: formData.paymentMethod === 'card' ? '#f0f9fa' : '#f8fafc', border: `1px solid ${formData.paymentMethod === 'card' ? '#2fa5b6' : '#e2e8f0'}` }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      id="card"
                    />
                    <label className="form-check-label w-100 ms-2" htmlFor="card">
                      <div className="d-flex align-items-center gap-2">
                        <FaCreditCard style={{ color: '#2fa5b6' }} />
                        <div>
                          <strong className="d-block" style={{ color: '#0b2540' }}>Credit/Debit Card</strong>
                          <small className="text-muted">Pay securely with card</small>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="form-check p-3 rounded-3" style={{ backgroundColor: formData.paymentMethod === 'cod' ? '#f0f9fa' : '#f8fafc', border: `1px solid ${formData.paymentMethod === 'cod' ? '#2fa5b6' : '#e2e8f0'}` }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      id="cod"
                    />
                    <label className="form-check-label w-100 ms-2" htmlFor="cod">
                      <div className="d-flex align-items-center gap-2">
                        <FaMoneyBillWave style={{ color: '#2fa5b6' }} />
                        <div>
                          <strong className="d-block" style={{ color: '#0b2540' }}>Cash on Delivery</strong>
                          <small className="text-muted">Pay when you receive your order</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Order Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special instructions..."
                    style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 rounded-pill fw-semibold"
                  style={{ backgroundColor: '#2fa5b6', border: 'none', fontSize: '1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Place Order - KES ${total.toLocaleString()}`}
                </button>
              </form>
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', position: 'sticky', top: '100px' }}>
                <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Order Summary</h4>
                {cart.map((item) => (
                  <div key={item.id} className="d-flex gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.95rem' }}>{item.name}</h6>
                      <p className="small text-muted mb-1">Qty: {item.quantity}</p>
                      <p className="fw-bold mb-0" style={{ color: '#2fa5b6', fontSize: '0.9rem' }}>
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-3" style={{ borderTop: '2px solid #e2e8f0' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-bold">KES {total.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Delivery</span>
                    <span className="fw-bold">Calculated separately</span>
                  </div>
                  <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    <span className="fw-bold fs-5" style={{ color: '#0b2540' }}>Total</span>
                    <span className="fw-bold fs-4" style={{ color: '#2fa5b6' }}>KES {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;