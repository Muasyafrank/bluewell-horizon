import React, { useState, useEffect } from 'react';
import { FaTint, FaClock, FaAward, FaCheckCircle, FaTools, FaWater, FaPhone, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa'; // Import all FA icons to map from DB strings
import { Link } from 'react-router-dom';

const Home = () => {
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Helper to render icons from database string names
  const renderIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : <FaTint />;
  };

  useEffect(() => {
    // Fetch Services and Gallery from Backend
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => setServices(data.slice(0, 6))) // Get first 6 for homepage
      .catch(err => console.error("Error fetching services:", err));

    fetch('http://localhost:5000/api/gallery')
      .then(res => res.json())
      .then(data => setGallery(data))
      .catch(err => console.error("Error fetching gallery:", err));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section-dark d-flex align-items-center position-relative" style={{ paddingTop: '140px', minHeight: '100vh', backgroundImage: `linear-gradient(rgba(6, 17, 28, 0.85), rgba(9, 28, 46, 0.9)), url('/images/hero-bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <h2 className="fw-bold mb-0" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '2px', lineHeight: 1.1 }}>
                <span style={{ color: '#ffffff' }}>BLUEWELL</span>{' '}<span style={{ color: '#2fa5b6' }}>HORIZON</span>
              </h2>
              <h3 className="fw-light mb-0 mt-1" style={{ color: '#95b5c4', fontSize: 'clamp(1rem, 2vw, 1.5rem)', letterSpacing: '8px', textTransform: 'uppercase' }}>LIMITED</h3>
              <h1 className="display-3 fw-bold mb-4 mt-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#ffffff' }}>
                Pure water,<br />engineered with <span className="fst-italic" style={{ color: '#7dd3e3' }}>precision.</span>
              </h1>
              <p className="lead mb-5 mx-auto" style={{ maxWidth: '650px', color: '#95b5c4', fontWeight: '300' }}>
                Bluewell Horizon Limited designs, supplies, installs and maintains advanced water treatment systems for homes, businesses, institutions and industries.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 fw-bold">Get a Free Consultation</Link>
                <Link to="/services" className="btn btn-outline-light btn-lg rounded-pill px-5">Explore Services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section (Dynamic) */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Our Services</span>
            <h2 className="display-5 fw-bold mb-3 mt-2" style={{ color: '#0b2540' }}>Comprehensive water solutions <span className="fst-italic" style={{ color: '#2fa5b6' }}>tailored to you</span></h2>
          </div>
          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <div className="p-4 rounded-4 h-100 d-flex flex-column" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', transition: 'all 0.3s ease' }}
                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '1.4rem' }}>
                    {renderIcon(service.icon)}
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>{service.title}</h5>
                  <p className="mb-4 flex-grow-1" style={{ color: '#718096', lineHeight: 1.6 }}>{service.shortDesc}</p>
                  <Link to="/services" className="text-decoration-none fw-semibold d-flex align-items-center gap-2" style={{ color: '#2fa5b6' }}>Learn More <FaArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section (Dynamic) */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Our Work</span>
            <h2 className="display-5 fw-bold mb-3 mt-2" style={{ color: '#0b2540' }}>Projects & <span className="fst-italic" style={{ color: '#2fa5b6' }}>Installations</span></h2>
          </div>
          <div className="row g-4">
            {gallery.map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="rounded-4 overflow-hidden" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <div style={{ overflow: 'hidden', height: '250px' }}>
                    <img src={item.image} alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="p-4">
                    <span className="badge rounded-pill mb-2" style={{ backgroundColor: '#f0f9fa', color: '#2fa5b6', border: '1px solid #d1e8eb' }}>{item.category}</span>
                    <h6 className="fw-bold mb-0" style={{ color: '#0b2540' }}>{item.title}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-5" style={{ backgroundImage: `linear-gradient(rgba(6, 17, 28, 0.8), rgba(6, 17, 28, 0.9)), url('/images/bg-cta.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold mb-4" style={{ color: '#ffffff' }}>Ready to transform your water quality?</h2>
          <p className="lead mb-5 mx-auto" style={{ color: '#cbd5e0', maxWidth: '700px' }}>Contact us today for a free water diagnosis and system design consultation.</p>
          <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 fw-bold">Get Free Consultation</Link>
        </div>
      </section>
    </>
  );
};

export default Home;