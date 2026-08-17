"use client";

import MetricCard from "@/components/MetricCard";
import FadeIn from "@/components/FadeIn";

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
  return (
    <FadeIn>
      <section className="border-b border-border-subtle bg-surface/40">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <MetricCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              format={stat.format}
            />
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
