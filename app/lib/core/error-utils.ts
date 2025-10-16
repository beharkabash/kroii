/**
 * Enhanced Error Handling Utilities
 * Provides consistent error handling and user feedback across the application
 */

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Error types and their user-friendly messages
 */
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Verkkovirhe. Tarkista internetyhteys.',
  TIMEOUT_ERROR: 'Pyyntö aikakatkaistiin. Yritä uudelleen.',
  SERVER_ERROR: 'Palvelinvirhe. Yritä hetken kuluttua.',

  // Authentication errors
  AUTH_REQUIRED: 'Kirjautuminen vaaditaan.',
  AUTH_FORBIDDEN: 'Ei käyttöoikeutta tähän toimintoon.',
  AUTH_INVALID: 'Kirjautumistiedot ovat virheelliset.',
  AUTH_EXPIRED: 'Istunto vanhentunut. Kirjaudu uudelleen sisään.',

  // Validation errors
  VALIDATION_ERROR: 'Tarkista syöttämäsi tiedot.',
  REQUIRED_FIELD: 'Pakollinen kenttä puuttuu.',
  INVALID_FORMAT: 'Virheellinen tietojen muoto.',
  EMAIL_EXISTS: 'Sähköpostiosoite on jo käytössä.',

  // Database errors
  DATABASE_ERROR: 'Tietokantavirhe. Yritä uudelleen.',
  RECORD_NOT_FOUND: 'Tietuetta ei löytynyt.',
  FOREIGN_KEY_ERROR: 'Liittyvä tieto puuttuu.',

  // File operations
  FILE_TOO_LARGE: 'Tiedosto on liian suuri.',
  FILE_TYPE_ERROR: 'Virheellinen tiedostotyyppi.',
  UPLOAD_ERROR: 'Virhe lataaessa tiedostoa.',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Liian monta pyyntöä. Odota hetki.',

  // Car-specific errors
  CAR_NOT_FOUND: 'Autoa ei löytynyt.',
  CAR_ALREADY_SOLD: 'Auto on jo myyty.',

  // Lead-specific errors
  LEAD_NOT_FOUND: 'Liidiä ei löytynyt.',
  LEAD_ALREADY_ASSIGNED: 'Liidi on jo osoitettu toiselle.',

  // Generic
  GENERIC_ERROR: 'Tapahtui odottamaton virhe.',
  UNKNOWN_ERROR: 'Tuntematon virhe.',
} as const;

/**
 * Create standardized error object
 */
export function createAppError(
  code: keyof typeof ERROR_MESSAGES,
  message?: string,
  details?: Record<string, unknown>
): AppError {
  return {
    code,
    message: message || code,
    userMessage: ERROR_MESSAGES[code],
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): AppError {
  // Network error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createAppError('NETWORK_ERROR', error.message);
  }

  // API response error
  if (error instanceof Response) {
    switch (error.status) {
      case 401:
        return createAppError('AUTH_REQUIRED');
      case 403:
        return createAppError('AUTH_FORBIDDEN');
      case 404:
        return createAppError('RECORD_NOT_FOUND');
      case 429:
        return createAppError('RATE_LIMIT_EXCEEDED');
      case 500:
      case 502:
      case 503:
        return createAppError('SERVER_ERROR');
      default:
        return createAppError('GENERIC_ERROR', `HTTP ${error.status}`);
    }
  }

  // JavaScript Error
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('Failed to fetch')) {
      return createAppError('NETWORK_ERROR', error.message);
    }

    if (error.message.includes('timeout')) {
      return createAppError('TIMEOUT_ERROR', error.message);
    }

    if (error.message.includes('validation')) {
      return createAppError('VALIDATION_ERROR', error.message);
    }

    return createAppError('GENERIC_ERROR', error.message);
  }

  // Unknown error
  return createAppError('UNKNOWN_ERROR', String(error));
}

/**
 * Standardized API error handler for fetch requests
 */
export async function handleFetchError(response: Response): Promise<never> {
  let errorData: { error?: string; message?: string; [key: string]: unknown };

  try {
    errorData = await response.json();
  } catch {
    // If response isn't JSON, use status text
    errorData = { error: response.statusText || 'Unknown error' };
  }

  const appError = createAppError(
    response.status === 401 ? 'AUTH_REQUIRED' :
    response.status === 403 ? 'AUTH_FORBIDDEN' :
    response.status === 404 ? 'RECORD_NOT_FOUND' :
    response.status === 429 ? 'RATE_LIMIT_EXCEEDED' :
    response.status >= 500 ? 'SERVER_ERROR' :
    'GENERIC_ERROR',
    errorData.error || errorData.message,
    {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      ...errorData,
    }
  );

  throw appError;
}

/**
 * Enhanced fetch wrapper with automatic error handling
 */
export async function fetchWithErrorHandling(
  url: string,
  options: RequestInit = {}
): Promise<unknown> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      await handleFetchError(response);
    }

    return await response.json();
  } catch (error) {
    // Re-throw AppErrors as-is
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }

    // Convert other errors to AppErrors
    throw handleApiError(error);
  }
}

/**
 * Show user-friendly error message
 */
export function showErrorMessage(error: AppError | Error | string): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'userMessage' in error) {
    return (error as AppError).userMessage;
  }

  if (error instanceof Error) {
    // Check for common error patterns and provide better messages
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    if (error.message.includes('timeout')) {
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    }

    // Return the error message if it's user-friendly, otherwise generic message
    const message = error.message;
    if (message.length < 100 && !message.includes('stack') && !message.includes('function')) {
      return message;
    }

    return ERROR_MESSAGES.GENERIC_ERROR;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Log error for monitoring/debugging
 */
export function logError(error: AppError | Error, context?: string): void {
  const logData = {
    timestamp: new Date().toISOString(),
    context: context || 'unknown',
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Log]', logData);
  } else {
    // In production, send to monitoring service
    console.error('[Production Error]', {
      ...logData,
      stack: undefined, // Don't log stack in production console
    });

    // TODO: Send to Sentry, LogRocket, or other monitoring service
    // Example: Sentry.captureException(error, { extra: logData });
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
  backoffFactor = 2
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries - 1) {
        break; // Last attempt failed, exit loop
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(backoffFactor, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));

      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
    }
  }

  throw lastError!;
}

/**
 * Validate required environment variables
 */
export function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw createAppError(
      'GENERIC_ERROR',
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Safe JSON parsing with error handling
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logError(error instanceof Error ? error : new Error('JSON parse failed'), 'safeJsonParse');
    return defaultValue;
  }
}