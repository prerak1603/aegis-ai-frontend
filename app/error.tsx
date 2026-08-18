"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";
import Nav from "@/components/Nav";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-severity-high mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-3xl font-semibold tracking-tight mb-4">Something went wrong</h1>
          <p className="text-text-muted leading-relaxed mb-10">
            An unexpected error occurred. Try again, or head back to the
            homepage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-strong text-text-primary hover:border-accent transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to homepage
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
