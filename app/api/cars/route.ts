import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import type { Car } from '@/app/data/cars';

// GET - Fetch all cars from Sanity
export async function GET() {
  try {
    console.log('API: Fetching cars from Sanity...');
    
    const query = `*[_type == "car"] | order(_createdAt desc) {
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

    const sanityCars = await client.fetch(query);
    console.log('API: Found Sanity cars:', sanityCars.length);

    // Transform Sanity data to match Car interface
    const cars: Car[] = sanityCars.map((car: any) => ({
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
      detailedDescription: car.detailedDescription || [],
      features: car.features || [],
      specifications: car.specifications || [],
      condition: car.condition,
      category: car.category,
      status: car.status || 'available',
      featured: car.featured || false,
      images: car.images?.map((img: any, index: number) => ({
        url: img.url || '/placeholder-car.jpg',
        altText: img.altText || car.name,
        order: img.order || index + 1,
        isPrimary: img.isPrimary || index === 0
      })) || []
    }));

    return NextResponse.json({ success: true, cars });
  } catch (error) {
    console.error('API: Error fetching cars from Sanity:', error);
    // Fallback to empty array on error
    return NextResponse.json({ 
      success: false, 
      cars: [],
      error: 'Failed to fetch cars from Sanity'
    });
  }
}
