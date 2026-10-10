import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaLock, FaPhoneAlt, FaTruck } from 'react-icons/fa';
import { ordersApi } from '../api';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { SEO, Image } from '../components/common';
import { PageBanner } from '../components/layout';
import { Button, Card, Field, SearchableSelect } from '../components/ui';
import { COUNTIES, VAT_RATE, getDeliveryOption } from '../utils/kenyanData';
import { email, kenyanPhone, required, validate } from '../utils/validation';
import { toastError } from '../utils/toast';
import { CONTACT_DETAILS } from '../data/company';

// Payment method and delivery method selection were removed from this page
// on request. A real order still needs some value in both fields on the
// backend, and the business still needs to know how the customer intends to
// be reached about payment — so rather than silently guess, every order now
// says plainly it will be followed up by phone. "standard" delivery is used
// internally for the ETA shown and for the (hidden) fee calculation the
// admin dashboard still relies on for its own totals.
const DEFAULT_DELIVERY_METHOD = 'standard';
const DEFAULT_PAYMENT_METHOD = 'cod';

const INITIAL_VALUES = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  companyName: '',
  kraPin: '',
  county: '',
  estate: '',
  streetAddress: '',
  addressDetails: '',
  notes: '',
};

function buildRules() {
  return {
    customerName: [required('Tell us who the order is for')],
    customerEmail: [required('We need an email for confirmation'), email()],
    customerPhone: [required('We need a phone number to arrange delivery and payment'), kenyanPhone()],
    county: [required('Choose a county so we can arrange delivery')],
    estate: [required('Which estate or area?')],
    streetAddress: [required('Add a street name and number')],
  };
}

export default function Checkout() {
  const navigate = useNavigate();
  const { token, isAuthenticated, user: customer } = useCustomer();
  const { items, count, subtotal, isEmpty, clearCart } = useCart();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);

  useEffect(() => {
    if (isEmpty && !submitting) navigate('/shop', { replace: true });
  }, [isEmpty, submitting, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !customer) return;
    setValues((current) => ({
      ...current,
      customerName: current.customerName || customer.name || '',
      customerEmail: current.customerEmail || customer.email || '',
      customerPhone: current.customerPhone || customer.phone || '',
    }));
  }, [isAuthenticated, customer]);

  // Not shown anywhere on this page — computed only so the order record
  // created on the backend (and the admin dashboard that reads it) still has
  // real numbers to work with.
  const { deliveryFee, vatAmount, total } = useMemo(() => {
    const fee = values.county ? getDeliveryOption(values.county, DEFAULT_DELIVERY_METHOD).fee : 0;
    const vat = (subtotal + fee) * VAT_RATE;
    return { deliveryFee: fee, vatAmount: vat, total: subtotal + fee + vat };
  }, [subtotal, values.county]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(values, buildRules());
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toastError('Check the highlighted fields and try again');
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const response = await ordersApi.checkout(
        {
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          customerPhone: values.customerPhone,
          companyName: values.companyName,
          kraPin: values.kraPin,
          county: values.county,
          estate: values.estate,
          streetAddress: values.streetAddress,
          buildingName: values.addressDetails,
          deliveryMethod: DEFAULT_DELIVERY_METHOD,
          paymentMethod: DEFAULT_PAYMENT_METHOD,
          notes: values.notes,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
            image: item.image,
          })),
          subtotal,
          deliveryFee,
          vatAmount,
          totalAmount: total,
        },
        { token: isAuthenticated ? token : undefined },
      );

      clearCart();
      navigate('/order-success', {
        replace: true,
        state: { orderNumber: response.orderNumber, email: values.customerEmail },
      });
    } catch (error) {
      toastError(error.message);
      setSubmitting(false);
    }
  };

  if (isEmpty) return null;

  return (
    <>
      <SEO
        title="Checkout"
        description="Submit your order and we'll be in touch to arrange delivery and payment."
        path="/checkout"
        noIndex
      />

      <PageBanner
        eyebrow="Checkout"
        title="Submit your order"
        lead="Give us your details and delivery address — we'll call to confirm delivery and payment."
        image="/images/gallery-5.png"
      />

      <section className="bw-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit} noValidate>
                <Card tint className="mb-4">
                  <h2 className="h5 d-flex align-items-center gap-2 mb-4">
                    <FaPhoneAlt aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Your details
                  </h2>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Field
                        label="Full name"
                        name="customerName"
                        value={values.customerName}
                        onChange={handleChange}
                        error={errors.customerName}
                        autoComplete="name"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Email address"
                        name="customerEmail"
                        type="email"
                        value={values.customerEmail}
                        onChange={handleChange}
                        error={errors.customerEmail}
                        autoComplete="email"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        label="Phone number"
                        name="customerPhone"
                        type="tel"
                        value={values.customerPhone}
                        onChange={handleChange}
                        error={errors.customerPhone}
                        hint="We'll call this number to confirm delivery and payment."
                        autoComplete="tel"
                        required
                        className="mb-0"
                      />
                    </div>
                  </div>

                  {!showBusinessDetails ? (
                    <button
                      type="button"
                      className="btn btn-link p-0 mt-3 d-inline-flex align-items-center gap-2 text-decoration-none"
                      style={{ color: 'var(--bw-teal-dark)', fontSize: '0.875rem' }}
                      onClick={() => setShowBusinessDetails(true)}
                    >
                      <FaChevronDown size={11} aria-hidden="true" />
                      Need a receipt for your business?
                    </button>
                  ) : (
                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <Field
                          label="Company name"
                          name="companyName"
                          value={values.companyName}
                          onChange={handleChange}
                          optional
                          autoComplete="organization"
                          className="mb-0"
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          label="KRA PIN"
                          name="kraPin"
                          value={values.kraPin}
                          onChange={handleChange}
                          optional
                          className="mb-0"
                        />
                      </div>
                    </div>
                  )}
                </Card>

                <Card tint className="mb-4">
                  <h2 className="h5 d-flex align-items-center gap-2 mb-4">
                    <FaTruck aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Delivery address
                  </h2>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <SearchableSelect
                        label="County"
                        name="county"
                        value={values.county}
                        onChange={handleChange}
                        options={COUNTIES}
                        error={errors.county}
                        placeholder="Start typing your county…"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Estate or area"
                        name="estate"
                        value={values.estate}
                        onChange={handleChange}
                        error={errors.estate}
                        placeholder="Kilimani"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        label="Street address"
                        name="streetAddress"
                        value={values.streetAddress}
                        onChange={handleChange}
                        error={errors.streetAddress}
                        autoComplete="street-address"
                        required
                        className="mb-0"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        label="Apartment, building or landmark"
                        name="addressDetails"
                        value={values.addressDetails}
                        onChange={handleChange}
                        optional
                        placeholder="e.g. Kilimani Heights, Apt 4B, opposite Yaya Centre"
                        className="mb-0"
                      />
                    </div>
                  </div>

                  {values.county ? (
                    <p className="small text-muted mt-3 mb-0">
                      Estimated delivery to {values.county}: {getDeliveryOption(values.county, DEFAULT_DELIVERY_METHOD).eta}
                    </p>
                  ) : null}
                </Card>

                <Card tint className="mb-4">
                  <Field
                    label="Delivery notes"
                    name="notes"
                    as="textarea"
                    rows={2}
                    value={values.notes}
                    onChange={handleChange}
                    optional
                    placeholder="Gate code, preferred delivery time…"
                    className="mb-0"
                  />
                </Card>

                <Button type="submit" size="lg" block loading={submitting} loadingText="Submitting your order" icon={<FaLock aria-hidden="true" />}>
                  Place order
                </Button>

                <p className="text-center small text-muted mt-3 mb-0">
                  We'll call you shortly after to confirm delivery and arrange payment.
                </p>
              </form>
            </div>

            <div className="col-lg-5">
              <Card tint className="bw-sticky-aside">
                <h2 className="h5 mb-4">Your order</h2>
                <ul className="list-unstyled mb-0">
                  {items.map((item) => (
                    <li className="d-flex gap-3 pb-3 mb-3 border-bottom" key={item.id}>
                      <Image src={item.image} alt="" className="bw-thumb bw-thumb--sm" />
                      <div className="flex-grow-1">
                        <p className="fw-semibold mb-1" style={{ fontSize: '0.875rem' }}>
                          {item.name}
                        </p>
                        <p className="small text-muted mb-0">Quantity: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="small text-muted mb-0">
                  {count} {count === 1 ? 'item' : 'items'} in this order.
                </p>
              </Card>

              <p className="text-center small text-muted mt-4 mb-0">
                Need a hand with this order? Call {CONTACT_DETAILS.phones.join(' or ')}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}