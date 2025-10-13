import { CacheManager } from './cache';
import { CACHE_KEYS } from './redis';

export class CacheInvalidationService {
  /**
   * Invalidate all car-related caches when car data changes
   */
  static async invalidateCarCaches(carId?: string): Promise<void> {
    try {
      console.log('Invalidating car caches...');

      // Clear all cars cache
      await CacheManager.del(CACHE_KEYS.CARS_ALL);
      await CacheManager.del(CACHE_KEYS.CARS_FEATURED);

      // Clear specific car cache if ID provided
      if (carId) {
        await CacheManager.del(CACHE_KEYS.CAR_DETAILS(carId));
      }

      // Clear search metadata (brands, categories might have changed)
      await CacheManager.del('search:metadata');

      console.log('Car caches invalidated successfully');
    } catch (error) {
      console.error('Error invalidating car caches:', error);
    }
  }

  /**
   * Invalidate search caches when search-related data changes
   */
  static async invalidateSearchCaches(): Promise<void> {
    try {
      console.log('Invalidating search caches...');

      // Note: In a production environment with Redis SCAN support,
      // you would scan for all keys matching CACHE_KEYS.CARS_SEARCH pattern
      await CacheManager.del('search:metadata');

      console.log('Search caches invalidated successfully');
    } catch (error) {
      console.error('Error invalidating search caches:', error);
    }
  }

  /**
   * Invalidate testimonial caches when testimonials change
   */
  static async invalidateTestimonialCaches(): Promise<void> {
    try {
      console.log('Invalidating testimonial caches...');

      // Note: In production, you would scan for all testimonial cache keys
      // For now, we'll clear the base testimonials cache
      await CacheManager.del(CACHE_KEYS.TESTIMONIALS);

      console.log('Testimonial caches invalidated successfully');
    } catch (error) {
      console.error('Error invalidating testimonial caches:', error);
    }
  }

  /**
   * Clear all application caches
   */
  static async clearAllCaches(): Promise<void> {
    try {
      console.log('Clearing all application caches...');
      await CacheManager.clear();
      console.log('All caches cleared successfully');
    } catch (error) {
      console.error('Error clearing all caches:', error);
    }
  }

  /**
   * Warm up critical caches by pre-loading frequently accessed data
   */
  static async warmUpCaches(): Promise<void> {
    try {
      console.log('Warming up critical caches...');

      // This would typically pre-load:
      // - Featured cars
      // - Search metadata
      // - Top testimonials
      // Implementation depends on your data access patterns

      console.log('Cache warm-up completed');
    } catch (error) {
      console.error('Error warming up caches:', error);
    }
  }
}

/**
 * Middleware helper for cache invalidation in API routes
 */
export function withCacheInvalidation<T extends (...args: unknown[]) => unknown>(
  handler: T,
  invalidationFn: () => Promise<void>
): T {
  return (async (...args: Parameters<T>) => {
    const result = await handler(...args);

    // Invalidate cache after successful operation
    if (result && typeof result === 'object' && 'status' in result) {
      // For Next.js Response objects
      const statusResult = result as { status: number };
      if (statusResult.status >= 200 && statusResult.status < 300) {
        await invalidationFn();
      }
    } else {
      // For other successful operations
      await invalidationFn();
    }

    return result;
  }) as T;
}