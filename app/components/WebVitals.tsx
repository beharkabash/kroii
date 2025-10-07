'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics endpoint
    const body = JSON.stringify(metric);
    const url = '/api/vitals';

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true }).catch(console.error);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric.name, metric.value, metric.rating);
    }
  });

  return null;
}
