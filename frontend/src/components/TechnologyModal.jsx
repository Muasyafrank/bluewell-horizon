import React from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { FaCheckCircle, FaTint, FaShieldAlt, FaCog, FaFlask, FaIndustry, FaHome, FaHospital, FaHotel, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TechnologyModal = ({ show, handleClose, technology }) => {
  if (!show || !technology) return null;

  const renderIcon = (iconName) => {
    const icons = {
      FaTint: <FaTint size={18} />, FaShieldAlt: <FaShieldAlt size={18} />,
      FaCog: <FaCog size={18} />, FaFlask: <FaFlask size={18} />,
      FaIndustry: <FaIndustry size={18} />, FaHome: <FaHome size={18} />,
      FaHospital: <FaHospital size={18} />, FaHotel: <FaHotel size={18} />,
      FaBuilding: <FaBuilding size={18} />
    };
    return icons[iconName] || <FaTint size={18} />;
  };

  // Wrap the modal in createPortal to render it at the root of the DOM
  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1040, backgroundColor: 'rgba(11, 37, 64, 0.7)' }}
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog"
        style={{ zIndex: 1050 }}
        onClick={handleClose}
      >
        <div 
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 rounded-4 shadow-lg" style={{ backgroundColor: '#ffffff' }}>
            
            {/* Header */}
            <div className="modal-header border-0 pb-0 pt-4 px-4">
              <h5 className="modal-title fw-bold" style={{ color: '#0b2540', fontSize: '1.75rem' }}>
                {technology.name}
              </h5>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
            
            {/* Body */}
            <div className="modal-body pt-4 px-4">
              <p className="lead mb-4" style={{ color: '#4a5568', lineHeight: 1.7, fontSize: '1.1rem' }}>
                {technology.description}
              </p>

              {technology.features && technology.features.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#0b2540', letterSpacing: '1px', fontSize: '0.9rem' }}>Key Features</h6>
                  <div className="row g-3">
                    {technology.features.map((feature, index) => (
                      <div className="col-md-6" key={index}>
                        <div className="d-flex align-items-start gap-2">
                          <FaCheckCircle className="mt-1 flex-shrink-0" style={{ color: '#2fa5b6', fontSize: '0.9rem' }} />
                          <span style={{ color: '#718096', fontSize: '0.95rem' }}>{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {technology.applications && technology.applications.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#0b2540', letterSpacing: '1px', fontSize: '0.9rem' }}>Applications</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {technology.applications.map((app, index) => (
                      <span key={index} className="d-inline-flex align-items-center rounded-pill px-3 py-2" style={{ backgroundColor: '#f0f9fa', color: '#2fa5b6', border: '1px solid #d1e8eb', fontWeight: '500', fontSize: '0.85rem' }}>
                        {renderIcon(app.icon)} <span className="ms-2">{app.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {technology.benefits && (
                <div className="p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <h6 className="fw-bold mb-2" style={{ color: '#0b2540' }}>Why Choose This Technology?</h6>
                  <p className="mb-0" style={{ color: '#718096', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {technology.benefits}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 pt-0 pb-4 px-4">
              <button type="button" className="btn rounded-pill px-4 fw-semibold" onClick={handleClose} style={{ borderColor: '#2fa5b6', color: '#2fa5b6', borderWidth: '2px' }}>
                Close
              </button>
              <Link to="/contact" className="btn rounded-pill px-4 text-white fw-semibold" onClick={handleClose} style={{ backgroundColor: '#2fa5b6', border: 'none' }}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default TechnologyModal;