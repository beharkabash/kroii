/**
 * Admin Single Car API
 * Handle individual car operations (get, update, delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient, CarStatus, CarCondition, CarCategory, FuelType, TransmissionType, DriveType } from '@prisma/client';

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
async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.car.findUnique({ where: { slug } });
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

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        features: {
          orderBy: { order: 'asc' }
        },
        specifications: {
          orderBy: { order: 'asc' }
        },
        inquiries: {
          include: {
            car: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        views: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
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
    const existingCar = await prisma.car.findUnique({
      where: { id },
      include: {
        images: true,
        features: true,
        specifications: true,
      }
    });

    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Generate new slug if brand, model, or year changed
    let slug = existingCar.slug;
    if (data.brand !== existingCar.brand ||
        data.model !== existingCar.model ||
        parseInt(data.year) !== existingCar.year) {
      const baseSlug = generateSlug(data.brand, data.model, parseInt(data.year));
      slug = await getUniqueSlug(baseSlug, id);
    }

    // Prepare car data
    const carData = {
      slug,
      name: data.name || `${data.brand} ${data.model}`,
      brand: data.brand,
      model: data.model,
      year: parseInt(data.year),
      priceEur: parseInt(data.priceEur),
      fuel: data.fuel as FuelType,
      transmission: data.transmission as TransmissionType,
      kmNumber: parseInt(data.kmNumber) || 0,
      color: data.color || null,
      driveType: data.driveType ? (data.driveType as DriveType) : null,
      engineSize: data.engineSize || null,
      power: data.power ? parseInt(data.power) : null,
      status: data.status as CarStatus,
      condition: data.condition as CarCondition,
      category: data.category as CarCategory,
      featured: Boolean(data.featured),
      description: data.description,
      detailedDescription: data.detailedDescription || [],
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    };

    // Update car in transaction
    const updatedCar = await prisma.$transaction(async (tx) => {
      // Delete existing relations
      await tx.carImage.deleteMany({ where: { carId: id } });
      await tx.carFeature.deleteMany({ where: { carId: id } });
      await tx.carSpecification.deleteMany({ where: { carId: id } });

      // Update car with new relations
      return await tx.car.update({
        where: { id },
        data: {
          ...carData,

          // Create new images
          images: {
            create: (data.images || []).map((img: any, index: number) => ({
              url: img.url,
              altText: img.altText || carData.name,
              order: index,
              isPrimary: img.isPrimary || index === 0,
            }))
          },

          // Create new features
          features: {
            create: (data.features || []).map((feature: string, index: number) => ({
              feature,
              order: index,
            }))
          },

          // Create new specifications
          specifications: {
            create: (data.specifications || []).map((spec: any, index: number) => ({
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
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'CAR_UPDATED',
        entity: 'car',
        entityId: updatedCar.id,
        metadata: {
          carName: updatedCar.name,
          changes: {
            from: {
              brand: existingCar.brand,
              model: existingCar.model,
              year: existingCar.year,
              price: existingCar.priceEur,
              status: existingCar.status,
            },
            to: {
              brand: updatedCar.brand,
              model: updatedCar.model,
              year: updatedCar.year,
              price: updatedCar.priceEur,
              status: updatedCar.status,
            }
          }
        }
      }
    });

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
    const existingCar = await prisma.car.findUnique({
      where: { id },
      include: {
        inquiries: true,
      }
    });

    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Check if car has inquiries
    if (existingCar.inquiries.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete car with existing inquiries. Archive it instead.'
        },
        { status: 400 }
      );
    }

    // Delete car (related records will be deleted via CASCADE)
    await prisma.car.delete({
      where: { id }
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'CAR_DELETED',
        entity: 'car',
        entityId: id,
        metadata: {
          carName: existingCar.name,
          brand: existingCar.brand,
          model: existingCar.model,
          year: existingCar.year,
          price: existingCar.priceEur,
        }
      }
    });

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