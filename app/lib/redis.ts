import { Redis } from 'ioredis';

class RedisService {
  private static instance: RedisService;
  private redis: Redis | null = null;

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async connect(): Promise<Redis | Pick<Redis, 'get' | 'set' | 'setex' | 'del' | 'exists' | 'expire' | 'flushall'>> {
    if (this.redis && this.redis.status === 'ready') {
      return this.redis;
    }

    try {
      const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;

      if (!redisUrl) {
        console.warn('Redis URL not found. Caching disabled.');
        return this.createMockRedis();
      }

      this.redis = new Redis(redisUrl, {
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        connectTimeout: 5000,
        commandTimeout: 5000,
      });

      this.redis.on('error', (error) => {
        console.error('Redis connection error:', error);
      });

      await this.redis.connect();
      console.log('Redis connected successfully');
      return this.redis;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      return this.createMockRedis();
    }
  }

  private createMockRedis(): Pick<Redis, 'get' | 'set' | 'setex' | 'del' | 'exists' | 'expire' | 'flushall'> {
    return {
      get: async () => null,
      set: async () => 'OK',
      setex: async () => 'OK',
      del: async () => 1,
      exists: async () => 0,
      expire: async () => 1,
      flushall: async () => 'OK',
    } as Pick<Redis, 'get' | 'set' | 'setex' | 'del' | 'exists' | 'expire' | 'flushall'>;
  }

  public async get(key: string): Promise<string | null> {
    try {
      const redis = await this.connect();
      return await redis.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  public async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    try {
      const redis = await this.connect();
      if (expireInSeconds) {
        await redis.setex(key, expireInSeconds, value);
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  public async del(key: string): Promise<void> {
    try {
      const redis = await this.connect();
      await redis.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const redis = await this.connect();
      return (await redis.exists(key)) === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  public async flushAll(): Promise<void> {
    try {
      const redis = await this.connect();
      await redis.flushall();
    } catch (error) {
      console.error('Redis flushAll error:', error);
    }
  }

  public disconnect(): void {
    if (this.redis) {
      this.redis.disconnect();
      this.redis = null;
    }
  }
}

export const redisService = RedisService.getInstance();
export { RedisService };

export const CACHE_KEYS = {
  CARS_FEATURED: 'cars:featured',
  CARS_ALL: 'cars:all',
  CARS_SEARCH: 'cars:search',
  CAR_DETAILS: (id: string) => `car:${id}`,
  TESTIMONIALS: 'testimonials',
  BLOG_POSTS: 'blog:posts',
  SITE_STATS: 'site:stats',
  FINANCING_RATES: 'financing:rates',
} as const;

export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  VERY_LONG: 3600, // 1 hour
  DAILY: 86400, // 24 hours
} as const;