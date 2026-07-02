import React from 'react';
import * as FaIcons from 'react-icons/fa';

const ServiceModal = ({ show, handleClose, service }) => {
  if (!show || !service) return null;

  const renderIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : <FaIcons.FaCheckCircle />;
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header border-0">
            <h4 className="modal-title fw-bold" style={{ color: '#0b2540' }}>{service.title}</h4>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body p-4">
            {service.image && <img src={service.image} alt={service.title} className="w-100 rounded-4 mb-4" style={{ height: '250px', objectFit: 'cover' }} />}
            <p className="lead mb-4" style={{ color: '#4a5568', lineHeight: 1.7 }}>{service.description}</p>
            
            {service.features && service.features.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Key Features</h6>
                <ul className="list-unstyled">
                  {service.features.map((f, i) => (
                    <li key={i} className="d-flex align-items-center gap-2 mb-2" style={{ color: '#718096' }}>
                      <FaIcons.FaCheckCircle style={{ color: '#2fa5b6' }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.applications && service.applications.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Ideal Applications</h6>
                <div className="d-flex flex-wrap gap-2">
                  {service.applications.map((app, i) => (
                    <span key={i} className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#f0f9fa', color: '#2fa5b6', border: '1px solid #d1e8eb' }}>
                      {renderIcon(app.icon)} <span className="ms-2">{app.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {service.benefits && (
              <div className="p-3 rounded-3" style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #2fa5b6' }}>
                <h6 className="fw-bold mb-1" style={{ color: '#0b2540' }}>The Bluewell Advantage</h6>
                <p className="mb-0 small" style={{ color: '#718096' }}>{service.benefits}</p>
              </div>
            )}
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light rounded-pill px-4" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;