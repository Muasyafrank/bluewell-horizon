import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Bluewell Horizon Limited';
const SITE_URL = 'https://www.bluewellhorizonlimited.com';
const DEFAULT_DESCRIPTION =
  'Bluewell Horizon Limited designs, supplies, installs and maintains water treatment systems for homes, businesses, institutions and industries across Kenya.';

/** Page metadata. `path` is joined to the canonical site URL. */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'water treatment, water purification, reverse osmosis, Nairobi, Kenya, Bluewell Horizon',
  image = `${SITE_URL}/images/og-image.png`,
  path = '',
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="geo.region" content="KE" />
      <meta name="geo.placename" content="Nairobi" />
      <meta name="geo.position" content="-1.2921;36.8219" />
      <meta name="ICBM" content="-1.2921, 36.8219" />
    </Helmet>
  );
}
