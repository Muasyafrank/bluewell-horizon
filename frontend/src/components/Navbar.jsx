import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useCustomer } from '../context/CustomerContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { isAuthenticated, customer, logout } = useCustomer();
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

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
    setShowDropdown(false);
  }, [location]);

  // Handle hover - show dropdown with slight delay
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowDropdown(true);
  };

  // Handle mouse leave - hide dropdown with delay for smooth UX
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200); // 200ms delay for smoother transition
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Solutions', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Requset Quote', path: '/quote'},
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

          {/* Customer Account Dropdown - Desktop Only, Hover Activated */}
          {isAuthenticated ? (
            <div 
              className="position-relative d-none d-lg-block" 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="nav-link-custom d-flex align-items-center gap-2 border-0 bg-transparent"
                style={{ cursor: 'pointer' }}
                aria-expanded={showDropdown}
              >
                <FaUserCircle size={20} style={{ color: '#2fa5b6' }} />
                <span className="fw-semibold" style={{ color: '#ffffff' }}>
                  {customer?.name?.split(' ')[0] || 'Account'}
                </span>
                <FaChevronDown size={12} style={{ color: '#2fa5b6', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Dropdown Menu - Shows on Hover */}
              <div 
                className="position-absolute end-0 mt-2 p-2 rounded-3 shadow-lg"
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  minWidth: '220px',
                  zIndex: 1000,
                  opacity: showDropdown ? 1 : 0,
                  visibility: showDropdown ? 'visible' : 'hidden',
                  transform: showDropdown ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s'
                }}
              >
                {/* Email Display - Only in Dropdown */}
                <div className="px-3 py-2 mb-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <small className="text-muted d-block">Signed in as</small>
                  <small className="fw-semibold d-block text-truncate" style={{ color: '#0b2540', maxWidth: '190px' }}>
                    {customer?.email}
                  </small>
                </div>
                
                <NavLink 
                  to="/account" 
                  className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded-2"
                  style={{ color: '#0b2540', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f9fa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <FaUserCircle style={{ color: '#2fa5b6' }} />
                  <span>My Account</span>
                </NavLink>
                
                <button 
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 px-3 py-2 w-100 text-start border-0 bg-transparent rounded-2"
                  style={{ color: '#dc3545', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff5f5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="nav-cta-btn ms-2 d-none d-lg-inline-block">
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

          {/* Mobile Customer Account Section - Email REMOVED */}
          {isAuthenticated ? (
            <>
              <div className="py-2 mt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                <small className="fw-semibold d-block mb-2" style={{ color: '#ffffff' }}>
                  <FaUserCircle className="me-2" style={{ color: '#2fa5b6' }} />
                  {customer?.name}
                </small>
              </div>
              <NavLink to="/account" className="nav-link-custom d-block py-2 d-flex align-items-center gap-2">
                <FaUserCircle style={{ color: '#2fa5b6' }} />
                <span className="fw-semibold">My Account</span>
              </NavLink>
              <button 
                onClick={handleLogout}
                className="nav-link-custom d-block py-2 text-start w-100 border-0 bg-transparent d-flex align-items-center gap-2"
                style={{ color: '#dc3545' }}
              >
                <FaSignOutAlt />
                <span>Logout</span>
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