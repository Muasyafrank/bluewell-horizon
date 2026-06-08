import React from 'react';
import { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools, FaFlask, FaFilter } from 'react-icons/fa';
import { servicesData } from '../data/data';

const iconMap = { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools, FaFlask, FaFilter };

const Services = () => (
  <section className="py-5">
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
            <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Our Services</span>
          </div>
          <h2 className="display-5 fw-bold mb-3">Comprehensive water solutions<br />tailored to your needs</h2>
          <p className="lead" style={{ color: '#95b5c4', maxWidth: '600px', fontWeight: '300' }}>
            From purification to full bottling plant setup, we deliver end-to-end water treatment services.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {servicesData.map((service, index) => {
          const IconComponent = iconMap[service.icon];
          return (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="p-4 rounded-4 h-100" style={{ 
                background: 'rgba(9, 28, 46, 0.5)', 
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(9, 28, 46, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(47, 165, 182, 0.3)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(9, 28, 46, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div className="d-flex align-items-center justify-content-center rounded-3 mb-4" 
                     style={{ 
                       width: '56px', height: '56px',
                       background: 'rgba(47, 165, 182, 0.15)',
                       border: '1px solid rgba(47, 165, 182, 0.3)',
                       fontSize: '1.4rem',
                       color: '#2fa5b6'
                     }}>
                  {IconComponent && <IconComponent />}
                </div>
                <h5 className="fw-bold mb-3">{service.title}</h5>
                <p className="mb-0" style={{ color: '#5a7a8c', lineHeight: '1.6', fontWeight: '300' }}>{service.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;