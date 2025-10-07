import { CarDetailContent } from './CarDetailContent';
import { getCarById, getRelatedCars, convertToLegacyFormat } from '@/app/lib/db/cars';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Force dynamic rendering to avoid database issues during build
export const dynamic = 'force-dynamic';

/**
 * Generate static params for all car pages
 * This enables static site generation at build time
 */
export async function generateStaticParams() {
  try {
    if (!process.env.DATABASE_URL) {
      return [];
    }
    const { cars } = await import('@/app/lib/db/cars').then(async (module) => {
      const result = await module.getAllCars({}, { limit: 1000 });
      return result;
    });

    return cars.map((car) => ({
      id: car.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const dbCar = await getCarById(id);

  if (!dbCar) {
    return {
      title: 'Auto ei löytynyt - Kroi Auto Center',
    };
  }

  // Convert to legacy format for compatibility
  const car = convertToLegacyFormat(dbCar);

  const baseUrl = 'https://kroiautocenter.fi';
  const imageUrl = car.image ? `${baseUrl}${car.image}` : `${baseUrl}/cars/placeholder.jpg`;

  return {
    title: `${car.name} - ${car.price} | Kroi Auto Center`,
    description: `${car.description} ${car.year}, ${car.km}, ${car.fuel}, ${car.transmission}. Ota yhteyttä ja sovi koeajo!`,
    keywords: [
      car.brand,
      car.model,
      car.year,
      car.fuel,
      car.transmission,
      'käytetty auto',
      'auto myytävänä',
      'Helsinki',
      'Kroi Auto Center',
    ].join(', '),
    openGraph: {
      title: `${car.name} - ${car.price}`,
      description: car.description,
      url: `${baseUrl}/cars/${car.slug}`,
      siteName: 'Kroi Auto Center',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: car.name,
        },
      ],
      locale: 'fi_FI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${car.name} - ${car.price}`,
      description: car.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/cars/${car.slug}`,
    },
  };
}

/**
 * Server Component - Car Detail Page
 * Handles params extraction and passes to client component with structured data
 */
export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dbCar = await getCarById(id);

  // Return 404 if car not found
  if (!dbCar) {
    notFound();
  }

  // Convert to legacy format for compatibility
  const car = convertToLegacyFormat(dbCar);

  // Get related cars
  const dbRelatedCars = await getRelatedCars(dbCar.id);
  const relatedCars = dbRelatedCars.map(convertToLegacyFormat);

  // Generate structured data for SEO (Schema.org Product markup)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    'name': dbCar.name,
    'description': dbCar.description,
    'brand': {
      '@type': 'Brand',
      'name': dbCar.brand,
    },
    'model': dbCar.model,
    'vehicleModelDate': dbCar.year.toString(),
    'mileageFromOdometer': {
      '@type': 'QuantitativeValue',
      'value': dbCar.kmNumber,
      'unitCode': 'KMT',
    },
    'fuelType': dbCar.fuel,
    'vehicleTransmission': dbCar.transmission,
    'offers': {
      '@type': 'Offer',
      'price': dbCar.priceEur,
      'priceCurrency': 'EUR',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'AutoDealer',
        'name': 'Kroi Auto Center Oy',
        'telephone': '+358413188214',
        'email': 'kroiautocenter@gmail.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Läkkisepäntie 15 B 300620',
          'addressLocality': 'Helsinki',
          'addressCountry': 'FI',
        },
      },
    },
    'itemCondition': 'https://schema.org/UsedCondition',
    'url': `https://kroiautocenter.fi/cars/${dbCar.slug}`,
    ...(dbCar.images.length > 0 && {
      'image': `https://kroiautocenter.fi${dbCar.images[0].url}`,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CarDetailContent car={car} relatedCars={relatedCars} />
    </>
  );
}