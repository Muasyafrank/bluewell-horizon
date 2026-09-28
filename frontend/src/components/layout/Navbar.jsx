import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars, FaChevronDown, FaShoppingCart, FaSignOutAlt, FaTimes, FaUserCircle,FaHeart
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useCustomer } from '../../context/CustomerContext';
import { useOnClickOutside, useScrolledPast } from '../../hooks';
import { pluralise } from '../../utils/format';
import { useWishlist } from "../../context/WishlistContext";

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Solutions', path: '/services' },
  { label: 'Shop', path: '/shop' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Request a quote', path: '/quote' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const scrolled = useScrolledPast(50);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user: customer, logout } = useCustomer();
  const { count } = useCart();
  const accountRef = useRef(null);
  const { count: wishlistCount } = useWishlist();

  // The account menu opened on hover only, so it was unreachable by keyboard
  // and on touch devices. It is now a click/keyboard menu that closes on
  // Escape or an outside click.
  useOnClickOutside(accountRef, () => setAccountOpen(false), accountOpen);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!accountOpen && !mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setAccountOpen(false);
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [accountOpen, mobileOpen]);

  const handleLogout = useCallback(() => {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const cartLabel = `Cart, ${count} ${pluralise(count, 'item')}`;
  const wishlistLabel = `Wishlist ,${wishlistCount} saved ${pluralise(wishlistCount, 'item')}`;

  return (
    <nav
      className={[
        'bw-navbar',
        scrolled ? 'bw-navbar--scrolled' : '',
        mobileOpen ? 'bw-navbar--open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Main"
    >
      <div className="d-flex justify-content-between align-items-center gap-3">
        <NavLink to="/" className="d-flex align-items-center" aria-label="Bluewell Horizon, home">
          <img src="/logo.png" alt="" className="bw-navbar__logo" width="44" height="44" />
        </NavLink>

        <div className="d-none d-xl-flex align-items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `bw-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink to="/wishlist" className="bw-nav-link position-relative" aria-label={wishlistLabel}>
            <FaHeart size={18} aria-hidden="true" />
            {wishlistCount > 0 ? (
              <span className="bw-cart-count" aria-hidden="true">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink to="/cart" className="bw-nav-link position-relative" aria-label={cartLabel}>
            <FaShoppingCart size={18} aria-hidden="true" />
            {count > 0 ? (
              <span className="bw-cart-count" aria-hidden="true">
                {count > 99 ? '99+' : count}
              </span>
            ) : null}
          </NavLink>

          {isAuthenticated ? (
            <div className="position-relative" ref={accountRef}>
              <button
                type="button"
                className="bw-nav-link"
                aria-expanded={accountOpen}
                aria-haspopup="true"
                onClick={() => setAccountOpen((open) => !open)}
              >
                <FaUserCircle size={18} aria-hidden="true" />
                <span>{customer?.name?.split(' ')[0] || 'Account'}</span>
                <FaChevronDown
                  size={11}
                  aria-hidden="true"
                  style={{ transform: accountOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
                />
              </button>

              {accountOpen ? (
                <div className="bw-menu">
                  <div className="bw-menu__meta">
                    <small className="d-block text-muted">Signed in as</small>
                    <small className="d-block fw-semibold text-truncate">{customer?.email}</small>
                  </div>
                  <NavLink to="/account" className="bw-menu__item">
                    <FaUserCircle aria-hidden="true" /> My account
                  </NavLink>
                  <button type="button" className="bw-menu__item bw-menu__item--danger" onClick={handleLogout}>
                    <FaSignOutAlt aria-hidden="true" /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <NavLink to="/login" className="bw-nav-link">
              <FaUserCircle size={18} aria-hidden="true" /> Sign in
            </NavLink>
          )}

          <NavLink to="/contact" className="bw-btn bw-btn--primary bw-btn--sm ms-2">
            Book a consultation
          </NavLink>
        </div>

        <div className="d-flex d-xl-none align-items-center gap-2">
          <NavLink to="/cart" className="bw-nav-link position-relative" aria-label={cartLabel}>
            <FaShoppingCart size={18} aria-hidden="true" />
            {count > 0 ? (
              <span className="bw-cart-count" aria-hidden="true">
                {count > 99 ? '99+' : count}
              </span>
            ) : null}
          </NavLink>
          <button
            type="button"
            className="bw-hamburger"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="bw-mobile-nav d-xl-none" id="mobile-navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `bw-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink to="/account" className="bw-nav-link">
                <FaUserCircle aria-hidden="true" /> My account
              </NavLink>
              <button type="button" className="bw-nav-link bw-nav-link--danger" onClick={handleLogout}>
                <FaSignOutAlt aria-hidden="true" /> Sign out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="bw-nav-link">
              <FaUserCircle aria-hidden="true" /> Sign in
            </NavLink>
          )}

          <NavLink to="/contact" className="bw-btn bw-btn--primary bw-btn--sm mt-3 align-self-start">
            Book a consultation
          </NavLink>
        </div>
      ) : null}
    </nav>
  );
}
