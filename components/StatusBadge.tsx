"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 45_000;

type Status = "checking" | "healthy" | "unhealthy";

/** Small pulsing-dot status indicator for the header. Polls the existing
 * /api/health route (same one /audit already uses) on mount and on an
 * interval — no new backend surface. */
export default function StatusBadge() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setStatus(data.status === "healthy" ? "healthy" : "unhealthy");
      } catch {
        if (!cancelled) setStatus("unhealthy");
      }
    }

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const isHealthy = status === "healthy";
  const label = status === "checking" ? "Checking…" : isHealthy ? "Engine Live" : "Waking up…";

  return (
    <div
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-subtle text-xs text-text-muted"
      title="Live status of the detection engine backing /audit"
    >
      <span className="relative flex h-1.5 w-1.5">
        {isHealthy && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-severity-low opacity-75 animate-ping" />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
            isHealthy ? "bg-severity-low" : "bg-text-faint"
          }`}
        />
      </span>
      <span className="font-mono-num">{label}</span>
    </div>
  );
}
