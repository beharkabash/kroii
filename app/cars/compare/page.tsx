'use client';

import React, { useEffect, useState } from 'react';
import { useComparisonStore, COMPARISON_CATEGORIES, formatComparisonValue, calculateComparisonScore } from '@/app/lib/features/comparison-store';
import { ArrowLeft, X, Scale, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/app/lib/core/utils';
import { Breadcrumbs } from '@/app/components/layout/navigation';

export default function ComparisonPage() {
  const { comparedCars, removeFromComparison, clearComparison } = useComparisonStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Ladataan vertailua...</p>
        </div>
      </div>
    );
  }

  if (comparedCars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs
            items={[
              { name: 'Etusivu', url: '/' },
              { name: 'Autot', url: '/cars' },
              { name: 'Vertailu', url: '/cars/compare', isCurrentPage: true }
            ]}
            className="mb-6"
          />

          <div className="text-center max-w-md mx-auto">
            <Scale className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Ei autoja vertailussa
            </h1>
            <p className="text-gray-600 mb-8">
              Lisää autoja vertailuun selaamalla autoilmoituksia ja klikkaamalla &quot;Lisää vertailuun&quot; -painiketta.
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Selaa autoja</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate scores for each car
  const carsWithScores = comparedCars.map(car => ({
    ...car,
    score: calculateComparisonScore(car, comparedCars)
  })).sort((a, b) => b.score - a.score);

  const bestCar = carsWithScores[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Etusivu', url: '/' },
            { name: 'Autot', url: '/cars' },
            { name: 'Vertailu', url: '/cars/compare', isCurrentPage: true }
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Autojen vertailu
            </h1>
            <p className="text-gray-600">
              Vertaile {comparedCars.length} autoa rinnakkain
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/cars"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Takaisin autoihin</span>
            </Link>
            <button
              onClick={clearComparison}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 border border-red-300 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Tyhjennä vertailu</span>
            </button>
          </div>
        </div>

        {/* Best Pick Banner */}
        {bestCar && carsWithScores.length > 1 && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">
                  Paras valinta: {bestCar.name}
                </h3>
                <p className="text-yellow-700">
                  Vertailupisteesi: {bestCar.score}/100 - Paras hinta-laatu-suhde
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Car Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {carsWithScores.map((car, index) => (
            <div
              key={car.id}
              className={cn(
                "bg-white rounded-lg border-2 p-6 relative",
                index === 0 && carsWithScores.length > 1
                  ? "border-yellow-300 bg-yellow-50"
                  : "border-gray-200"
              )}
            >
              {index === 0 && carsWithScores.length > 1 && (
                <div className="absolute -top-3 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Paras</span>
                </div>
              )}

              <button
                onClick={() => removeFromComparison(car.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Poista vertailusta"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <Image
                  src={car.image || '/cars/placeholder.jpg'}
                  alt={car.name}
                  width={200}
                  height={120}
                  className="rounded-lg object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {car.name}
                </h3>
                <p className="text-2xl font-bold text-purple-600 mb-2">
                  {car.priceEur.toLocaleString('fi-FI')} €
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{car.year} • {car.kmNumber.toLocaleString('fi-FI')} km</p>
                  <p>{car.fuel} • {car.transmission}</p>
                </div>
                {carsWithScores.length > 1 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-1">Vertailupisteet</div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          index === 0 ? "bg-yellow-500" : "bg-purple-600"
                        )}
                        style={{ width: `${car.score}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {car.score}/100
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              Yksityiskohtainen vertailu
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-sm font-medium text-gray-900 min-w-[200px]">
                    Ominaisuus
                  </th>
                  {comparedCars.map((car) => (
                    <th
                      key={car.id}
                      className="px-6 py-3 text-center text-sm font-medium text-gray-900 min-w-[200px]"
                    >
                      <div className="text-xs text-gray-500">{car.brand}</div>
                      <div>{car.model} {car.year}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(COMPARISON_CATEGORIES).map(([categoryKey, category]) => (
                  <React.Fragment key={categoryKey}>
                    <tr className="bg-gray-50">
                      <td
                        colSpan={comparedCars.length + 1}
                        className="px-6 py-3 text-sm font-semibold text-gray-900"
                      >
                        {category.label}
                      </td>
                    </tr>
                    {category.fields.map((field) => (
                      <tr key={field.key} className="hover:bg-gray-50">
                        <td className="sticky left-0 bg-white px-6 py-4 text-sm text-gray-900 font-medium border-r border-gray-200">
                          {field.label}
                        </td>
                        {comparedCars.map((car) => {
                          const value = (car as unknown as Record<string, unknown>)[field.key];
                          return (
                            <td
                              key={car.id}
                              className="px-6 py-4 text-sm text-center text-gray-700"
                            >
                              {formatComparisonValue(value, field.format)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {comparedCars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.slug}`}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
            >
              Näytä {car.brand} {car.model}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}