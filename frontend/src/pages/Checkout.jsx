import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaPhoneAlt, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { ordersApi } from '../api';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { SEO, Image } from '../components/common';
import { PageBanner } from '../components/layout';
import { Button, Card, Field } from '../components/ui';
import DeliveryOptions from '../components/checkout/DeliveryOptions';
import PaymentOptions from '../components/checkout/PaymentOptions';
import OrderSummary from '../components/shop/OrderSummary';
import { COUNTIES, VAT_RATE, getDeliveryOption } from '../utils/kenyanData';
import { formatCurrency } from '../utils/format';
import { email, kenyanPhone, required, validate } from '../utils/validation';
import { toastError } from '../utils/toast';
import { CONTACT_DETAILS } from '../data/company';

const INITIAL_VALUES = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  companyName: '',
  kraPin: '',
  county: '',
  constituency: '',
  estate: '',
  streetAddress: '',
  buildingName: '',
  apartmentNumber: '',
  poBox: '',
  postalCode: '',
  deliveryMethod: 'standard',
  paymentMethod: 'mpesa',
  mpesaPhone: '',
  mpesaReference: '',
  notes: '',
};

/** Validation rules, applied on submit and re-checked as fields are corrected. */
function buildRules(values) {
  const rules = {
    customerName: [required('Tell us who the order is for')],
    customerEmail: [required('We need an email for the receipt'), email()],
    customerPhone: [required('We need a phone number for delivery'), kenyanPhone()],
    county: [required('Choose a county so we can price delivery')],
    estate: [required('Which estate or area?')],
    streetAddress: [required('Add a street name and number')],
  };

  if (values.paymentMethod === 'mpesa') {
    rules.mpesaPhone = [required('Enter the number that paid'), kenyanPhone()];
    rules.mpesaReference = [required('Enter the M-Pesa confirmation code')];
  }

  return rules;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { token, isAuthenticated, user: customer } = useCustomer();
  const { items, count, subtotal, isEmpty, clearCart } = useCart();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Send shoppers back to the shop only once, and only when the cart is empty
  // for real — the old effect raced the cart's own load and sometimes bounced
  // people out of a checkout they had just opened.
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
      mpesaPhone: current.mpesaPhone || customer.phone || '',
    }));
  }, [isAuthenticated, customer]);

  const { deliveryFee, vatAmount, total } = useMemo(() => {
    const fee = values.county ? getDeliveryOption(values.county, values.deliveryMethod).fee : 0;
    const vat = (subtotal + fee) * VAT_RATE;
    return { deliveryFee: fee, vatAmount: vat, total: subtotal + fee + vat };
  }, [subtotal, values.county, values.deliveryMethod]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(values, buildRules(values));
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
          ...values,
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
        // Sending the token links the order to the signed-in account, so it
        // shows up in their order history.
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
        description="Complete your order with M-Pesa, bank transfer or cash on delivery."
        path="/checkout"
        noIndex
      />

      <PageBanner
        eyebrow="Checkout"
        title="Complete your order"
        lead="Delivery is priced by county. Everything is confirmed by email once the order is placed."
        image="/images/gallery-5.png"
      />

      <section className="bw-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit} noValidate>
                <Card tint className="mb-4">
                  <h2 className="h5 d-flex align-items-center gap-2 mb-4">
                    <FaPhoneAlt aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Contact details
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
                        hint="07XX XXX XXX or +254 7XX XXX XXX"
                        autoComplete="tel"
                        required
                        className="mb-0"
                      />
                    </div>
                  </div>
                </Card>

                <Card tint className="mb-4">
                  <h2 className="h5 mb-1">Business details</h2>
                  <p className="small text-muted mb-4">Only needed if you want an ETR receipt.</p>
                  <div className="row g-3">
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
                </Card>

                <Card tint className="mb-4">
                  <h2 className="h5 d-flex align-items-center gap-2 mb-4">
                    <FaTruck aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Delivery address
                  </h2>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Field
                        label="County"
                        name="county"
                        as="select"
                        value={values.county}
                        onChange={handleChange}
                        error={errors.county}
                        required
                        className="mb-0"
                      >
                        <option value="">Select a county</option>
                        {COUNTIES.map((county) => (
                          <option key={county} value={county}>
                            {county}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Constituency"
                        name="constituency"
                        value={values.constituency}
                        onChange={handleChange}
                        optional
                        placeholder="Westlands"
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
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                      <Field
                        label="Building name"
                        name="buildingName"
                        value={values.buildingName}
                        onChange={handleChange}
                        optional
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Apartment or house number"
                        name="apartmentNumber"
                        value={values.apartmentNumber}
                        onChange={handleChange}
                        optional
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="P.O. Box"
                        name="poBox"
                        value={values.poBox}
                        onChange={handleChange}
                        optional
                        className="mb-0"
                      />
                    </div>
                    <div className="col-md-6">
                      <Field
                        label="Postal code"
                        name="postalCode"
                        value={values.postalCode}
                        onChange={handleChange}
                        optional
                        autoComplete="postal-code"
                        placeholder="00100"
                        className="mb-0"
                      />
                    </div>
                  </div>
                </Card>

                <Card tint className="mb-4">
                  <DeliveryOptions
                    county={values.county}
                    value={values.deliveryMethod}
                    onChange={handleChange}
                  />
                </Card>

                <Card tint className="mb-4">
                  <PaymentOptions
                    values={values}
                    errors={errors}
                    onChange={handleChange}
                    total={total}
                  />
                </Card>

                <Card tint className="mb-4">
                  <Field
                    label="Order notes"
                    name="notes"
                    as="textarea"
                    rows={3}
                    value={values.notes}
                    onChange={handleChange}
                    optional
                    placeholder="Gate code, landmark, preferred delivery time…"
                    className="mb-0"
                  />
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  block
                  loading={submitting}
                  loadingText="Placing your order"
                  icon={<FaLock aria-hidden="true" />}
                >
                  Place order · {formatCurrency(total)}
                </Button>

                <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-4 mt-4 mb-0 small text-muted">
                  <li className="d-flex align-items-center gap-2">
                    <FaShieldAlt aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Secure checkout
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaCheckCircle aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Genuine equipment
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <FaTruck aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Nationwide delivery
                  </li>
                </ul>
              </form>
            </div>

            <div className="col-lg-5">
              <OrderSummary
                itemCount={count}
                total={total}
                rows={[
                  { label: 'Subtotal', value: subtotal },
                  { label: 'Delivery', value: values.county ? deliveryFee : 'Choose a county' },
                  { label: 'VAT (16%)', value: vatAmount },
                ]}
              >
                <ul className="list-unstyled mb-4" style={{ maxHeight: '18rem', overflowY: 'auto' }}>
                  {items.map((item) => (
                    <li className="d-flex gap-3 pb-3 mb-3 border-bottom" key={item.id}>
                      <Image src={item.image} alt="" className="bw-thumb bw-thumb--sm" />
                      <div className="flex-grow-1">
                        <p className="fw-semibold mb-1" style={{ fontSize: '0.875rem' }}>
                          {item.name}
                        </p>
                        <p className="small text-muted mb-1">Quantity: {item.quantity}</p>
                        <p className="small bw-price mb-0">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </OrderSummary>

              {values.county ? (
                <Card className="mt-4">
                  <p className="small fw-semibold d-flex align-items-center gap-2 mb-1">
                    <FaTruck aria-hidden="true" style={{ color: 'var(--bw-teal)' }} />
                    Delivery to {values.county}
                  </p>
                  <p className="small text-muted mb-0">
                    {getDeliveryOption(values.county, values.deliveryMethod).eta}
                  </p>
                </Card>
              ) : null}

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
