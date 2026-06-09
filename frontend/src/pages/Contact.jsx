import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaClock, FaCheckCircle, FaAward } from 'react-icons/fa';
import { servicesData } from '../data/services'; // Updated import path


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! Our team will contact you shortly.");
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <>
      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
              Contact Us
            </span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2, maxWidth: '800px' }}>
            Let's start a <span className="fst-italic" style={{ color: '#2fa5b6' }}>conversation.</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568', maxWidth: '700px' }}>
            Reach out to our expert team for a free water diagnosis, system design consultation, or maintenance support.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-5">
            {/* Contact Info */}
            <div className="col-lg-5">
              <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Get in Touch</h4>
              <p className="mb-5" style={{ color: '#718096', lineHeight: 1.7 }}>
                Our team is ready to help you find the perfect water treatment solution for your needs.
              </p>

              <div className="d-flex gap-3 mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle" 
                     style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.95rem' }}>Location</h6>
                  <p className="mb-0" style={{ color: '#718096', fontSize: '0.95rem' }}>Harambee Estate, Kenya</p>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle" 
                     style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                  <FaPhone />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.95rem' }}>Phone</h6>
                  <p className="mb-0" style={{ color: '#718096', fontSize: '0.95rem' }}>0721-633-223 / 0731-836-349</p>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle" 
                     style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                  <FaEnvelope />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.95rem' }}>Email</h6>
                  <p className="mb-0" style={{ color: '#718096', fontSize: '0.95rem' }}>bluewellsynergy@gmail.com</p>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle" 
                     style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                  <FaGlobe />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#0b2540', fontSize: '0.95rem' }}>Website</h6>
                  <p className="mb-0" style={{ color: '#718096', fontSize: '0.95rem' }}>www.bluewellhorizonlimited.com</p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaClock className="text-info" style={{ color: '#2fa5b6' }} />
                  <h6 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Business Hours</h6>
                </div>
                <p className="mb-0 small" style={{ color: '#718096' }}>Monday - Saturday: 8:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="p-5 rounded-4" style={{ 
                border: '1px solid #e2e8f0', 
                backgroundColor: '#ffffff' 
              }}>
                <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Send us a Message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Full Name *</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} 
                             placeholder="John Doe" required 
                             style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Email Address *</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} 
                             placeholder="john@example.com" required 
                             style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Phone Number *</label>
                      <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} 
                             placeholder="+254 7XX XXX XXX" required 
                             style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Service Interested In</label>
                      <select className="form-select" name="service" value={formData.service} onChange={handleChange} required
                              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
                        <option value="">Select a service...</option>
                        {servicesData.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Message *</label>
                      <textarea className="form-control" rows="4" name="message" value={formData.message} onChange={handleChange} 
                                placeholder="Tell us about your water treatment needs..." required
                                style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-semibold"
                              style={{ backgroundColor: '#2fa5b6', border: 'none', fontSize: '1rem' }}>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" 
                     style={{ width: '64px', height: '64px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.5rem' }}>
                  <FaCheckCircle />
                </div>
                <h6 className="fw-bold mb-2" style={{ color: '#0b2540' }}>Free Diagnosis</h6>
                <p className="mb-0 small" style={{ color: '#718096' }}>Complimentary water quality analysis and system assessment</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" 
                     style={{ width: '64px', height: '64px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.5rem' }}>
                  <FaClock />
                </div>
                <h6 className="fw-bold mb-2" style={{ color: '#0b2540' }}>Fast Response</h6>
                <p className="mb-0 small" style={{ color: '#718096' }}>Quick turnaround times for all inquiries and support</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" 
                     style={{ width: '64px', height: '64px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.5rem' }}>
                  <FaAward />
                </div>
                <h6 className="fw-bold mb-2" style={{ color: '#0b2540' }}>Expert Advice</h6>
                <p className="mb-0 small" style={{ color: '#718096' }}>Professional guidance from certified water treatment specialists</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;