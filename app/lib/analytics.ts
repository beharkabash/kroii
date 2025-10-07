/**
 * Google Analytics 4 Event Tracking Utilities
 * Provides type-safe event tracking for key user interactions
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export interface CarViewEvent {
  car_id: string;
  car_name: string;
  car_price: string;
  car_year?: string;
  car_brand?: string;
}

export interface ContactEvent {
  method: 'form' | 'phone' | 'email' | 'whatsapp';
  car_interest?: string;
  lead_score?: number;
  [key: string]: unknown;
}

export interface ConversionEvent {
  value?: number;
  currency?: string;
  transaction_id?: string;
}

/**
 * Track page view (called automatically by Analytics component)
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: document.title,
    page_location: window.location.href,
  });

  console.log('[Analytics] Page view:', url);
}

/**
 * Track car listing view
 */
export function trackCarView(data: CarViewEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_item', {
    items: [
      {
        item_id: data.car_id,
        item_name: data.car_name,
        price: parsePrice(data.car_price),
        item_category: 'Car',
        item_brand: data.car_brand || 'Unknown',
        item_variant: data.car_year || 'Unknown',
      },
    ],
  });

  // Custom event for internal tracking
  window.gtag('event', 'car_view', {
    car_id: data.car_id,
    car_name: data.car_name,
    car_price: data.car_price,
    car_year: data.car_year,
    car_brand: data.car_brand,
  });

  console.log('[Analytics] Car view:', data.car_name);
}

/**
 * Track contact form submission
 */
export function trackContactForm(data?: { car_interest?: string; lead_score?: number }) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const eventData: ContactEvent = {
    method: 'form',
    car_interest: data?.car_interest,
    lead_score: data?.lead_score,
  };

  // Standard GA4 event
  window.gtag('event', 'generate_lead', {
    value: data?.lead_score || 50,
    currency: 'EUR',
  });

  // Custom event with additional data
  window.gtag('event', 'contact_form_submit', eventData);

  console.log('[Analytics] Contact form submission:', eventData);
}

/**
 * Track WhatsApp button click
 */
export function trackWhatsAppClick(carName?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const eventData: ContactEvent = {
    method: 'whatsapp',
    car_interest: carName,
  };

  // Standard GA4 event
  window.gtag('event', 'generate_lead', {
    value: 40,
    currency: 'EUR',
    method: eventData.method,
    car_interest: eventData.car_interest,
  });

  // Custom event
  window.gtag('event', 'whatsapp_click', {
    car_interest: carName || 'general',
  });

  console.log('[Analytics] WhatsApp click:', carName || 'general inquiry');
}

/**
 * Track phone call click
 */
export function trackPhoneClick() {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'generate_lead', {
    value: 60,
    currency: 'EUR',
  });

  window.gtag('event', 'phone_click', {
    method: 'phone',
  });

  console.log('[Analytics] Phone click');
}

/**
 * Track email click
 */
export function trackEmailClick() {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'generate_lead', {
    value: 30,
    currency: 'EUR',
  });

  window.gtag('event', 'email_click', {
    method: 'email',
  });

  console.log('[Analytics] Email click');
}

/**
 * Track social media link click
 */
export function trackSocialClick(platform: 'facebook' | 'instagram') {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'social_click', {
    platform,
  });

  console.log('[Analytics] Social click:', platform);
}

/**
 * Track outbound link clicks
 */
export function trackOutboundLink(url: string, label?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'click', {
    event_category: 'outbound',
    event_label: label || url,
    transport_type: 'beacon',
    value: url,
  });

  console.log('[Analytics] Outbound link:', url);
}

/**
 * Track search (if search functionality is added)
 */
export function trackSearch(searchTerm: string, results?: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results: results,
  });

  console.log('[Analytics] Search:', searchTerm, `(${results} results)`);
}

/**
 * Track newsletter subscription
 */
export function trackNewsletterSignup() {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'sign_up', {
    method: 'newsletter',
  });

  window.gtag('event', 'newsletter_signup', {});

  console.log('[Analytics] Newsletter signup');
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Only track at 25%, 50%, 75%, 100%
  if (![25, 50, 75, 100].includes(percentage)) return;

  window.gtag('event', 'scroll', {
    percent_scrolled: percentage,
  });

  console.log('[Analytics] Scroll depth:', `${percentage}%`);
}

/**
 * Track time on page (call when user leaves or after certain duration)
 */
export function trackTimeOnPage(seconds: number, page?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'user_engagement', {
    engagement_time_msec: seconds * 1000,
    page_path: page || window.location.pathname,
  });

  console.log('[Analytics] Time on page:', `${seconds}s`);
}

/**
 * Track custom conversion event
 */
export function trackConversion(eventName: string, data?: ConversionEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    value: data?.value || 0,
    currency: data?.currency || 'EUR',
    transaction_id: data?.transaction_id,
  });

  console.log('[Analytics] Conversion:', eventName, data);
}

/**
 * Helper: Parse price string to number
 */
function parsePrice(price: string): number {
  const cleaned = price.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Set user properties (for segmentation)
 */
export function setUserProperties(properties: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);

  console.log('[Analytics] User properties set:', properties);
}

/**
 * Track exceptions/errors
 */
export function trackException(description: string, fatal = false) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description,
    fatal,
  });

  console.error('[Analytics] Exception tracked:', description);
}