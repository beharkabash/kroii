'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ComparisonCar {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  priceEur: number;
  kmNumber: number;
  fuel: string;
  transmission: string;
  description: string;
  image?: string;
  images?: Array<{ url: string; alt?: string }>;
  // Additional specs for comparison
  engine?: string;
  power?: string;
  consumption?: string;
  emissions?: string;
  doors?: number;
  seats?: number;
  color?: string;
  category?: string;
  features?: string[];
}

interface ComparisonState {
  comparedCars: ComparisonCar[];
  addToComparison: (car: ComparisonCar) => void;
  removeFromComparison: (carId: string) => void;
  clearComparison: () => void;
  isInComparison: (carId: string) => boolean;
  canAddMore: () => boolean;
  getComparisonCount: () => number;
}

const MAX_COMPARISON_CARS = 3;

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      comparedCars: [],

      addToComparison: (car: ComparisonCar) => {
        const { comparedCars, isInComparison, canAddMore } = get();

        if (isInComparison(car.id)) {
          return; // Car already in comparison
        }

        if (!canAddMore()) {
          return; // Maximum cars reached
        }

        set({
          comparedCars: [...comparedCars, car]
        });
      },

      removeFromComparison: (carId: string) => {
        set((state) => ({
          comparedCars: state.comparedCars.filter(car => car.id !== carId)
        }));
      },

      clearComparison: () => {
        set({ comparedCars: [] });
      },

      isInComparison: (carId: string) => {
        return get().comparedCars.some(car => car.id === carId);
      },

      canAddMore: () => {
        return get().comparedCars.length < MAX_COMPARISON_CARS;
      },

      getComparisonCount: () => {
        return get().comparedCars.length;
      }
    }),
    {
      name: 'car-comparison',
      skipHydration: true,
    }
  )
);

// Comparison criteria and utilities
export const COMPARISON_CATEGORIES = {
  BASIC_INFO: {
    label: 'Perustiedot',
    fields: [
      { key: 'brand', label: 'Merkki', format: undefined },
      { key: 'model', label: 'Malli', format: undefined },
      { key: 'year', label: 'Vuosimalli', format: undefined },
      { key: 'category', label: 'Kategoria', format: undefined },
      { key: 'color', label: 'Väri', format: undefined }
    ]
  },
  PRICING: {
    label: 'Hinnoittelu',
    fields: [
      { key: 'priceEur', label: 'Hinta', format: 'currency' },
      { key: 'kmNumber', label: 'Kilometrit', format: 'number' }
    ]
  },
  ENGINE_SPECS: {
    label: 'Moottori ja suorituskyky',
    fields: [
      { key: 'engine', label: 'Moottori', format: undefined },
      { key: 'fuel', label: 'Polttoaine', format: undefined },
      { key: 'transmission', label: 'Vaihteisto', format: undefined },
      { key: 'power', label: 'Teho', format: undefined },
      { key: 'consumption', label: 'Kulutus', format: undefined },
      { key: 'emissions', label: 'Päästöt', format: undefined }
    ]
  },
  DIMENSIONS: {
    label: 'Mitat ja tilat',
    fields: [
      { key: 'doors', label: 'Ovet', format: 'number' },
      { key: 'seats', label: 'Istumapaikat', format: 'number' }
    ]
  },
  FEATURES: {
    label: 'Varusteet',
    fields: [
      { key: 'features', label: 'Lisävarusteet', format: 'list' }
    ]
  }
} as const;

export function formatComparisonValue(value: unknown, format?: string): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  switch (format) {
    case 'currency':
      return `${(value as number).toLocaleString('fi-FI')} €`;
    case 'number':
      return (value as number).toLocaleString('fi-FI');
    case 'list':
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'Ei lisävarusteita';
      }
      return String(value);
    default:
      return String(value);
  }
}

export function calculateComparisonScore(car: ComparisonCar, allCars: ComparisonCar[]): number {
  if (allCars.length < 2) return 0;

  let score = 0;
  let totalWeight = 0;

  // Price comparison (lower is better)
  const prices = allCars.map(c => c.priceEur);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  if (maxPrice > minPrice) {
    const priceScore = 1 - ((car.priceEur - minPrice) / (maxPrice - minPrice));
    score += priceScore * 0.3; // 30% weight
    totalWeight += 0.3;
  }

  // Mileage comparison (lower is better)
  const mileages = allCars.map(c => c.kmNumber);
  const minMileage = Math.min(...mileages);
  const maxMileage = Math.max(...mileages);
  if (maxMileage > minMileage) {
    const mileageScore = 1 - ((car.kmNumber - minMileage) / (maxMileage - minMileage));
    score += mileageScore * 0.2; // 20% weight
    totalWeight += 0.2;
  }

  // Year comparison (higher is better)
  const years = allCars.map(c => c.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  if (maxYear > minYear) {
    const yearScore = (car.year - minYear) / (maxYear - minYear);
    score += yearScore * 0.2; // 20% weight
    totalWeight += 0.2;
  }

  // Features comparison
  const featureCounts = allCars.map(c => c.features?.length || 0);
  const minFeatures = Math.min(...featureCounts);
  const maxFeatures = Math.max(...featureCounts);
  if (maxFeatures > minFeatures) {
    const featuresScore = ((car.features?.length || 0) - minFeatures) / (maxFeatures - minFeatures);
    score += featuresScore * 0.3; // 30% weight
    totalWeight += 0.3;
  }

  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
}