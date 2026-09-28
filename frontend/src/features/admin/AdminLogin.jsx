import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { authApi } from '../../api';
import { useAdmin } from '../../context/AdminContext';
import { SEO } from '../../components/common';
import { Button, Field } from '../../components/ui';
import { toastError, toastSuccess } from '../../utils/toast';

export default function AdminLogin() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      // Previously posted to /api/auth/login, a route that does not exist on
      // the server — every admin sign-in 404'd. The real route is
      // /api/admin/login.
      const data = await authApi.adminLogin(values);
      login(data.token);
      toastSuccess('Signed in');
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      toastError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin sign in" path="/admin/login" noIndex />

      <div className="bw-auth-shell">
        <div className="bw-auth-card">
          <div className="text-center mb-4">
            <span className="bw-feature-icon mx-auto" aria-hidden="true">
              <FaLock />
            </span>
            <h1 className="h4 mb-1">Admin portal</h1>
            <p className="small text-muted mb-0">Bluewell Horizon Limited</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Field
              label="Email address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              autoComplete="username"
              placeholder="admin@bluewellhorizon.com"
              required
            />
            <Field
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <Button type="submit" block size="lg" loading={submitting} loadingText="Signing in">
              Sign in
            </Button>
          </form>

          <p className="text-center small text-muted mt-4 mb-0">
            <Link to="/">Back to the site</Link>
          </p>
        </div>
      </div>
    </>
  );
}
