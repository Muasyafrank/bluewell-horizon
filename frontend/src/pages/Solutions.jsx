import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ServiceModal from '../components/ServiceModal';

const Solutions = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const renderIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : <FaIcons.FaTint />;
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error(err));
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  return (
    <>
      {/* Header */}
      <section className="py-5" style={{ backgroundImage: `linear-gradient(rgba(6, 17, 28, 0.7), rgba(6, 17, 28, 0.9)), url('/images/bg-header.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#ffffff' }}>Our Solutions</h1>
          <p className="lead mb-0" style={{ color: '#cbd5e0', maxWidth: '700px' }}>Comprehensive services powered by advanced water treatment technologies.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <div className="p-4 rounded-4 h-100 d-flex flex-column" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', transition: 'all 0.3s ease' }}
                     onClick={() => handleServiceClick(service)}
                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.4rem' }}>
                    {renderIcon(service.icon)}
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>{service.title}</h5>
                  <p className="mb-4 flex-grow-1" style={{ color: '#718096', lineHeight: 1.6 }}>{service.shortDesc}</p>
                  <span className="fw-semibold d-flex align-items-center gap-2" style={{ color: '#2fa5b6' }}>Learn More <FaIcons.FaArrowRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <ServiceModal show={showModal} handleClose={() => setShowModal(false)} service={selectedService} />
    </>
  );
};

export default Solutions;