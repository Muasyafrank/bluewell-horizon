import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';
import { SEO } from '../../components/common';
import { Button, Field, Alert } from '../../components/ui';
import AuthLayout from '../../components/marketing/AuthLayout';
import { toastError } from '../../utils/toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (error) {
      toastError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Reset password" path="/forgot-password" noIndex />

      <AuthLayout
        title="Forgot your password?"
        subtitle="Enter your email and we will send you a link to choose a new one."
        footer={<Link to="/login">Back to sign in</Link>}
      >
        {sent ? (
          <Alert tone="success">
            If that email is registered, a reset link is on its way. It expires in one hour. Check your spam folder if
            it does not arrive.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field
              label="Email address"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
            <Button type="submit" block size="lg" loading={submitting} loadingText="Sending">
              Send reset link
            </Button>
          </form>
        )}
      </AuthLayout>
    </>
  );
}
