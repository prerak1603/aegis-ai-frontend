"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hasConsentDecision, setAnalyticsConsent } from "@/lib/analytics";

/**
 * Minimal accept/dismiss cookie banner — not a full CMP. Gates whether GA4
 * is mounted at all (see GoogleAnalyticsGate in layout.tsx): analytics
 * never fires until "Accept" is clicked, not just visually deferred.
 */
export default function CookieConsent({ onDecision }: { onDecision: (granted: boolean) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reads localStorage — must stay false during SSR/hydration to avoid a
    // mismatch, so this can't move to a lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!hasConsentDecision()) setVisible(true);
  }, []);

  function decide(granted: boolean) {
    setAnalyticsConsent(granted);
    onDecision(granted);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:left-auto z-[100] sm:max-w-sm rounded-xl border border-border-subtle bg-surface-raised px-5 py-4 shadow-lg"
          role="dialog"
          aria-label="Cookie consent"
        >
          <p className="text-sm text-text-muted leading-relaxed">
            We use privacy-friendly analytics to understand how the site is
            used. No data is sold or shared. Accept?
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => decide(true)}
              className="px-4 py-1.5 rounded-md bg-accent text-ink text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Accept
            </button>
            <button
              onClick={() => decide(false)}
              className="px-4 py-1.5 rounded-md border border-border-strong text-text-muted text-sm hover:text-text-primary transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
