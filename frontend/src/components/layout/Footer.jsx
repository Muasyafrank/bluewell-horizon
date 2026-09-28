import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { CONTACT_DETAILS } from '../../data/company';

/**
 * Site footer.
 * The previous version linked every item to `#home`, `#services` and similar
 * hash fragments that exist nowhere in the app, so none of the footer
 * navigation worked. These are now real routes.
 */
const SITE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Solutions', to: '/services' },
  { label: 'Shop', to: '/shop' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

const SERVICE_LINKS = [
  'Water purification',
  'Desalination',
  'Water softening',
  'Bottling plants',
  'Ultrapure water systems',
];

const SOCIALS = [
  { label: 'Bluewell Horizon on Facebook', href: 'https://www.facebook.com/bluewellhorizon', icon: <FaFacebookF /> },
  { label: 'Bluewell Horizon on LinkedIn', href: 'https://www.linkedin.com/company/bluewell-horizon', icon: <FaLinkedinIn /> },
  { label: 'Bluewell Horizon on X', href: 'https://twitter.com/bluewellhorizon', icon: <FaTwitter /> },
];

export default function Footer() {
  return (
    <footer className="bw-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <img src="/logo.png" alt="Bluewell Horizon" className="bw-footer__logo" width="64" height="64" />
            <p className="mb-4" style={{ lineHeight: 1.7, fontSize: '0.9375rem', maxWidth: '34ch' }}>
              Advanced, sustainable water systems — so that safe, clean water reaches every home,
              business and institution we serve.
            </p>
            <div className="d-flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="bw-footer__social"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-sm-4 col-6">
            <h2 className="bw-footer__heading">Site</h2>
            {SITE_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="bw-footer__link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="col-lg-3 col-sm-4 col-6">
            <h2 className="bw-footer__heading">What we do</h2>
            {SERVICE_LINKS.map((label) => (
              <Link key={label} to="/services" className="bw-footer__link">
                {label}
              </Link>
            ))}
          </div>

          <div className="col-lg-3 col-sm-4">
            <h2 className="bw-footer__heading">Get in touch</h2>
            <address className="mb-0" style={{ fontStyle: 'normal' }}>
              <Link to="/contact" className="bw-footer__link">
                {CONTACT_DETAILS.address}
              </Link>
              {CONTACT_DETAILS.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="bw-footer__link">
                  {phone}
                </a>
              ))}
              <a href={`mailto:${CONTACT_DETAILS.email}`} className="bw-footer__link">
                {CONTACT_DETAILS.email}
              </a>
            </address>
          </div>
        </div>

        <hr className="my-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <p className="text-center small mb-0">
          &copy; {new Date().getFullYear()} Bluewell Horizon Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
