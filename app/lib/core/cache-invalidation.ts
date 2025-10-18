/**
 * Cache Invalidation Module
 * Utilities for managing cache invalidation strategies
 */

import { globalCache } from './cache';

export type InvalidationStrategy = 'all' | 'pattern' | 'tag';

export interface InvalidationOptions {
  strategy?: InvalidationStrategy;
  pattern?: string | RegExp;
  tags?: string[];
}

class CacheInvalidator {
  private tagMap = new Map<string, Set<string>>();

  /**
   * Associate a cache key with tags
   */
  addTags(key: string, tags: string[]): void {
    tags.forEach(tag => {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)?.add(key);
    });
  }

  /**
   * Remove tags for a cache key
   */
  removeTags(key: string): void {
    this.tagMap.forEach(keys => {
      keys.delete(key);
    });
  }

  /**
   * Invalidate cache based on strategy
   */
  invalidate(options: InvalidationOptions = {}): number {
    const { strategy = 'all', pattern, tags } = options;
    let invalidatedCount = 0;

    switch (strategy) {
      case 'all':
        const size = globalCache.size();
        globalCache.clear();
        this.tagMap.clear();
        invalidatedCount = size;
        break;

      case 'pattern':
        if (pattern) {
          // Note: This would need access to cache keys, which our simple cache doesn't expose
          // In a real implementation, we'd iterate through keys and delete matching ones
          console.warn('Pattern-based invalidation not fully implemented');
        }
        break;

      case 'tag':
        if (tags) {
          tags.forEach(tag => {
            const keys = this.tagMap.get(tag);
            if (keys) {
              keys.forEach(key => {
                if (globalCache.delete(key)) {
                  invalidatedCount++;
                }
              });
              this.tagMap.delete(tag);
            }
          });
        }
        break;
    }

    return invalidatedCount;
  }

  /**
   * Schedule periodic cache cleanup
   */
  scheduleCleanup(intervalMs: number = 60000): NodeJS.Timeout {
    return setInterval(() => {
      globalCache.cleanup();
    }, intervalMs);
  }
}

export const cacheInvalidator = new CacheInvalidator();

/**
 * Decorator for automatic cache invalidation
 */
export function invalidateCache(options: InvalidationOptions) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const result = await originalMethod.apply(this, args);
      cacheInvalidator.invalidate(options);
      return result;
    };

    return descriptor;
  };
}

export default cacheInvalidator;