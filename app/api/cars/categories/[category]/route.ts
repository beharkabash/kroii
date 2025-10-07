/**
 * Car Category API - Get cars by category
 * GET /api/cars/categories/[category] - Get cars in specific category
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCarsByCategory } from '@/app/lib/db/cars';
import { CarCategory } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      );
    }

    // Convert category string to enum
    const categoryEnum = category.toUpperCase() as CarCategory;

    // Validate category
    if (!Object.values(CarCategory).includes(categoryEnum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'name' | 'priceEur' | 'year' | 'kmNumber' | 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const cars = await getCarsByCategory(categoryEnum, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    return NextResponse.json({
      success: true,
      data: {
        cars,
        category: categoryEnum,
        total: cars.length
      }
    });

  } catch (error) {
    console.error('Category API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cars by category'
      },
      { status: 500 }
    );
  }
}