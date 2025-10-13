/**
 * Single Car API - Get car by ID or slug
 * GET /api/cars/[id] - Get single car details
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCarById, trackCarView } from '@/app/lib/db/cars';
import { cacheApiResponse } from '@/app/lib/cache';
import { CACHE_KEYS, CACHE_DURATION } from '@/app/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Car ID is required' },
        { status: 400 }
      );
    }

    // Get car with caching
    const car = await cacheApiResponse(
      CACHE_KEYS.CAR_DETAILS(id),
      async () => getCarById(id),
      CACHE_DURATION.LONG
    );

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Track car view for analytics
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               undefined;

    // Track view asynchronously (don't wait for it)
    trackCarView(car.id, ip, userAgent, referrer).catch(console.error);

    return NextResponse.json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error('Car detail API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch car details'
      },
      { status: 500 }
    );
  }
}