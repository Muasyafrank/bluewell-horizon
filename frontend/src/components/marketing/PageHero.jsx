import React from 'react';

/**
 * Hero shared by the marketing pages.
 *
 * - `image`: optional background photograph. Without one the hero uses the
 *   brand navy with ripples, which suits pages (like Contact) where a photo
 *   would compete with the form below.
 * - `overlap`: content that straddles the hero's lower edge, such as a stat
 *   strip or contact cards. The section after it gets extra top padding.
 * - `size`: "lg" for the home page, "md" for everything else.
 * - `children`: extra content under the buttons (e.g. a row of chips).
 */
export default function PageHero({ eyebrow, title, lead, image, actions, overlap, size = 'md', children }) {
  const classes = ['bw-band', 'bw-page-hero', `bw-page-hero--${size}`, image ? '' : 'bw-page-hero--plain']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={classes} style={image ? { backgroundImage: `url('${image}')` } : undefined}>
        <div className="container">
          {eyebrow ? <p className="bw-eyebrow">{eyebrow}</p> : null}
          <h1 className="bw-page-hero__title">{title}</h1>
          {lead ? <p className="bw-lead bw-page-hero__lead">{lead}</p> : null}
          {actions ? <div className="bw-page-hero__actions">{actions}</div> : null}
          {children}
        </div>
      </header>
      {overlap ? <div className="container bw-hero-overlap">{overlap}</div> : null}
    </>
  );
}
