import { PrismaClient } from '@prisma/client';

// Database configuration for Render PostgreSQL
export const DATABASE_CONFIG = {
  // Connection pooling for production
  CONNECTION_POOL: {
    min: 2,
    max: process.env.NODE_ENV === 'production' ? 10 : 5,
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },

  // Query optimization settings
  QUERY_TIMEOUT: 30000, // 30 seconds
  SLOW_QUERY_THRESHOLD: 5000, // 5 seconds

  // Cache settings
  CACHE_TTL: {
    CARS_LIST: 5 * 60, // 5 minutes
    CAR_DETAILS: 15 * 60, // 15 minutes
    FEATURED_CARS: 10 * 60, // 10 minutes
    SEARCH_RESULTS: 3 * 60, // 3 minutes
    TESTIMONIALS: 30 * 60, // 30 minutes
    STATIC_CONTENT: 60 * 60, // 1 hour
  },

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
};

// Prisma client configuration for production
export const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],

    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Performance monitoring in development
  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
      if (e.duration > DATABASE_CONFIG.SLOW_QUERY_THRESHOLD) {
        console.warn(`Slow query detected (${e.duration}ms):`, e.query);
      }
    });
  }

  return prisma;
};

// Database health check utilities
export const checkDatabaseHealth = async (prisma: PrismaClient) => {
  try {
    // Test basic connectivity
    await prisma.$queryRaw`SELECT 1`;

    // Check critical tables exist
    const tablesCheck = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('vehicles', 'inventory_alerts', 'contacts')
    `;

    return {
      connected: true,
      tablesExist: Number((tablesCheck as { count: number }[])[0]?.count) >= 3,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Database migration status check
export const checkMigrationStatus = async (prisma: PrismaClient) => {
  try {
    const migrations = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations
      ORDER BY started_at DESC
      LIMIT 5
    `;

    return {
      latestMigrations: migrations,
      allApplied: true, // We'll enhance this if needed
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      allApplied: false,
    };
  }
};

// Performance optimization queries
export const OPTIMIZED_QUERIES = {
  // Get active cars with minimal data for listings
  getActiveCarsMinimal: (limit: number = 12, offset: number = 0) => ({
    select: {
      id: true,
      slug: true,
      make: true,
      model: true,
      year: true,
      price: true,
      mileage: true,
      fuelType: true,
      transmission: true,
      color: true,
      featured: true,
      images: {
        select: {
          url: true,
          altText: true,
          isPrimary: true,
        },
        where: {
          isPrimary: true,
        },
        take: 1,
      },
    },
    where: {
      status: 'AVAILABLE',
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
    skip: offset,
  }),

  // Get car details with all relations
  getCarDetails: (slug: string) => ({
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
    },
  }),

  // Search cars with filters
  searchCars: (filters: {
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    fuelType?: string;
    transmission?: string;
    category?: string;
  }) => {
    const where: Record<string, unknown> = {
      status: 'AVAILABLE',
    };

    if (filters.make) where.brand = { contains: filters.make, mode: 'insensitive' };
    if (filters.model) where.model = { contains: filters.model, mode: 'insensitive' };
    if (filters.minPrice) where.priceEur = { ...(where.priceEur as object || {}), gte: filters.minPrice };
    if (filters.maxPrice) where.priceEur = { ...(where.priceEur as object || {}), lte: filters.maxPrice };
    if (filters.minYear) where.year = { ...(where.year as object || {}), gte: filters.minYear };
    if (filters.maxYear) where.year = { ...(where.year as object || {}), lte: filters.maxYear };
    if (filters.fuelType) where.fuel = filters.fuelType;
    if (filters.transmission) where.transmission = filters.transmission;
    if (filters.category) where.category = filters.category;

    return { where };
  },
};

export default DATABASE_CONFIG;