import React from 'react';

/**
 * Compact circular control for tables and steppers.
 * `label` is required because these buttons show an icon only — without it
 * screen readers announce nothing, which was the case in every admin table.
 */
const IconButton = React.forwardRef(function IconButton(
  { label, icon, variant = 'default', className = '', ...rest },
  ref,
) {
  const classes = [
    'bw-icon-btn',
    variant === 'solid' ? 'bw-icon-btn--solid' : '',
    variant === 'danger' ? 'bw-icon-btn--danger' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} type="button" className={classes} aria-label={label} title={label} {...rest}>
      <span aria-hidden="true">{icon}</span>
    </button>
  );
});

export default IconButton;
