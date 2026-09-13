import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPhoneAlt, FaCreditCard, FaMoneyBillWave, FaTruck, FaStore, FaCheckCircle, FaShieldAlt, FaLock, FaMobileAlt } from 'react-icons/fa';
// import { SiSafaricom } from 'react-icons/si';
import SEO from '../components/SEO';
import WaterLoader from '../components/WaterLoader';
import { useCustomer } from '../context/CustomerContext';
import { getCart, getCartTotal, getCartCount, clearCart } from '../utils/cart';
import { counties, deliveryZones, getDeliveryZone, mpesaDetails, bankDetails } from '../utils/kenyanData';
import { toastSuccess, toastError, toastLoading, toastDismiss } from '../utils/toast';

const Checkout = () => {
  const { token, isAuthenticated, customer } = useCustomer();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = getCart();
    if (savedCart.length === 0) {
      navigate('/shop');
    } else {
      setCart(savedCart);
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated && customer) {
      setFormData(prev => ({
        ...prev,
        customerName: customer.name || '',
        customerEmail: customer.email || '',
        customerPhone: customer.phone || '',
        mpesaPhone: customer.phone || ''
      }));
    }
  }, [isAuthenticated, customer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = getCartTotal();
  const vatRate = 0.16; // 16% VAT in Kenya
  const vatAmount = subtotal * vatRate;
  
  // Calculate delivery fee based on county and method
  const getDeliveryFee = () => {
    if (!formData.county) return 0;
    const zone = getDeliveryZone(formData.county);
    const zoneData = deliveryZones[zone];
    return zoneData[formData.deliveryMethod]?.fee || 0;
  };

  const deliveryFee = getDeliveryFee();
  const totalBeforeVat = subtotal + deliveryFee;
  const total = totalBeforeVat + vatAmount;

  const validatePhone = (phone) => {
    const kenyanPhone = /^(?:\+?254|0)?[71]\d{8}$/;
    return kenyanPhone.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhone(formData.customerPhone)) {
      toastError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    if (formData.paymentMethod === 'mpesa' && !validatePhone(formData.mpesaPhone)) {
      toastError('Please enter a valid M-Pesa phone number');
      return;
    }

    setLoading(true);
    const loadingToast = toastLoading('Processing your order...');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const orderData = {
        ...formData,
        items: cart,
        subtotal,
        deliveryFee,
        vatAmount,
        totalAmount: total
      };

      const res = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok) {
        toastDismiss(loadingToast);
        toastSuccess(`Order placed successfully! Order #${data.orderNumber}`);
        clearCart();
        setTimeout(() => navigate('/order-success', { state: { orderNumber: data.orderNumber } }), 1000);
      } else {
        toastDismiss(loadingToast);
        toastError(data.message || 'Error placing order. Please try again.');
      }
    } catch (error) {
      toastDismiss(loadingToast);
      toastError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <WaterLoader text="Loading checkout..." />;
  }

  return (
    <>
      <SEO 
        title="Checkout - Complete Your Order"
        description="Complete your water treatment products order with secure M-Pesa, bank transfer, or cash on delivery payment options."
        url="https://www.bluewellhorizonlimited.com/checkout"
      />

      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#0b2540' }}>
            <span className="fst-italic" style={{ color: '#2fa5b6' }}>Checkout</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568' }}>
            Complete your order by filling in your details below.
          </p>
        </div>
      </section>

      {/* Checkout Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>
                    <FaPhoneAlt className="me-2" style={{ color: '#2fa5b6' }} />
                    Contact Information
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="0712 345 678"
                        required
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                      <small className="text-muted">Format: 07XX XXX XXX or +254 7XX XXX XXX</small>
                    </div>
                  </div>
                </div>

                {/* Business Information (Optional) */}
                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>
                    Business Information <small className="text-muted fw-normal">(Optional)</small>
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="For business orders"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>KRA PIN</label>
                      <input
                        type="text"
                        className="form-control"
                        name="kraPin"
                        value={formData.kraPin}
                        onChange={handleChange}
                        placeholder="For ETR receipt"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>
                    <FaTruck className="me-2" style={{ color: '#2fa5b6' }} />
                    Delivery Address
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>County *</label>
                      <select
                        className="form-select"
                        name="county"
                        value={formData.county}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      >
                        <option value="">Select County</option>
                        {counties.map(county => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Constituency</label>
                      <input
                        type="text"
                        className="form-control"
                        name="constituency"
                        value={formData.constituency}
                        onChange={handleChange}
                        placeholder="e.g., Westlands"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Estate / Area *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="estate"
                        value={formData.estate}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Kilimani, Karen"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Street Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        required
                        placeholder="Street name and number"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Building Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="buildingName"
                        value={formData.buildingName}
                        onChange={handleChange}
                        placeholder="Building or estate name"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Apartment / House No.</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apartmentNumber"
                        value={formData.apartmentNumber}
                        onChange={handleChange}
                        placeholder="e.g., Apt 3B"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>P.O. Box</label>
                      <input
                        type="text"
                        className="form-control"
                        name="poBox"
                        value={formData.poBox}
                        onChange={handleChange}
                        placeholder="e.g., 12345"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="e.g., 00100"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>
                    <FaTruck className="me-2" style={{ color: '#2fa5b6' }} />
                    Delivery Method
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="form-check p-3 rounded-3 h-100" style={{ 
                        backgroundColor: formData.deliveryMethod === 'standard' ? '#f0f9fa' : '#ffffff',
                        border: `2px solid ${formData.deliveryMethod === 'standard' ? '#2fa5b6' : '#e2e8f0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="deliveryMethod"
                          value="standard"
                          checked={formData.deliveryMethod === 'standard'}
                          onChange={handleChange}
                          id="standard"
                        />
                        <label className="form-check-label w-100 ms-2" htmlFor="standard">
                          <FaTruck className="mb-2" style={{ color: '#2fa5b6', fontSize: '1.5rem' }} />
                          <strong className="d-block" style={{ color: '#0b2540' }}>Standard Delivery</strong>
                          <small className="text-muted d-block">
                            {formData.county && deliveryZones[getDeliveryZone(formData.county)]?.standard?.days}
                          </small>
                          <strong className="d-block mt-1" style={{ color: '#2fa5b6' }}>
                            KES {deliveryZones[getDeliveryZone(formData.county || 'Nairobi')]?.standard?.fee || 300}
                          </strong>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check p-3 rounded-3 h-100" style={{ 
                        backgroundColor: formData.deliveryMethod === 'express' ? '#f0f9fa' : '#ffffff',
                        border: `2px solid ${formData.deliveryMethod === 'express' ? '#2fa5b6' : '#e2e8f0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="deliveryMethod"
                          value="express"
                          checked={formData.deliveryMethod === 'express'}
                          onChange={handleChange}
                          id="express"
                        />
                        <label className="form-check-label w-100 ms-2" htmlFor="express">
                          <FaTruck className="mb-2" style={{ color: '#2fa5b6', fontSize: '1.5rem' }} />
                          <strong className="d-block" style={{ color: '#0b2540' }}>Express Delivery</strong>
                          <small className="text-muted d-block">
                            {formData.county && deliveryZones[getDeliveryZone(formData.county)]?.express?.days}
                          </small>
                          <strong className="d-block mt-1" style={{ color: '#2fa5b6' }}>
                            KES {deliveryZones[getDeliveryZone(formData.county || 'Nairobi')]?.express?.fee || 500}
                          </strong>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check p-3 rounded-3 h-100" style={{ 
                        backgroundColor: formData.deliveryMethod === 'pickup' ? '#f0f9fa' : '#ffffff',
                        border: `2px solid ${formData.deliveryMethod === 'pickup' ? '#2fa5b6' : '#e2e8f0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="deliveryMethod"
                          value="pickup"
                          checked={formData.deliveryMethod === 'pickup'}
                          onChange={handleChange}
                          id="pickup"
                        />
                        <label className="form-check-label w-100 ms-2" htmlFor="pickup">
                          <FaStore className="mb-2" style={{ color: '#2fa5b6', fontSize: '1.5rem' }} />
                          <strong className="d-block" style={{ color: '#0b2540' }}>Pickup</strong>
                          <small className="text-muted d-block">
                            Collect from Harambee Estate
                          </small>
                          <strong className="d-block mt-1" style={{ color: '#2fa5b6' }}>
                            FREE
                          </strong>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>
                    Payment Method
                  </h4>
                  
                  {/* M-Pesa Option */}
                  <div className="form-check p-3 mb-3 rounded-3" style={{ 
                    backgroundColor: formData.paymentMethod === 'mpesa' ? '#f0f9fa' : '#ffffff',
                    border: `2px solid ${formData.paymentMethod === 'mpesa' ? '#2fa5b6' : '#e2e8f0'}`
                  }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={formData.paymentMethod === 'mpesa'}
                      onChange={handleChange}
                      id="mpesa"
                    />
                    <label className="form-check-label w-100 ms-2" htmlFor="mpesa">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaMobileAlt style={{ color: '#4CAF50', fontSize: '1.5rem' }} />
                        <div>
                          <strong className="d-block" style={{ color: '#0b2540' }}>M-Pesa</strong>
                          <small className="text-muted">Pay via M-Pesa (Paybill or Till Number)</small>
                        </div>
                      </div>
                      {formData.paymentMethod === 'mpesa' && (
                        <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#ffffff', border: '1px solid #d1e8eb' }}>
                          <p className="mb-2 small fw-semibold" style={{ color: '#0b2540' }}>M-Pesa Payment Instructions:</p>
                          <ol className="small mb-3 ps-3" style={{ color: '#4a5568' }}>
                            <li>Go to M-Pesa on your phone</li>
                            <li>Select Lipa na M-Pesa</li>
                            <li>Choose Paybill</li>
                            <li>Enter Business Number: <strong style={{ color: '#2fa5b6' }}>{mpesaDetails.paybill.number}</strong></li>
                            <li>Account Number: <strong style={{ color: '#2fa5b6' }}>Your Order Number</strong></li>
                            <li>Enter Amount: <strong style={{ color: '#2fa5b6' }}>KES {total.toLocaleString()}</strong></li>
                            <li>Enter M-Pesa PIN and send</li>
                          </ol>
                          <div className="row g-2">
                            <div className="col-md-6">
                              <label className="form-label small fw-semibold">M-Pesa Phone Number *</label>
                              <input
                                type="tel"
                                className="form-control form-control-sm"
                                name="mpesaPhone"
                                value={formData.mpesaPhone}
                                onChange={handleChange}
                                placeholder="0712 345 678"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-semibold">M-Pesa Reference Code *</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="mpesaReference"
                                value={formData.mpesaReference}
                                onChange={handleChange}
                                placeholder="e.g., QKL123ABC"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Bank Transfer Option */}
                  <div className="form-check p-3 mb-3 rounded-3" style={{ 
                    backgroundColor: formData.paymentMethod === 'bank_transfer' ? '#f0f9fa' : '#ffffff',
                    border: `2px solid ${formData.paymentMethod === 'bank_transfer' ? '#2fa5b6' : '#e2e8f0'}`
                  }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      id="bank_transfer"
                    />
                    <label className="form-check-label w-100 ms-2" htmlFor="bank_transfer">
                      <div className="d-flex align-items-center gap-2">
                        <FaCreditCard style={{ color: '#2fa5b6', fontSize: '1.5rem' }} />
                        <div>
                          <strong className="d-block" style={{ color: '#0b2540' }}>Bank Transfer</strong>
                          <small className="text-muted">Direct bank deposit or transfer</small>
                        </div>
                      </div>
                      {formData.paymentMethod === 'bank_transfer' && (
                        <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#ffffff', border: '1px solid #d1e8eb' }}>
                          <p className="mb-2 small fw-semibold" style={{ color: '#0b2540' }}>Bank Details:</p>
                          <div className="small" style={{ color: '#4a5568' }}>
                            <p className="mb-1"><strong>Bank:</strong> {bankDetails.bankName}</p>
                            <p className="mb-1"><strong>Account Name:</strong> {bankDetails.accountName}</p>
                            <p className="mb-1"><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                            <p className="mb-1"><strong>Branch:</strong> {bankDetails.branch}</p>
                            <p className="mb-0"><strong>Swift Code:</strong> {bankDetails.swiftCode}</p>
                          </div>
                          <p className="mt-2 mb-0 small text-muted">Please include your order number in the transfer reference.</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Cash on Delivery Option */}
                  <div className="form-check p-3 rounded-3" style={{ 
                    backgroundColor: formData.paymentMethod === 'cod' ? '#f0f9fa' : '#ffffff',
                    border: `2px solid ${formData.paymentMethod === 'cod' ? '#2fa5b6' : '#e2e8f0'}`
                  }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      id="cod"
                    />
                    <label className="form-check-label w-100 ms-2" htmlFor="cod">
                      <div className="d-flex align-items-center gap-2">
                        <FaMoneyBillWave style={{ color: '#2fa5b6', fontSize: '1.5rem' }} />
                        <div>
                          <strong className="d-block" style={{ color: '#0b2540' }}>Cash on Delivery</strong>
                          <small className="text-muted">Pay when you receive your order (Nairobi only)</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Order Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special delivery instructions or notes..."
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-lg w-100 rounded-pill py-3 fw-semibold"
                  style={{ backgroundColor: '#2fa5b6', border: 'none', color: '#ffffff', fontSize: '1.1rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FaLock className="me-2" />
                      Place Order - KES {total.toLocaleString()}
                    </>
                  )}
                </button>

                {/* Trust Signals */}
                <div className="mt-4 text-center">
                  <div className="d-inline-flex gap-3 flex-wrap justify-content-center">
                    <span className="d-flex align-items-center gap-1 small text-muted">
                      <FaShieldAlt style={{ color: '#2fa5b6' }} /> Secure Checkout
                    </span>
                    <span className="d-flex align-items-center gap-1 small text-muted">
                      <FaCheckCircle style={{ color: '#2fa5b6' }} /> 100% Genuine Products
                    </span>
                    <span className="d-flex align-items-center gap-1 small text-muted">
                      <FaTruck style={{ color: '#2fa5b6' }} /> Nationwide Delivery
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="col-lg-5">
              <div className="p-4 rounded-4" style={{ 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0',
                position: 'sticky',
                top: '100px'
              }}>
                <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Order Summary</h4>
                
                {/* Cart Items */}
                <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.9rem' }}>{item.name}</h6>
                        <p className="small text-muted mb-1">Qty: {item.quantity}</p>
                        <p className="fw-bold mb-0" style={{ color: '#2fa5b6', fontSize: '0.9rem' }}>
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3" style={{ borderTop: '2px solid #e2e8f0' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal ({getCartCount()} items)</span>
                    <span className="fw-semibold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Delivery Fee</span>
                    <span className="fw-semibold">KES {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <span className="text-muted">VAT (16%)</span>
                    <span className="fw-semibold">KES {vatAmount.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-2">
                    <span className="fw-bold fs-5" style={{ color: '#0b2540' }}>Total</span>
                    <span className="fw-bold fs-4" style={{ color: '#2fa5b6' }}>KES {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                {formData.county && (
                  <div className="mt-4 p-3 rounded-3" style={{ backgroundColor: '#ffffff', border: '1px solid #d1e8eb' }}>
                    <p className="small mb-1 fw-semibold" style={{ color: '#0b2540' }}>
                      <FaTruck className="me-2" style={{ color: '#2fa5b6' }} />
                      Delivery to {formData.county}
                    </p>
                    <p className="small text-muted mb-0">
                      {deliveryZones[getDeliveryZone(formData.county)]?.[formData.deliveryMethod]?.days}
                    </p>
                  </div>
                )}

                {/* Support Info */}
                <div className="mt-4 text-center">
                  <p className="small text-muted mb-2">Need help with your order?</p>
                  <p className="small fw-bold mb-0" style={{ color: '#2fa5b6' }}>
                    Call: 0721-633-223 / 0731-836-349
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;