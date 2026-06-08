import React from 'react';
import { technologies } from '../data/data';

const Technologies = () => (
  <section className="py-5" style={{ background: 'linear-gradient(180deg, #06111c 0%, #091c2e 100%)' }}>
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{ width: '30px', height: '1px', background: '#2fa5b6' }}></div>
            <span className="text-uppercase small fw-bold" style={{ color: '#2fa5b6', letterSpacing: '3px' }}>Technologies</span>
          </div>
          <h2 className="display-5 fw-bold mb-3">Powered by advanced<br />water treatment tech</h2>
          <p className="lead" style={{ color: '#95b5c4', maxWidth: '600px', fontWeight: '300' }}>
            We utilize cutting-edge technologies to deliver efficient, reliable, and sustainable purification solutions.
          </p>
        </div>
      </div>

      <div className="d-flex flex-wrap">
        {technologies.map((tech, index) => (
          <span key={index} 
                className="rounded-pill px-4 py-2 m-1"
                style={{ 
                  background: 'rgba(9, 28, 46, 0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#95b5c4',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#2fa5b6';
                  e.target.style.color = '#2fa5b6';
                  e.target.style.background = 'rgba(47, 165, 182, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.target.style.color = '#95b5c4';
                  e.target.style.background = 'rgba(9, 28, 46, 0.6)';
                }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default Technologies;