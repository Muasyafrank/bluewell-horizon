import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords = 'water treatment, water purification, reverse osmosis, Nairobi, Kenya, Bluewell Horizon',
  image = '/images/og-image.png',
  url = 'https://www.bluewellhorizonlimited.com',
  type = 'website'
}) => {
  const fullTitle = `${title} | Bluewell Horizon Limited`;
  const fullDescription = description || 'Bluewell Horizon Limited - Trusted provider of innovative water treatment technologies in Kenya. We design, supply, install, and maintain high-quality water systems for residential, commercial, and industrial clients.';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Bluewell Horizon Limited" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bluewell Horizon Limited" />
      <meta property="og:locale" content="en_KE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="geo.region" content="KE" />
      <meta name="geo.placename" content="Nairobi" />
      <meta name="geo.position" content="-1.2921;36.8219" />
      <meta name="ICBM" content="-1.2921, 36.8219" />
    </Helmet>
  );
};

export default SEO;