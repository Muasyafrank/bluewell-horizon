import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { enquiriesApi } from '../api';
import { SEO } from '../components/common';
import { PageBanner } from '../components/layout';
import { Alert, Button, Card, Field } from '../components/ui';
import { CONTACT_DETAILS, QUOTE_SERVICE_OPTIONS } from '../data/company';
import { email, kenyanPhone, required, validate } from '../utils/validation';
import { toastError, toastSuccess } from '../utils/toast';

const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  serviceType: '',
  projectDetails: '',
};

const RULES = {
  name: [required('Tell us your name')],
  companyName: [required('Which organisation is this for?')],
  email: [required('We need an email for the proposal'), email()],
  phone: [required('A phone number helps us clarify details'), kenyanPhone()],
  serviceType: [required('Choose the type of project')],
  projectDetails: [required('Describe the project so we can scope it')],
};

const REASONS = [
  { title: 'Sized to your capacity', description: 'Specified against your throughput, water test and budget.' },
  { title: 'Engineer-led assessment', description: 'A free initial site assessment before anything is quoted.' },
  { title: 'Itemised pricing', description: 'Equipment, installation and commissioning listed separately.' },
  { title: 'Answered within a day', description: 'Every quote request gets a response inside one working day.' },
];

export default function Quote() {
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
      await enquiriesApi.submitQuote(values);
      setValues(INITIAL_VALUES);
      setSent(true);
      toastSuccess('Quote request received. We will be in touch within a working day.');
    } catch (error) {
      toastError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Request a quote"
        description="Request a custom quote for industrial water treatment, bottling plants, desalination or ultrapure water systems."
        keywords="water treatment quote Kenya, bottling plant cost, desalination system price, industrial water treatment Nairobi"
        path="/quote"
      />

      <PageBanner
        eyebrow="Request a quote"
        title="Tell us about the project"
        lead="For bottling lines, desalination and industrial systems, send us the requirements and we will put together a costed proposal."
      />

      <section className="bw-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              {sent ? (
                <Alert tone="success">
                  Quote request received. Our engineers will review it and contact you within one
                  working day.
                </Alert>
              ) : null}

              <Card tint>
                <h2 className="h5 mb-4">Project details</h2>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Field
                        label="Full name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                        autoComplete="name"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Company or organisation"
                        name="companyName"
                        value={values.companyName}
                        onChange={handleChange}
                        error={errors.companyName}
                        autoComplete="organization"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Email address"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
                        autoComplete="email"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Phone number"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        autoComplete="tel"
                        placeholder="+254 7XX XXX XXX"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        label="Type of project"
                        name="serviceType"
                        as="select"
                        value={values.serviceType}
                        onChange={handleChange}
                        error={errors.serviceType}
                        required
                        className="mb-0"
                      >
                        <option value="">Select a project type</option>
                        {QUOTE_SERVICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field
                        label="Requirements"
                        name="projectDetails"
                        as="textarea"
                        rows={6}
                        value={values.projectDetails}
                        onChange={handleChange}
                        error={errors.projectDetails}
                        placeholder="Scope, expected capacity, site location, timelines and anything else we should know."
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-12">
                      <Button
                        type="submit"
                        size="lg"
                        loading={submitting}
                        loadingText="Sending"
                        icon={<FaPaperPlane aria-hidden="true" />}
                      >
                        Request a quote
                      </Button>
                    </div>
                  </div>
                </form>
              </Card>
            </div>

            <div className="col-lg-4">
              <div className="bw-card bw-sticky-aside" style={{ backgroundColor: 'var(--bw-navy)', borderColor: 'var(--bw-navy)' }}>
                <h2 className="h5 mb-4" style={{ color: 'var(--bw-white)' }}>
                  What you get
                </h2>
                <ul className="list-unstyled mb-4">
                  {REASONS.map((reason) => (
                    <li className="mb-4" key={reason.title}>
                      <strong className="d-block mb-1" style={{ color: 'var(--bw-white)' }}>
                        {reason.title}
                      </strong>
                      <span className="small" style={{ color: 'var(--bw-text-on-dark)' }}>
                        {reason.description}
                      </span>
                    </li>
                  ))}
                </ul>

                <hr style={{ borderColor: 'rgba(255,255,255,0.12)' }} />

                <p className="small mb-2" style={{ color: 'var(--bw-text-on-dark-muted)' }}>
                  Prefer to talk it through?
                </p>
                {CONTACT_DETAILS.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="d-block fw-bold"
                    style={{ color: 'var(--bw-teal-light)' }}
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
