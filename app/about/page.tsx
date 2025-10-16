import { Metadata } from 'next';
import Script from 'next/script';
import AboutClient from './components/AboutClient';

export const metadata: Metadata = {
  title: 'Meistä | Kroi Auto Center',
  description: 'Kroi Auto Center - Yli 15 vuoden kokemus autojen myynnistä. Luotettava perheyritys Helsingissä. Lue lisää meistä.',
};

export default function AboutPage() {
  // Enhanced structured data for SEO
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kroi Auto Center",
    "description": "Yli 15 vuoden kokemus autojen myynnistä. Luotettava perheyritys Helsingissä.",
    "url": "https://kroiautocenter.fi",
    "foundingDate": "2008",
    "areaServed": {
      "@type": "Country",
      "name": "Finland"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Helsinki",
      "addressCountry": "FI"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Finnish", "Swedish", "English"]
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Used Cars",
      "itemListElement": [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Car",
          "@id": "UsedCars",
          "brand": ["BMW", "Mercedes-Benz", "Skoda", "Volkswagen", "Audi"]
        }
      }]
    },
    "knowsAbout": ["Car Sales", "Used Cars", "Automotive Services"],
    "slogan": "Luotettava perheyritys yli 15 vuoden kokemuksella"
  };

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <AboutClient />
    </>
  );
}