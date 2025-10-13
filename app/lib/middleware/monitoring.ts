import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { logger } from '../logger';

interface PerformanceMetrics {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  userAgent?: string;
  ip?: string;
  timestamp: string;
}

export class APIMonitoring {
  private static performanceData: PerformanceMetrics[] = [];
  private static readonly MAX_STORED_METRICS = 1000;

  static withMonitoring<T>(
    handler: (request: NextRequest) => Promise<NextResponse>,
    routeName: string
  ) {
    return async (request: NextRequest): Promise<NextResponse> => {
      const startTime = Date.now();
      const timestamp = new Date().toISOString();

      // Start Sentry transaction
      return await Sentry.startSpan(
        {
          name: `${request.method} ${routeName}`,
          op: 'http.server',
          attributes: {
            'http.method': request.method,
            'http.route': routeName,
            'http.url': request.url,
          },
        },
        async (span) => {
          let response: NextResponse;
          let error: Error | null = null;

          try {
            // Add request context to Sentry
            Sentry.setTag('api.route', routeName);
            Sentry.setTag('http.method', request.method);

            // Execute the handler
            response = await handler(request);

            // Set response status on span
            span?.setAttributes({
              'http.status_code': response.status,
            });

            return response;
          } catch (err) {
            error = err instanceof Error ? err : new Error('Unknown error');

            // Set error status on span
            span?.setAttributes({
              'http.status_code': 500,
              error: true,
            });

            // Capture error in Sentry
            Sentry.captureException(error, {
              tags: {
                api_route: routeName,
                http_method: request.method,
              },
              extra: {
                url: request.url,
                headers: Object.fromEntries(request.headers.entries()),
              },
            });

            // Return error response
            response = NextResponse.json(
              { error: 'Internal Server Error' },
              { status: 500 }
            );

            return response;
          } finally {
            const duration = Date.now() - startTime;

            // Log performance metrics
            const metrics: PerformanceMetrics = {
              method: request.method,
              path: routeName,
              statusCode: response!.status,
              duration,
              userAgent: request.headers.get('user-agent') || undefined,
              ip: this.getClientIP(request),
              timestamp,
            };

            this.storeMetrics(metrics);

            // Log to our logger
            logger.logRequest(
              request.method,
              routeName,
              response!.status,
              duration,
              {
                userAgent: metrics.userAgent,
                ip: metrics.ip,
                error: error?.message,
              }
            );

            // Add breadcrumb for performance tracking
            Sentry.addBreadcrumb({
              category: 'api',
              message: `${request.method} ${routeName}`,
              level: response!.status >= 400 ? 'warning' : 'info',
              data: {
                status: response!.status,
                duration: `${duration}ms`,
                method: request.method,
                path: routeName,
              },
            });

            // Warn about slow requests
            if (duration > 5000) {
              Sentry.captureMessage(
                `Slow API request: ${request.method} ${routeName} took ${duration}ms`,
                'warning'
              );
            }
          }
        }
      );
    };
  }

  private static getClientIP(request: NextRequest): string | undefined {
    // Try various headers for client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    return (
      request.headers.get('x-real-ip') ||
      request.headers.get('x-client-ip') ||
      request.headers.get('cf-connecting-ip') ||
      undefined
    );
  }

  private static storeMetrics(metrics: PerformanceMetrics): void {
    this.performanceData.push(metrics);

    // Keep only the latest metrics
    if (this.performanceData.length > this.MAX_STORED_METRICS) {
      this.performanceData = this.performanceData.slice(-this.MAX_STORED_METRICS);
    }
  }

  static getMetrics(timeRange?: number): PerformanceMetrics[] {
    if (!timeRange) {
      return [...this.performanceData];
    }

    const cutoff = Date.now() - timeRange;
    return this.performanceData.filter(
      metric => new Date(metric.timestamp).getTime() > cutoff
    );
  }

  static getAggregatedMetrics(timeRange: number = 3600000) { // 1 hour default
    const metrics = this.getMetrics(timeRange);

    if (metrics.length === 0) {
      return null;
    }

    const totalRequests = metrics.length;
    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
    const maxDuration = Math.max(...metrics.map(m => m.duration));
    const minDuration = Math.min(...metrics.map(m => m.duration));

    const statusCodes = metrics.reduce((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const errorRate = (statusCodes[500] || 0) / totalRequests;
    const successRate = Object.entries(statusCodes)
      .filter(([code]) => parseInt(code) < 400)
      .reduce((sum, [, count]) => sum + count, 0) / totalRequests;

    const routes = metrics.reduce((acc, m) => {
      const key = `${m.method} ${m.path}`;
      if (!acc[key]) {
        acc[key] = { count: 0, avgDuration: 0, errors: 0 };
      }
      acc[key].count++;
      acc[key].avgDuration = (acc[key].avgDuration + m.duration) / acc[key].count;
      if (m.statusCode >= 400) {
        acc[key].errors++;
      }
      return acc;
    }, {} as Record<string, { count: number; avgDuration: number; errors: number }>);

    return {
      timeRange,
      totalRequests,
      avgDuration: Math.round(avgDuration),
      maxDuration,
      minDuration,
      errorRate: Math.round(errorRate * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      statusCodes,
      routes,
      timestamp: new Date().toISOString(),
    };
  }

  static clearMetrics(): void {
    this.performanceData = [];
  }
}

// Request rate limiting and monitoring
export class RateLimitMonitoring {
  private static requests = new Map<string, number[]>();
  private static readonly WINDOW_SIZE = 60000; // 1 minute
  private static readonly MAX_REQUESTS = 100; // Per minute per IP

  static checkRateLimit(request: NextRequest): boolean {
    const ip = APIMonitoring['getClientIP'](request) || 'unknown';
    const now = Date.now();

    // Get existing requests for this IP
    const ipRequests = this.requests.get(ip) || [];

    // Remove old requests outside the window
    const validRequests = ipRequests.filter(
      timestamp => now - timestamp < this.WINDOW_SIZE
    );

    // Check if limit exceeded
    if (validRequests.length >= this.MAX_REQUESTS) {
      // Log rate limit violation
      Sentry.captureMessage(
        `Rate limit exceeded for IP: ${ip}`,
        {
          level: 'warning',
          tags: {
            ip,
            requests_count: validRequests.length,
            limit: this.MAX_REQUESTS,
          },
        }
      );

      logger.warn('Rate limit exceeded', {
        ip,
        requestCount: validRequests.length,
        limit: this.MAX_REQUESTS,
      });

      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(ip, validRequests);

    return true;
  }

  static getRateLimitStats(): Record<string, number> {
    const now = Date.now();
    const stats: Record<string, number> = {};

    for (const [ip, requests] of this.requests.entries()) {
      const validRequests = requests.filter(
        timestamp => now - timestamp < this.WINDOW_SIZE
      );
      if (validRequests.length > 0) {
        stats[ip] = validRequests.length;
      }
    }

    return stats;
  }
}

// Health check utilities
export class HealthMonitoring {
  static async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    metrics: Record<string, number>;
    timestamp: string;
  }> {
    const checks: Record<string, boolean> = {};
    const metrics: Record<string, number> = {};
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      // Memory usage check
      const memoryUsage = process.memoryUsage();
      const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      checks.memory = memoryUsagePercent < 90;
      metrics.memoryUsagePercent = Math.round(memoryUsagePercent);
      metrics.memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);

      if (memoryUsagePercent > 90) {
        status = 'unhealthy';
      } else if (memoryUsagePercent > 75) {
        status = 'degraded';
      }

      // API performance check
      const recentMetrics = APIMonitoring.getAggregatedMetrics(300000); // 5 minutes
      if (recentMetrics) {
        checks.apiPerformance = recentMetrics.avgDuration < 5000;
        checks.apiErrors = recentMetrics.errorRate < 0.1;

        metrics.avgResponseTime = recentMetrics.avgDuration;
        metrics.errorRate = recentMetrics.errorRate;
        metrics.requestCount = recentMetrics.totalRequests;

        if (recentMetrics.avgDuration > 5000 || recentMetrics.errorRate > 0.1) {
          status = status === 'healthy' ? 'degraded' : status;
        }
      } else {
        checks.apiPerformance = true;
        checks.apiErrors = true;
      }

      // Uptime check
      metrics.uptimeSeconds = Math.floor(process.uptime());
      checks.uptime = metrics.uptimeSeconds > 60; // At least 1 minute uptime

    } catch (error) {
      console.error('Health check failed:', error);
      status = 'unhealthy';
      checks.healthCheck = false;
    }

    const result = {
      status,
      checks,
      metrics,
      timestamp: new Date().toISOString(),
    };

    // Report unhealthy status to Sentry
    if (status === 'unhealthy') {
      Sentry.captureMessage('System health check failed', {
        level: 'error',
        extra: result,
      });
    } else if (status === 'degraded') {
      Sentry.captureMessage('System health degraded', {
        level: 'warning',
        extra: result,
      });
    }

    return result;
  }
}

export default {
  APIMonitoring,
  RateLimitMonitoring,
  HealthMonitoring,
};