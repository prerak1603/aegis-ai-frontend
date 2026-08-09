"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  accent?: string;
  format?: (n: number) => string;
}

export default function MetricCard({
  label,
  value,
  suffix = "",
  accent = "var(--color-text-primary)",
  format,
}: MetricCardProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // No "run once" guard here on purpose — React's Strict Mode (dev only)
    // mounts, cleans up, and re-mounts every effect once. A guard that
    // blocks re-running after the first invocation permanently freezes
    // this animation, because the first run gets killed by the Strict
    // Mode cleanup before it reaches `value`. Letting the effect restart
    // cleanly is what makes it self-heal in dev, and it's a no-op extra
    // cost in production (effects only run once there anyway).
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);

  const shown = format ? format(display) : Math.round(display).toLocaleString();

  return (
    <div className="rounded-xl border border-border-subtle bg-surface px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
        {label}
      </p>
      <p
        className="text-2xl font-semibold font-mono-num"
        style={{ color: accent }}
      >
        {shown}
        {suffix}
      </p>
    </div>
  );
}
