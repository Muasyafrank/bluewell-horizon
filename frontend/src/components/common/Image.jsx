import React, { useState } from 'react';
import { assetUrl } from '../../api';

/**
 * Image with a fallback and native lazy loading.
 *
 * Replaces the old `LazyImage`, which set up an IntersectionObserver per image
 * to do what `loading="lazy"` does natively, and hid the image behind an
 * absolutely positioned spinner that never cleared if the load failed. Explicit
 * `width`/`height` or an aspect ratio keeps layout from shifting as images
 * arrive.
 */
export default function Image({
  src,
  alt,
  fallback = '/images/placeholder.png',
  className = '',
  ...rest
}) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? fallback : assetUrl(src, fallback);

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
