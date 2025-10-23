import { CarDetailContent } from './CarDetailContent';
import { client } from '@/lib/sanity';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Car } from '@/app/data/cars';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper to fetch car from Sanity
async function getCarBySlug(slug: string): Promise<Car | null> {
  try {
    const query = `*[_type == "car" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      brand,
      model,
      price,
      priceEur,
      year,
      fuel,
      transmission,
      km,
      kmNumber,
      category,
      description,
      detailedDescription,
      features,
      "image": mainImage.asset->url,
      "images": gallery[].asset->{
        "url": url,
        "altText": originalFilename,
        order,
        isPrimary
      },
      specifications,
      condition,
      status,
      featured
    }`;

    const sanityCar = await client.fetch(query, { slug });
    
    if (!sanityCar) return null;

    return {
      id: sanityCar.slug?.current || sanityCar._id,
      slug: sanityCar.slug?.current || sanityCar._id,
      name: sanityCar.name,
      brand: sanityCar.brand,
      model: sanityCar.model,
      price: sanityCar.price,
      priceEur: sanityCar.priceEur,
      year: sanityCar.year,
      fuel: sanityCar.fuel,
      transmission: sanityCar.transmission,
      km: sanityCar.km,
      kmNumber: sanityCar.kmNumber,
      image: sanityCar.image || '/placeholder-car.jpg',
      description: sanityCar.description,
      detailedDescription: sanityCar.detailedDescription || [],
      features: sanityCar.features || [],
      specifications: sanityCar.specifications || [],
      condition: sanityCar.condition,
      category: sanityCar.category,
      status: sanityCar.status || 'available',
      featured: sanityCar.featured || false,
      images: sanityCar.images?.map((img: any, index: number) => ({
        url: img.url || '/placeholder-car.jpg',
        altText: img.altText || sanityCar.name,
        order: img.order || index + 1,
        isPrimary: img.isPrimary || index === 0
      })) || []
    };
  } catch (error) {
    console.error('Error fetching car from Sanity:', error);
    return null;
  }
}

// Helper to fetch related cars
async function getRelatedCarsByBrand(brand: string, currentSlug: string, limit: number = 3): Promise<Car[]> {
  try {
    const query = `*[_type == "car" && brand == $brand && slug.current != $currentSlug][0...${limit}] {
      _id,
      name,
      slug,
      brand,
      model,
      price,
      priceEur,
      year,
      fuel,
      transmission,
      km,
      kmNumber,
      category,
      description,
      "image": mainImage.asset->url,
      status,
      featured
    }`;

    const sanityCars = await client.fetch(query, { brand, currentSlug });
    
    return sanityCars.map((car: any) => ({
      id: car.slug?.current || car._id,
      slug: car.slug?.current || car._id,
      name: car.name,
      brand: car.brand,
      model: car.model,
      price: car.price,
      priceEur: car.priceEur,
      year: car.year,
      fuel: car.fuel,
      transmission: car.transmission,
      km: car.km,
      kmNumber: car.kmNumber,
      image: car.image || '/placeholder-car.jpg',
      description: car.description,
      detailedDescription: [],
      features: [],
      specifications: [],
      condition: '',
      category: car.category,
      status: car.status || 'available',
      featured: car.featured || false,
      images: []
    }));
  } catch (error) {
    console.error('Error fetching related cars:', error);
    return [];
  }
}

/**
 * Generate static params for all car pages
 */
export async function generateStaticParams() {
  try {
    const cars = await client.fetch(`*[_type == "car"] { "id": slug.current }`);
    return cars.map((car: any) => ({
      id: car.id,
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
  const car = await getCarBySlug(id);

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
  const car = await getCarBySlug(id);

  // Return 404 if car not found
  if (!car) {
    notFound();
  }

  // Get related cars
  const relatedCars = await getRelatedCarsByBrand(car.brand, id);

  // Transform car data to match CarData interface
  const transformedCar = {
    ...car,
    features: car.features?.map((f: string) => ({ feature: f }))
  };

  const transformedRelatedCars = relatedCars.map((c: Car) => ({
    ...c,
    features: c.features?.map((f: string) => ({ feature: f }))
  }));

  return (
    <CarDetailContent car={transformedCar} relatedCars={transformedRelatedCars} />
  );
}