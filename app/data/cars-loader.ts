import { readFile } from 'fs/promises';
import { join } from 'path';
import { cars as staticCars, type Car } from './cars';

// Load cars from dynamic JSON file or fallback to static
export async function getCars(): Promise<Car[]> {
  try {
    const dynamicFile = join(process.cwd(), 'app', 'data', 'cars-dynamic.json');
    const data = await readFile(dynamicFile, 'utf-8');
    const dynamicCars = JSON.parse(data);
    
    // If dynamic file has data, use it; otherwise use static
    return dynamicCars.length > 0 ? dynamicCars : staticCars;
  } catch (error) {
    // If file doesn't exist or error, use static data
    return staticCars;
  }
}

export function getCarById(cars: Car[], id: string): Car | undefined {
  return cars.find(car => car.id === id || car.slug === id);
}

export function getCarsByBrand(cars: Car[], brand: string): Car[] {
  return cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
}

export function getCarsByCategory(cars: Car[], category: string): Car[] {
  return cars.filter(car => car.category === category);
}

export function getRelatedCars(cars: Car[], currentCarId: string, limit: number = 3): Car[] {
  const currentCar = getCarById(cars, currentCarId);
  if (!currentCar) return [];

  let related = getCarsByBrand(cars, currentCar.brand).filter(car => car.id !== currentCarId);

  if (related.length < limit) {
    const categoryMatches = getCarsByCategory(cars, currentCar.category)
      .filter(car => car.id !== currentCarId && !related.find(r => r.id === car.id));
    related = [...related, ...categoryMatches];
  }

  if (related.length < limit) {
    const others = cars
      .filter(car => car.id !== currentCarId && !related.find(r => r.id === car.id));
    related = [...related, ...others];
  }

  return related.slice(0, limit);
}
