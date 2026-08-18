"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import CookieConsent from "@/components/CookieConsent";
import { hasAnalyticsConsent } from "@/lib/analytics";

/**
 * Consent-gated GA4 mount. The GoogleAnalytics script tag is not rendered
 * at all until the user has accepted the cookie banner (or had previously
 * accepted it in an earlier visit) — default-deny, not just deferred.
 *
 * Measurement ID is read from NEXT_PUBLIC_GA_ID (see .env.local.example).
 * Set it in Vercel under Settings -> Environment Variables.
 */
export default function AnalyticsGate() {
  const [granted, setGranted] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // Reads localStorage, which must stay unavailable during SSR/hydration
    // to avoid a mismatch — this one extra render after mount is the
    // deliberate tradeoff, not an oversight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGranted(hasAnalyticsConsent());
  }, []);

  return (
    <>
      {granted && gaId && <GoogleAnalytics gaId={gaId} />}
      <CookieConsent onDecision={setGranted} />
    </>
  );
}
