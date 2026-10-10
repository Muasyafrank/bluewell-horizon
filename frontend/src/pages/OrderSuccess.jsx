
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

      <section
        className="bw-section bw-section--tint bw-page bw-order-success"
        // style={{ paddingBottom: '5rem' }}
        style={{
          minHeight: '700px',
          padding: '120px 20px 100px',
          position: 'relative',
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">

              {/* Success Icon */}
              <div className="bw-empty__icon mb-3" aria-hidden="true">
                <FaCheckCircle />
              </div>

              {/* Heading */}
              <h1 className="display-6 fw-bold mb-2">
                Order placed
              </h1>

              <p className="bw-lead mx-auto mb-4">
                Thanks  we have your order and will start processing it right away.
              </p>

              {/* Order Number */}
              <Card className="mb-3 bw-order-number-card">
                <p className="small text-muted mb-1">
                  Your order number
                </p>

                <p className="h4 bw-price mb-0">
                  {orderNumber}
                </p>
              </Card>

              {/* Confirmation */}
              <p className="text-muted mb-2">
                A confirmation is on its way
                {email ? ` to ${email}` : ''}.
                Quote this number if you pay by M-Pesa or bank transfer.
              </p>

              <p className="small text-muted mb-4">
                Questions about the order? Call {CONTACT_DETAILS.phones[0]} or email{' '}
                {CONTACT_DETAILS.email}.
              </p>

              {/* Actions */}
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Button
                  to="/shop"
                  variant="outline"
                  icon={<FaShoppingBag aria-hidden="true" />}
                >
                  Continue shopping
                </Button>

                <Button to="/account">
                  View my orders
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
