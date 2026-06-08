import React from 'react';
import Hero from '../components/Hero';
import { FaTint, FaIndustry, FaWater, FaShieldAlt, FaCheckCircle, FaClock, FaTools, FaAward,FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/data';

const Home = () => {
  // Select top 6 services for landing page
  const featuredServices = servicesData.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Brief Introduction */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #091c2e 0%, #06111c 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
                <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>About Us</span>
              </div>
              <h2 className="display-5 fw-bold mb-4">Trusted Provider of Innovative Water Treatment Solutions</h2>
              <p className="lead mb-4" style={{ color: '#95b5c4', fontWeight: '300', lineHeight: '1.8' }}>
                Bluewell Horizon Limited specializes in designing, supplying, installing, and maintaining high-quality water systems for residential, commercial, institutional, and industrial clients.
              </p>
              <p className="mb-4" style={{ color: '#5a7a8c', lineHeight: '1.7' }}>
                With a commitment to excellence, sustainability, and customer satisfaction, we deliver customized water solutions that meet the highest standards of safety, efficiency, and environmental responsibility.
              </p>
              <div className="d-flex gap-3">
                <Link to="/about" className="btn btn-outline-light rounded-pill px-4">
                  Learn More
                </Link>
                <Link to="/contact" className="btn btn-primary rounded-pill px-4" style={{ background: '#2fa5b6', border: 'none' }}>
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.2)' }}>
                    <FaTint className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2">100+</h4>
                    <p className="small mb-0" style={{ color: '#95b5c4' }}>Installations</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.2)' }}>
                    <FaClock className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2">24/7</h4>
                    <p className="small mb-0" style={{ color: '#95b5c4' }}>Support</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.2)' }}>
                    <FaAward className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2">10+</h4>
                    <p className="small mb-0" style={{ color: '#95b5c4' }}>Technologies</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.2)' }}>
                    <FaCheckCircle className="fs-1 mb-3" style={{ color: '#2fa5b6' }} />
                    <h4 className="fw-bold mb-2">100%</h4>
                    <p className="small mb-0" style={{ color: '#95b5c4' }}>Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-2 mb-3">
              <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
              <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Our Services</span>
              <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
            </div>
            <h2 className="display-5 fw-bold mb-3">Comprehensive Water Solutions</h2>
            <p className="lead mx-auto" style={{ color: '#95b5c4', maxWidth: '600px', fontWeight: '300' }}>
              From purification to full bottling plant setup, we deliver end-to-end water treatment services tailored to your needs.
            </p>
          </div>

          <div className="row g-4">
            {featuredServices.map((service, index) => {
              const IconComponent = service.icon;
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
                    <p className="mb-4" style={{ color: '#5a7a8c', lineHeight: '1.6', fontWeight: '300' }}>{service.desc}</p>
                    <Link to="/services" className="text-decoration-none" style={{ color: '#2fa5b6', fontWeight: '600' }}>
                      Learn More →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-5">
            <Link to="/services" className="btn btn-primary btn-lg rounded-pill px-5" style={{ background: '#2fa5b6', border: 'none' }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #06111c 0%, #091c2e 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
                <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Why Choose Us</span>
              </div>
              <h2 className="display-5 fw-bold mb-4">Delivering Excellence in Every Drop</h2>
              <p className="lead mb-4" style={{ color: '#95b5c4', fontWeight: '300' }}>
                We combine cutting-edge technology with expert service to provide water solutions that exceed expectations.
              </p>
              
              <div className="row g-4">
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2">Customized Solutions</h6>
                      <p className="mb-0 small" style={{ color: '#5a7a8c' }}>Tailored to meet the unique needs and budget of every client.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                      <FaTools />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2">End-to-End Service</h6>
                      <p className="mb-0 small" style={{ color: '#5a7a8c' }}>From diagnosis and design to installation and after-sales support.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                      <FaWater />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2">Commitment to Sustainability</h6>
                      <p className="mb-0 small" style={{ color: '#5a7a8c' }}>Eco-friendly solutions that promote sustainable water use.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3" 
                         style={{ width: '48px', height: '48px', minWidth: '48px', background: 'rgba(47, 165, 182, 0.1)', border: '1px solid rgba(47, 165, 182, 0.3)', color: '#2fa5b6' }}>
                      <FaClock />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-2">Timely & Transparent</h6>
                      <p className="mb-0 small" style={{ color: '#5a7a8c' }}>Upholding integrity, transparency, and fast response times.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Water Treatment" 
                    className="w-100"
                    style={{ height: '500px', objectFit: 'cover' }}
                  />
                </div>
                <div className="position-absolute bottom-0 start-0 m-4 p-4 rounded-4" 
                     style={{ 
                       background: 'rgba(9, 28, 46, 0.9)', 
                       border: '1px solid rgba(47, 165, 182, 0.3)',
                       backdropFilter: 'blur(10px)'
                     }}>
                  <h4 className="fw-bold mb-2" style={{ color: '#2fa5b6' }}>Trusted Partner</h4>
                  <p className="mb-0 small" style={{ color: '#95b5c4' }}>Building long-term partnerships grounded in trust and excellence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Preview */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-2 mb-3">
              <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
              <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Technologies</span>
              <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
            </div>
            <h2 className="display-5 fw-bold mb-3">Powered by Advanced Technology</h2>
            <p className="lead mx-auto" style={{ color: '#95b5c4', maxWidth: '600px', fontWeight: '300' }}>
              We utilize cutting-edge technologies to deliver efficient, reliable, and sustainable purification solutions.
            </p>
          </div>

          <div className="row g-3 justify-content-center">
            {['Reverse Osmosis (RO)', 'Ultrafiltration (UF)', 'UV Sterilization', 'Water Softening', 'EDI Systems', 'Ozone Treatment'].map((tech, index) => (
              <div className="col-auto" key={index}>
                <span className="rounded-pill px-4 py-2 d-inline-block"
                      style={{ 
                        background: 'rgba(9, 28, 46, 0.6)',
                        border: '1px solid rgba(47, 165, 182, 0.3)',
                        color: '#2fa5b6',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}>
                  {tech}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/technologies" className="btn btn-outline-light btn-lg rounded-pill px-5">
              Explore All Technologies
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(160deg, #091c2e 0%, var(--logo-navy) 100%)' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="p-5 rounded-5 text-center" style={{ 
                background: 'rgba(47, 165, 182, 0.1)',
                border: '1px solid rgba(47, 165, 182, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 className="display-5 fw-bold mb-4">Ready to Transform Your Water Quality?</h2>
                <p className="lead mb-5" style={{ color: '#95b5c4', maxWidth: '700px', margin: '0 auto' }}>
                  Contact us today for a free water diagnosis and discover how our innovative solutions can meet your specific needs.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5" 
                        style={{ background: '#2fa5b6', border: 'none', fontWeight: '700' }}>
                    Get Free Consultation
                  </Link>
                  <a href="tel:0721633223" className="btn btn-outline-light btn-lg rounded-pill px-5">
                    Call Us Now
                  </a>
                </div>
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p className="mb-2" style={{ color: '#95b5c4' }}>
                    <FaPhone className="me-2" style={{ color: '#2fa5b6' }} />
                    0721-633-223 / 0731-836-349
                  </p>
                  <p className="mb-0" style={{ color: '#95b5c4' }}>
                    <FaShieldAlt className="me-2" style={{ color: '#2fa5b6' }} />
                    Free Water Diagnosis & System Design
                  </p>
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