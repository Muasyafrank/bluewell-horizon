import React from 'react';
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { CONTACT_DETAILS } from '../../data/company';

const telHref = (phone) => `tel:${phone.replace(/\s/g, '')}`;

/** Address, phone, email and hours as four cards overlapping the hero. */
export default function ContactCards() {
  return (
    <ul className="bw-contact-cards">
      <li className="bw-contact-card">
        <span className="bw-contact-card__icon" aria-hidden="true"><FaMapMarkerAlt /></span>
        <div>
          <span className="bw-contact-card__label">Visit</span>
          <span className="bw-contact-card__value">{CONTACT_DETAILS.address}</span>
        </div>
      </li>
      <li className="bw-contact-card">
        <span className="bw-contact-card__icon" aria-hidden="true"><FaPhoneAlt /></span>
        <div>
          <span className="bw-contact-card__label">Call</span>
          {CONTACT_DETAILS.phones.map((phone) => (
            <a key={phone} href={telHref(phone)} className="bw-contact-card__value">{phone}</a>
          ))}
        </div>
      </li>
      <li className="bw-contact-card">
        <span className="bw-contact-card__icon" aria-hidden="true"><FaEnvelope /></span>
        <div>
          <span className="bw-contact-card__label">Email</span>
          <a href={`mailto:${CONTACT_DETAILS.email}`} className="bw-contact-card__value">
            {/* Offer a line break at the "@" so a narrow card never splits the address mid-word. */}
            {CONTACT_DETAILS.email.split('@')[0]}@<wbr />{CONTACT_DETAILS.email.split('@')[1]}
          </a>
        </div>
      </li>
      <li className="bw-contact-card">
        <span className="bw-contact-card__icon" aria-hidden="true"><FaClock /></span>
        <div>
          <span className="bw-contact-card__label">Hours</span>
          <span className="bw-contact-card__value">{CONTACT_DETAILS.hours}</span>
        </div>
      </li>
    </ul>
  );
}
