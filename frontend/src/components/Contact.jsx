import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { servicesData } from '../data/data';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! Our team will contact you shortly.");
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <section className="py-5" style={{ background: 'linear-gradient(180deg, #06111c 0%, #091c2e 100%)' }}>
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
              <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Contact Us</span>
            </div>
            <h2 className="display-5 fw-bold mb-3">Let's secure your<br />clean water supply</h2>
            <p className="lead" style={{ color: '#95b5c4', maxWidth: '600px', fontWeight: '300' }}>
              Reach out to our expert team for a free water diagnosis, system design consultation, or maintenance support.
            </p>
          </div>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <div className="d-flex gap-3 mb-4">
              <div className="d-flex align-items-center justify-content-center rounded-3" 
                   style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h6 className="text-uppercase small mb-1" style={{ color: '#5a7a8c', letterSpacing: '2px' }}>Location</h6>
                <p className="mb-0 fw-medium">Harambee Estate, Kenya</p>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <div className="d-flex align-items-center justify-content-center rounded-3" 
                   style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                <FaPhone />
              </div>
              <div>
                <h6 className="text-uppercase small mb-1" style={{ color: '#5a7a8c', letterSpacing: '2px' }}>Phone</h6>
                <p className="mb-0 fw-medium">0721-633-223 / 0731-836-349</p>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <div className="d-flex align-items-center justify-content-center rounded-3" 
                   style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                <FaEnvelope />
              </div>
              <div>
                <h6 className="text-uppercase small mb-1" style={{ color: '#5a7a8c', letterSpacing: '2px' }}>Email</h6>
                <p className="mb-0 fw-medium">bluewellsynergy@gmail.com</p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-3" 
                   style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                <FaGlobe />
              </div>
              <div>
                <h6 className="text-uppercase small mb-1" style={{ color: '#5a7a8c', letterSpacing: '2px' }}>Website</h6>
                <p className="mb-0 fw-medium">www.bluewellhorizonlimited.com</p>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <form onSubmit={handleSubmit} className="p-5 rounded-4" style={{ 
              background: 'rgba(9, 28, 46, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-uppercase small" style={{ color: '#5a7a8c', letterSpacing: '1.5px' }}>Full Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} 
                         placeholder="John Doe" required 
                         style={{ background: 'rgba(6, 17, 28, 0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small" style={{ color: '#5a7a8c', letterSpacing: '1.5px' }}>Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} 
                         placeholder="john@example.com" required 
                         style={{ background: 'rgba(6, 17, 28, 0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small" style={{ color: '#5a7a8c', letterSpacing: '1.5px' }}>Phone</label>
                  <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} 
                         placeholder="+254 7XX XXX XXX" required 
                         style={{ background: 'rgba(6, 17, 28, 0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small" style={{ color: '#5a7a8c', letterSpacing: '1.5px' }}>Service</label>
                  <select className="form-select" name="service" value={formData.service} onChange={handleChange} required
                          style={{ background: 'rgba(6, 17, 28, 0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' }}>
                    <option value="">Select a service...</option>
                    {servicesData.map((s, i) => <option key={i} value={s.title} style={{ background: '#06111c' }}>{s.title}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label text-uppercase small" style={{ color: '#5a7a8c', letterSpacing: '1.5px' }}>Message</label>
                  <textarea className="form-control" rows="4" name="message" value={formData.message} onChange={handleChange} 
                            placeholder="Tell us about your water treatment needs..." required
                            style={{ background: 'rgba(6, 17, 28, 0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff' }}></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold"
                          style={{ background: '#2fa5b6', border: 'none', letterSpacing: '0.5px' }}>
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;