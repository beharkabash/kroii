import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    server: boolean;
    memory: {
      status: boolean;
      used: number;
      total: number;
      percentage: number;
    };
  };
}

export async function GET() {
  const startTime = Date.now();

  try {
    // Memory check
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    // Determine health status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (memoryPercentage > 90) {
      status = 'unhealthy';
    } else if (memoryPercentage > 75) {
      status = 'degraded';
    }

    const healthCheck: HealthCheck = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        server: true,
        memory: {
          status: memoryPercentage < 90,
          used: Math.round(usedMemory / 1024 / 1024), // MB
          total: Math.round(totalMemory / 1024 / 1024), // MB
          percentage: Math.round(memoryPercentage),
        },
      },
    };

    const responseTime = Date.now() - startTime;

    return NextResponse.json(healthCheck, {
      status: status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503,
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
      },
      { status: 503 }
    );
  }
}