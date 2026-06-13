import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'scrolled' : ''}`} 
         style={{
           background: scrolled ? 'rgba(6, 17, 28, 0.95)' : 'rgba(8, 24, 40, 0.85)',
           backdropFilter: 'blur(20px)',
           borderRadius: '60px',
           margin: '16px',
           border: '1px solid rgba(255,255,255,0.06)'
         }}>
      <div className="container">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-3">
          <img src="/logo.png" alt="Bluewell Horizon Logo" className="logo-img" />
        </NavLink>

        <button className="navbar-toggler border-0" type="button" onClick={() => setIsOpen(!isOpen)}
                style={{ color: '#fff', fontSize: '1.5rem' }}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {navLinks.map((item) => (
              <li className="nav-item" key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link px-3 ${isActive ? 'active' : ''}`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#7dd3e3' : '#95b5c4',
                    fontWeight: '500',
                    fontSize: '0.85rem'
                  })}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            <li className="nav-item ms-lg-3">
              <NavLink to="/contact" className="btn btn-primary rounded-pill px-4"
                      style={{ 
                        background: '#2fa5b6', 
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.85rem'
                      }}>
                Get Consultation
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;