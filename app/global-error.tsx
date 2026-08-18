"use client";

import { useEffect } from "react";
import "./globals.css";

// Root-level fallback — only fires if the root layout itself throws
// (rare). Must render its own <html>/<body> and can't depend on anything
// the layout provides (ClerkProvider, Nav, fonts import order, etc.),
// since the layout is exactly what failed.
export default function GlobalError({
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
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex items-center justify-center px-6"
        style={{ backgroundColor: "#0a0d13", color: "#e8eaf1" }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p style={{ color: "#e8453b", fontSize: 14, marginBottom: 16 }}>
            Critical error
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>
            Aegis AI hit a problem loading
          </h1>
          <p style={{ color: "#8891a3", marginBottom: 32, lineHeight: 1.6 }}>
            Something went wrong at the application level. Reloading usually
            fixes it.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              backgroundColor: "#7c8cf8",
              color: "#0a0d13",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
