import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'BWH-123456';

  return (
    <>
      <section className="py-5" style={{ backgroundColor: '#f8fafc', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" 
                     style={{ width: '100px', height: '100px', backgroundColor: '#d4f1e8', color: '#2fa5b6', fontSize: '3.5rem' }}>
                  <FaCheckCircle />
                </div>
              </div>
              <h1 className="display-5 fw-bold mb-3" style={{ color: '#0b2540' }}>
                Order Placed Successfully!
              </h1>
              <p className="lead mb-4" style={{ color: '#4a5568' }}>
                Thank you for your purchase. We've received your order and will process it shortly.
              </p>
              <div className="p-4 rounded-4 mb-5" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                <p className="mb-2 text-muted">Order Number</p>
                <h3 className="fw-bold mb-0" style={{ color: '#2fa5b6' }}>{orderNumber}</h3>
              </div>
              <div className="mb-5">
                <p className="text-muted mb-3">
                  We've sent a confirmation email to your inbox with order details.
                </p>
                <p className="small text-muted">
                  For inquiries, contact us at <strong>0721-633-223</strong> or <strong>bluewellsynergy@gmail.com</strong>
                </p>
              </div>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/shop" className="btn btn-outline-primary rounded-pill px-4">
                  <FaShoppingBag className="me-2" /> Continue Shopping
                </Link>
                <Link to="/contact" className="btn btn-primary rounded-pill px-4" style={{ backgroundColor: '#2fa5b6', border: 'none' }}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;