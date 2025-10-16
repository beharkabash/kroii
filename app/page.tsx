import { Metadata } from 'next';
import { cars } from '@/app/data/cars';
import PageLayout from './components/layout/PageLayout';
import HomeContent from './(pages)/home/HomeContent';

export const metadata: Metadata = {
  title: 'Kroi Auto Center - Laadukkaita käytettyjä autoja Helsingissä',
  description: 'Kroi Auto Center on luotettava autoliike Helsingissä. Meiltä löydät laadukkaita käytettyjä autoja, rahoitusratkaisuja ja ammattitaitoista palvelua. Yli 15 vuoden kokemus.',
  keywords: [
    'käytetyt autot',
    'autokauppa Helsinki',
    'autorahoitus',
    'käytettyjen autojen myynti',
    'Kroi Auto Center',
    'luotettava autoliike',
    'autohuolto',
    'takuuautot'
  ],
  openGraph: {
    title: 'Kroi Auto Center - Laadukkaita käytettyjä autoja',
    description: 'Luotettava autoliike Helsingissä. Meiltä löydät laadukkaita käytettyjä autoja ja ammattitaitoista palvelua.',
    url: 'https://kroiautocenter.fi',
    siteName: 'Kroi Auto Center',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kroi Auto Center - Käytettyjen autojen asiantuntija',
      },
    ],
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kroi Auto Center - Laadukkaita käytettyjä autoja',
    description: 'Luotettava autoliike Helsingissä. Meiltä löydät laadukkaita käytettyjä autoja ja ammattitaitoista palvelua.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  // Get latest 9 cars sorted by year (newest first)
  const latestCars = cars
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, 9);

  // Structured data for local business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": "https://kroiautocenter.fi",
    "name": "Kroi Auto Center",
    "description": "Luotettava autoliike Helsingissä. Meiltä löydät laadukkaita käytettyjä autoja, rahoitusratkaisuja ja ammattitaitoista palvelua.",
    "url": "https://kroiautocenter.fi",
    "logo": "https://kroiautocenter.fi/logo.png",
    "image": "https://kroiautocenter.fi/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Läkkisepäntie 15 B",
      "postalCode": "00620",
      "addressLocality": "Helsinki",
      "addressCountry": "FI"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "60.1699",
      "longitude": "24.9384"
    },
    "telephone": "+358413188214",
    "email": "kroiautocenter@gmail.com",
    "openingHours": [
      "Mo-Fr 10:00-18:00",
      "Sa 11:00-17:00"
    ],
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "priceRange": "€€€",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "sameAs": [
      "https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/",
      "https://www.instagram.com/kroiautocenteroy"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Käytetyt autot",
      "itemListElement": latestCars.slice(0, 6).map((car, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Car",
          "name": car.name,
          "brand": car.brand,
          "model": car.model,
          "vehicleModelDate": car.year,
          "fuelType": car.fuel,
          "vehicleTransmission": car.transmission,
          "mileageFromOdometer": {
            "@type": "QuantitativeValue",
            "value": car.km,
            "unitCode": "KMT"
          }
        },
        "price": car.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "AutoDealer",
          "name": "Kroi Auto Center"
        }
      }))
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "60.1699",
        "longitude": "24.9384"
      },
      "geoRadius": "100000"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageLayout
        pageKey="homepage"
        showFooter={true}
        className="bg-gradient-to-b from-slate-50 to-white"
      >
        <HomeContent cars={latestCars} />
      </PageLayout>
    </>
  );
}