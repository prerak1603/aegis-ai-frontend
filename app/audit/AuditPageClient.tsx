"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle2, Circle, Download } from "lucide-react";
import Nav from "@/components/Nav";
import UploadZone from "@/components/UploadZone";
import MetricCard from "@/components/MetricCard";
import AttackChart from "@/components/AttackChart";
import ThreatCard from "@/components/ThreatCard";
import { riskLevel, RISK_COLOR } from "@/lib/risk";
import type { AnalyzeResponse, HealthResponse } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

const COLD_START_MESSAGE =
  "The analysis engine is waking up from idle (free-tier hosting — this can take up to a minute on the first request). Please try again in a moment.";

export default function AuditPageClient() {
  const [clientName, setClientName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

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
    trackEvent("audit_upload_started");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });

      // Render cold-start / upstream-down: a 502/503/504 from our own API
      // route (which itself proxies to the Render-hosted backend) is the
      // realistic failure mode here, not a generic error.
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        throw new Error(COLD_START_MESSAGE);
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail ?? data.error ?? "Analysis failed.");
      }
      setResults(data);
      trackEvent("audit_completed");
    } catch (err) {
      const isNetworkFailure = err instanceof TypeError; // fetch() itself threw (timeout/offline)
      if (err instanceof Error && err.message === COLD_START_MESSAGE) {
        setError(COLD_START_MESSAGE);
      } else if (isNetworkFailure || !isLive) {
        // Health check already told us the engine wasn't live — treat any
        // failure in that state as the same cold-start story rather than
        // surfacing a raw fetch/network error.
        setError(COLD_START_MESSAGE);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong reaching the analysis engine."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleExportPdf() {
    if (!results) return;
    setExportingPdf(true);
    try {
      const { generateAuditPdf } = await import("@/lib/generatePdf");
      generateAuditPdf(clientName, results);
    } finally {
      setExportingPdf(false);
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
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">
              Client / company name (used on the exported report)
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:border-signal outline-none"
            />
          </div>

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

            <div>
              <button
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-strong text-text-primary text-sm font-medium hover:bg-surface-raised transition-colors disabled:opacity-50"
              >
                {exportingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download full audit report (PDF)
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
}
