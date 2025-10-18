/**
 * Car Category Page
 * Shows cars filtered by specific category
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCarsByCategory } from '@/app/data/cars';

// Simple category enum
const CarCategory = {
  PREMIUM: 'premium',
  FAMILY: 'family',
  SUV: 'suv',
  COMPACT: 'compact',
  SPORTS: 'sports',
  LUXURY: 'luxury',
  ELECTRIC: 'electric'
} as const;
import CategoryPageContent from './CategoryPageContent';

// Force dynamic rendering to avoid database issues during build
export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = Object.values(CarCategory);
  return categories.map((category) => ({
    category: category
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  const categoryNames: Record<string, string> = {
    'premium': 'Premium-autot',
    'family': 'Perheautot',
    'suv': 'SUV-autot',
    'compact': 'Kompaktiautot',
    'sports': 'Urheiluautot',
    'luxury': 'Luksusautot',
    'electric': 'Sähköautot'
  };

  const categoryName = categoryNames[category.toLowerCase()] || 'Autot';

  return {
    title: `${categoryName} - Kroi Auto Center`,
    description: `Tutustu laajaan ${categoryName.toLowerCase()} valikoimaamme. Laadukkaita käytettyjä autoja Helsingistä.`,
    keywords: [
      categoryName.toLowerCase(),
      'käytetyt autot',
      'auto myytävänä',
      'Helsinki',
      'Kroi Auto Center',
      category
    ].join(', '),
    openGraph: {
      title: `${categoryName} - Kroi Auto Center`,
      description: `Tutustu ${categoryName.toLowerCase()} valikoimaamme`,
      type: 'website',
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Validate category
  const validCategories = Object.values(CarCategory);
  if (!validCategories.includes(category as typeof CarCategory[keyof typeof CarCategory])) {
    notFound();
  }

  try {
    // Get cars in this category
    const categoryCars = getCarsByCategory(category);

    const categoryNames: Record<string, string> = {
      'premium': 'Premium-autot',
      'family': 'Perheautot',
      'suv': 'SUV-autot',
      'compact': 'Kompaktiautot',
      'sports': 'Urheiluautot',
      'luxury': 'Luksusautot',
      'electric': 'Sähköautot'
    };

    const categoryDescriptions: Record<string, string> = {
      'premium': 'Korkealuokkaiset premium-autot, jotka tarjoavat ylellistä ajokokemusta ja huippuluokan varustusta.',
      'family': 'Luotettavia ja turvallisia perheautoja, jotka sopivat erinomaisesti arkikäyttöön ja perheen tarpeisiin.',
      'suv': 'Monikäyttöiset SUV-autot, jotka yhdistävät korkeamman ajoasennon, tilavuuden ja maasto-ominaisuudet.',
      'compact': 'Kompaktit kaupunkiautot, jotka ovat taloudellisia ajaa ja helppoja pysäköidä.',
      'sports': 'Dynaamiset urheiluautot suorituskyvyn ja ajoelämyksen ystäville.',
      'luxury': 'Eksklusiiviset luksusautot, jotka edustavat huippuluokan käsityötä ja teknologiaa.',
      'electric': 'Ympäristöystävälliset sähköautot tulevaisuuden kestävään liikkumiseen.'
    };

    const categoryName = categoryNames[category.toLowerCase()] || 'Autot';
    const categoryDescription = categoryDescriptions[category.toLowerCase()] || '';

    return (
      <CategoryPageContent
        cars={categoryCars}
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        category={category}
      />
    );
  } catch (error) {
    console.error('Error fetching category cars:', error);
    notFound();
  }
}