/**
 * Car Database Service Layer
 * Handles all car-related database operations
 */

import { PrismaClient, Car, CarImage, CarFeature, CarSpecification, CarStatus, CarCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Type definitions for complete car data with relations
export type CarWithDetails = Car & {
  images: CarImage[];
  features: CarFeature[];
  specifications: CarSpecification[];
};

export interface CarFilters {
  brand?: string;
  category?: CarCategory;
  status?: CarStatus;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuel?: string;
  transmission?: string;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'priceEur' | 'year' | 'kmNumber' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get all cars with optional filtering and pagination
 */
export async function getAllCars(
  filters: CarFilters = {},
  pagination: PaginationOptions = {}
): Promise<{
  cars: CarWithDetails[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = pagination;

  const skip = (page - 1) * limit;

  // Note: Caching temporarily disabled to fix build issue
  // TODO: Implement server-side only caching

  // Build where clause
  const where: any = {
    status: filters.status || CarStatus.AVAILABLE,
  };

  if (filters.brand) {
    where.brand = {
      equals: filters.brand,
      mode: 'insensitive'
    };
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.minPrice || filters.maxPrice) {
    where.priceEur = {};
    if (filters.minPrice) where.priceEur.gte = filters.minPrice;
    if (filters.maxPrice) where.priceEur.lte = filters.maxPrice;
  }

  if (filters.minYear || filters.maxYear) {
    where.year = {};
    if (filters.minYear) where.year.gte = filters.minYear;
    if (filters.maxYear) where.year.lte = filters.maxYear;
  }

  if (filters.fuel) {
    where.fuel = filters.fuel;
  }

  if (filters.transmission) {
    where.transmission = filters.transmission;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { brand: { contains: filters.search, mode: 'insensitive' } },
      { model: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Get total count for pagination
  const total = await prisma.car.count({ where });

  // Get cars with relations
  const cars = await prisma.car.findMany({
    where,
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      features: {
        orderBy: { order: 'asc' }
      },
      specifications: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    skip,
    take: limit,
  });

  return {
    cars,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

/**
 * Get a single car by ID or slug
 */
export async function getCarById(idOrSlug: string): Promise<CarWithDetails | null> {
  const car = await prisma.car.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug }
      ]
    },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      features: {
        orderBy: { order: 'asc' }
      },
      specifications: {
        orderBy: { order: 'asc' }
      }
    }
  });

  return car;
}

/**
 * Get cars by brand
 */
export async function getCarsByBrand(
  brand: string,
  pagination: PaginationOptions = {}
): Promise<CarWithDetails[]> {
  const { cars } = await getAllCars({ brand }, pagination);
  return cars;
}

/**
 * Get cars by category
 */
export async function getCarsByCategory(
  category: CarCategory,
  pagination: PaginationOptions = {}
): Promise<CarWithDetails[]> {
  const { cars } = await getAllCars({ category }, pagination);
  return cars;
}

/**
 * Get related cars based on brand and category
 */
export async function getRelatedCars(
  currentCarId: string,
  limit: number = 3
): Promise<CarWithDetails[]> {
  const currentCar = await getCarById(currentCarId);
  if (!currentCar) return [];

  // First try to get cars from the same brand
  let relatedCars = await prisma.car.findMany({
    where: {
      AND: [
        { id: { not: currentCarId } },
        { brand: currentCar.brand },
        { status: CarStatus.AVAILABLE }
      ]
    },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      features: {
        orderBy: { order: 'asc' }
      },
      specifications: {
        orderBy: { order: 'asc' }
      }
    },
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  // If not enough cars from same brand, add cars from same category
  if (relatedCars.length < limit) {
    const remainingCount = limit - relatedCars.length;
    const relatedCarIds = relatedCars.map(car => car.id);

    const categoryMatches = await prisma.car.findMany({
      where: {
        AND: [
          { id: { not: currentCarId } },
          { id: { notIn: relatedCarIds } },
          { category: currentCar.category },
          { status: CarStatus.AVAILABLE }
        ]
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        features: {
          orderBy: { order: 'asc' }
        },
        specifications: {
          orderBy: { order: 'asc' }
        }
      },
      take: remainingCount,
      orderBy: { createdAt: 'desc' }
    });

    relatedCars = [...relatedCars, ...categoryMatches];
  }

  // If still not enough, add any other available cars
  if (relatedCars.length < limit) {
    const remainingCount = limit - relatedCars.length;
    const relatedCarIds = relatedCars.map(car => car.id);

    const otherCars = await prisma.car.findMany({
      where: {
        AND: [
          { id: { not: currentCarId } },
          { id: { notIn: relatedCarIds } },
          { status: CarStatus.AVAILABLE }
        ]
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        features: {
          orderBy: { order: 'asc' }
        },
        specifications: {
          orderBy: { order: 'asc' }
        }
      },
      take: remainingCount,
      orderBy: { createdAt: 'desc' }
    });

    relatedCars = [...relatedCars, ...otherCars];
  }

  return relatedCars.slice(0, limit);
}

/**
 * Search cars with full-text search
 */
export async function searchCars(
  query: string,
  filters: Omit<CarFilters, 'search'> = {},
  pagination: PaginationOptions = {}
): Promise<{
  cars: CarWithDetails[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  return getAllCars({ ...filters, search: query }, pagination);
}

/**
 * Get featured cars
 */
export async function getFeaturedCars(limit: number = 6): Promise<CarWithDetails[]> {
  return await prisma.car.findMany({
    where: {
      AND: [
        { featured: true },
        { status: CarStatus.AVAILABLE }
      ]
    },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      features: {
        orderBy: { order: 'asc' }
      },
      specifications: {
        orderBy: { order: 'asc' }
      }
    },
    take: limit,
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get all unique brands
 */
export async function getAllBrands(): Promise<string[]> {
  const brands = await prisma.car.findMany({
    where: { status: CarStatus.AVAILABLE },
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' }
  });

  return brands.map(car => car.brand);
}

/**
 * Get cars count by category
 */
export async function getCarCountByCategory(): Promise<Record<string, number>> {
  const counts = await prisma.car.groupBy({
    by: ['category'],
    where: { status: CarStatus.AVAILABLE },
    _count: { category: true }
  });

  return counts.reduce((acc, item) => {
    acc[item.category] = item._count.category;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Track car view for analytics
 */
export async function trackCarView(
  carId: string,
  ip?: string,
  userAgent?: string,
  referrer?: string,
  sessionId?: string
): Promise<void> {
  try {
    await prisma.carView.create({
      data: {
        carId,
        ip,
        userAgent,
        referrer,
        sessionId,
      }
    });
  } catch (error) {
    // Fail silently for analytics
    console.error('Failed to track car view:', error);
  }
}

/**
 * Convert database car to legacy format for backward compatibility
 */
export function convertToLegacyFormat(car: CarWithDetails): any {
  const primaryImage = car.images.find(img => img.isPrimary) || car.images[0];

  return {
    id: car.slug, // Use slug as ID for compatibility
    slug: car.slug,
    name: car.name,
    brand: car.brand,
    model: car.model,
    price: `€${car.priceEur.toLocaleString()}`,
    priceEur: car.priceEur,
    year: car.year.toString(),
    fuel: car.fuel,
    transmission: car.transmission,
    km: `${car.kmNumber.toLocaleString()} km`,
    kmNumber: car.kmNumber,
    image: primaryImage?.url || '',
    description: car.description,
    detailedDescription: car.detailedDescription,
    features: car.features.map(f => f.feature),
    specifications: car.specifications.map(s => ({
      label: s.label,
      value: s.value
    })),
    condition: car.condition,
    category: car.category.toLowerCase()
  };
}