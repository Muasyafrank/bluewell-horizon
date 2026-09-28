import React from 'react';

/**
 * Surface container. Set `interactive` only when the whole card is clickable —
 * previously every card lifted on hover, including ones that did nothing,
 * which suggested an affordance that was not there.
 */
export default function Card({
  as: Element = 'div',
  tint = false,
  flush = false,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'bw-card',
    tint ? 'bw-card--tint' : '',
    flush ? 'bw-card--flush' : '',
    interactive ? 'bw-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  );
}
