/**
 * Car Service Layer
 * Handles all car-related database operations with caching
 */

import { prisma } from '@/app/lib/db/prisma';
import { redis, CacheKeys, CacheTTL } from '@/app/lib/db/redis';
import { Car, CarStatus, CarCategory, FuelType, TransmissionType, DriveType, Prisma } from '@prisma/client';

export interface CarWithRelations extends Car {
  images: Array<{ id: string; url: string; altText: string | null; isPrimary: boolean; order: number }>;
  features: Array<{ id: string; feature: string; order: number }>;
  specifications: Array<{ id: string; label: string; value: string; order: number }>;
  _count?: {
    views: number;
    inquiries: number;
  };
}

export interface CarListFilters {
  status?: CarStatus;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  featured?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'priceEur' | 'year' | 'kmNumber';
  orderDirection?: 'asc' | 'desc';
}

export interface CreateCarInput {
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  priceEur: number;
  fuel: string;
  transmission: string;
  kmNumber: number;
  color?: string;
  driveType?: string;
  engineSize?: string;
  power?: number;
  status?: CarStatus;
  category: string;
  featured?: boolean;
  description: string;
  detailedDescription: string[];
  images: Array<{ url: string; altText?: string; order: number; isPrimary: boolean }>;
  features: Array<{ feature: string; order: number }>;
  specifications: Array<{ label: string; value: string; order: number }>;
}

export interface UpdateCarInput extends Partial<CreateCarInput> {
  id: string;
}

/**
 * Get car by ID with caching
 */
export async function getCarById(id: string): Promise<CarWithRelations | null> {
  try {
    // Try cache first
    const cacheKey = CacheKeys.car(id);
    const cached = await redis.get<CarWithRelations>(cacheKey);
    if (cached) {
      return cached;
    }

    // Query database
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        features: {
          orderBy: { order: 'asc' },
        },
        specifications: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            views: true,
            inquiries: true,
          },
        },
      },
    });

    if (!car) return null;

    // Cache result
    await redis.set(cacheKey, car, CacheTTL.LONG);

    return car as CarWithRelations;
  } catch (error) {
    console.error('[CAR SERVICE] Error getting car by ID:', error);
    throw new Error('Failed to fetch car');
  }
}

/**
 * Get car by slug with caching
 */
export async function getCarBySlug(slug: string): Promise<CarWithRelations | null> {
  try {
    // Try cache first
    const cacheKey = CacheKeys.carSlug(slug);
    const cached = await redis.get<CarWithRelations>(cacheKey);
    if (cached) {
      return cached;
    }

    // Query database
    const car = await prisma.car.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        features: {
          orderBy: { order: 'asc' },
        },
        specifications: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            views: true,
            inquiries: true,
          },
        },
      },
    });

    if (!car) return null;

    // Cache result
    await redis.set(cacheKey, car, CacheTTL.LONG);

    return car as CarWithRelations;
  } catch (error) {
    console.error('[CAR SERVICE] Error getting car by slug:', error);
    throw new Error('Failed to fetch car');
  }
}

/**
 * List cars with filters and caching
 */
export async function listCars(filters: CarListFilters = {}): Promise<CarWithRelations[]> {
  try {
    const {
      status = CarStatus.AVAILABLE,
      brand,
      category,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      featured,
      limit = 50,
      offset = 0,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = filters;

    // Generate cache key based on filters
    const filterKey = JSON.stringify(filters);
    const cacheKey = CacheKeys.carsList(filterKey);

    // Try cache first
    const cached = await redis.get<CarWithRelations[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build where clause
    const where: Prisma.CarWhereInput = {
      status,
      ...(brand && { brand }),
      ...(category && { category: category as CarCategory }),
      ...(featured !== undefined && { featured }),
      ...(minPrice && { priceEur: { gte: minPrice } }),
      ...(maxPrice && { priceEur: { lte: maxPrice } }),
      ...(minYear && { year: { gte: minYear } }),
      ...(maxYear && { year: { lte: maxYear } }),
    };

    // Query database
    const cars = await prisma.car.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        features: {
          orderBy: { order: 'asc' },
        },
        specifications: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            views: true,
            inquiries: true,
          },
        },
      },
      orderBy: { [orderBy]: orderDirection },
      take: limit,
      skip: offset,
    });

    // Cache result
    await redis.set(cacheKey, cars, CacheTTL.MEDIUM);

    return cars as CarWithRelations[];
  } catch (error) {
    console.error('[CAR SERVICE] Error listing cars:', error);
    throw new Error('Failed to fetch cars');
  }
}

/**
 * Get featured cars
 */
export async function getFeaturedCars(limit: number = 6): Promise<CarWithRelations[]> {
  return listCars({
    featured: true,
    status: CarStatus.AVAILABLE,
    limit,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });
}

/**
 * Get related cars (same brand or category)
 */
export async function getRelatedCars(carId: string, limit: number = 3): Promise<CarWithRelations[]> {
  try {
    // Try cache first
    const cacheKey = CacheKeys.relatedCars(carId);
    const cached = await redis.get<CarWithRelations[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get the current car
    const currentCar = await prisma.car.findUnique({
      where: { id: carId },
      select: { brand: true, category: true },
    });

    if (!currentCar) return [];

    // Get cars from same brand
    let relatedCars = await prisma.car.findMany({
      where: {
        brand: currentCar.brand,
        id: { not: carId },
        status: CarStatus.AVAILABLE,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        features: {
          orderBy: { order: 'asc' },
        },
        specifications: {
          orderBy: { order: 'asc' },
        },
      },
      take: limit,
    });

    // If not enough, add from same category
    if (relatedCars.length < limit) {
      const categoryCars = await prisma.car.findMany({
        where: {
          category: currentCar.category,
          id: {
            not: carId,
            notIn: relatedCars.map((c) => c.id),
          },
          status: CarStatus.AVAILABLE,
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          features: {
            orderBy: { order: 'asc' },
          },
          specifications: {
            orderBy: { order: 'asc' },
          },
        },
        take: limit - relatedCars.length,
      });

      relatedCars = [...relatedCars, ...categoryCars];
    }

    // Cache result
    await redis.set(cacheKey, relatedCars, CacheTTL.LONG);

    return relatedCars as CarWithRelations[];
  } catch (error) {
    console.error('[CAR SERVICE] Error getting related cars:', error);
    return [];
  }
}

/**
 * Create new car
 */
export async function createCar(input: CreateCarInput): Promise<CarWithRelations> {
  try {
    const { images, features, specifications, fuel, category, transmission, driveType, ...carData } = input;

    const car = await prisma.car.create({
      data: {
        ...carData,
        fuel: fuel as FuelType,
        category: category as CarCategory,
        transmission: transmission as TransmissionType,
        ...(driveType && { driveType: driveType as DriveType }),
        images: {
          create: images,
        },
        features: {
          create: features,
        },
        specifications: {
          create: specifications,
        },
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        features: {
          orderBy: { order: 'asc' },
        },
        specifications: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Invalidate relevant caches
    await invalidateCarCaches();

    return car as CarWithRelations;
  } catch (error) {
    console.error('[CAR SERVICE] Error creating car:', error);
    throw new Error('Failed to create car');
  }
}

/**
 * Update car
 */
export async function updateCar(input: UpdateCarInput): Promise<CarWithRelations> {
  try {
    const { id, images, features, specifications, fuel, category, transmission, driveType, ...carData } = input;

    // Update car and relations in transaction
    const car = await prisma.$transaction(async (tx) => {
      // Update basic car data
      await tx.car.update({
        where: { id },
        data: {
          ...carData,
          ...(fuel && { fuel: fuel as FuelType }),
          ...(category && { category: category as CarCategory }),
          ...(transmission && { transmission: transmission as TransmissionType }),
          ...(driveType && { driveType: driveType as DriveType }),
        },
      });

      // Update images if provided
      if (images) {
        await tx.carImage.deleteMany({ where: { carId: id } });
        await tx.carImage.createMany({
          data: images.map((img) => ({ ...img, carId: id })),
        });
      }

      // Update features if provided
      if (features) {
        await tx.carFeature.deleteMany({ where: { carId: id } });
        await tx.carFeature.createMany({
          data: features.map((feat) => ({ ...feat, carId: id })),
        });
      }

      // Update specifications if provided
      if (specifications) {
        await tx.carSpecification.deleteMany({ where: { carId: id } });
        await tx.carSpecification.createMany({
          data: specifications.map((spec) => ({ ...spec, carId: id })),
        });
      }

      // Fetch complete car with relations
      return tx.car.findUnique({
        where: { id },
        include: {
          images: { orderBy: { order: 'asc' } },
          features: { orderBy: { order: 'asc' } },
          specifications: { orderBy: { order: 'asc' } },
        },
      });
    });

    if (!car) {
      throw new Error('Car not found after update');
    }

    // Invalidate caches
    await redis.del(CacheKeys.car(id));
    await redis.del(CacheKeys.carSlug(car.slug));
    await invalidateCarCaches();

    return car as CarWithRelations;
  } catch (error) {
    console.error('[CAR SERVICE] Error updating car:', error);
    throw new Error('Failed to update car');
  }
}

/**
 * Delete car
 */
export async function deleteCar(id: string): Promise<void> {
  try {
    const car = await prisma.car.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!car) {
      throw new Error('Car not found');
    }

    await prisma.car.delete({
      where: { id },
    });

    // Invalidate caches
    await redis.del(CacheKeys.car(id));
    await redis.del(CacheKeys.carSlug(car.slug));
    await invalidateCarCaches();
  } catch (error) {
    console.error('[CAR SERVICE] Error deleting car:', error);
    throw new Error('Failed to delete car');
  }
}

/**
 * Track car view
 */
export async function trackCarView(carId: string, data: { ip?: string; userAgent?: string; sessionId?: string }): Promise<void> {
  try {
    await prisma.carView.create({
      data: {
        carId,
        ...data,
      },
    });

    // Update view counter in cache
    const viewKey = CacheKeys.carViews(carId);
    await redis.incr(viewKey);
    await redis.expire(viewKey, CacheTTL.DAY);
  } catch (error) {
    console.error('[CAR SERVICE] Error tracking view:', error);
    // Don't throw - view tracking is non-critical
  }
}

/**
 * Get car statistics
 */
export async function getCarStats(carId: string) {
  try {
    const [views, inquiries] = await Promise.all([
      prisma.carView.count({ where: { carId } }),
      prisma.contactSubmission.count({ where: { carId } }),
    ]);

    return { views, inquiries };
  } catch (error) {
    console.error('[CAR SERVICE] Error getting car stats:', error);
    return { views: 0, inquiries: 0 };
  }
}

/**
 * Invalidate all car-related caches
 */
async function invalidateCarCaches(): Promise<void> {
  try {
    await redis.delPattern('cars:*');
  } catch (error) {
    console.error('[CAR SERVICE] Error invalidating caches:', error);
  }
}