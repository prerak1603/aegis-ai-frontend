"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import MetricCard from "@/components/MetricCard";

const STATS = [
  {
    label: "Model Accuracy",
    value: 99.88,
    suffix: "%",
    format: (n: number) => n.toFixed(2),
  },
  {
    label: "Records Analyzed",
    value: 2.8,
    suffix: "M+",
    format: (n: number) => n.toFixed(1),
  },
  {
    label: "Attack Categories",
    value: 13,
    suffix: "",
  },
  {
    label: "Model Ensemble",
    value: 4,
    suffix: "",
  },
];

export default function StatRow() {
  const ref = useRef<HTMLDivElement>(null);
  // MetricCard starts its 0->value count-up the instant it mounts, so the
  // cards below aren't rendered at all until scrolled into view — that's
  // what makes the count-up actually happen on-scroll rather than having
  // already finished by the time a fade-in reveals it. `once: true` means
  // this never re-triggers on subsequent scrolls within the same load.
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <section className="border-b border-border-subtle bg-surface/40">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {inView
            ? STATS.map((stat) => (
                <MetricCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  format={stat.format}
                />
              ))
            : STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border-subtle bg-surface px-5 py-4"
                >
                  <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold font-mono-num text-text-primary">
                    0{stat.suffix}
                  </p>
                </div>
              ))}
        </div>
      </section>
    </motion.div>
  );
}
