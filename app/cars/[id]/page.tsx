import { CarDetailContent } from './CarDetailContent';
import { getCarById, getRelatedCars } from '@/app/data/cars';
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
    const { cars } = await import('@/app/data/cars');
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
  const car = getCarById(id);

  if (!car) {
    return {
      title: 'Auto ei löytynyt - Kroi Auto Center',
    };
  }

  // Generate enhanced metadata
  return {
    title: `${car.name} ${car.year} - ${car.price} | Kroi Auto Center`,
    description: car.description,
    keywords: [car.brand, car.model, car.year, car.fuel, car.transmission, 'käytetty auto', 'auto myynti', 'Kroi Auto'].join(', '),
    openGraph: {
      title: `${car.name} ${car.year} - ${car.price} | Kroi Auto Center`,
      description: car.description,
      images: [car.image]
    }
  };
}

/**
 * Server Component - Car Detail Page
 * Handles params extraction and passes to client component with structured data
 */
export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = getCarById(id);

  // Return 404 if car not found
  if (!car) {
    notFound();
  }

  // Get related cars
  const relatedCars = getRelatedCars(car.id);

  // Transform car data to match CarData interface
  const transformedCar = {
    ...car,
    features: car.features?.map(f => ({ feature: f }))
  };

  const transformedRelatedCars = relatedCars.map(c => ({
    ...c,
    features: c.features?.map(f => ({ feature: f }))
  }));

  return (
    <CarDetailContent car={transformedCar} relatedCars={transformedRelatedCars} />
  );
}