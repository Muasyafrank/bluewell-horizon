import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useAdmin } from '../../context/AdminContext';
import { SEO } from '../../components/common';
import { Button, Field } from '../../components/ui';
import { toastError } from '../../utils/toast';
import '../../styles/staff.css';

export default function StaffLogin() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/staff" replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const data = await authApi.adminLogin(values);
      login(data.token);
      navigate('/staff', { replace: true });
    } catch (error) {
      toastError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Staff sign in" path="/staff/login" noIndex />
      <div className="bms-login">
        <div className="bms-login__card">
          <img className="bms-login__logo" src="/logo.png" alt="Bluewell Horizon" />
          <p className="bw-eyebrow">Staff only</p>
          <h1>Business system</h1>
          <p className="small text-muted text-center mb-4">Sign in with your staff account.</p>
          <form onSubmit={handleSubmit}>
            <Field label="Email address" name="email" type="email" value={values.email} onChange={handleChange}
              autoComplete="username" required />
            <Field label="Password" name="password" type="password" value={values.password} onChange={handleChange}
              autoComplete="current-password" required />
            <Button type="submit" block size="lg" loading={submitting} loadingText="Signing in">Sign in</Button>
          </form>
          <p className="text-center small text-muted mt-4 mb-0"><Link to="/">Back to the site</Link></p>
        </div>
      </div>
    </>
  );
}
