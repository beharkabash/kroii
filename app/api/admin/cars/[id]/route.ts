/**
 * Admin Single Car API
 * Handle individual car operations (get, update, delete)
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
async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.vehicles.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const car = await prisma.vehicles.findUnique({
      where: { id }
      // Note: images, features, specifications, and views tables don't exist in schema
      // include: {
      //   images: {
      //     orderBy: { order: 'asc' }
      //   },
      //   features: {
      //     orderBy: { order: 'asc' }
      //   },
      //   specifications: {
      //     orderBy: { order: 'asc' }
      //   },
      //   views: {
      //     orderBy: { createdAt: 'desc' },
      //     take: 10
      //   }
      // }
    });

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch car'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if car exists
    const existingCar = await prisma.vehicles.findUnique({
      where: { id }
      // Note: images, features, specifications tables don't exist in schema
      // include: {
      //   images: true,
      //   features: true,
      //   specifications: true,
      // }
    });

    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Generate new slug if brand, model, or year changed
    let slug = existingCar.slug;
    if (data.make !== existingCar.make ||
        data.model !== existingCar.model ||
        parseInt(data.year) !== existingCar.year) {
      const baseSlug = generateSlug(data.make, data.model, parseInt(data.year));
      slug = await getUniqueSlug(baseSlug, id);
    }

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
      status: data.status as CarStatus,
      vin: data.vin || null,
      doors: data.doors ? parseInt(data.doors) : null,
      seats: data.seats ? parseInt(data.seats) : null,
    };

    // Update car
    const updatedCar = await prisma.vehicles.update({
      where: { id },
      data: carData
      // Note: images, features, specifications relations don't exist in schema
      // data: {
      //   ...carData,
      //   // Create new images
      //   images: {
      //     create: (data.images || []).map((img: { url: string; altText?: string; isPrimary?: boolean }, index: number) => ({
      //       url: img.url,
      //       altText: img.altText || carData.name,
      //       order: index,
      //       isPrimary: img.isPrimary || index === 0,
      //     }))
      //   },
      //   // Create new features
      //   features: {
      //     create: (data.features || []).map((feature: string, index: number) => ({
      //       feature,
      //       order: index,
      //     }))
      //   },
      //   // Create new specifications
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
    //     action: 'CAR_UPDATED',
    //     entity: 'car',
    //     entityId: updatedCar.id,
    //     metadata: {
    //       carName: `${updatedCar.make} ${updatedCar.model}`,
    //       changes: {
    //         from: {
    //           make: existingCar.make,
    //           model: existingCar.model,
    //           year: existingCar.year,
    //           price: existingCar.price,
    //           status: existingCar.status,
    //         },
    //         to: {
    //           make: updatedCar.make,
    //           model: updatedCar.model,
    //           year: updatedCar.year,
    //           price: updatedCar.price,
    //           status: updatedCar.status,
    //         }
    //       }
    //     }
    //   }
    // });

    return NextResponse.json({
      success: true,
      data: updatedCar
    });

  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update car'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions - only SUPER_ADMIN can delete cars
    const userRole = session.user.role;
    if (userRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions. Only super admin can delete cars.' },
        { status: 403 }
      );
    }

    // Check if car exists
    const existingCar = await prisma.vehicles.findUnique({
      where: { id }
    });

    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Note: Inquiry check temporarily disabled (inquiries table not available)
    // if (existingCar.inquiries?.length > 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: 'Cannot delete car with existing inquiries. Archive it instead.'
    //     },
    //     { status: 400 }
    //   );
    // }

    // Delete car (related records will be deleted via CASCADE)
    await prisma.vehicles.delete({
      where: { id }
    });

    // Log the activity
    // Note: activityLog table not available yet
    // await prisma.activityLog.create({
    //   data: {
    //     userId: session.user.id,
    //     action: 'CAR_DELETED',
    //     entity: 'car',
    //     entityId: id,
    //     metadata: {
    //       carName: `${existingCar.make} ${existingCar.model}`,
    //       make: existingCar.make,
    //       model: existingCar.model,
    //       year: existingCar.year,
    //       price: existingCar.price,
    //     }
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Car deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete car'
      },
      { status: 500 }
    );
  }
}