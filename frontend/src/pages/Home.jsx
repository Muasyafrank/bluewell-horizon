import React from 'react';
import Hero from '../components/Hero';
import { FaTint, FaIndustry, FaWater, FaShieldAlt, FaCheckCircle, FaClock, FaTools, FaAward, FaUsers, FaCog, FaArrowRight,FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';

const Home = () => {
  // Select top 6 services for landing page
  const featuredServices = servicesData.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* About Preview Section */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
                <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>About Us</span>
              </div>
              <h2 className="display-5 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2 }}>
                Trusted provider of <span className="fst-italic" style={{ color: '#2fa5b6' }}>innovative</span> water treatment technologies
              </h2>
              <p className="lead mb-4" style={{ color: '#4a5568', fontWeight: '300', lineHeight: '1.7' }}>
                Bluewell Horizon Limited specializes in designing, supplying, installing, and maintaining high-quality water systems for residential, commercial, institutional, and industrial clients.
              </p>
              <p className="mb-4" style={{ color: '#718096', lineHeight: '1.7' }}>
                With a commitment to excellence, sustainability, and customer satisfaction, we deliver customized water solutions that meet the highest standards of safety, efficiency, and environmental responsibility.
              </p>
              <div className="d-flex gap-3">
                <Link to="/about" className="btn btn-outline-primary rounded-pill px-4" 
                      style={{ borderColor: '#2fa5b6', color: '#2fa5b6', borderWidth: '2px', fontWeight: '600' }}>
                  Learn More
                </Link>
                <Link to="/contact" className="btn btn-primary rounded-pill px-4" 
                      style={{ backgroundColor: '#2fa5b6', border: 'none', fontWeight: '600' }}>
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center h-100" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <FaTint className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '2rem' }}>100+</h4>
                    <p className="small mb-0" style={{ color: '#718096' }}>Installations</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center h-100" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <FaClock className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '2rem' }}>24/7</h4>
                    <p className="small mb-0" style={{ color: '#718096' }}>Support</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center h-100" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <FaAward className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '2rem' }}>10+</h4>
                    <p className="small mb-0" style={{ color: '#718096' }}>Technologies</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center h-100" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <FaCheckCircle className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '2rem' }}>100%</h4>
                    <p className="small mb-0" style={{ color: '#718096' }}>Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-3 mb-4">
              <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
              <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Our Services</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            </div>
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#0b2540', lineHeight: 1.2 }}>
              Comprehensive water solutions <span className="fst-italic" style={{ color: '#2fa5b6' }}>tailored to you</span>
            </h2>
            <p className="lead mx-auto" style={{ color: '#4a5568', maxWidth: '700px', fontWeight: '300' }}>
              From purification to full bottling plant setup, we deliver end-to-end water treatment services designed for your specific needs.
            </p>
          </div>

          <div className="row g-4">
            {featuredServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div 
                    className="p-4 rounded-4 h-100 d-flex flex-column" 
                    style={{ 
                      border: '1px solid #e2e8f0', 
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease' 
                    }}
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
                    <Link to="/services" className="text-decoration-none fw-semibold d-flex align-items-center gap-2" 
                          style={{ color: '#2fa5b6', fontSize: '0.9rem' }}>
                      Learn More <FaArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-5">
            <Link to="/services" className="btn btn-primary btn-lg rounded-pill px-5" 
                  style={{ backgroundColor: '#2fa5b6', border: 'none', fontWeight: '600' }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
                <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Why Choose Us</span>
              </div>
              <h2 className="display-5 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2 }}>
                Delivering excellence in <span className="fst-italic" style={{ color: '#2fa5b6' }}>every drop</span>
              </h2>
              <p className="lead mb-4" style={{ color: '#4a5568', fontWeight: '300', lineHeight: 1.7 }}>
                We combine cutting-edge technology with expert service to provide water solutions that exceed expectations.
              </p>
              
              <div className="row g-4">
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-circle" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '1rem' }}>Customized Solutions</h6>
                      <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.5 }}>Tailored to meet the unique needs and budget of every client.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-circle" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                      <FaTools />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '1rem' }}>End-to-End Service</h6>
                      <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.5 }}>From diagnosis and design to installation and after-sales support.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-circle" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                      <FaWater />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '1rem' }}>Commitment to Sustainability</h6>
                      <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.5 }}>Eco-friendly solutions that promote sustainable water use.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-circle" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                      <FaClock />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '1rem' }}>Timely & Transparent</h6>
                      <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.5 }}>Upholding integrity, transparency, and fast response times.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Water Treatment" 
                    className="w-100"
                    style={{ height: '550px', objectFit: 'cover' }}
                  />
                </div>
                <div className="position-absolute bottom-0 start-0 m-4 p-4 rounded-4" 
                     style={{ 
                       backgroundColor: 'rgba(255, 255, 255, 0.95)',
                       border: '1px solid #e2e8f0',
                       backdropFilter: 'blur(10px)'
                     }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaAward style={{ color: '#2fa5b6' }} />
                    <h6 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Trusted Partner</h6>
                  </div>
                  <p className="mb-0 small" style={{ color: '#718096' }}>Building long-term partnerships grounded in trust and excellence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Preview Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-3 mb-4">
              <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
              <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>Technologies</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            </div>
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#0b2540', lineHeight: 1.2 }}>
              Powered by <span className="fst-italic" style={{ color: '#2fa5b6' }}>advanced technology</span>
            </h2>
            <p className="lead mx-auto" style={{ color: '#4a5568', maxWidth: '700px', fontWeight: '300' }}>
              We utilize cutting-edge technologies to deliver efficient, reliable, and sustainable purification solutions.
            </p>
          </div>

          <div className="row g-3 justify-content-center">
            {['Reverse Osmosis (RO)', 'Ultrafiltration (UF)', 'Nanofiltration (NF)', 'UV Sterilization', 'Water Softening', 'EDI Systems', 'Ozone Treatment', 'Automated Controls'].map((tech, index) => (
              <div className="col-auto" key={index}>
                <span className="rounded-pill px-4 py-2 d-inline-block"
                      style={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: '#0b2540',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#2fa5b6';
                        e.target.style.backgroundColor = '#2fa5b6';
                        e.target.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.color = '#0b2540';
                      }}>
                  {tech}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/technologies" className="btn btn-outline-primary btn-lg rounded-pill px-5" 
                  style={{ borderColor: '#2fa5b6', color: '#2fa5b6', borderWidth: '2px', fontWeight: '600' }}>
              Explore All Technologies
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="p-5 rounded-5 text-center" style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0'
              }}>
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" 
                     style={{ width: '80px', height: '80px', backgroundColor: '#2fa5b6', color: '#ffffff', fontSize: '2.5rem' }}>
                  <FaWater />
                </div>
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#0b2540' }}>Ready to transform your water quality?</h2>
                <p className="lead mb-5" style={{ color: '#4a5568', maxWidth: '700px', margin: '0 auto', fontWeight: '300' }}>
                  Contact us today for a free water diagnosis and discover how our innovative solutions can meet your specific needs.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                  <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5" 
                        style={{ backgroundColor: '#2fa5b6', border: 'none', fontWeight: '600' }}>
                    Get Free Consultation
                  </Link>
                  <a href="tel:0721633223" className="btn btn-outline-primary btn-lg rounded-pill px-5" 
                     style={{ borderColor: '#2fa5b6', color: '#2fa5b6', borderWidth: '2px', fontWeight: '600' }}>
                    Call Us Now
                  </a>
                </div>
                <div className="row g-4 justify-content-center">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center justify-content-center gap-2" style={{ color: '#718096' }}>
                      <FaPhone style={{ color: '#2fa5b6' }} />
                      <span className="fw-medium">0721-633-223 / 0731-836-349</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center justify-content-center gap-2" style={{ color: '#718096' }}>
                      <FaShieldAlt style={{ color: '#2fa5b6' }} />
                      <span className="fw-medium">Free Water Diagnosis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;