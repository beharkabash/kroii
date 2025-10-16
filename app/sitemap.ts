import { MetadataRoute } from 'next';
import { cars } from '@/app/data/cars';

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

/**
 * Dynamic sitemap generation for SEO
 * Automatically includes all car detail pages and category/brand pages
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kroiautocenter.fi';
  const currentDate = new Date().toISOString();

  try {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ];

    // Dynamic car detail pages
    const carPages: MetadataRoute.Sitemap = cars.map((car) => ({
      url: `${baseUrl}/cars/${car.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Get all brands for brand pages
    const brands = [...new Set(cars.map(car => car.brand))];
    const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
      url: `${baseUrl}/cars/brand/${encodeURIComponent(brand.toLowerCase())}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Category pages
    const categories = Object.values(CarCategory);
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/cars/category/${category}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...carPages, ...brandPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Fallback to static pages only
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 1.0,
      }
    ];
  }
}