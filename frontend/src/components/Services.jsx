import React, { useState } from 'react';
import { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools, FaFlask, FaFilter, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import ServiceModal from '../components/ServiceModal';

const iconMap = { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools, FaFlask, FaFilter };

const Services = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  return (
    <>
      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
              Our Services
            </span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2, maxWidth: '800px' }}>
            Comprehensive water solutions <span className="fst-italic" style={{ color: '#2fa5b6' }}>tailored to you.</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568', maxWidth: '700px' }}>
            From purification to full bottling plant setup, we deliver end-to-end water treatment services designed for your specific needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-4">
            {servicesData.map((service) => {
              const IconComponent = iconMap[service.icon];
              return (
                <div className="col-md-6 col-lg-4" key={service.id}>
                  <div 
                    className="p-4 rounded-4 h-100 d-flex flex-column" 
                    style={{ 
                      border: '1px solid #e2e8f0', 
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease' 
                    }}
                    onClick={() => handleServiceClick(service)}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.borderColor = '#2fa5b6'; 
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(47, 165, 182, 0.12)'; 
                      e.currentTarget.style.transform = 'translateY(-4px)'; 
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.borderColor = '#e2e8f0'; 
                      e.currentTarget.style.boxShadow = 'none'; 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" 
                         style={{ width: '56px', height: '56px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.4rem' }}>
                      {IconComponent && <IconComponent />}
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: '#0b2540', fontSize: '1.15rem' }}>{service.title}</h5>
                    <p className="mb-4 flex-grow-1" style={{ color: '#718096', lineHeight: 1.6, fontSize: '0.95rem' }}>{service.desc}</p>
                    <span className="text-decoration-none fw-semibold d-flex align-items-center gap-2" 
                          style={{ color: '#2fa5b6', fontSize: '0.9rem' }}>
                      Learn More <FaArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="p-5 rounded-5 text-center" style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0'
          }}>
            <h3 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>Need a custom water solution?</h3>
            <p className="lead mb-4" style={{ color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
              Contact us today for a free water diagnosis and system design consultation.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5" 
                  style={{ backgroundColor: '#2fa5b6', border: 'none', fontWeight: '600' }}>
              Contact Us Now
            </Link>
          </div>
        </div>
      </section>

      {/* Service Modal */}
      <ServiceModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        service={selectedService} 
      />
    </>
  );
};

export default Services;