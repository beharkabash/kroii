/**
 * Secure Error Handling Utilities
 * Provides safe error handling that doesn't leak sensitive information
 */

export interface ErrorDetails {
  message: string;
  code?: string;
  statusCode: number;
  timestamp: string;
  requestId?: string;
}

export interface SecurityEvent {
  type: 'rate_limit' | 'malicious_input' | 'auth_failure' | 'validation_error' | 'server_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userAgent: string;
  endpoint: string;
  details: Record<string, unknown>;
  timestamp: string;
}

/**
 * Log security events for monitoring and analysis
 * In production, send to security monitoring service (e.g., Sentry, DataDog)
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const logLevel = event.severity === 'critical' || event.severity === 'high' ? 'error' : 'warn';

  console[logLevel]('[SECURITY EVENT]', {
    ...event,
    // Sanitize IP (only log first 3 octets)
    ip: sanitizeIPForLogging(event.ip),
  });

  // TODO: Send to monitoring service in production
  /*
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.captureMessage(`Security Event: ${event.type}`, {
      level: logLevel === 'error' ? 'error' : 'warning',
      extra: event,
    });
  }
  */
}

/**
 * Sanitize IP address for logging (privacy-preserving)
 */
function sanitizeIPForLogging(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown';

  // For IPv4, only log first 3 octets
  const ipv4Match = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (ipv4Match) {
    return `${ipv4Match[1]}.xxx`;
  }

  // For IPv6, only log first 4 groups
  const ipv6Match = ip.match(/^([0-9a-f:]+):([0-9a-f]+):([0-9a-f]+):([0-9a-f]+):/i);
  if (ipv6Match) {
    return `${ipv6Match[1]}:${ipv6Match[2]}:${ipv6Match[3]}:${ipv6Match[4]}:xxxx`;
  }

  // Unknown format, hash it
  return 'redacted';
}

/**
 * Create user-friendly error message
 * Never exposes internal error details to users
 */
export function getUserFriendlyError(error: unknown, defaultMessage: string): ErrorDetails {
  const timestamp = new Date().toISOString();

  // Known error types with safe messages
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      timestamp,
    };
  }

  if (error instanceof RateLimitError) {
    return {
      message: 'Liian monta yritystä. Yritä hetken kuluttua uudelleen.',
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
      timestamp,
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      message: 'Käyttöoikeus evätty.',
      code: 'UNAUTHORIZED',
      statusCode: 401,
      timestamp,
    };
  }

  // Log actual error for debugging (server-side only)
  console.error('[ERROR]', {
    timestamp,
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Return generic error message to user
  return {
    message: defaultMessage || 'Tapahtui virhe. Yritä myöhemmin uudelleen.',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    timestamp,
  };
}

/**
 * Custom Error Classes
 */

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Safe error logging (doesn't expose sensitive data)
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    message: error instanceof Error ? error.message : 'Unknown error',
    name: error instanceof Error ? error.name : 'Error',
    context: context ? sanitizeContext(context) : undefined,
    // Only log stack in development
    ...(process.env.NODE_ENV === 'development' && error instanceof Error
      ? { stack: error.stack }
      : {}),
  };

  console.error('[ERROR]', errorInfo);
}

/**
 * Sanitize context object to remove sensitive data before logging
 */
function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'cookie',
    'session',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();

    // Redact sensitive keys
    if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
      continue;
    }

    // Sanitize nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>);
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

/**
 * Assert condition and throw ValidationError if false
 */
export function assert(condition: boolean, message: string, field?: string): asserts condition {
  if (!condition) {
    throw new ValidationError(message, field);
  }
}

/**
 * Try-catch wrapper with error handling
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error, { operation: errorMessage });
    throw getUserFriendlyError(error, errorMessage);
  }
}