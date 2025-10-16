/**
 * SEO utilities
 * Functions for generating SEO metadata
 */

import { Car } from '@/app/data/cars';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    images?: string[];
  };
}

export function generateCarSEOMetadata(car: Car): SEOMetadata {
  const title = `${car.name} ${car.year} - ${car.price} | Kroi Auto Center`;
  const description = `${car.description} Katsastus ja huolto kunnossa. Ota yhteyttä jo tänään!`;

  return {
    title,
    description,
    keywords: [
      car.brand,
      car.model,
      car.year,
      car.fuel,
      car.transmission,
      'käytetty auto',
      'auto myynti',
      'Kroi Auto'
    ],
    openGraph: {
      title,
      description,
      images: [car.image]
    }
  };
}

export function generateBrandSEOMetadata(brand: string, carCount: number): SEOMetadata {
  const title = `${brand} Käytetyt Autot (${carCount} kpl) | Kroi Auto Center`;
  const description = `Löydä ${carCount} ${brand} käytettyä autoa Kroi Auto Centeristä. Laadukkaat autot, katsastus kunnossa.`;

  return {
    title,
    description,
    keywords: [brand, 'käytetty auto', 'auto myynti', 'Kroi Auto'],
    openGraph: {
      title,
      description
    }
  };
}

export function generateCategorySEOMetadata(category: string, carCount: number): SEOMetadata {
  const categoryNames: Record<string, string> = {
    'premium': 'Premium-luokan',
    'family': 'Perhe',
    'suv': 'SUV'
  };

  const categoryName = categoryNames[category] || category;
  const title = `${categoryName} Käytetyt Autot (${carCount} kpl) | Kroi Auto Center`;
  const description = `Löydä ${carCount} ${categoryName.toLowerCase()} käytettyä autoa Kroi Auto Centeristä. Laadukkaat autot, katsastus kunnossa.`;

  return {
    title,
    description,
    keywords: [categoryName, 'käytetty auto', 'auto myynti', 'Kroi Auto'],
    openGraph: {
      title,
      description
    }
  };
}

export function generateSearchSEOMetadata(query: string, resultCount: number): SEOMetadata {
  const title = `Haku: "${query}" (${resultCount} tulosta) | Kroi Auto Center`;
  const description = `Löydettiin ${resultCount} autoa hakusanalla "${query}". Tutustu laadukkaaseen käytettyjen autojen valikoimaamme.`;

  return {
    title,
    description,
    keywords: [query, 'käytetty auto', 'auto haku', 'Kroi Auto'],
    openGraph: {
      title,
      description
    }
  };
}

/**
 * SEO Generator utility class for backward compatibility
 */
export class SEOGenerator {
  static generateCarMetadata = generateCarSEOMetadata;
  static generateBrandMetadata = generateBrandSEOMetadata;
  static generateCategoryMetadata = generateCategorySEOMetadata;
  static generateSearchMetadata = generateSearchSEOMetadata;
}