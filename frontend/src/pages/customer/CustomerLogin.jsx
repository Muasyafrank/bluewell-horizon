import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { toastSuccess, toastError } from '../../utils/toast';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useCustomer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.customer);
        toastSuccess(`Welcome back, ${data.customer.name}!`);
        setTimeout(() => navigate('/'), 500);
      } else {
        toastError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      toastError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#f8fafc', paddingTop: '140px' }}>
      <div className="p-5 rounded-4 shadow-sm" style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: '#0b2540' }}>Welcome Back</h3>
          <p className="text-muted small">Log in to view your orders and account details.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaEnvelope style={{ color: '#2fa5b6' }} /></span>
              <input type="email" className="form-control border-start-0" value={email} onChange={e => setEmail(e.target.value)} required style={{ borderRadius: '0 10px 10px 0' }} />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required style={{ borderRadius: '10px' }} />
          </div>
          <button type="submit" className="btn w-100 py-2 fw-bold text-white" disabled={loading} style={{ backgroundColor: '#2fa5b6', borderRadius: '10px' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="mb-0 small text-muted">Don't have an account? <Link to="/register" style={{ color: '#2fa5b6' }} className="fw-semibold">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;