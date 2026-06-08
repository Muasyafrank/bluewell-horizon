import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer-dark">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          {/* Logo */}
          <div className="mb-3">
            <img src="/logo.png" alt="Bluewell Horizon Logo" className="footer-logo logo-img" />
          </div>
          <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
            Delivering advanced, sustainable, and innovative water systems. Ensuring access to safe, clean water at every level.
          </p>
          <div className="d-flex gap-3 mt-3">
            <a href="#" className="text-muted" style={{ fontSize: '1.2rem' }}><FaFacebook /></a>
            <a href="#" className="text-muted" style={{ fontSize: '1.2rem' }}><FaLinkedin /></a>
            <a href="#" className="text-muted" style={{ fontSize: '1.2rem' }}><FaTwitter /></a>
          </div>
        </div>

        <div className="col-lg-2 col-6">
          <h5>Quick Links</h5>
          {['Home', 'About', 'Services', 'Technologies', 'Gallery', 'Contact'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>
          ))}
        </div>

        <div className="col-lg-3 col-6">
          <h5>Services</h5>
          <a href="#services">Water Purification</a>
          <a href="#services">Desalination</a>
          <a href="#services">Water Softening</a>
          <a href="#services">Bottling Plants</a>
          <a href="#services">UltraPure Systems</a>
        </div>

        <div className="col-lg-3">
          <h5>Contact</h5>
          <a href="#contact">Harambee Estate, Kenya</a>
          <a href="tel:0721633223">0721-633-223</a>
          <a href="tel:0731836349">0731-836-349</a>
          <a href="mailto:bluewellsynergy@gmail.com">bluewellsynergy@gmail.com</a>
        </div>
      </div>

      <div className="footer-bottom text-center">
        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} Bluewell Horizon Limited. All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;