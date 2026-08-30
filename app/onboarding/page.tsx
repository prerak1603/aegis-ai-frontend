"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  MessageSquareText,
  ListChecks,
} from "lucide-react";
import Nav from "@/components/Nav";
import MetricCard from "@/components/MetricCard";
import ThreatCard from "@/components/ThreatCard";
import { riskLevel, RISK_COLOR } from "@/lib/risk";
import type { AnalyzeResponse } from "@/lib/types";

type Step = "welcome" | "loading" | "results";

const SAMPLE_FILE_URL = "/samples/sample-flows.csv";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSampleAnalysis() {
    setError(null);
    setStep("loading");
    try {
      const fileRes = await fetch(SAMPLE_FILE_URL);
      const blob = await fileRes.blob();
      const file = new File([blob], "sample-flows.csv", { type: "text/csv" });

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail?.message ?? data.detail ?? data.error ?? "Analysis failed.");
      }
      setResults(data);
      setStep("results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong running the sample analysis."
      );
      setStep("welcome");
    }
  }

  const totalFlows = results?.total_flows_analyzed ?? 0;
  const totalAttacks = results?.total_attacks_detected ?? 0;
  const attackRate = totalFlows > 0 ? (totalAttacks / totalFlows) * 100 : 0;
  const risk = riskLevel(attackRate);
  const topReport = results?.ai_analysis?.reports?.[0];

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-signal text-sm font-mono-num tracking-wide mb-3">
                WELCOME TO AEGIS AI
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                Let&rsquo;s see it work — in about a minute.
              </h1>
              <p className="text-text-muted text-lg leading-relaxed mb-10 max-w-xl">
                Before you upload your own traffic, run a real sample through
                the full pipeline: classify, attribute, explain, recommend.
                No setup, just one click.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: ShieldAlert, label: "Real DDoS flows", body: "A small CIC-IDS-2017 sample, already flagged as attacks." },
                  { icon: MessageSquareText, label: "Full AI narrative", body: "The same RAG-backed agent your uploads will get." },
                  { icon: ListChecks, label: "A concrete action", body: "Severity, attribution, and what to do about it." },
                ].map((f) => (
                  <div key={f.label} className="rounded-xl border border-border-subtle bg-surface p-5">
                    <f.icon className="w-4 h-4 text-signal mb-3" strokeWidth={1.75} />
                    <p className="text-sm font-medium text-text-primary mb-1">{f.label}</p>
                    <p className="text-xs text-text-muted leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-severity-critical/40 bg-severity-critical/10 px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-severity-critical shrink-0 mt-0.5" />
                  <p className="text-sm text-text-primary">{error}</p>
                </div>
              )}

              <button
                onClick={runSampleAnalysis}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-4 h-4" />
                Try it with sample data
              </button>
              <p className="text-xs text-text-faint mt-3">
                This counts as one analysis on your account — you&rsquo;ll still
                have the rest of your monthly allotment for your own files.
              </p>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <Loader2 className="w-6 h-6 text-signal animate-spin mb-4" />
              <p className="text-text-primary font-medium mb-1">
                Classifying flows, attributing threats, writing the narrative…
              </p>
              <p className="text-sm text-text-faint">
                This can take up to a minute the first time.
              </p>
            </motion.div>
          )}

          {step === "results" && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-signal text-sm font-mono-num tracking-wide mb-3">
                THAT&rsquo;S THE PIPELINE
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
                Here&rsquo;s what Aegis found in the sample.
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                <MetricCard label="Flows analyzed" value={totalFlows} />
                <MetricCard label="Threats detected" value={totalAttacks} />
                <MetricCard
                  label="Threat rate"
                  value={attackRate}
                  suffix="%"
                  format={(n) => n.toFixed(1)}
                />
                <div className="rounded-xl border border-border-subtle bg-surface px-5 py-4">
                  <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
                    Risk level
                  </p>
                  <p className="text-2xl font-semibold font-mono-num" style={{ color: RISK_COLOR[risk] }}>
                    {risk}
                  </p>
                </div>
              </div>

              {topReport && (
                <div className="mb-10">
                  <h2 className="text-sm uppercase tracking-wide text-text-muted mb-1">
                    Reading a threat card
                  </h2>
                  <p className="text-xs text-text-faint mb-4 leading-relaxed">
                    Every flagged flow gets a severity, an attribution note
                    (destination port / likely service), a plain-language
                    narrative, and a recommended action — this is one of
                    yours from the sample:
                  </p>
                  <ThreatCard item={topReport} index={0} />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border-subtle bg-surface p-6">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-medium text-text-primary mb-1">
                    Ready for your own traffic?
                  </p>
                  <p className="text-xs text-text-muted">
                    Upload a CICFlowMeter export and get the same breakdown.
                  </p>
                </div>
                <Link
                  href="/audit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
                >
                  Upload your own file
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-strong text-text-primary font-medium hover:bg-surface-raised transition-colors"
                >
                  Go to account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
