import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Environment configuration
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  // Adjust this value in production
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Edge runtime configuration
  beforeSend(event) {
    // Filter out low-priority errors
    if (event.level === 'info' || event.level === 'debug') {
      return null;
    }

    return event;
  },
});