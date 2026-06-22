import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState(''); // Changed from username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // Send email
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8fafc' }}>
      <div className="p-5 rounded-4 shadow-sm" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#2fa5b6', color: '#fff' }}>
            <FaLock size={24} />
          </div>
          <h3 className="fw-bold" style={{ color: '#0b2540' }}>Admin Portal</h3>
          <p className="text-muted small">Bluewell Horizon Limited</p>
        </div>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaEnvelope style={{ color: '#2fa5b6' }} /></span>
              <input 
                type="email" 
                className="form-control border-start-0" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="admin@bluewellhorizon.com"
                style={{ borderRadius: '0 10px 10px 0' }} 
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required style={{ borderRadius: '10px' }} />
          </div>
          <button type="submit" className="btn w-100 py-2 fw-bold text-white" style={{ backgroundColor: '#2fa5b6', borderRadius: '10px' }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;