import React, { useState } from 'react';
import {
  FaClock, FaDirections, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt,
} from 'react-icons/fa';
import { enquiriesApi } from '../api';
import { SEO } from '../components/common';
import { PageBanner } from '../components/layout';
import { Alert, Button, Card, Field, SectionHeading } from '../components/ui';
import Marquee from '../components/marketing/Marquee';
import { CONTACT_DETAILS, CONTACT_SERVICE_OPTIONS } from '../data/company';
import { email, kenyanPhone, required, validate } from '../utils/validation';
import { toastError, toastSuccess } from '../utils/toast';

const INITIAL_VALUES = { name: '', email: '', phone: '', service: '', message: '' };

const RULES = {
  name: [required('Tell us your name')],
  email: [required('We need an email to reply to'), email()],
  phone: [required('A phone number helps us respond faster'), kenyanPhone()],
  service: [required('Choose what you need help with')],
  message: [required('Tell us a little about your water')],
};

const MARQUEE_ITEMS = [
  { icon: <FaMapMarkerAlt />, label: 'Location', value: CONTACT_DETAILS.address },
  { icon: <FaPhoneAlt />, label: 'Phone', value: CONTACT_DETAILS.phones.join(' / ') },
  { icon: <FaEnvelope />, label: 'Email', value: CONTACT_DETAILS.email },
  { icon: <FaClock />, label: 'Hours', value: CONTACT_DETAILS.hours },
];

export default function Contact() {
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

    // The form previously submitted with no client-side validation at all and
    // posted to an endpoint the backend never exposed, so every message failed
    // silently. The endpoint now exists; these rules catch typos first.
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
      <SEO
        title="Contact us"
        description="Contact Bluewell Horizon Limited for a free water consultation in Nairobi. Call 0721 633 223 or email bluewellsynergy@gmail.com."
        path="/contact"
      />

      <PageBanner
        eyebrow="Contact"
        title="Let’s talk about your water"
        lead="Tell us what your supply is doing and we will arrange a free test and consultation."
      />

      <Marquee items={MARQUEE_ITEMS} />

      <section className="bw-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <SectionHeading
                eyebrow="Find us"
                title="Visit the office"
                lead="We are in Harambee Estate, Nairobi. Drop in to talk through a system in person."
                className="mb-4"
              />

              <div className="rounded-4 overflow-hidden mb-4" style={{ border: '1px solid var(--bw-border)' }}>
                <iframe
                  src={CONTACT_DETAILS.mapsEmbed}
                  width="100%"
                  height="380"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map showing the Bluewell Horizon office in Harambee Estate, Nairobi"
                />
              </div>

              <Button
                href={CONTACT_DETAILS.mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                icon={<FaDirections aria-hidden="true" />}
              >
                Get directions
              </Button>

              <Card className="mt-4">
                <dl className="row mb-0 small">
                  <dt className="col-4 text-muted fw-normal">Address</dt>
                  <dd className="col-8">{CONTACT_DETAILS.address}</dd>
                  <dt className="col-4 text-muted fw-normal">Phone</dt>
                  <dd className="col-8">
                    {CONTACT_DETAILS.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="d-block">
                        {phone}
                      </a>
                    ))}
                  </dd>
                  <dt className="col-4 text-muted fw-normal">Email</dt>
                  <dd className="col-8">
                    <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>
                  </dd>
                  <dt className="col-4 text-muted fw-normal">Hours</dt>
                  <dd className="col-8 mb-0">{CONTACT_DETAILS.hours}</dd>
                </dl>
              </Card>
            </div>

            <div className="col-lg-6">
              <SectionHeading
                eyebrow="Send a message"
                title="Book a free consultation"
                lead="We reply to every enquiry within one working day."
                className="mb-4"
              />

              {sent ? <Alert tone="success">Message received. We will be in touch shortly.</Alert> : null}

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
                      placeholder="0712 345 678"
                      required
                      className="mb-0"
                    />
                  </div>
                  <div className="col-md-6">
                    <Field
                      label="What do you need?"
                      name="service"
                      as="select"
                      value={values.service}
                      onChange={handleChange}
                      error={errors.service}
                      required
                      className="mb-0"
                    >
                      <option value="">Select a service</option>
                      {CONTACT_SERVICE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="col-12">
                    <Field
                      label="Your message"
                      name="message"
                      as="textarea"
                      rows={5}
                      value={values.message}
                      onChange={handleChange}
                      error={errors.message}
                      placeholder="Where you are, what the water is like, and what you would like it to do."
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
                      Send message
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
