import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => (
  <footer className="py-5" style={{ background: '#040a11', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          <img src="/logo.png" alt="Bluewell Horizon Logo" className="footer-logo mb-3" />
          <p className="mb-3" style={{ color: '#95b5c4', lineHeight: 1.7, fontSize: '0.9rem' }}>
            Delivering advanced, sustainable, and innovative water systems. Ensuring access to safe, clean water at every level.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="text-secondary fs-5"><FaFacebook /></a>
            <a href="#" className="text-secondary fs-5"><FaLinkedin /></a>
            <a href="#" className="text-secondary fs-5"><FaTwitter /></a>
          </div>
        </div>

        <div className="col-lg-2 col-6">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ color: '#5a7a8c', letterSpacing: '2.5px' }}>Quick Links</h6>
          {['Home', 'About', 'Services', 'Technologies', 'Gallery', 'Contact'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="d-block mb-2 text-secondary text-decoration-none" 
               style={{ transition: 'color 0.3s' }}
               onMouseEnter={(e) => e.target.style.color = '#2fa5b6'}
               onMouseLeave={(e) => e.target.style.color = '#95b5c4'}>
              {link}
            </a>
          ))}
        </div>

        <div className="col-lg-3 col-6">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ color: '#5a7a8c', letterSpacing: '2.5px' }}>Services</h6>
          <a href="#services" className="d-block mb-2 text-secondary text-decoration-none">Water Purification</a>
          <a href="#services" className="d-block mb-2 text-secondary text-decoration-none">Desalination</a>
          <a href="#services" className="d-block mb-2 text-secondary text-decoration-none">Water Softening</a>
          <a href="#services" className="d-block mb-2 text-secondary text-decoration-none">Bottling Plants</a>
          <a href="#services" className="d-block mb-2 text-secondary text-decoration-none">UltraPure Systems</a>
        </div>

        <div className="col-lg-3">
          <h6 className="text-uppercase small fw-bold mb-3" style={{ color: '#5a7a8c', letterSpacing: '2.5px' }}>Contact</h6>
          <a href="#contact" className="d-block mb-2 text-secondary text-decoration-none">Harambee Estate, Kenya</a>
          <a href="tel:0721633223" className="d-block mb-2 text-secondary text-decoration-none">0721-633-223</a>
          <a href="tel:0731836349" className="d-block mb-2 text-secondary text-decoration-none">0731-836-349</a>
          <a href="mailto:bluewellsynergy@gmail.com" className="d-block mb-2 text-secondary text-decoration-none">bluewellsynergy@gmail.com</a>
        </div>
      </div>

      <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
      <p className="text-center small mb-0" style={{ color: '#5a7a8c' }}>
        &copy; {new Date().getFullYear()} Bluewell Horizon Limited. All Rights Reserved.
      </p>
    </div>
  </footer>
);

export default Footer;