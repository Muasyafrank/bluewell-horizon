import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useCustomer } from '../../context/CustomerContext';
import { SEO } from '../../components/common';
import { Button, Field } from '../../components/ui';
import { toastError, toastSuccess } from '../../utils/toast';

export default function CustomerLogin() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();

  // Return the visitor to whatever they were trying to reach.
  const redirectTo = location.state?.from || '/account';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const data = await authApi.customerLogin(values);
      login(data.token, data.customer);
      toastSuccess(`Welcome back, ${data.customer.name.split(' ')[0]}`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toastError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Sign in" path="/login" noIndex />

      <div className="bw-auth-shell">
        <div className="bw-auth-card">
          <div className="text-center mb-4">
            <Link to="/" aria-label="Bluewell Horizon, home">
              <img src="/logo.png" alt="" width="56" height="56" style={{ borderRadius: '50%' }} />
            </Link>
            <h1 className="h4 mt-3 mb-1">Welcome back</h1>
            <p className="small text-muted mb-0">Sign in to track your orders and repeat them.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Field
              label="Email address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
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
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
}
