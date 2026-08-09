"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import Nav from "@/components/Nav";
import UploadZone from "@/components/UploadZone";
import MetricCard from "@/components/MetricCard";
import AttackChart from "@/components/AttackChart";
import ThreatCard from "@/components/ThreatCard";
import type { AnalyzeResponse, HealthResponse } from "@/lib/types";

type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

function riskLevel(attackRate: number): RiskLevel {
  if (attackRate > 20) return "CRITICAL";
  if (attackRate > 5) return "HIGH";
  if (attackRate > 0) return "MODERATE";
  return "LOW";
}

const RISK_COLOR: Record<RiskLevel, string> = {
  LOW: "var(--color-severity-low)",
  MODERATE: "var(--color-severity-medium)",
  HIGH: "var(--color-severity-high)",
  CRITICAL: "var(--color-severity-critical)",
};

export default function AuditPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const isLive = health?.status === "healthy";

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail ?? data.error ?? "Analysis failed.");
      }
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong reaching the analysis engine."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalFlows = results?.total_flows_analyzed ?? 0;
  const totalAttacks = results?.total_attacks_detected ?? 0;
  const attackRate = totalFlows > 0 ? (totalAttacks / totalFlows) * 100 : 0;
  const risk = riskLevel(attackRate);

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="flex items-center gap-2 mb-2">
          {isLive ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-severity-low" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-text-faint" />
          )}
          <span className="text-xs text-text-muted font-mono-num">
            {isLive ? "Engine live" : "Checking engine status…"}
          </span>
        </div>

        <h1 className="text-3xl font-semibold mb-2">Run a security audit</h1>
        <p className="text-text-muted mb-10">
          Upload a CICFlowMeter-formatted CSV export of your network flows.
        </p>

        <div className="space-y-4">
          <UploadZone
            selectedFile={file}
            onFileSelected={setFile}
            onClear={() => {
              setFile(null);
              setResults(null);
              setError(null);
            }}
            disabled={loading}
          />

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-ink font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Analyzing flows…" : "Run audit"}
          </button>

          {loading && !isLive && (
            <p className="text-xs text-text-faint">
              The engine may be waking from idle — this can take up to a
              minute on the first request.
            </p>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-start gap-3 rounded-lg border border-severity-critical/40 bg-severity-critical/10 px-4 py-3"
            >
              <AlertTriangle className="w-4 h-4 text-severity-critical shrink-0 mt-0.5" />
              <p className="text-sm text-text-primary">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {results && results.status === "parsed_only" && (
          <div className="mt-10 rounded-lg border border-border-subtle bg-surface px-5 py-4 text-sm text-text-muted">
            Detected format: <b className="text-text-primary">{results.detected_format}</b>.{" "}
            {results.note}
          </div>
        )}

        {results && results.status !== "parsed_only" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-12 space-y-10"
          >
            <div>
              <h2 className="text-sm uppercase tracking-wide text-text-muted mb-4">
                Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  <p
                    className="text-2xl font-semibold font-mono-num"
                    style={{ color: RISK_COLOR[risk] }}
                  >
                    {risk}
                  </p>
                </div>
              </div>
            </div>

            {results.attack_breakdown && (
              <div>
                <h2 className="text-sm uppercase tracking-wide text-text-muted mb-4">
                  Attack breakdown
                </h2>
                <AttackChart breakdown={results.attack_breakdown} />
              </div>
            )}

            {results.ai_analysis && results.ai_analysis.reports.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-wide text-text-muted mb-1">
                  AI agent threat analysis
                </h2>
                <p className="text-xs text-text-faint mb-4">
                  Full attribution + RAG-backed reasoning generated for{" "}
                  {results.ai_analysis.flows_analyzed} of{" "}
                  {results.ai_analysis.flows_available} highest-confidence flows.
                </p>
                <div className="space-y-4">
                  {results.ai_analysis.reports.map((item, i) => (
                    <ThreatCard key={`${item.row}-${i}`} item={item} index={i} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </>
  );
}
