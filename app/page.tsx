import { getAllCars, convertToLegacyFormat } from './lib/db/cars';
import HomeContent from './components/HomeContent';

// Force dynamic rendering to avoid database issues during build
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch cars from database with fallback for missing DATABASE_URL
  let cars: ReturnType<typeof convertToLegacyFormat>[] = [];

  try {
    // Only try to fetch if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      const { cars: dbCars } = await getAllCars({}, { limit: 9, sortBy: 'createdAt', sortOrder: 'desc' });
      cars = dbCars.map(convertToLegacyFormat);
    }
  } catch (error) {
    console.warn('Database not available during build, using empty car list:', error);
    // Use empty array as fallback
    cars = [];
  }

  return <HomeContent cars={cars} />;
}