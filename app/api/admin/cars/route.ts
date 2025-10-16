/**
 * Admin Cars API
 * Handle car creation and management for admin users
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/core/auth';
import { PrismaClient } from '@prisma/client';
import { CarStatus } from '@/types/prisma';

const prisma = new PrismaClient();

// Helper function to generate slug from car name
function generateSlug(make: string, model: string, year: number): string {
  const name = `${make} ${model} ${year}`;
  return name
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to ensure unique slug
async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.vehicles.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const userRole = session.user.role;
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'price', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug
    const baseSlug = generateSlug(data.make, data.model, data.year);
    const slug = await getUniqueSlug(baseSlug);

    // Prepare car data (matching vehicles schema)
    const carData = {
      slug,
      make: data.make,
      model: data.model,
      year: parseInt(data.year),
      price: parseInt(data.price),
      mileage: parseInt(data.mileage) || 0,
      fuelType: data.fuelType,
      transmission: data.transmission,
      bodyType: data.bodyType,
      color: data.color || '',
      engineSize: data.engineSize || '',
      drivetrain: data.drivetrain || '',
      features: data.features || '',
      images: data.images || '',
      description: data.description || '',
      featured: Boolean(data.featured),
      status: (data.status as CarStatus) || CarStatus.AVAILABLE,
      vin: data.vin || null,
      doors: data.doors ? parseInt(data.doors) : null,
      seats: data.seats ? parseInt(data.seats) : null,
    };

    // Create car
    const car = await prisma.vehicles.create({
      data: {
        id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...carData
      }
      // Note: images, features, specifications relations don't exist in schema
      // data: {
      //   ...carData,
      //   // Create images
      //   images: {
      //     create: (data.images || []).map((img: { url: string; altText?: string; isPrimary?: boolean }, index: number) => ({
      //       url: img.url,
      //       altText: img.altText || `${carData.make} ${carData.model}`,
      //       order: index,
      //       isPrimary: img.isPrimary || index === 0,
      //     }))
      //   },
      //   // Create features
      //   features: {
      //     create: (data.features || []).map((feature: string, index: number) => ({
      //       feature,
      //       order: index,
      //     }))
      //   },
      //   // Create specifications
      //   specifications: {
      //     create: (data.specifications || []).map((spec: { label: string; value: string }, index: number) => ({
      //       label: spec.label,
      //       value: spec.value,
      //       order: index,
      //     }))
      //   },
      // },
      // include: {
      //   images: true,
      //   features: true,
      //   specifications: true,
      // }
    });

    // Log the activity
    // Note: activityLog table not available yet
    // await prisma.activityLog.create({
    //   data: {
    //     userId: session.user.id,
    //     action: 'CAR_CREATED',
    //     entity: 'car',
    //     entityId: car.id,
    //     metadata: {
    //       carName: `${car.make} ${car.model}`,
    //       make: car.make,
    //       model: car.model,
    //       year: car.year,
    //       price: car.price,
    //     }
    //   }
    // });

    return NextResponse.json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create car'
      },
      { status: 500 }
    );
  }
}