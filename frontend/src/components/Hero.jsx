import React from 'react';
import { FaShieldAlt, FaArrowRight, FaCogs } from 'react-icons/fa';

const Hero = () => (
  <section className="hero-section-dark d-flex align-items-center position-relative">
    {/* Background effects */}
    <div className="position-absolute" style={{
      top: '-50%', right: '-20%', width: '800px', height: '800px',
      background: 'radial-gradient(circle, rgba(47, 165, 182, 0.08) 0%, transparent 70%)',
      borderRadius: '50%', pointerEvents: 'none'
    }}></div>
    
    <div className="container position-relative" style={{ zIndex: 2 }}>
      <div className="row justify-content-center text-center">
        <div className="col-lg-10">
          {/* Badge */}
          <div className="d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 mb-4 animate-fade-in animate-delay-1"
               style={{ 
                 background: 'rgba(9, 28, 46, 0.8)', 
                 border: '1px solid rgba(47, 165, 182, 0.3)' 
               }}>
            <FaShieldAlt className="text-info" />
            <span className="text-uppercase small fw-bold" style={{ letterSpacing: '2.5px', color: '#95b5c4' }}>
              Trusted Water Treatment Specialists
            </span>
          </div>

          {/* Title */}
          <h1 className="display-1 fw-bold mb-4 animate-fade-in animate-delay-2 hero-title">
            Pure water,<br />
            engineered with <span className="italic-accent">precision</span>.
          </h1>

          {/* Subtitle */}
          <p className="lead mb-5 mx-auto animate-fade-in animate-delay-3" 
             style={{ maxWidth: '650px', color: '#95b5c4', fontWeight: '300' }}>
            Bluewell Horizon Limited designs, supplies, installs and maintains advanced water treatment systems for homes, businesses, institutions and industries.
          </p>

          {/* Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5 animate-fade-in animate-delay-4">
            <a href="#contact" className="btn btn-light btn-lg rounded-pill px-5 fw-bold d-flex align-items-center gap-2">
              Get a Free Consultation <FaArrowRight />
            </a>
            <a href="#services" className="btn btn-outline-light btn-lg rounded-pill px-5 d-flex align-items-center gap-2">
              <FaCogs /> Explore Services
            </a>
          </div>

          {/* Stats */}
          <div className="row g-3 animate-fade-in animate-delay-4">
            <div className="col-md-4">
              <div className="p-4 rounded-4" style={{ 
                background: 'rgba(9, 28, 46, 0.6)', 
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 className="fw-bold mb-1" style={{ color: '#7dd3e3', fontFamily: 'Space Mono, monospace' }}>100+</h3>
                <p className="text-uppercase small mb-0" style={{ letterSpacing: '3px', color: '#5a7a8c' }}>Installations</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4" style={{ 
                background: 'rgba(9, 28, 46, 0.6)', 
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 className="fw-bold mb-1" style={{ color: '#7dd3e3', fontFamily: 'Space Mono, monospace' }}>24/7</h3>
                <p className="text-uppercase small mb-0" style={{ letterSpacing: '3px', color: '#5a7a8c' }}>Support</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4" style={{ 
                background: 'rgba(9, 28, 46, 0.6)', 
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 className="fw-bold mb-1" style={{ color: '#7dd3e3', fontFamily: 'Space Mono, monospace' }}>10+</h3>
                <p className="text-uppercase small mb-0" style={{ letterSpacing: '3px', color: '#5a7a8c' }}>Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;