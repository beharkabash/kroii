/**
 * Cars API - Main endpoint for car listings
 * GET /api/cars - List cars with pagination and filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllCars, CarFilters, PaginationOptions } from '@/app/lib/db/cars';
import { CarCategory, CarStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse pagination options
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as PaginationOptions['sortBy'];
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as PaginationOptions['sortOrder'];

    // Parse filters
    const filters: CarFilters = {};

    if (searchParams.get('brand')) {
      filters.brand = searchParams.get('brand')!;
    }

    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')! as CarCategory;
    }

    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')! as CarStatus;
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

    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!;
    }

    // Get cars with pagination
    const result = await getAllCars(filters, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Cars API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cars'
      },
      { status: 500 }
    );
  }
}