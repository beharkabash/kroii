/**
 * Prisma Client Singleton with Production Optimizations
 * Ensures single instance in development (hot reload) and production
 */

import { PrismaClient } from '@prisma/client';
import { createPrismaClient, checkDatabaseHealth, DATABASE_CONFIG } from './config';

// This prevents hot-reloading in development from creating multiple instances.
// In production, it simply creates one instance.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use optimized client configuration
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database health monitoring
export const getDatabaseHealth = () => checkDatabaseHealth(prisma);

/**
 * Graceful shutdown with connection cleanup
 */
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed gracefully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
}

// Connection test utility
export const testConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};

// Query performance monitoring wrapper
export const withPerformanceLogging = async <T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> => {
  const start = Date.now();
  try {
    const result = await query();
    const duration = Date.now() - start;

    if (duration > DATABASE_CONFIG.SLOW_QUERY_THRESHOLD) {
      console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`Query failed: ${queryName} after ${duration}ms`, error);
    throw error;
  }
};

// Database transaction wrapper with retry logic
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt === maxRetries) {
        break;
      }

      // Only retry on connection errors, not business logic errors
      if (lastError.message.includes('Connection') || lastError.message.includes('timeout')) {
        console.warn(`Database operation failed, retrying (${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      } else {
        break;
      }
    }
  }

  throw lastError!;
};

// Handle process termination gracefully
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await disconnectDB();
  });

  process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
  });
}

// Database initialization check
const initializeDatabase = async () => {
  const health = await getDatabaseHealth();
  if (health.connected) {
    console.log('✅ Database connected successfully');
  } else {
    console.error('❌ Database connection failed:', health.error);
  }
};

// Run initialization in production
if (process.env.NODE_ENV === 'production') {
  initializeDatabase().catch(console.error);
}
