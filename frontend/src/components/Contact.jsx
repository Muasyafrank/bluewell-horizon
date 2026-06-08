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
    <section id="contact" className="section-dark section-dark-alt">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-8">
            <div className="section-label">Contact Us</div>
            <h2 className="section-title">Let's secure your<br />clean water supply</h2>
            <p className="section-subtitle">
              Reach out to our expert team for a free water diagnosis, system design consultation, or maintenance support.
            </p>
          </div>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <div className="contact-info-dark">
              <div className="contact-icon-dark"><FaMapMarkerAlt /></div>
              <div>
                <h6>Location</h6>
                <p>Harambee Estate, Kenya</p>
              </div>
            </div>
            <div className="contact-info-dark">
              <div className="contact-icon-dark"><FaPhone /></div>
              <div>
                <h6>Phone</h6>
                <p>0721-633-223 / 0731-836-349</p>
              </div>
            </div>
            <div className="contact-info-dark">
              <div className="contact-icon-dark"><FaEnvelope /></div>
              <div>
                <h6>Email</h6>
                <p>bluewellsynergy@gmail.com</p>
              </div>
            </div>
            <div className="contact-info-dark">
              <div className="contact-icon-dark"><FaGlobe /></div>
              <div>
                <h6>Website</h6>
                <p>www.bluewellhorizonlimited.com</p>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <form onSubmit={handleSubmit} className="contact-form-dark">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-dark">Full Name</label>
                  <input type="text" className="form-control form-control-dark" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-dark">Email</label>
                  <input type="email" className="form-control form-control-dark" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-dark">Phone</label>
                  <input type="tel" className="form-control form-control-dark" name="phone" value={formData.phone} onChange={handleChange} placeholder="+254 7XX XXX XXX" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-dark">Service</label>
                  <select className="form-select form-select-dark" name="service" value={formData.service} onChange={handleChange} required>
                    <option value="">Select a service...</option>
                    {servicesData.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label-dark">Message</label>
                  <textarea className="form-control form-control-dark" rows="4" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your water treatment needs..." required></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn-submit-dark">Send Message</button>
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