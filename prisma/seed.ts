/**
 * Database Seed Script
 * Migrates existing car data from TypeScript to PostgreSQL
 * Run with: npm run db:seed
 */

import { PrismaClient, CarStatus, CarCategory, FuelType, TransmissionType } from '@prisma/client';
import { cars } from '../app/data/cars';

const prisma = new PrismaClient();

// Mapping functions
function mapCategory(category: string): CarCategory {
  const catMap: Record<string, CarCategory> = {
    'premium': CarCategory.OTHER,
    'family': CarCategory.SEDAN,
    'suv': CarCategory.SUV,
    'compact': CarCategory.HATCHBACK,
    'sports': CarCategory.COUPE,
    'luxury': CarCategory.SEDAN,
    'electric': CarCategory.OTHER,
  };
  return catMap[category.toLowerCase()] || CarCategory.SEDAN;
}

function mapFuelType(fuel: string): FuelType {
  const fuelMap: Record<string, FuelType> = {
    'diesel': FuelType.DIESEL,
    'gasoline': FuelType.GASOLINE,
    'petrol': FuelType.GASOLINE,
    'hybrid': FuelType.HYBRID,
    'electric': FuelType.ELECTRIC,
  };
  return fuelMap[fuel.toLowerCase()] || FuelType.OTHER;
}

function mapTransmission(transmission: string): TransmissionType {
  const transMap: Record<string, TransmissionType> = {
    'automatic': TransmissionType.AUTOMATIC,
    'automaatti': TransmissionType.AUTOMATIC,
    'manual': TransmissionType.MANUAL,
    'manuaali': TransmissionType.MANUAL,
    'cvt': TransmissionType.CVT,
  };
  return transMap[transmission.toLowerCase()] || TransmissionType.AUTOMATIC;
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Migrate car data
  console.log('🚗 Migrating car data...');
  let migratedCount = 0;
  let skippedCount = 0;

  for (const car of cars) {
    try {
      // Check if car already exists
      const existing = await prisma.car.findUnique({
        where: { slug: car.slug },
      });

      if (existing) {
        console.log(`⊗ Skipped: ${car.name} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create car with all relations
      await prisma.car.create({
        data: {
          slug: car.slug,
          name: car.name,
          brand: car.brand,
          model: car.model,
          year: parseInt(car.year),
          priceEur: car.priceEur,
          fuel: mapFuelType(car.fuel),
          transmission: mapTransmission(car.transmission),
          kmNumber: car.kmNumber,
          status: CarStatus.AVAILABLE,
          condition: 'Good condition',
          category: mapCategory(car.category),
          featured: false,
          description: car.description,
          detailedDescription: Array.isArray(car.detailedDescription) ? car.detailedDescription.join('\n\n') : car.detailedDescription,
          
          // Create related images
          images: {
            create: [
              {
                url: car.image,
                order: 0,
                isPrimary: true,
              },
            ],
          },

          // Create features
          features: {
            create: car.features.map((feature, index) => ({
              feature,
              order: index,
            })),
          },

          // Create specifications
          specifications: {
            create: car.specifications.map((spec, index) => ({
              label: spec.label,
              value: spec.value,
              order: index,
            })),
          },
        },
      });

      console.log(`✓ Migrated: ${car.name}`);
      migratedCount++;
    } catch (error) {
      console.error(`✗ Error migrating ${car.name}:`, error);
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   • Migrated: ${migratedCount} cars`);
  console.log(`   • Skipped: ${skippedCount} cars`);
  console.log(`   • Total: ${cars.length} cars\n`);

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
