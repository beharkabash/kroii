/**
 * Car Brand API - Get cars by brand
 * GET /api/cars/brands/[brand] - Get cars from specific brand
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCarsByBrand } from '@/app/lib/db/cars';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brand: string }> }
) {
  try {
    const { brand } = await params;

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand is required' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'make' | 'price' | 'year' | 'mileage' | 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const cars = await getCarsByBrand(decodeURIComponent(brand), {
      page,
      limit,
      sortBy,
      sortOrder
    });

    return NextResponse.json({
      success: true,
      data: {
        cars,
        brand: decodeURIComponent(brand),
        total: cars.length
      }
    });

  } catch (error) {
    console.error('Brand API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cars by brand'
      },
      { status: 500 }
    );
  }
}