/**
 * Car Search API - Advanced search with filters
 * GET /api/cars/search - Search cars with query and filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchCars, getAllBrands, getCarCountByCategory } from '@/app/lib/db/cars';
import { CarCategory, CarStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as any;
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as any;

    // Parse filters
    const filters: any = {};

    if (searchParams.get('brand')) {
      filters.brand = searchParams.get('brand')!;
    }

    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')! as CarCategory;
    }

    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')! as CarStatus;
    } else {
      filters.status = CarStatus.AVAILABLE; // Default to available cars
    }

    if (searchParams.get('minPrice')) {
      filters.minPrice = parseInt(searchParams.get('minPrice')!);
    }

    if (searchParams.get('maxPrice')) {
      filters.maxPrice = parseInt(searchParams.get('maxPrice')!);
    }

    if (searchParams.get('minYear')) {
      filters.minYear = parseInt(searchParams.get('minYear')!);
    }

    if (searchParams.get('maxYear')) {
      filters.maxYear = parseInt(searchParams.get('maxYear')!);
    }

    if (searchParams.get('fuel')) {
      filters.fuel = searchParams.get('fuel')!;
    }

    if (searchParams.get('transmission')) {
      filters.transmission = searchParams.get('transmission')!;
    }

    // Perform search
    const result = await searchCars(query, filters, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    return NextResponse.json({
      success: true,
      data: result,
      query
    });

  } catch (error) {
    console.error('Car search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search cars'
      },
      { status: 500 }
    );
  }
}

/**
 * Get search metadata (brands, categories, etc.)
 * Used for populating search filters
 */
export async function POST(request: NextRequest) {
  try {
    const brands = await getAllBrands();
    const categoryCounts = await getCarCountByCategory();

    return NextResponse.json({
      success: true,
      data: {
        brands,
        categories: Object.keys(categoryCounts),
        categoryCounts,
        fuelTypes: ['DIESEL', 'PETROL', 'ELECTRIC', 'HYBRID'],
        transmissionTypes: ['AUTOMATIC', 'MANUAL']
      }
    });

  } catch (error) {
    console.error('Search metadata API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch search metadata'
      },
      { status: 500 }
    );
  }
}