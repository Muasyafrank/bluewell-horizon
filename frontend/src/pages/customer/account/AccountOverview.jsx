import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight, FaBoxOpen, FaCheckCircle, FaClipboardList, FaEnvelope, FaHeart, FaShoppingBag, FaTruck,
} from 'react-icons/fa';

const QUICK_ACTIONS = [
  { to: '/shop', icon: <FaShoppingBag />, title: 'Browse the shop', text: 'Filters, RO systems, softeners and more' },
  { to: '/quote', icon: <FaClipboardList />, title: 'Request a quote', text: 'For larger or custom installations' },
  { to: '/wishlist', icon: <FaHeart />, title: 'Your wishlist', text: 'Pick up where you left off' },
  { to: '/contact', icon: <FaEnvelope />, title: 'Talk to us', text: 'Questions about an order?' },
];

function Stat({ icon, value, label, to }) {
  const body = (
    <>
      <span className="bw-account-stat__icon" aria-hidden="true">{icon}</span>
      <span className="bw-account-stat__value">{value}</span>
      <span className="bw-account-stat__label">{label}</span>
    </>
  );
  return to ? (
    <Link to={to} className="bw-account-stat bw-account-stat--link">{body}</Link>
  ) : (
    <div className="bw-account-stat">{body}</div>
  );
}

/** Stat tiles and quick links shown under the profile banner. */
export default function AccountOverview({ summary, wishlistCount }) {
  return (
    <>
      <section className="bw-account-stats" aria-label="Order summary">
        <Stat icon={<FaBoxOpen />} value={summary.total} label="Orders placed" />
        <Stat icon={<FaTruck />} value={summary.inProgress} label="In progress" />
        <Stat icon={<FaCheckCircle />} value={summary.delivered} label="Delivered" />
        <Stat icon={<FaHeart />} value={wishlistCount} label="Saved items" to="/wishlist" />
      </section>

      <nav className="bw-account-actions" aria-label="Quick links">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.to} to={action.to} className="bw-account-action">
            <span className="bw-account-action__icon" aria-hidden="true">{action.icon}</span>
            <span className="bw-account-action__text">
              <strong>{action.title}</strong>
              <small>{action.text}</small>
            </span>
            <FaArrowRight className="bw-account-action__arrow" aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </>
  );
}
