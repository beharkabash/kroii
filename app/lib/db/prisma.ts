/**
 * Prisma Client Singleton
 * Ensures single instance in development (hot reload) and production
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    // Optimize for low-memory environments (Render free tier)
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown
 */
export async function disconnectDB() {
  await prisma.$disconnect();
}

// Handle process termination
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await disconnectDB();
  });
}