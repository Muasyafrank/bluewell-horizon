import { Helmet } from 'react-helmet-async';

const StructuredData = () => {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Bluewell Horizon Limited",
    "image": "https://www.bluewellhorizonlimited.com/images/logo.png",
    "url": "https://www.bluewellhorizonlimited.com",
    "telephone": "+254721633223",
    "email": "bluewellsynergy@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Harambee Estate",
      "addressLocality": "Nairobi",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.2921,
      "longitude": 36.8219
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/bluewellhorizon",
      "https://www.linkedin.com/company/bluewell-horizon"
    ],
    "priceRange": "$$",
    "description": "Bluewell Horizon Limited is a trusted provider of innovative water treatment technologies in Kenya, specializing in water purification, desalination, bottling plants, and technical support.",
    "areaServed": {
      "@type": "Country",
      "name": "Kenya"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Water Treatment Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Water Purification",
            "description": "Comprehensive purification systems using RO, UV, and activated carbon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Water Bottling Plant Solutions",
            "description": "Complete bottling plant setup and operational support"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Desalination Systems",
            "description": "Convert saline water to fresh water using membrane technology"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(businessData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;