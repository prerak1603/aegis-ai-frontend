"use client";

// Thin wrapper around gtag so call sites don't need to know about consent
// state or the global window typing. Every event is a no-op until the
// user has accepted the cookie-consent banner (see CookieConsent.tsx) —
// analytics never fires silently before consent.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "aegis-analytics-consent";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "granted";
}

export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
}

export function hasConsentDecision(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) !== null;
}

/** Fire a GA4 custom event. Silently no-ops if consent hasn't been granted
 * or the gtag script hasn't loaded yet. */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
