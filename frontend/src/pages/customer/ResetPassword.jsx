import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api';
import { SEO } from '../../components/common';
import { Button, Field, Alert } from '../../components/ui';
import AuthLayout from '../../components/marketing/AuthLayout';
import { toastError, toastSuccess } from '../../utils/toast';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const [values, setValues] = useState({ password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const [problem, setProblem] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (values.password.length < 8) {
      setProblem('Use at least 8 characters.');
      return;
    }
    if (values.password !== values.confirm) {
      setProblem('The two passwords do not match.');
      return;
    }
    setProblem('');
    setSubmitting(true);
    try {
      await authApi.resetPassword(token, values.password);
      toastSuccess('Password updated. Please sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      toastError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Choose a new password" path="/reset-password" noIndex />

      <AuthLayout
        title="Choose a new password"
        subtitle="Pick something you have not used elsewhere."
        footer={<Link to="/forgot-password">Need a new link?</Link>}
      >
        {!token ? (
          <Alert tone="danger">This reset link is incomplete. Please request a new one.</Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {problem ? <Alert tone="danger">{problem}</Alert> : null}
            <Field
              label="New password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <Field
              label="Confirm new password"
              name="confirm"
              type="password"
              value={values.confirm}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <Button type="submit" block size="lg" loading={submitting} loadingText="Saving">
              Update password
            </Button>
          </form>
        )}
      </AuthLayout>
    </>
  );
}
