import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: unknown;
  userId?: string;
  email?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(this.sanitizeContext(context)) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
  }

  private sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context };

    // Remove sensitive information
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];

    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage(LogLevel.INFO, message, context));

    if (!this.isDevelopment && context) {
      Sentry.addBreadcrumb({
        level: 'info',
        message,
        data: this.sanitizeContext(context),
      });
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));

    Sentry.captureMessage(message, {
      level: 'warning',
      contexts: {
        custom: this.sanitizeContext(context || {}),
      },
    });
  }

  error(message: string, error?: Error, context?: LogContext): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, context));

    if (error) {
      console.error(error);

      Sentry.captureException(error, {
        contexts: {
          custom: this.sanitizeContext(context || {}),
        },
        tags: {
          errorType: error.name,
        },
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        contexts: {
          custom: this.sanitizeContext(context || {}),
        },
      });
    }
  }

  // HTTP request logging
  logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    const logContext: LogContext = {
      method,
      path,
      statusCode,
      duration,
      ...context,
    };

    if (statusCode >= 500) {
      this.error(`HTTP ${statusCode} ${method} ${path}`, undefined, logContext);
    } else if (statusCode >= 400) {
      this.warn(`HTTP ${statusCode} ${method} ${path}`, logContext);
    } else {
      this.info(`HTTP ${statusCode} ${method} ${path}`, logContext);
    }
  }

  // Performance monitoring
  logPerformance(operation: string, duration: number, context?: LogContext): void {
    const logContext: LogContext = {
      operation,
      duration,
      ...context,
    };

    if (duration > 3000) {
      this.warn(`Slow operation: ${operation} took ${duration}ms`, logContext);
    } else {
      this.info(`Operation: ${operation} took ${duration}ms`, logContext);
    }
  }
}

export const logger = new Logger();