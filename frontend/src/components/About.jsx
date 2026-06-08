import React from 'react';
import { FaAward, FaUsers, FaTools, FaShieldAlt } from 'react-icons/fa';

const AboutSection = () => (
  <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
    <div className="container py-5">
      {/* Section Label */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
        <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
          About Us
        </span>
      </div>

      {/* Headline */}
      <h2 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2, maxWidth: '800px' }}>
        Innovative water solutions you can <span className="fst-italic" style={{ color: '#2fa5b6' }}>rely on.</span>
      </h2>

      {/* Body Text */}
      <p className="lead mb-4" style={{ color: '#4a5568', lineHeight: 1.7 }}>
        Bluewell Horizon Limited is a trusted provider of innovative and reliable water treatment technologies. We specialize in designing, supplying, installing, and maintaining high-quality water systems for residential, commercial, institutional, and industrial clients.
      </p>
      <p className="mb-5" style={{ color: '#4a5568', lineHeight: 1.7, maxWidth: '800px' }}>
        Our commitment is simple — deliver safe, clean water through dependable engineering and personalised service that fits every environment.
      </p>

      {/* Feature Cards Grid (2 columns as shown in image) */}
      <div className="row g-4">
        {[
          { icon: <FaAward size={20} />, title: "Certified Quality", desc: "Industry-grade systems and components." },
          { icon: <FaUsers size={20} />, title: "Every Sector", desc: "Homes, businesses, schools, industries." },
          { icon: <FaTools size={20} />, title: "Expert Installation", desc: "Professional setup and ongoing technical support." },
          { icon: <FaShieldAlt size={20} />, title: "Safe & Reliable", desc: "Advanced purification meeting highest safety standards." }
        ].map((item, index) => (
          <div className="col-md-6" key={index}>
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
                   style={{ width: '48px', height: '48px', backgroundColor: '#2fa5b6', color: '#ffffff' }}>
                {item.icon}
              </div>
              <h5 className="fw-bold mb-2" style={{ color: '#0b2540', fontSize: '1.1rem' }}>{item.title}</h5>
              <p className="mb-0 small" style={{ color: '#718096', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;