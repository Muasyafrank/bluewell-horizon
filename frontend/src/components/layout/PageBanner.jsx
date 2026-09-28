import React from 'react';

/**
 * The dark photographic banner at the top of an inner page.
 *
 * Each page used to inline its own `linear-gradient(...) url(...)` background.
 * Several used a light scrim under navy text, leaving headings barely legible;
 * the shared `.bw-band` scrim guarantees white text has enough contrast.
 */
export default function PageBanner({ eyebrow, title, lead, image = '/images/gallery-3.png' }) {
  return (
    <header
      className="bw-band bw-section"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="container">
        {eyebrow ? <p className="bw-eyebrow">{eyebrow}</p> : null}
        <h1 className="display-5 fw-bold mb-3" style={{ maxWidth: '18ch' }}>
          {title}
        </h1>
        {lead ? <p className="bw-lead mb-0">{lead}</p> : null}
      </div>
    </header>
  );
}
