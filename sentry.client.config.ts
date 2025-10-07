import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment configuration
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"),

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Performance Monitoring
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filter out noise
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "atomicFindClose",
    // Network errors
    "NetworkError",
    "Network request failed",
    "Failed to fetch",
    // Browser-specific errors
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],

  beforeSend(event, hint) {
    // Filter out localhost errors in development
    if (process.env.NODE_ENV === "development") {
      return null;
    }

    // Don't send errors from bots
    if (
      navigator.userAgent &&
      /bot|crawler|spider/i.test(navigator.userAgent)
    ) {
      return null;
    }

    return event;
  },

  // Set user context
  beforeSendTransaction(event) {
    // Remove sensitive data from URLs
    if (event.request?.url) {
      event.request.url = event.request.url.replace(
        /([?&])(email|token|password)=[^&]*/gi,
        "$1$2=REDACTED"
      );
    }
    return event;
  },
});
