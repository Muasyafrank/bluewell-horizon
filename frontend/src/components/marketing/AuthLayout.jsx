import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaHeart, FaTruck } from 'react-icons/fa';

const PERKS = [
  { icon: FaClipboardList, text: 'Track every order in one place' },
  { icon: FaTruck, text: 'Check out faster with your details saved' },
  { icon: FaHeart, text: 'Keep a wishlist of products for later' },
];

/**
 * Two-column shell for sign in and register: a brand panel beside the form.
 * The panel collapses to a logo header on small screens.
 */
export default function AuthLayout({ title, subtitle, notice, footer, children }) {
  return (
    <div className="bw-auth">
      <aside className="bw-auth__brand">
        <Link to="/" className="bw-auth__logo" aria-label="Bluewell Horizon, home">
          <img src="/logo.png" alt="" width="64" height="64" />
        </Link>
        <p className="bw-auth__brand-title">Bluewell Horizon Solutions Limited</p>
        <p className="bw-auth__brand-text">Water treatment systems, delivered and serviced across Kenya.</p>
        <ul className="bw-auth__perks">
          {PERKS.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="bw-auth__main">
        <div className="bw-auth__card">
          <Link to="/" className="bw-auth__logo bw-auth__logo--compact" aria-label="Bluewell Horizon, home">
            <img src="/logo.png" alt="" width="56" height="56" />
          </Link>
          <h1 className="bw-auth__title">{title}</h1>
          <p className="bw-auth__subtitle">{subtitle}</p>
          {notice}
          {children}
          <p className="bw-auth__footer">{footer}</p>
        </div>
      </main>
    </div>
  );
}
