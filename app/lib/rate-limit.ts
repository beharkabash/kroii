import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {};

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per window
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limiting implementation for API routes
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and headers info
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  }
): Promise<RateLimitResult> {
  // Get identifier (IP address or fallback)
  const identifier = getIdentifier(request);

  const now = Date.now();

  // Get or create rate limit entry
  let limitEntry = rateLimitStore[identifier];

  if (!limitEntry || limitEntry.resetTime < now) {
    // Create new entry or reset expired entry
    limitEntry = {
      count: 0,
      resetTime: now + config.interval,
    };
    rateLimitStore[identifier] = limitEntry;
  }

  // Increment request count
  limitEntry.count++;

  // Check if limit exceeded
  const success = limitEntry.count <= config.uniqueTokenPerInterval;
  const remaining = Math.max(0, config.uniqueTokenPerInterval - limitEntry.count);

  return {
    success,
    limit: config.uniqueTokenPerInterval,
    remaining,
    reset: limitEntry.resetTime,
  };
}

/**
 * Get unique identifier for rate limiting
 * Uses IP address with fallback to user agent
 */
function getIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (order matters for proxy setups)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  let ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';

  // Sanitize IP address
  ip = ip.trim();

  // If IP is still unknown, use a combination of user agent and accept-language as fallback
  if (ip === 'unknown') {
    const userAgent = request.headers.get('user-agent') || 'no-agent';
    const acceptLanguage = request.headers.get('accept-language') || 'no-lang';
    ip = `fallback-${Buffer.from(userAgent + acceptLanguage).toString('base64').substring(0, 32)}`;
  }

  return ip;
}

/**
 * Rate limit specifically for form submissions (stricter limits)
 */
export async function rateLimitForm(request: NextRequest): Promise<RateLimitResult> {
  return rateLimit(request, {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 3, // 3 submissions per minute
  });
}

/**
 * Rate limit for API endpoints (moderate limits)
 */
export async function rateLimitAPI(request: NextRequest): Promise<RateLimitResult> {
  return rateLimit(request, {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30, // 30 requests per minute
  });
}