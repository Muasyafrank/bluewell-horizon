import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useCustomer } from '../../context/CustomerContext';
import { SEO } from '../../components/common';
import { Button, Field, Alert } from '../../components/ui';
import AuthLayout from '../../components/marketing/AuthLayout';
import { toastError, toastSuccess } from '../../utils/toast';

export default function CustomerLogin() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();

  // Return the visitor to whatever they were trying to reach.
  const redirectTo = location.state?.from || '/account';
  const wasRedirected = Boolean(location.state?.from);

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

      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to track your orders and repeat them."
        notice={wasRedirected ? <Alert tone="info">Please sign in or create an account to continue.</Alert> : null}
        footer={
          <>
            New here? <Link to="/register" state={location.state}>Create an account</Link>
          </>
        }
      >
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
      </AuthLayout>
    </>
  );
}
