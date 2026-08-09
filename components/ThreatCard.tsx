"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Info } from "lucide-react";
import type { AIAnalysisItem } from "@/lib/types";

const SEVERITY_STYLES: Record<
  string,
  { border: string; badge: string; bar: string; pulse: boolean }
> = {
  CRITICAL: {
    border: "border-l-severity-critical",
    badge: "bg-severity-critical text-white",
    bar: "bg-severity-critical",
    pulse: true,
  },
  HIGH: {
    border: "border-l-severity-high",
    badge: "bg-severity-high text-white",
    bar: "bg-severity-high",
    pulse: false,
  },
  MEDIUM: {
    border: "border-l-severity-medium",
    badge: "bg-severity-medium text-ink",
    bar: "bg-severity-medium",
    pulse: false,
  },
  LOW: {
    border: "border-l-severity-low",
    badge: "bg-severity-low text-ink",
    bar: "bg-severity-low",
    pulse: false,
  },
};

interface ThreatCardProps {
  item: AIAnalysisItem;
  index: number;
}

export default function ThreatCard({ item, index }: ThreatCardProps) {
  const r = item.report;
  const cls = r.classification;
  const sev = r.severity;
  const attrib = r.attribution;
  const rec = r.recommendation;
  const narrative = r.narrative ?? "";

  const sevLevel = sev?.level ?? "LOW";
  const style = SEVERITY_STYLES[sevLevel] ?? SEVERITY_STYLES.LOW;
  const confidencePct = (cls?.confidence ?? 0) * 100;

  const isPendingNarrative = narrative.trim().startsWith("[LLM unavailable");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
      className={`rounded-xl border border-border-subtle border-l-4 ${style.border} bg-surface p-5 ${
        style.pulse ? "animate-[pulse-glow_2.4s_ease-in-out_infinite]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert className="w-4 h-4 text-text-muted shrink-0" />
          <span className="font-semibold text-text-primary truncate">
            {cls?.attack_type ?? "Unknown"}
          </span>
          <span className="text-xs text-text-faint font-mono-num shrink-0">
            flow #{item.row}
          </span>
        </div>
        <span
          className={`text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full shrink-0 ${style.badge}`}
        >
          {sevLevel}
        </span>
      </div>

      <div className="text-sm text-text-muted mb-1.5 font-mono-num">
        {confidencePct.toFixed(2)}% model confidence
        {attrib?.destination_port && (
          <span>
            {" "}
            · port {attrib.destination_port} ({attrib.likely_service ?? "unknown"})
          </span>
        )}
      </div>

      <div className="h-1.5 rounded-full bg-border-subtle overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{ width: `${confidencePct}%` }}
        />
      </div>

      {attrib?.disclosure && (
        <div className="flex gap-2 text-xs text-text-faint italic border-l-2 border-border-subtle pl-3 mb-3">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{attrib.disclosure}</span>
        </div>
      )}

      <div
        className={`rounded-lg px-4 py-3 text-sm mb-3 border border-dashed border-border-subtle ${
          isPendingNarrative ? "text-text-faint italic" : "text-text-primary/90 bg-ink/40"
        }`}
      >
        {isPendingNarrative
          ? "AI-generated narrative will appear here once the language model is connected."
          : `"${narrative}"`}
      </div>

      {rec && (
        <div className="flex items-center justify-between gap-3 flex-wrap bg-surface-raised rounded-lg px-4 py-2.5">
          <span className="text-sm font-medium text-text-primary">
            {rec.recommended_action}
          </span>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-severity-high text-white">
              {rec.urgency}
            </span>
            {rec.auto_blockable && (
              <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border border-severity-low text-severity-low">
                Auto-blockable
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
