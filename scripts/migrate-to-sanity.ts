import { createClient } from '@sanity/client';
import { cars } from '../app/data/cars';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: envVars.SANITY_API_TOKEN,
  useCdn: false,
});

async function uploadImage(imagePath: string): Promise<string | null> {
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠️  Skipping missing image: ${imagePath}`);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
    });
    return asset._id;
  } catch (error) {
    console.warn(`  ⚠️  Failed to upload ${imagePath}:`, error);
    return null;
  }
}

async function migrateCars() {
  console.log(`🚀 Starting migration of ${cars.length} vehicles to Sanity...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const car of cars) {
    try {
      console.log(`\n📦 Processing: ${car.name}`);

      // Upload main image
      console.log(`  ⬆️  Uploading main image: ${car.image}`);
      const mainImageId = await uploadImage(car.image);

      // Upload gallery images
      console.log(`  ⬆️  Uploading ${car.images.length} gallery images...`);
      const galleryImageIds = await Promise.all(
        car.images.map(async (img: { url: string }) => {
          const imageId = await uploadImage(img.url);
          return {
            _type: 'image',
            _key: imageId,
            asset: {
              _type: 'reference',
              _ref: imageId,
            },
          };
        })
      );

      // Create car document
      const carDoc = {
        _type: 'car',
        _id: `car-${car.id}`,
        name: car.name,
        slug: {
          _type: 'slug',
          current: car.slug,
        },
        brand: car.brand,
        model: car.model,
        price: car.price,
        priceEur: car.priceEur,
        year: car.year,
        fuel: car.fuel,
        transmission: car.transmission,
        km: car.km,
        kmNumber: car.kmNumber,
        category: car.category,
        description: car.description,
        detailedDescription: car.detailedDescription,
        features: car.features,
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: mainImageId,
          },
        },
        gallery: galleryImageIds,
        specifications: car.specifications,
        condition: car.condition,
        status: car.status,
        featured: car.featured,
      };

      await client.createOrReplace(carDoc);
      console.log(`  ✅ Migrated: ${car.name}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error migrating ${car.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   ✅ Success: ${successCount} vehicles`);
  console.log(`   ❌ Errors: ${errorCount} vehicles`);
}

// Run migration
migrateCars()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
