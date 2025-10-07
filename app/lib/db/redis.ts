/**
 * Redis Cache Client
 * High-performance caching for car listings and frequently accessed data
 */

import Redis from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  // Default local Redis
  return 'redis://localhost:6379';
};

class RedisClient {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.client = new Redis(getRedisUrl(), {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          if (times > 3) {
            console.error('[REDIS] Max retries reached, giving up');
            return null;
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err: Error) => {
          console.error('[REDIS] Reconnect on error:', err.message);
          return true;
        },
      });

      this.client.on('connect', () => {
        console.log('[REDIS] Connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (error: Error) => {
        console.error('[REDIS] Connection error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.warn('[REDIS] Connection closed');
        this.isConnected = false;
      });
    } catch (error) {
      console.error('[REDIS] Failed to initialize:', error);
      this.client = null;
    }
  }

  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) {
      console.warn('[REDIS] Cache miss - client not available:', key);
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      console.error('[REDIS] Get error:', error);
      return null;
    }
  }

  /**
   * Set cached value with TTL
   */
  async set(key: string, value: unknown, ttlSeconds: number = 3600): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      console.warn('[REDIS] Cache skip - client not available:', key);
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      await this.client.setex(key, ttlSeconds, serialized);
      return true;
    } catch (error) {
      console.error('[REDIS] Set error:', error);
      return false;
    }
  }

  /**
   * Delete cached value
   */
  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('[REDIS] Delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async delPattern(pattern: string): Promise<number> {
    if (!this.client || !this.isConnected) {
      return 0;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.client.del(...keys);
      return result;
    } catch (error) {
      console.error('[REDIS] Delete pattern error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('[REDIS] Exists error:', error);
      return false;
    }
  }

  /**
   * Increment counter
   */
  async incr(key: string): Promise<number> {
    if (!this.client || !this.isConnected) {
      return 0;
    }

    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('[REDIS] Increment error:', error);
      return 0;
    }
  }

  /**
   * Set expiration
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error('[REDIS] Expire error:', error);
      return false;
    }
  }

  /**
   * Get remaining TTL
   */
  async ttl(key: string): Promise<number> {
    if (!this.client || !this.isConnected) {
      return -1;
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('[REDIS] TTL error:', error);
      return -1;
    }
  }

  /**
   * Flush all cache
   */
  async flushAll(): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.flushall();
      return true;
    } catch (error) {
      console.error('[REDIS] Flush all error:', error);
      return false;
    }
  }

  /**
   * Graceful disconnect
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('[REDIS] Ping error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const redis = new RedisClient();

// Cache key generators
export const CacheKeys = {
  // Car-related keys
  car: (id: string) => `car:${id}`,
  carSlug: (slug: string) => `car:slug:${slug}`,
  carsList: (filters?: string) => `cars:list${filters ? `:${filters}` : ''}`,
  carsByBrand: (brand: string) => `cars:brand:${brand}`,
  carsByCategory: (category: string) => `cars:category:${category}`,
  relatedCars: (id: string) => `cars:related:${id}`,
  featuredCars: () => 'cars:featured',

  // Analytics
  carViews: (carId: string) => `analytics:views:${carId}`,
  popularCars: () => 'analytics:popular:cars',

  // Contact & leads
  contactSubmissions: (status?: string) => `contacts${status ? `:${status}` : ''}`,

  // User sessions
  userSession: (token: string) => `session:${token}`,
} as const;

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const;