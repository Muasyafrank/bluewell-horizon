import React from 'react';
import { FaShieldAlt, FaArrowRight, FaCogs } from 'react-icons/fa';

const Hero = () => (
  <section id="home" className="hero-section-dark">
    <div className="container position-relative" style={{ zIndex: 2 }}>
      {/* Badge */}
      <div className="hero-badge animate-fade-in animate-delay-1">
        <FaShieldAlt />
        <span>Trusted Water Treatment Specialists</span>
      </div>

      {/* Title */}
      <h1 className="hero-title animate-fade-in animate-delay-2">
        Pure water,<br />
        engineered with <span className="italic-accent">precision</span>.
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle animate-fade-in animate-delay-3">
        Bluewell Horizon Limited designs, supplies, installs and maintains advanced water treatment systems for homes, businesses, institutions and industries.
      </p>

      {/* Buttons */}
      <div className="d-flex flex-wrap gap-3 animate-fade-in animate-delay-4">
        <a href="#contact" className="btn-hero-primary">
          Get a Free Consultation <FaArrowRight />
        </a>
        <a href="#services" className="btn-hero-secondary">
          <FaCogs /> Explore Services
        </a>
      </div>

      {/* Stats */}
      <div className="stats-container animate-fade-in animate-delay-4">
        <div className="row text-center">
          <div className="col-4 stat-item">
            <h3>100+</h3>
            <p>Installations</p>
          </div>
          <div className="col-4 stat-item">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
          <div className="col-4 stat-item">
            <h3>10+</h3>
            <p>Technologies</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;