'use client';

import { useEffect, useState } from 'react';
import { X, ArrowRight, Scale } from 'lucide-react';
import { useComparisonStore } from '@/app/lib/comparison-store';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

export default function ComparisonWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const { comparedCars, removeFromComparison, getComparisonCount } = useComparisonStore();

  useEffect(() => {
    // Only show the widget if there are cars to compare
    setIsVisible(getComparisonCount() > 0);
  }, [getComparisonCount]);

  // Hydration fix for SSR
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isVisible || comparedCars.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">
              Vertailu ({comparedCars.length}/3)
            </h3>
          </div>
          <Link
            href="/cars/compare"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <span>Vertaile autoja</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparedCars.map((car) => (
            <div
              key={car.id}
              className="relative bg-gray-50 rounded-lg p-3 border"
            >
              <button
                onClick={() => removeFromComparison(car.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Poista vertailusta"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image
                    src={car.image || '/cars/placeholder.jpg'}
                    alt={car.name}
                    width={60}
                    height={45}
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {car.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {car.year} • {car.kmNumber.toLocaleString('fi-FI')} km
                  </p>
                  <p className="text-sm font-semibold text-purple-600">
                    {car.priceEur.toLocaleString('fi-FI')} €
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Add more slots indicator */}
          {comparedCars.length < 3 && (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center">
              <div className="text-center">
                <Scale className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  Lisää auto vertailuun
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add to Compare Button Component
interface AddToCompareButtonProps {
  car: {
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
  };
  className?: string;
  variant?: 'default' | 'compact';
}

export function AddToCompareButton({ car, className, variant = 'default' }: AddToCompareButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparisonStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration issues
  }

  const inComparison = isInComparison(car.id);
  const canAdd = canAddMore();

  const handleClick = () => {
    if (inComparison) {
      removeFromComparison(car.id);
    } else if (canAdd) {
      // Convert car data to ComparisonCar format
      const comparisonCar = {
        ...car,
        image: car.image || car.images?.[0]?.url,
        category: 'Auto', // Default category
        features: [], // Would be populated from car data
      };
      addToComparison(comparisonCar);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={!canAdd && !inComparison}
        className={cn(
          "p-2 rounded-lg border transition-all duration-200",
          inComparison
            ? "bg-purple-600 text-white border-purple-600"
            : canAdd
            ? "bg-white text-gray-700 border-gray-300 hover:border-purple-600 hover:text-purple-600"
            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
          className
        )}
        title={
          inComparison
            ? "Poista vertailusta"
            : canAdd
            ? "Lisää vertailuun"
            : "Maksimi 3 autoa vertailussa"
        }
      >
        <Scale className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!canAdd && !inComparison}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium",
        inComparison
          ? "bg-purple-600 text-white border-purple-600"
          : canAdd
          ? "bg-white text-gray-700 border-gray-300 hover:border-purple-600 hover:text-purple-600"
          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
        className
      )}
    >
      <Scale className="h-4 w-4" />
      <span>
        {inComparison
          ? "Poista vertailusta"
          : canAdd
          ? "Lisää vertailuun"
          : "Vertailu täynnä"}
      </span>
    </button>
  );
}