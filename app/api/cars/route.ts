/**
 * Cars API - Main endpoint for car listings
 * GET /api/cars - List cars with pagination and filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllCars, CarFilters, PaginationOptions } from '@/app/lib/db/cars';
import { CarCategory, CarStatus } from '@prisma/client';
import { cacheApiResponse } from '@/app/lib/cache';
import { CACHE_KEYS, CACHE_DURATION } from '@/app/lib/redis';

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

    // Create cache key based on filters and pagination
    const cacheKey = `${CACHE_KEYS.CARS_ALL}:${JSON.stringify({ filters, page, limit, sortBy, sortOrder })}`;

    // Get cars with pagination (with caching)
    const result = await cacheApiResponse(
      cacheKey,
      async () => getAllCars(filters, { page, limit, sortBy, sortOrder }),
      CACHE_DURATION.MEDIUM
    );

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