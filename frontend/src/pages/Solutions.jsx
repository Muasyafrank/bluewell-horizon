import SEO from '../components/SEO';
import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ServiceModal from '../components/ServiceModal';

const Solutions = () => {
  const [services, setServices] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const renderIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : <FaIcons.FaTint />;
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/services').then(r => r.json()).then(setServices);
    fetch('http://localhost:5000/api/technologies').then(r => r.json()).then(setTechnologies);
    fetch('http://localhost:5000/api/process-steps').then(r => r.json()).then(setProcessSteps);
  }, []);

  return (
    <>

      <SEO 
        title="Our Services & Technologies - Water Treatment Solutions"
        description="Explore our comprehensive water treatment services including purification, bottling plants, desalination, disinfection, and advanced technologies like RO, UV, and EDI systems."
        keywords="water purification services, RO systems Kenya, UV sterilization, water bottling solutions, desalination systems, EDI water treatment"
        url="https://www.bluewellhorizonlimited.com/services"
      />
      {/* Header */}
      <section className="py-5" style={{ backgroundImage: `linear-gradient(rgba(147, 149, 150, 0.25), rgba(14, 17, 28, 0.9)), url('/images/gallery-4.png')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#ffffff' }}>Comprehensive Services & <span className="fst-italic" style={{ color: '#7dd3e3' }}>Advanced Technologies</span></h1>
          <p className="lead mb-0" style={{ color: '#cbd5e0', maxWidth: '700px' }}>We combine industry-leading water treatment technologies with expert engineering to deliver tailored solutions.</p>
        </div>
      </section>

      {/* Section 1: Core Services */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>Our Core Services</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>End-to-end water treatment solutions designed for reliability and efficiency.</p>
          </div>
          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <div className="p-4 rounded-4 h-100 d-flex flex-column" style={{ border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.3s ease' }}
                     onClick={() => { setSelectedService(service); setShowModal(true); }}
                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                    {renderIcon(service.icon)}
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>{service.title}</h5>
                  <p className="mb-4 flex-grow-1" style={{ color: '#718096' }}>{service.shortDesc}</p>
                  <span className="fw-semibold d-flex align-items-center gap-2" style={{ color: '#2fa5b6' }}>Learn More <FaIcons.FaArrowRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Technology Stack */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>Technology Stack That Powers Our Solutions</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>We deploy cutting-edge technologies tailored to your specific water challenges.</p>
          </div>
          <div className="row g-4">
            {technologies.map((tech) => (
              <div className="col-md-6 col-lg-4" key={tech.id}>
                <div className="p-4 rounded-4 h-100" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', transition: 'all 0.3s ease' }}
                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#f0f9fa', color: '#2fa5b6' }}>
                      {renderIcon(tech.icon)}
                    </div>
                    <h6 className="fw-bold mb-0" style={{ color: '#0b2540' }}>{tech.name}</h6>
                  </div>
                  <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.6 }}>{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>How We Combine Services & Technology</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {processSteps.map((step) => (
              <div className="col-md-4" key={step.id}>
                <div className="text-center p-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {step.stepNumber}
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#0b2540' }}>{step.title}</h5>
                  <p className="text-muted small">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5" style={{ backgroundColor: '#2fa5b6', border: 'none' }}>Get a Free Consultation</Link>
          </div>
        </div>
      </section>

      <ServiceModal show={showModal} handleClose={() => setShowModal(false)} service={selectedService} />
    </>
  );
};

export default Solutions;