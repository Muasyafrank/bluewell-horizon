import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { Button } from '../ui';
import { CONTACT_DETAILS } from '../../data/company';

/** Closing call to action: headline, one or two buttons and the phone number. */
export default function CtaBand({ title, lead, primary, secondary }) {
  const [phone] = CONTACT_DETAILS.phones;

  return (
    <section className="bw-section bw-section--navy bw-cta">
      <div className="container text-center">
        <h2 className="bw-cta__title">{title}</h2>
        <p className="bw-lead mx-auto mb-5">{lead}</p>
        <div className="bw-cta__actions">
          <Button to={primary.to} variant="onDark" size="lg">
            {primary.label}
          </Button>
          {secondary ? (
            <Button to={secondary.to} variant="ghostOnDark" size="lg">
              {secondary.label}
            </Button>
          ) : null}
        </div>
        <p className="bw-cta__phone">
          <FaPhoneAlt aria-hidden="true" /> Prefer to talk?{' '}
          <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
        </p>
      </div>
    </section>
  );
}
