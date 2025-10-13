import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { RedisService } from '@/app/lib/redis';
import { APIMonitoring, HealthMonitoring } from '@/app/lib/middleware/monitoring';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface _HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    server: boolean;
    database: 'healthy' | 'unhealthy' | 'disabled';
    redis: 'healthy' | 'unhealthy' | 'disabled';
    memory: {
      status: boolean;
      used: number;
      total: number;
      percentage: number;
    };
  };
  errors?: string[];
}

export const GET = APIMonitoring.withMonitoring(
  async (_request: NextRequest) => {
    const startTime = Date.now();

    try {
      // Use the new comprehensive health monitoring
      const healthResult = await HealthMonitoring.performHealthCheck();

      // Check database connection
      let databaseStatus: 'healthy' | 'unhealthy' | 'disabled' = 'disabled';
      if (process.env.DATABASE_URL) {
        try {
          await prisma.$queryRaw`SELECT 1`;
          databaseStatus = 'healthy';
        } catch (_error) {
          databaseStatus = 'unhealthy';
          healthResult.checks.database = false;
        }
      }

      // Check Redis connection
      let redisStatus: 'healthy' | 'unhealthy' | 'disabled' = 'disabled';
      if (process.env.REDIS_URL) {
        try {
          const redis = RedisService.getInstance();
          await redis.exists('health_check_test');
          redisStatus = 'healthy';
        } catch (_error) {
          redisStatus = 'unhealthy';
          healthResult.checks.redis = false;
        }
      }

      // Get API performance metrics
      const apiMetrics = APIMonitoring.getAggregatedMetrics(300000); // 5 minutes

      const healthCheck = {
        status: healthResult.status,
        timestamp: healthResult.timestamp,
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks: {
          server: true,
          database: databaseStatus,
          redis: redisStatus,
          memory: healthResult.checks.memory,
          api: healthResult.checks.apiPerformance,
        },
        metrics: {
          memory: {
            used: healthResult.metrics.memoryUsedMB,
            percentage: healthResult.metrics.memoryUsagePercent,
          },
          api: apiMetrics ? {
            avgResponseTime: apiMetrics.avgDuration,
            errorRate: apiMetrics.errorRate,
            requestCount: apiMetrics.totalRequests,
          } : null,
          uptime: healthResult.metrics.uptimeSeconds,
        },
      };

      const responseTime = Date.now() - startTime;

      return NextResponse.json(healthCheck, {
        status: healthResult.status === 'healthy' ? 200 :
               healthResult.status === 'degraded' ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Response-Time': `${responseTime}ms`,
        },
      });
    } catch (error) {
      console.error('Health check failed:', error);

      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Health check failed',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 503 }
      );
    }
  },
  '/api/health'
);