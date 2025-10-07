import { getAllCars, convertToLegacyFormat } from './lib/db/cars';
import HomeContent from './components/HomeContent';

export default async function Home() {
  // Fetch cars from database
  const { cars: dbCars } = await getAllCars({}, { limit: 9, sortBy: 'createdAt', sortOrder: 'desc' });
  const cars = dbCars.map(convertToLegacyFormat);

  return <HomeContent cars={cars} />;
}