/**
 * Analytics abstraction.
 *
 * No analytics platform is installed. `trackEvent` forwards to Google
 * Analytics (gtag) or Google Tag Manager (dataLayer) if either is added
 * to the page later, and logs to the console during development.
 */

export type AnalyticsEvent =
  | "whatsapp_click"
  | "call_click"
  | "directions_click"
  | "appointment_started"
  | "appointment_submitted"
  | "appointment_validation_failed"
  | "google_reviews_click"
  | "instagram_click"
  | "facebook_click"
  | "service_enquiry"
  | "gallery_open";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
    }
    if (process.env.NODE_ENV === "development") {
      console.info(`[analytics] ${event}`, params);
    }
  } catch {
    // Analytics must never break the page.
  }
}
