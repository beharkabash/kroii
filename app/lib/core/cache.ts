/**
 * Cache Module
 * Simple in-memory caching utilities
 */

export interface CacheEntry<T> {
  value: T;
  expires: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

export class Cache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly defaultTTL = 1000 * 60 * 5; // 5 minutes
  private readonly maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || this.defaultTTL;
    this.maxSize = options.maxSize || 100;
  }

  set(key: string, value: T, ttl?: number): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expires });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  has(key: string): boolean {
    const value = this.get(key);
    return value !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const globalCache = new Cache();

// Memoization decorator
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options?: CacheOptions
): T {
  const cache = new Cache(options);

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached !== null) {
      return cached as ReturnType<T>;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export default Cache;