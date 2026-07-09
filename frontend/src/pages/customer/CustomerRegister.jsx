import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useCustomer();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.customer);
        navigate('/account');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#f8fafc', paddingTop: '140px' }}>
      <div className="p-5 rounded-4 shadow-sm" style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: '#0b2540' }}>Create Account</h3>
          <p className="text-muted small">Join us to track your orders and get exclusive support.</p>
        </div>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaUser style={{ color: '#2fa5b6' }} /></span>
              <input type="text" name="name" className="form-control border-start-0" value={formData.name} onChange={handleChange} required style={{ borderRadius: '0 10px 10px 0' }} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaEnvelope style={{ color: '#2fa5b6' }} /></span>
              <input type="email" name="email" className="form-control border-start-0" value={formData.email} onChange={handleChange} required style={{ borderRadius: '0 10px 10px 0' }} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaPhone style={{ color: '#2fa5b6' }} /></span>
              <input type="tel" name="phone" className="form-control border-start-0" value={formData.phone} onChange={handleChange} required style={{ borderRadius: '0 10px 10px 0' }} />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" style={{ borderRadius: '10px' }} />
          </div>
          <button type="submit" className="btn w-100 py-2 fw-bold text-white" disabled={loading} style={{ backgroundColor: '#2fa5b6', borderRadius: '10px' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="mb-0 small text-muted">Already have an account? <Link to="/login" style={{ color: '#2fa5b6' }} className="fw-semibold">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;