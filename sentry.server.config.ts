import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Environment configuration
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),

  // Performance Monitoring
  integrations: [
    Sentry.prismaIntegration(),
  ],

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Server-specific configuration
  beforeSend(event, hint) {
    // Filter out low-priority errors
    if (event.level === 'info' || event.level === 'debug') {
      return null;
    }

    // Scrub sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }

    return event;
  },

  // Set context for server errors
  beforeSendTransaction(event) {
    // Add custom tags
    event.tags = {
      ...event.tags,
      runtime: 'node',
    };
    return event;
  },
});