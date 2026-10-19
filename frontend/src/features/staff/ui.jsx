import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BADGE = { success: 'success', warning: 'warning', danger: 'danger', info: 'info', neutral: 'neutral', muted: 'neutral' };

/** Status pill. Uses the website's badge so statuses read the same everywhere. */
export function Tone({ tone = 'neutral', children }) {
  return <span className={`bw-badge bw-badge--${BADGE[tone] || 'neutral'}${tone === 'muted' ? ' bms-badge--muted' : ''}`}>{children}</span>;
}

export function StatusTone({ map, value }) {
  const entry = map[value] || { label: value, tone: 'neutral' };
  return <Tone tone={entry.tone}>{entry.label}</Tone>;
}

/** The navy banner every page opens with, like the account page's. */
export function PageHead({ title, subtitle, eyebrow = 'Business system', children }) {
  return (
    <header className="bms-hero">
      <div className="bms-hero__text">
        <p className="bms-hero__eyebrow">{eyebrow}</p>
        <h1 className="bms-hero__title">{title}</h1>
        {subtitle ? <p className="bms-hero__sub">{subtitle}</p> : null}
      </div>
      {children ? <div className="bms-hero__actions">{children}</div> : null}
    </header>
  );
}

/** A figure tile like the account page's, with an icon chip. */
export function Stat({ label, value, tone, icon }) {
  return (
    <div className={['bms-stat', tone ? `bms-stat--${tone}` : ''].join(' ').trim()}>
      {icon ? <span className="bms-stat__icon" aria-hidden="true">{icon}</span> : null}
      <strong className="bms-stat__value">{value}</strong>
      <span className="bms-stat__label">{label}</span>
    </div>
  );
}

export function Empty({ children }) {
  return <div className="bms-empty">{children}</div>;
}

export function BackLink({ to, children }) {
  return (
    <p className="bms-back">
      <Link to={to}><FaArrowLeft aria-hidden="true" /> {children}</Link>
    </p>
  );
}
