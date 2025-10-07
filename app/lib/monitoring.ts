import * as Sentry from '@sentry/nextjs';
import { logger } from './logger';

export interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
}

// Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export function reportWebVitals(metric: PerformanceMetrics): void {
  const { name, value, id, delta, navigationType } = metric;

  // Calculate rating
  const rating = getRating(name, value);

  // Log metrics
  logger.info(`Web Vital: ${name}`, {
    metric: name,
    value,
    rating,
    delta,
    id,
    navigationType,
  });

  // Send to Sentry
  if (rating === 'poor' || rating === 'needs-improvement') {
    Sentry.captureMessage(`Poor Web Vital: ${name}`, {
      level: rating === 'poor' ? 'warning' : 'info',
      tags: {
        webVital: name,
        rating,
      },
      contexts: {
        performance: {
          metric: name,
          value,
          rating,
          delta,
          navigationType,
        },
      },
    });
  }

  // Send to analytics endpoint
  if (typeof window !== 'undefined' && navigator.sendBeacon) {
    const body = JSON.stringify({
      name,
      value,
      rating,
      delta,
      id,
      navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    navigator.sendBeacon('/api/vitals', body);
  }
}

export function trackCustomMetric(name: string, value: number, unit: string = 'ms'): void {
  logger.info(`Custom Metric: ${name}`, {
    metric: name,
    value,
    unit,
  });

  Sentry.addBreadcrumb({
    category: 'metric',
    message: `${name}: ${value}${unit}`,
    level: 'info',
    data: {
      metric: name,
      value,
      unit,
    },
  });
}

export function startTransaction(name: string, operation: string) {
  // Simplified monitoring without complex Sentry APIs
  const startTime = Date.now();

  return {
    transaction: { name, operation, startTime },
    finish: () => {
      const duration = Date.now() - startTime;
      trackCustomMetric(`${name}_duration`, duration);
      logger.logPerformance(name, duration);
    },
    setStatus: (status: string) => {
      logger.info(`Transaction ${name} status: ${status}`);
    },
    setData: (key: string, value: unknown) => {
      logger.debug(`Transaction ${name} data: ${key}=${value}`);
    },
  };
}

export function measureAsync<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  return operation()
    .then((result) => {
      const duration = performance.now() - startTime;
      trackCustomMetric(name, duration);
      logger.logPerformance(name, duration);
      return result;
    })
    .catch((error) => {
      const duration = performance.now() - startTime;
      logger.error(`${name} failed after ${duration}ms`, error);
      throw error;
    });
}

export function captureError(error: Error, context?: Record<string, unknown>): void {
  logger.error(error.message, error, context);

  Sentry.captureException(error, {
    contexts: {
      custom: context || {},
    },
  });
}

export function setUser(userId: string, email?: string, username?: string): void {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });

  logger.info('User context set', { userId, email, username });
}

export function clearUser(): void {
  Sentry.setUser(null);
  logger.info('User context cleared');
}