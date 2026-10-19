import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FaBars, FaChevronDown, FaSignOutAlt, FaTimes, FaUserCircle } from 'react-icons/fa';
import { SEO } from '../../components/common';
import { Loader, ErrorState } from '../../components/ui';
import { useOnClickOutside, useScrolledPast } from '../../hooks';
import { visibleNav } from './access';
import { useStaff } from './StaffContext';
import '../../styles/staff.css';

/**
 * The business system uses the website's own floating navbar, so staff move
 * between the two without feeling they changed product. The menu lists only
 * what the signed-in role may open.
 */
export default function StaffLayout() {
  const { me, loading, error, logout } = useStaff();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const scrolled = useScrolledPast(50);
  const location = useLocation();

  useOnClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen && !mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, mobileOpen]);

  if (loading) return <Loader text="Loading" fullPage />;
  if (error) return <ErrorState error={error} />;
  if (!me) return null;

  const links = visibleNav(me.modules);
  const linkClass = ({ isActive }) => `bw-nav-link ${isActive ? 'active' : ''}`;
  const firstName = (me.name || 'Account').split(' ')[0];

  return (
    <div className="bms">
      <SEO title="Staff" path="/staff" noIndex />
      <nav className={['bw-navbar', scrolled ? 'bw-navbar--scrolled' : '', mobileOpen ? 'bw-navbar--open' : ''].filter(Boolean).join(' ')}
        aria-label="Business system">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <NavLink to="/staff" className="d-flex align-items-center gap-2 bms-brand" aria-label="Bluewell Horizon business system, dashboard">
            <img src="/logo.png" alt="" className="bw-navbar__logo" width="44" height="44" />
            <span className="bms-brand__text">Business system</span>
          </NavLink>

          <div className="d-none d-xl-flex align-items-center gap-1">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>{item.label}</NavLink>
            ))}

            <div className="position-relative" ref={menuRef}>
              <button type="button" className="bw-nav-link" aria-expanded={menuOpen} aria-haspopup="true" onClick={() => setMenuOpen((o) => !o)}>
                <FaUserCircle size={18} aria-hidden="true" />
                <span>{firstName}</span>
                <FaChevronDown size={11} aria-hidden="true" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
              </button>
              {menuOpen ? (
                <div className="bw-menu">
                  <div className="bw-menu__meta">
                    <small className="d-block fw-semibold text-truncate">{me.name}</small>
                    <small className="d-block text-muted text-truncate">{me.roleLabel} · {me.email}</small>
                  </div>
                  <NavLink to="/" className="bw-menu__item">Back to the website</NavLink>
                  <button type="button" className="bw-menu__item bw-menu__item--danger" onClick={logout}>
                    <FaSignOutAlt aria-hidden="true" /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="d-flex d-xl-none align-items-center gap-2">
            <button type="button" className="bw-hamburger" onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen} aria-controls="staff-mobile-navigation" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
              {mobileOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="bw-mobile-nav d-xl-none" id="staff-mobile-navigation">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>{item.label}</NavLink>
            ))}
            <NavLink to="/" className="bw-nav-link">Back to the website</NavLink>
            <button type="button" className="bw-nav-link bw-nav-link--danger" onClick={logout}>
              <FaSignOutAlt aria-hidden="true" /> Sign out ({firstName})
            </button>
          </div>
        ) : null}
      </nav>

      <main className="bms__main container">
        <Outlet />
      </main>
    </div>
  );
}
