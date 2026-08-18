"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { trackEvent } from "@/lib/analytics";

const FIRED_KEY = "aegis-signup-tracked";

/**
 * Fires the signup_completed GA4 event once, the moment Clerk's embedded
 * <SignUp> flow transitions this session to signed-in. The App Router
 * path-routing <SignUp> component doesn't expose a direct "success"
 * callback, so this watches useUser() instead — deduped via
 * sessionStorage so a page refresh post-signup doesn't refire it.
 */
export default function SignupTracker() {
  const { isSignedIn, isLoaded } = useUser();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || firedRef.current) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(FIRED_KEY)) return;

    window.sessionStorage.setItem(FIRED_KEY, "1");
    firedRef.current = true;
    trackEvent("signup_completed");
  }, [isLoaded, isSignedIn]);

  return null;
}
