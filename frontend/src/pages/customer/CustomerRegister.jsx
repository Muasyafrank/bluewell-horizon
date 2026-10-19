import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api';
import { useCustomer } from '../../context/CustomerContext';
import { SEO } from '../../components/common';
import { Button, Field, Alert } from '../../components/ui';
import AuthLayout from '../../components/marketing/AuthLayout';
import { email, kenyanPhone, minLength, required, validate } from '../../utils/validation';
import { toastError, toastSuccess } from '../../utils/toast';

const RULES = {
  name: [required('Tell us your name')],
  email: [required('We need an email address'), email()],
  phone: [required('We need a phone number for deliveries'), kenyanPhone()],
  password: [required('Choose a password'), minLength(8, 'Use at least 8 characters')],
};

export default function CustomerRegister() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useCustomer();
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const redirectTo = location.state?.from || '/account';
  const wasRedirected = Boolean(location.state?.from);
  const handleSubmit = async (event) => {
    event.preventDefault();

    // The form only enforced a 6-character minimum via the browser's own
    // `minLength`, with no feedback on anything else.
    const validationErrors = validate(values, RULES);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const data = await authApi.customerRegister(values);
      login(data.token, data.customer);
      toastSuccess(`Welcome to Bluewell Horizon, ${data.customer.name.split(' ')[0]}`);
      navigate(redirectTo, {replace:true});
    } catch (error) {
      toastError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Create an account" path="/register" noIndex />

      <AuthLayout
        title="Create an account"
        subtitle="Track orders and check out faster next time."
        notice={wasRedirected ? <Alert tone="info">Please sign in or create an account to continue.</Alert> : null}
        footer={
          <>
            Already registered? <Link to="/login" state={location.state}>Sign in</Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Full name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
            required
          />
          <Field
            label="Email address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
          />
          <Field
            label="Phone number"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
            autoComplete="tel"
            placeholder="0712 345 678"
            required
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            hint="At least 8 characters."
            autoComplete="new-password"
            required
          />

          <Button type="submit" block size="lg" loading={submitting} loadingText="Creating account">
            Create account
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}
