import React from 'react';

/**
 * Empty and "nothing found" screens.
 * Copy is written as an invitation to act rather than an apology.
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="bw-empty">
      {icon ? (
        <div className="bw-empty__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className="h5 mb-2">{title}</h3>
      {description ? (
        <p className="bw-prose mx-auto mb-4" style={{ maxWidth: '38rem' }}>
          {description}
        </p>
      ) : null}
      {action}
    </div>
  );
}
