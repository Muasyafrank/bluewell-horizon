import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import Button from './Button';

/**
 * Shown when a request fails. It says what went wrong and offers the one action
 * that can fix it, rather than leaving the screen blank as it did before.
 */
export default function ErrorState({ error, onRetry, title = 'We could not load this' }) {
  return (
    <div className="bw-empty">
      <div className="bw-empty__icon" aria-hidden="true">
        <FaExclamationTriangle />
      </div>
      <h3 className="h5 mb-2">{title}</h3>
      <p className="bw-prose mx-auto mb-4" style={{ maxWidth: '38rem' }}>
        {error?.message || 'The server did not respond as expected.'}
      </p>
      {onRetry ? (
        <Button variant="outline" icon={<FaRedo aria-hidden="true" />} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
