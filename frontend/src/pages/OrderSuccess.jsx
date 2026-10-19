
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { SEO } from '../components/common';
import { Button, Card } from '../components/ui';
import { CONTACT_DETAILS } from '../data/company';

export default function OrderSuccess() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;
  const email = location.state?.email;

  // Prevent access without a real order
  if (!orderNumber) return <Navigate to="/shop" replace />;

  return (
    <>
      <SEO title="Order placed" path="/order-success" noIndex />

      <header className="bw-band bw-page-hero bw-page-hero--plain bw-page-hero--sm bw-page-hero--center">
        <div className="container">
          <div className="bw-success-icon" aria-hidden="true">
            <FaCheckCircle />
          </div>
          <h1 className="bw-page-hero__title">Order placed</h1>
          <p className="bw-lead bw-page-hero__lead">
            Thanks, we have your order and will start processing it right away.
          </p>
        </div>
      </header>

      <section className="bw-section">
        <div className="container bw-success">
          <Card className="bw-order-number-card">
            <p className="small text-muted mb-1">Your order number</p>
            <p className="h3 bw-price mb-0">{orderNumber}</p>
          </Card>

          <p className="text-muted mt-4 mb-2">
            A confirmation is on its way
            {email ? ` to ${email}` : ''}. Quote this number if you pay by M-Pesa or bank transfer.
          </p>
          <p className="small text-muted mb-4">
            Questions about the order? Call {CONTACT_DETAILS.phones[0]} or email {CONTACT_DETAILS.email}.
          </p>

          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Button to="/shop" variant="outline" icon={<FaShoppingBag aria-hidden="true" />}>
              Continue shopping
            </Button>
            <Button to="/account">View my orders</Button>
          </div>
        </div>
      </section>
    </>
  );
}
