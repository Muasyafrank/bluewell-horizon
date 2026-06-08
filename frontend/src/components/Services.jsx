import React from 'react';
import { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools, FaFlask, FaFilter } from 'react-icons/fa';
import { servicesData } from '../data/data';

const iconMap = { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools, FaFlask, FaFilter };

const Services = () => (
  <section id="services" className="section-dark">
    <div className="container">
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="section-label">Our Services</div>
          <h2 className="section-title">Comprehensive water solutions<br />tailored to your needs</h2>
          <p className="section-subtitle">
            From purification to full bottling plant setup, we deliver end-to-end water treatment services.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {servicesData.map((service, index) => {
          const IconComponent = iconMap[service.icon];
          return (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="service-card-dark">
                <div className="service-icon-dark">
                  {IconComponent && <IconComponent />}
                </div>
                <h5>{service.title}</h5>
                <p>{service.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;