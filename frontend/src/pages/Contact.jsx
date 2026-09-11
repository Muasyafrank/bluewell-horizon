import SEO from '../components/SEO';
import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaGlobe, 
  FaPaperPlane, FaSpinner, FaCheckCircle, FaDirections 
} from 'react-icons/fa';
import { toastSuccess, toastError } from '../utils/toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toastSuccess('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        toastError('Failed to send message. Please try again.');
      }
    } catch (err) {
      toastError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <SEO 
        title="Contact Us - Get Free Water Consultation"
        description="Contact Bluewell Horizon Limited for a free water consultation. Located in Harambee Estate, Nairobi. Call 0721-633-223 or email bluewellsynergy@gmail.com."
        keywords="contact Bluewell Horizon, water treatment consultation Nairobi, Harambee Estate water company"
        url="https://www.bluewellhorizonlimited.com/contact"
        type="website"
      />
      {/* Page Header */}
      <section className="py-5" style={{ 
        backgroundImage: `linear-gradient(rgba(147, 149, 150, 0.25), rgba(140,145,149, 0.9)), url('/images/gallery-3.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '350px', 
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Contact Us</span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#ffffff', lineHeight: 1.2, maxWidth: '800px' }}>
            Let's discuss your <span className="fst-italic" style={{ color: '#7dd3e3' }}>water needs.</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#cbd5e0', maxWidth: '700px' }}>
            Get in touch with our team for a free consultation and water diagnosis.
          </p>
        </div>
      </section>

      {/* Marquee Contact Details */}
      <section className="py-4" style={{ backgroundColor: '#0b2540', overflow: 'hidden', position: 'relative' }}>
        <div className="marquee-container">
          <div className="marquee-content">
            <div className="marquee-item">
              <FaMapMarkerAlt className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Location:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">Harambee Estate, Nairobi, Kenya</span>
            </div>
            <div className="marquee-divider">•</div>
            <div className="marquee-item">
              <FaPhoneAlt className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Phone:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">0721-633-223 / 0731-836-349</span>
            </div>
            <div className="marquee-divider">•</div>
            <div className="marquee-item">
              <FaEnvelope className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Email:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">bluewellsynergy@gmail.com</span>
            </div>
            <div className="marquee-divider">•</div>
            <div className="marquee-item">
              <FaClock className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Hours:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">Mon-Fri: 8AM-6PM | Sat: 9AM-2PM</span>
            </div>
            <div className="marquee-divider">•</div>
            {/* Duplicate for seamless loop */}
            <div className="marquee-item">
              <FaMapMarkerAlt className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Location:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">Harambee Estate, Nairobi, Kenya</span>
            </div>
            <div className="marquee-divider">•</div>
            <div className="marquee-item">
              <FaPhoneAlt className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Phone:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">0721-633-223 / 0731-836-349</span>
            </div>
            <div className="marquee-divider">•</div>
            <div className="marquee-item">
              <FaEnvelope className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Email:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">bluewellsynergy@gmail.com</span>
            </div>
            <div className="marquee-divider">•</div>
            <div className="marquee-item">
              <FaClock className="me-2" style={{ color: '#2fa5b6' }} />
              <span style={{ color: '#ffffff', fontWeight: '600' }}>Hours:</span>
              <span style={{ color: '#cbd5e0' }} className="ms-2">Mon-Fri: 8AM-6PM | Sat: 9AM-2PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          

          {/* Map and Contact Form */}
          <div className="row g-5">
            {/* Google Map */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
                <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Find Us</span>
              </div>
              <h3 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Visit Our <span className="fst-italic" style={{ color: '#2fa5b6' }}>Office</span></h3>
              <p className="mb-4" style={{ color: '#718096', lineHeight: 1.7 }}>
                We are conveniently located in Harambee Estate, Nairobi. Stop by for a consultation or to discuss your water treatment needs in person.
              </p>
              
              {/* Map Container */}
              <div className="rounded-4 overflow-hidden mb-4" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.27836!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d5c0b0c0b1%3A0x0!2sHarambee%20Estate%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bluewell Horizon Location"
                ></iframe>
              </div>

              {/* Get Directions Button */}
              <a 
                href="https://www.google.com/maps/dir//Harambee+Estate,+Nairobi,+Kenya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: '#2fa5b6', color: '#ffffff', border: 'none' }}
              >
                <FaDirections /> Get Directions
              </a>
            </div>

            {/* Contact Form */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
                <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Send Message</span>
              </div>
              <h3 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Get a Free <span className="fst-italic" style={{ color: '#2fa5b6' }}>Consultation</span></h3>
              <p className="mb-4" style={{ color: '#718096', lineHeight: 1.7 }}>
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {/* Success Message */}
              {success && (
                <div className="alert d-flex align-items-center gap-2 rounded-3 mb-4" style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                  <FaCheckCircle />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert rounded-3 mb-4" style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Full Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Email Address *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="07XX XXX XXX"
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Service Needed *</label>
                    <select 
                      className="form-select" 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    >
                      <option value="">Select a service</option>
                      <option value="Water Purification">Water Purification</option>
                      <option value="Water Bottling Plant">Water Bottling Plant</option>
                      <option value="Desalination Systems">Desalination Systems</option>
                      <option value="Water Disinfection">Water Disinfection</option>
                      <option value="Water Diagnosis">Water Diagnosis & Design</option>
                      <option value="Installation & Support">Installation & Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Your Message *</label>
                    <textarea 
                      className="form-control" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Tell us about your water treatment needs..."
                      style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button 
                      type="submit" 
                      className="btn btn-lg rounded-pill px-5 d-inline-flex align-items-center gap-2"
                      style={{ backgroundColor: '#2fa5b6', color: '#ffffff', border: 'none' }}
                      disabled={loading}
                    >
                      {loading ? (
                        <><FaSpinner className="spin" /> Sending...</>
                      ) : (
                        <><FaPaperPlane /> Send Message</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;