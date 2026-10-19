import React from 'react';
import { FaEnvelope, FaPhone, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import { Button } from '../../../components/ui';
import { firstName, greetingFor, initials } from './orderSummary';

/** Personal banner at the top of the account page. */
export default function ProfileHero({ customer, onLogout }) {
  return (
    <section className="bw-account-hero" aria-label="Your profile">
      <div className="bw-account-hero__identity">
        <div className="bw-account-avatar" aria-hidden="true">
          {initials(customer?.name)}
        </div>
        <div>
          <p className="bw-account-hero__eyebrow">{greetingFor()}</p>
          <h1 className="bw-account-hero__title">{firstName(customer?.name) || 'Welcome'}</h1>
          <ul className="bw-account-hero__contact">
            {customer?.email ? (
              <li>
                <FaEnvelope aria-hidden="true" /> {customer.email}
              </li>
            ) : null}
            {customer?.phone ? (
              <li>
                <FaPhone aria-hidden="true" /> {customer.phone}
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="bw-account-hero__actions">
        <Button to="/shop" variant="onDark" icon={<FaShoppingBag aria-hidden="true" />}>
          Continue shopping
        </Button>
        <Button variant="ghostOnDark" icon={<FaSignOutAlt aria-hidden="true" />} onClick={onLogout}>
          Sign out
        </Button>
      </div>
    </section>
  );
}
