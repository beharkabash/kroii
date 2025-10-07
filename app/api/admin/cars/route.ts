/**
 * Admin Cars API
 * Handle car creation and management for admin users
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient, CarStatus, CarCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate slug from car name
function generateSlug(brand: string, model: string, year: number): string {
  const name = `${brand} ${model} ${year}`;
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

  while (await prisma.car.findUnique({ where: { slug } })) {
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
    const requiredFields = ['brand', 'model', 'year', 'priceEur', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug
    const baseSlug = generateSlug(data.brand, data.model, data.year);
    const slug = await getUniqueSlug(baseSlug);

    // Prepare car data
    const carData = {
      slug,
      name: data.name || `${data.brand} ${data.model}`,
      brand: data.brand,
      model: data.model,
      year: parseInt(data.year),
      priceEur: parseInt(data.priceEur),
      fuel: data.fuel,
      transmission: data.transmission,
      kmNumber: parseInt(data.kmNumber) || 0,
      color: data.color || null,
      driveType: data.driveType || null,
      engineSize: data.engineSize || null,
      power: data.power ? parseInt(data.power) : null,
      status: (data.status as CarStatus) || CarStatus.AVAILABLE,
      condition: data.condition || 'GOOD',
      category: data.category as CarCategory,
      featured: Boolean(data.featured),
      description: data.description,
      detailedDescription: data.detailedDescription || [],
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    };

    // Create car with relations
    const car = await prisma.car.create({
      data: {
        ...carData,

        // Create images
        images: {
          create: (data.images || []).map((img: { url: string; altText?: string; isPrimary?: boolean }, index: number) => ({
            url: img.url,
            altText: img.altText || carData.name,
            order: index,
            isPrimary: img.isPrimary || index === 0,
          }))
        },

        // Create features
        features: {
          create: (data.features || []).map((feature: string, index: number) => ({
            feature,
            order: index,
          }))
        },

        // Create specifications
        specifications: {
          create: (data.specifications || []).map((spec: { label: string; value: string }, index: number) => ({
            label: spec.label,
            value: spec.value,
            order: index,
          }))
        },
      },
      include: {
        images: true,
        features: true,
        specifications: true,
      }
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
    //       carName: car.name,
    //       brand: car.brand,
    //       model: car.model,
    //       year: car.year,
    //       price: car.priceEur,
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