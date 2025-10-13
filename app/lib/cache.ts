import { redisService, CACHE_DURATION } from './redis';

export interface CacheOptions {
  key: string;
  duration?: number;
  tags?: string[];
}

export class CacheManager {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redisService.get(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set<T>(key: string, data: T, duration: number = CACHE_DURATION.MEDIUM): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      await redisService.set(key, serialized, duration);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redisService.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      return await redisService.exists(key);
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      // Note: This is a simplified version. In production, you might want
      // to use Redis SCAN command for pattern-based deletion
      console.log(`Cache invalidation requested for pattern: ${pattern}`);
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await redisService.flushAll();
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

/**
 * Higher-order function to wrap any async function with caching
 */
export function withCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: {
    keyGenerator: (...args: Parameters<T>) => string;
    duration?: number;
    skipCache?: boolean;
  }
): T {
  return (async (...args: Parameters<T>) => {
    const { keyGenerator, duration = CACHE_DURATION.MEDIUM, skipCache = false } = options;

    if (skipCache) {
      return await fn(...args);
    }

    const cacheKey = keyGenerator(...args);

    // Try to get from cache first
    const cached = await CacheManager.get(cacheKey);
    if (cached !== null) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    // If not in cache, execute the function
    console.log(`Cache miss for key: ${cacheKey}`);
    const result = await fn(...args);

    // Store in cache for next time
    await CacheManager.set(cacheKey, result, duration);

    return result;
  }) as T;
}

/**
 * Utility to create cache-enabled API endpoints
 */
export async function cacheApiResponse<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number = CACHE_DURATION.MEDIUM
): Promise<T> {
  // Check cache first
  const cached = await CacheManager.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Cache the result
  await CacheManager.set(key, data, duration);

  return data;
}