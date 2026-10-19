import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { enquiriesApi } from '../../api';
import { Alert, Button, Field } from '../../components/ui';
import { CONTACT_SERVICE_OPTIONS } from '../../data/company';
import { email, kenyanPhone, required, validate } from '../../utils/validation';
import { toastError, toastSuccess } from '../../utils/toast';

const INITIAL_VALUES = { name: '', email: '', phone: '', service: '', message: '' };

const RULES = {
  name: [required('Tell us your name')],
  email: [required('We need an email to reply to'), email()],
  phone: [required('A phone number helps us respond faster'), kenyanPhone()],
  service: [required('Choose what you need help with')],
  message: [required('Tell us a little about your water')],
};

/** The consultation request form: validates, submits, and reports the result. */
export default function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(values, RULES);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await enquiriesApi.submitContact(values);
      setValues(INITIAL_VALUES);
      setSent(true);
      toastSuccess('Message sent. We will reply within one working day.');
    } catch (error) {
      toastError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {sent ? <Alert tone="success">Message received. We will be in touch shortly.</Alert> : null}

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <Field label="Full name" name="name" value={values.name} onChange={handleChange}
              error={errors.name} autoComplete="name" required className="mb-0" />
          </div>
          <div className="col-md-6">
            <Field label="Email address" name="email" type="email" value={values.email} onChange={handleChange}
              error={errors.email} autoComplete="email" required className="mb-0" />
          </div>
          <div className="col-md-6">
            <Field label="Phone number" name="phone" type="tel" value={values.phone} onChange={handleChange}
              error={errors.phone} autoComplete="tel" placeholder="0712 345 678" required className="mb-0" />
          </div>
          <div className="col-md-6">
            <Field label="What do you need?" name="service" as="select" value={values.service}
              onChange={handleChange} error={errors.service} required className="mb-0">
              <option value="">Select a service</option>
              {CONTACT_SERVICE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Field>
          </div>
          <div className="col-12">
            <Field label="Your message" name="message" as="textarea" rows={5} value={values.message}
              onChange={handleChange} error={errors.message} required className="mb-0"
              placeholder="Where you are, what the water is like, and what you would like it to do." />
          </div>
          <div className="col-12">
            <Button type="submit" size="lg" loading={submitting} loadingText="Sending"
              icon={<FaPaperPlane aria-hidden="true" />}>
              Send message
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
