import React from 'react';
import { useReveal } from '../../hooks';

/**
 * Wraps one grid item so it fades in as it scrolls into view. `index` staggers
 * neighbours slightly (use the item's position within its row).
 */
export default function Reveal({ as: Tag = 'div', index = 0, className = '', children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`bw-reveal ${className}`.trim()} style={{ '--i': index }} {...rest}>
      {children}
    </Tag>
  );
}
