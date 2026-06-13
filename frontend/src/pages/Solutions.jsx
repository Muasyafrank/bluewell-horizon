import React, { useState } from 'react';
import { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools, FaArrowRight, FaCogs, FaBolt, FaMicroscope, FaDatabase, FaNetworkWired, FaFlask } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import ServiceModal from '../components/ServiceModal';

// Technologies from your company profile
const technologies = [
  { icon: FaDatabase, name: 'Reverse Osmosis (RO)', desc: 'Semi-permeable membrane filtration removing 99% of contaminants, salts, and heavy metals.' },
  { icon: FaNetworkWired, name: 'Ultrafiltration (UF) & Nanofiltration (NF)', desc: 'Precise membrane separation for suspended solids, bacteria, and selective ion removal.' },
  { icon: FaBolt, name: 'UV Sterilization & Ozone', desc: 'Chemical-free disinfection eliminating 99.99% of pathogens without altering water chemistry.' },
  { icon: FaMicroscope, name: 'Electrodeionization (EDI)', desc: 'Continuous high-purity water production for laboratories, pharmaceuticals, and medical facilities.' },
  { icon: FaCogs, name: 'Automated PLC & Softening', desc: 'Smart monitoring, auto-regeneration, and hardness removal for energy efficiency and equipment protection.' }
];

const Solutions = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (e, service) => {
    e.preventDefault();
    e.stopPropagation();
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
              What We Offer
            </span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2, maxWidth: '800px' }}>
            Comprehensive Services & <span className="fst-italic" style={{ color: '#2fa5b6' }}>Advanced Technologies</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568', maxWidth: '700px' }}>
            We combine industry-leading water treatment technologies with expert engineering to deliver tailored solutions for every environment.
          </p>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>Our Core Services</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>End-to-end water treatment solutions designed for reliability, efficiency, and sustainability.</p>
          </div>
          <div className="row g-4">
            {servicesData.map((service) => {
              const IconComponent = service.icon;
              return (
                <div className="col-md-6 col-lg-4" key={service.id}>
                  <div 
                    className="p-4 rounded-4 h-100 d-flex flex-column" 
                    style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onClick={(e) => handleServiceClick(e, service)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(47, 165, 182, 0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.4rem' }}>
                      {IconComponent && <IconComponent size={24} />}
                      {/* <tech.icon size={20} /> */}
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: '#0b2540', fontSize: '1.15rem' }}>{service.title}</h5>
                    <p className="mb-4 flex-grow-1" style={{ color: '#718096', lineHeight: 1.6, fontSize: '0.95rem' }}>{service.desc}</p>
                    <span className="fw-semibold d-flex align-items-center gap-2" style={{ color: '#2fa5b6', fontSize: '0.9rem' }}>Learn More <FaArrowRight size={14} /></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>Technology Stack That Powers Our Solutions</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>We deploy cutting-edge, sustainable technologies tailored to your specific water challenges.</p>
          </div>
          <div className="row g-4">
            {technologies.map((tech, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="p-4 rounded-4 h-100" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', transition: 'all 0.3s ease' }}
                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#f0f9fa', color: '#2fa5b6' }}>
                      <tech.icon size={20} />
                    </div>
                    <h6 className="fw-bold mb-0" style={{ color: '#0b2540' }}>{tech.name}</h6>
                  </div>
                  <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.6 }}>{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0b2540' }}>How We Combine Services & Technology</h2>
              <p className="lead mb-4" style={{ color: '#4a5568', fontWeight: '300' }}>
                Every project begins with a professional water diagnosis. We analyze your source water, usage requirements, and budget to design a custom system.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex gap-3 mb-3">
                  <span className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#2fa5b6', color: '#fff', fontSize: '0.8rem' }}>1</span>
                  <div><strong className="d-block" style={{ color: '#0b2540' }}>Assessment & Design</strong><span style={{ color: '#718096' }}>Water quality testing and custom engineering.</span></div>
                </li>
                <li className="d-flex gap-3 mb-3">
                  <span className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#2fa5b6', color: '#fff', fontSize: '0.8rem' }}>2</span>
                  <div><strong className="d-block" style={{ color: '#0b2540' }}>Technology Selection</strong><span style={{ color: '#718096' }}>Matching RO, UF, UV, or EDI to your exact needs.</span></div>
                </li>
                <li className="d-flex gap-3 mb-3">
                  <span className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#2fa5b6', color: '#fff', fontSize: '0.8rem' }}>3</span>
                  <div><strong className="d-block" style={{ color: '#0b2540' }}>Installation & Support</strong><span style={{ color: '#718096' }}>Professional setup, PLC automation, and ongoing maintenance.</span></div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="p-5 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h4 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Ready to upgrade your water system?</h4>
                <p className="mb-4" style={{ color: '#718096' }}>Whether you need a residential purifier, a commercial bottling plant, or an industrial desalination unit, our integrated approach ensures optimal performance and sustainability.</p>
                <Link to="/contact" className="btn btn-primary rounded-pill px-4" style={{ backgroundColor: '#2fa5b6', border: 'none', fontWeight: '600' }}>Get a Free Consultation</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="p-5 rounded-5 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h3 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>Need a custom water solution?</h3>
            <p className="lead mb-4" style={{ color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>Contact us today for a free water diagnosis and system design consultation.</p>
            <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5" style={{ backgroundColor: '#2fa5b6', border: 'none', fontWeight: '600' }}>Contact Us Now</Link>
          </div>
        </div>
      </section>

      {/* Service Modal */}
      <ServiceModal show={showModal} handleClose={handleCloseModal} service={selectedService} />
    </>
  );
};

export default Solutions;