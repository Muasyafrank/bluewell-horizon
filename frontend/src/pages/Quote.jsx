import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaBuilding, FaUser, FaEnvelope, FaPhoneAlt, FaClipboardList } from 'react-icons/fa';
import SEO from '../components/SEO';
import { toastSuccess, toastError } from '../utils/toast';

const Quote = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', companyName: '', serviceType: '', projectDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toastSuccess('Quote request submitted successfully! We will contact you shortly.');
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', companyName: '', serviceType: '', projectDetails: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toastError('Failed to submit request. Please try again.');
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
        title="Request a Quote - Custom Water Treatment Solutions"
        description="Request a custom quote for industrial water treatment, bottling plants, desalination, or ultrapure water systems from Bluewell Horizon Limited."
        keywords="water treatment quote Kenya, bottling plant cost, desalination system price, industrial water treatment Nairobi"
        url="https://www.bluewellhorizonlimited.com/quote"
      />

      {/* Page Header */}
      <section className="py-5" style={{ 
        backgroundImage: `linear-gradient(rgba(6, 17, 28, 0.7), rgba(6, 17, 28, 0.9)), url('/images/gallery-3.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', display: 'flex', alignItems: 'center'
      }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Get a Custom Quote</span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#ffffff', lineHeight: 1.2, maxWidth: '800px' }}>
            Tailored solutions for your <span className="fst-italic" style={{ color: '#7dd3e3' }}>specific needs.</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#cbd5e0', maxWidth: '700px' }}>
            For large-scale projects like bottling plants, desalination, or industrial systems, tell us about your requirements and we'll provide a customized proposal.
          </p>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-5 justify-content-center">
            <div className="col-lg-8">
              {success && (
                <div className="alert d-flex align-items-center gap-2 rounded-3 mb-4" style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                  <FaCheckCircle />
                  <span>Thank you! Your quote request has been received. Our team will review it and contact you within 24 hours.</span>
                </div>
              )}

              <div className="p-4 p-md-5 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h3 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Project Details</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Full Name *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaUser style={{ color: '#2fa5b6' }} /></span>
                        <input type="text" className="form-control border-start-0" name="name" value={formData.name} onChange={handleChange} required style={{ borderRadius: '0 12px 12px 0' }} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Company Name *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaBuilding style={{ color: '#2fa5b6' }} /></span>
                        <input type="text" className="form-control border-start-0" name="companyName" value={formData.companyName} onChange={handleChange} required style={{ borderRadius: '0 12px 12px 0' }} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Email Address *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaEnvelope style={{ color: '#2fa5b6' }} /></span>
                        <input type="email" className="form-control border-start-0" name="email" value={formData.email} onChange={handleChange} required style={{ borderRadius: '0 12px 12px 0' }} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Phone Number *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaPhoneAlt style={{ color: '#2fa5b6' }} /></span>
                        <input type="tel" className="form-control border-start-0" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+254 7XX XXX XXX" style={{ borderRadius: '0 12px 12px 0' }} />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Service Needed *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaClipboardList style={{ color: '#2fa5b6' }} /></span>
                        <select className="form-select border-start-0" name="serviceType" value={formData.serviceType} onChange={handleChange} required style={{ borderRadius: '0 12px 12px 0' }}>
                          <option value="">Select a service...</option>
                          <option value="Water Bottling Plant Solutions">Water Bottling Plant Solutions</option>
                          <option value="Desalination Systems">Desalination Systems</option>
                          <option value="UltraPure Water Systems (EDI)">UltraPure Water Systems (EDI)</option>
                          <option value="Industrial Water Purification">Industrial Water Purification</option>
                          <option value="Water Diagnosis & System Design">Water Diagnosis & System Design</option>
                          <option value="Other / Custom Project">Other / Custom Project</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold" style={{ color: '#0b2540' }}>Project Details & Requirements *</label>
                      <textarea 
                        className="form-control" 
                        name="projectDetails" 
                        value={formData.projectDetails} 
                        onChange={handleChange} 
                        required 
                        rows="5" 
                        placeholder="Please describe your project scope, expected capacity, location, and any specific requirements..."
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}
                      ></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-lg rounded-pill px-5 d-inline-flex align-items-center gap-2" style={{ backgroundColor: '#2fa5b6', color: '#ffffff', border: 'none' }} disabled={loading}>
                        {loading ? <><FaSpinner className="spin" /> Submitting...</> : <><FaPaperPlane /> Request Quote</>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#0b2540', color: '#ffffff' }}>
                <h4 className="fw-bold mb-4">Why Request a Quote?</h4>
                <ul className="list-unstyled mb-4" style={{ lineHeight: 1.8, color: '#cbd5e0' }}>
                  <li className="mb-3"> <strong>Customized Solutions:</strong> Tailored to your exact capacity and budget.</li>
                  <li className="mb-3"> <strong>Expert Consultation:</strong> Free initial assessment by our engineers.</li>
                  <li className="mb-3"> <strong>Transparent Pricing:</strong> Detailed breakdown of equipment and installation.</li>
                  <li className="mb-3"> <strong>Fast Turnaround:</strong> We respond to all quote requests within 24 hours.</li>
                </ul>
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <p className="small mb-0" style={{ color: '#95b5c4' }}>
                  Prefer to talk? Call us directly:<br/>
                  <strong style={{ color: '#2fa5b6', fontSize: '1.1rem' }}>0721-633-223</strong><br/>
                  <strong style={{ color: '#2fa5b6', fontSize: '1.1rem' }}>0731-836-349</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Quote;