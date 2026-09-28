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

  // Reaching this page without placing an order used to show a fabricated
  // order number ("BWH-123456"), which looked like a real confirmation.
  if (!orderNumber) return <Navigate to="/shop" replace />;

  return (
    <>
      <SEO title="Order placed" path="/order-success" noIndex />

      <section className="bw-section bw-section--tint bw-page">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">
              <div className="bw-empty__icon mb-4" aria-hidden="true">
                <FaCheckCircle />
              </div>

              <h1 className="display-6 fw-bold mb-3">Order placed</h1>
              <p className="bw-lead mx-auto mb-5">
                Thanks — we have your order and will start processing it right away.
              </p>

              <Card className="mb-5">
                <p className="small text-muted mb-2">Your order number</p>
                <p className="h4 bw-price mb-0">{orderNumber}</p>
              </Card>

              <p className="text-muted mb-2">
                A confirmation is on its way{email ? ` to ${email}` : ''}. Quote this number if you
                pay by M-Pesa or bank transfer.
              </p>
              <p className="small text-muted mb-5">
                Questions about the order? Call {CONTACT_DETAILS.phones[0]} or email{' '}
                {CONTACT_DETAILS.email}.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Button to="/shop" variant="outline" icon={<FaShoppingBag aria-hidden="true" />}>
                  Continue shopping
                </Button>
                <Button to="/account">View my orders</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
