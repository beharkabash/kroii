// In a dedicated file like /lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// This prevents hot-reloading in development from creating multiple instances.
// In production, it simply creates one instance.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Prisma will automatically look for the DATABASE_URL environment variable
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
