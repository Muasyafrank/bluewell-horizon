import React from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

/**
 * The one button in the app.
 *
 * Buttons used to be written as `<button className="btn btn-lg rounded-pill"
 * style={{ backgroundColor: '#2fa5b6', ... }}>` in roughly forty places, each
 * with slightly different padding and hover behaviour. Variants are defined in
 * CSS; this component only picks the right class and renders the correct
 * element (`button`, `a` or router `Link`).
 */
const VARIANTS = {
  primary: 'bw-btn--primary',
  secondary: 'bw-btn--secondary',
  outline: 'bw-btn--outline',
  onDark: 'bw-btn--on-dark',
  ghostOnDark: 'bw-btn--ghost-on-dark',
  danger: 'bw-btn--danger',
};

const SIZES = {
  sm: 'bw-btn--sm',
  md: '',
  lg: 'bw-btn--lg',
};

const Button = React.forwardRef(function Button(
  {
    as,
    to,
    href,
    variant = 'primary',
    size = 'md',
    block = false,
    loading = false,
    loadingText,
    disabled = false,
    icon = null,
    iconAfter = null,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const classes = [
    'bw-btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] ?? '',
    block ? 'bw-btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? <FaSpinner className="bw-spin" aria-hidden="true" /> : icon}
      <span>{loading && loadingText ? loadingText : children}</span>
      {!loading && iconAfter}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  const Element = as || 'button';

  return (
    <Element
      ref={ref}
      type={Element === 'button' ? type : undefined}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </Element>
  );
});

export default Button;
