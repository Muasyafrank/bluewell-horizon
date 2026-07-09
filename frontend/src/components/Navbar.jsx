import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useCustomer } from '../context/CustomerContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const { isAuthenticated, customer, logout } = useCustomer(); // Fixed: isAuthenticated

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Solutions', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`navbar-dark-custom ${scrolled ? 'scrolled' : ''}`}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <NavLink to="/" className="d-flex align-items-center text-decoration-none">
          <img src="/logo.png" alt="Bluewell Horizon Logo" className="logo-img" />
        </NavLink>

        <div className="d-none d-lg-flex align-items-center gap-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
            >
              {item.name}
            </NavLink>
          ))}
          
          <NavLink to="/cart" className="nav-link-custom position-relative">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                    style={{ backgroundColor: '#2fa5b6', fontSize: '0.65rem', padding: '2px 5px' }}>
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Customer Auth Section */}
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2 ms-2">
              <NavLink to="/account" className="nav-link-custom d-flex align-items-center gap-2">
                <FaUserCircle size={20} style={{ color: '#2fa5b6' }} />
                <span className="fw-semibold" style={{ color: '#ffffff' }}>
                  {customer?.name?.split(' ')[0] || 'Account'}
                </span>
              </NavLink>
              <button 
                onClick={handleLogout}
                className="btn btn-sm btn-outline-light rounded-pill px-3"
                style={{ borderColor: '#2fa5b6', color: '#2fa5b6' }}
              >
                <FaSignOutAlt className="me-1" /> Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-cta-btn ms-2">
              <FaUserCircle className="me-1" /> Login
            </NavLink>
          )}

          <NavLink to="/contact" className="nav-cta-btn ms-2">
            Get Consultation
          </NavLink>
        </div>

        <button className="hamburger-btn d-lg-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="d-lg-none mt-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-link-custom d-block py-2 ${isActive ? 'active' : ''}`}
            >
              {item.name}
            </NavLink>
          ))}
          
          <NavLink to="/cart" className="nav-link-custom d-block py-2">
            <FaShoppingCart className="me-2" /> Cart ({cartCount})
          </NavLink>

          {/* Mobile Customer Auth Section */}
          {isAuthenticated ? (
            <>
              <NavLink to="/account" className="nav-link-custom d-block py-2 d-flex align-items-center gap-2">
                <FaUserCircle style={{ color: '#2fa5b6' }} />
                <span className="fw-semibold">My Account</span>
              </NavLink>
              <button 
                onClick={handleLogout}
                className="nav-link-custom d-block py-2 text-start w-100 border-0 bg-transparent"
                style={{ color: 'inherit' }}
              >
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link-custom d-block py-2">
              <FaUserCircle className="me-2" /> Login
            </NavLink>
          )}

          <NavLink to="/contact" className="nav-cta-btn d-inline-block mt-2">
            Get Consultation
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;