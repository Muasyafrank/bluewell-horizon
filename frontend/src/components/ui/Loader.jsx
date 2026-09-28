import React from 'react';

/**
 * Water-drop loading indicator.
 * `role="status"` means assistive technology announces the wait instead of
 * sitting silent, which was the case before.
 */
export default function Loader({ text = 'Loading', size = 'md', fullPage = false }) {
  const classes = [
    'bw-loader',
    size === 'sm' ? 'bw-loader--sm' : '',
    fullPage ? 'bw-loader--page' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="status" aria-live="polite">
      <div className="bw-loader__figure" aria-hidden="true">
        <span className="bw-loader__drop" />
        <span className="bw-loader__ripple" />
        <span className="bw-loader__ripple" />
        <span className="bw-loader__ripple" />
      </div>
      {text ? <p className="bw-loader__text mb-0">{text}</p> : null}
      <span className="visually-hidden">{text || 'Loading'}</span>
    </div>
  );
}
