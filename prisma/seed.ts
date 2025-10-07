/**
 * Database Seed Script
 * Migrates existing car data from TypeScript to PostgreSQL
 * Run with: npm run db:seed
 */

import { PrismaClient, CarStatus, CarCondition, CarCategory, FuelType, TransmissionType, DriveType, UserRole } from '@prisma/client';
import { cars } from '../app/data/cars';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Mapping functions
function mapFuelType(fuel: string): FuelType {
  const fuelMap: Record<string, FuelType> = {
    'Diesel': FuelType.DIESEL,
    'Petrol': FuelType.PETROL,
    'Bensiini': FuelType.PETROL,
    'Electric': FuelType.ELECTRIC,
    'Sähkö': FuelType.ELECTRIC,
    'Hybrid': FuelType.HYBRID,
  };
  return fuelMap[fuel] || FuelType.DIESEL;
}

function mapTransmissionType(transmission: string): TransmissionType {
  const transMap: Record<string, TransmissionType> = {
    'Automatic': TransmissionType.AUTOMATIC,
    'Automaatti': TransmissionType.AUTOMATIC,
    'Manual': TransmissionType.MANUAL,
    'Manuaali': TransmissionType.MANUAL,
  };
  return transMap[transmission] || TransmissionType.AUTOMATIC;
}

function mapDriveType(driveType?: string): DriveType | undefined {
  if (!driveType) return undefined;
  
  const driveMap: Record<string, DriveType> = {
    'Etuvetävä': DriveType.FWD,
    'Takavetävä': DriveType.RWD,
    'Neliveto': DriveType.AWD,
    '4x4': DriveType.FOUR_WD,
    'FWD': DriveType.FWD,
    'RWD': DriveType.RWD,
    'AWD': DriveType.AWD,
  };
  return driveMap[driveType];
}

function mapCategory(category: string): CarCategory {
  const catMap: Record<string, CarCategory> = {
    'premium': CarCategory.PREMIUM,
    'family': CarCategory.FAMILY,
    'suv': CarCategory.SUV,
    'compact': CarCategory.COMPACT,
    'sports': CarCategory.SPORTS,
    'luxury': CarCategory.LUXURY,
    'electric': CarCategory.ELECTRIC,
  };
  return catMap[category.toLowerCase()] || CarCategory.FAMILY;
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Create default admin user
  console.log('👤 Creating default admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kroiautocenter.fi' },
    update: {},
    create: {
      email: 'admin@kroiautocenter.fi',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log(`✓ Created admin user: ${admin.email}\n`);

  // 2. Migrate car data
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

      // Parse drive type from specifications
      const driveTypeSpec = car.specifications.find(
        spec => spec.label === 'Vetotapa' || spec.label.toLowerCase().includes('drive')
      );

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
          transmission: mapTransmissionType(car.transmission),
          kmNumber: car.kmNumber,
          color: car.specifications.find(s => s.label === 'Väri')?.value,
          driveType: driveTypeSpec ? mapDriveType(driveTypeSpec.value) : undefined,
          status: CarStatus.AVAILABLE,
          condition: CarCondition.GOOD,
          category: mapCategory(car.category),
          featured: false,
          description: car.description,
          detailedDescription: car.detailedDescription,
          
          // Create related images
          images: {
            create: [
              {
                url: car.image,
                altText: car.name,
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

  // 3. Create some sample contact submissions for testing
  console.log('📧 Creating sample contact submissions...');
  const sampleCar = await prisma.car.findFirst();
  
  if (sampleCar) {
    await prisma.contactSubmission.create({
      data: {
        name: 'Matti Meikäläinen',
        email: 'matti@example.com',
        phone: '+358401234567',
        message: 'Kiinnostunut tästä autosta. Voisinko saada lisätietoja?',
        leadScore: 75,
        carId: sampleCar.id,
        status: 'NEW',
        priority: 'HIGH',
      },
    });
    console.log('✓ Created sample contact submission\n');
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📝 Default Admin Credentials:');
  console.log('   Email: admin@kroiautocenter.fi');
  console.log('   Password: admin123');
  console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
