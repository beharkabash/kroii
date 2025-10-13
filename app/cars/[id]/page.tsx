import { CarDetailContent } from './CarDetailContent';
import { getCarById, getRelatedCars, convertToLegacyFormat } from '@/app/lib/db/cars';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEOGenerator } from '@/app/lib/seo-utils';

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

  // Prepare car data for SEO generator
  const carSEOData = {
    id: dbCar.id,
    make: dbCar.brand,
    model: dbCar.model,
    year: dbCar.year,
    priceEur: dbCar.priceEur,
    kmNumber: dbCar.kmNumber,
    fuel: dbCar.fuel,
    transmission: dbCar.transmission,
    description: dbCar.description,
    images: dbCar.images?.map(img => img.url) || [],
    slug: dbCar.slug
  };

  // Generate enhanced metadata using SEO utilities
  return SEOGenerator.generateCarMetadata(carSEOData);
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

  // Prepare car data for enhanced SEO generators
  const carSEOData = {
    id: dbCar.id,
    make: dbCar.brand,
    model: dbCar.model,
    year: dbCar.year,
    priceEur: dbCar.priceEur,
    kmNumber: dbCar.kmNumber,
    fuel: dbCar.fuel,
    transmission: dbCar.transmission,
    description: dbCar.description,
    images: dbCar.images?.map(img => img.url) || [],
    slug: dbCar.slug
  };

  // Generate enhanced structured data using SEO utilities
  const carJSONLD = SEOGenerator.generateCarJSONLD(carSEOData);

  // Generate breadcrumb structured data
  const breadcrumbItems = [
    { name: 'Etusivu', url: '/' },
    { name: 'Autot', url: '/cars' },
    { name: dbCar.brand, url: `/cars/brand/${dbCar.brand.toLowerCase()}` },
    { name: `${dbCar.brand} ${dbCar.model} ${dbCar.year}`, url: `/cars/${dbCar.slug}` }
  ];
  const breadcrumbJSONLD = SEOGenerator.generateBreadcrumbJSONLD(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carJSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJSONLD) }}
      />
      <CarDetailContent car={car} relatedCars={relatedCars} />
    </>
  );
}