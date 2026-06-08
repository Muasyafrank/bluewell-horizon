import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Services', 'Technologies', 'Gallery', 'Contact'];

  return (
    <nav className={`navbar-dark-custom ${scrolled ? 'scrolled' : ''}`}>
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Logo */}
        <a href="#home" className="d-flex align-items-center text-decoration-none">
          <img src="/logo.png" alt="Bluewell Horizon Logo" className="logo-img" />
        </a>

        {/* Desktop Nav */}
        <div className="d-none d-lg-flex align-items-center gap-1">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link-custom text-decoration-none"
            >
              {item}
            </a>
          ))}
          <a href="#contact" className="nav-cta-btn ms-2 text-decoration-none">
            Get Consultation
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="hamburger-btn d-lg-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="d-lg-none mt-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link-custom d-block py-2 text-decoration-none"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <a href="#contact" className="nav-cta-btn d-inline-block mt-2 text-decoration-none" onClick={() => setIsOpen(false)}>
            Get Consultation
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;