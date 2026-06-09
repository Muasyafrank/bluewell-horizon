import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TechnologyModal from '../components/TechnologyModal';
import { technologiesData } from '../data/technologies'; // Import data here

const Technologies = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);

  const handleTechClick = (tech) => {
    setSelectedTech(tech);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTech(null);
  };

  return (
    <>
      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
              Technologies
            </span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2, maxWidth: '800px' }}>
            Advanced technology for <span className="fst-italic" style={{ color: '#2fa5b6' }}>pure water.</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568', maxWidth: '700px' }}>
            We utilize cutting-edge technologies to deliver efficient, reliable, and sustainable purification solutions.
          </p>
        </div>
      </section>

      {/* Technologies Grid */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-4">
            {technologiesData.map((tech) => (
              <div className="col-md-6 col-lg-4" key={tech.id}>
                <div 
                  className="p-4 rounded-4 h-100" 
                  style={{ 
                    border: '1px solid #e2e8f0', 
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease' 
                  }}
                  onClick={() => handleTechClick(tech)}
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
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="d-flex align-items-center justify-content-center rounded-circle" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                      <span className="fw-bold">{tech.id}</span>
                    </div>
                    <h5 className="mb-0 fw-semibold flex-grow-1" style={{ color: '#0b2540', fontSize: '1.05rem' }}>
                      {tech.name}
                    </h5>
                  </div>
                  <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.6 }}>
                    {tech.shortDesc}
                  </p>
                  <div className="mt-3">
                    <span className="text-decoration-none fw-semibold" style={{ color: '#2fa5b6', fontSize: '0.85rem' }}>
                      Learn More →
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            <h3 className="display-6 fw-bold mb-3" style={{ color: '#0b2540' }}>Need expert guidance?</h3>
            <p className="lead mb-4" style={{ color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
              Our specialists will help you choose the right technology for your specific water treatment needs.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5" 
                  style={{ backgroundColor: '#2fa5b6', border: 'none', fontWeight: '600' }}>
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Modal */}
      <TechnologyModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        technology={selectedTech} 
      />
    </>
  );
};

export default Technologies;