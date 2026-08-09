"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Loader2, AlertTriangle } from "lucide-react";
import Nav from "@/components/Nav";
import type { UploadHistoryItem, DetectionHistoryItem } from "@/lib/types";

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "text-severity-critical",
  HIGH: "text-severity-high",
  MEDIUM: "text-severity-medium",
  LOW: "text-severity-low",
};

export default function HistoryPage() {
  const [uploads, setUploads] = useState<UploadHistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detections, setDetections] = useState<Record<string, DetectionHistoryItem[]>>({});
  const [loadingDetections, setLoadingDetections] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history/uploads")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUploads(data);
        else throw new Error(data.detail ?? data.error ?? "Failed to load history.");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load history."));
  }, []);

  async function toggleExpand(uploadId: string) {
    if (expanded === uploadId) {
      setExpanded(null);
      return;
    }
    setExpanded(uploadId);
    if (!detections[uploadId]) {
      setLoadingDetections(uploadId);
      try {
        const res = await fetch(`/api/history/detections?upload_id=${uploadId}`);
        const data = await res.json();
        setDetections((prev) => ({ ...prev, [uploadId]: Array.isArray(data) ? data : [] }));
      } catch {
        setDetections((prev) => ({ ...prev, [uploadId]: [] }));
      } finally {
        setLoadingDetections(null);
      }
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-semibold mb-2">Past reports</h1>
        <p className="text-text-muted mb-10">
          Every audit run under this API key, most recent first.
        </p>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-severity-critical/40 bg-severity-critical/10 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-severity-critical shrink-0 mt-0.5" />
            <p className="text-sm text-text-primary">{error}</p>
          </div>
        )}

        {!uploads && !error && (
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading history…
          </div>
        )}

        {uploads && uploads.length === 0 && (
          <div className="rounded-lg border border-border-subtle bg-surface px-5 py-8 text-center text-text-muted text-sm">
            No audits run yet. Run one from the audit page to see it here.
          </div>
        )}

        <div className="space-y-3">
          {uploads?.map((u) => {
            const isOpen = expanded === u.id;
            const rate = u.total_flows > 0 ? (u.total_attacks / u.total_flows) * 100 : 0;
            return (
              <div
                key={u.id}
                className="rounded-xl border border-border-subtle bg-surface overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(u.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-raised transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-signal shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {u.filename}
                      </p>
                      <p className="text-xs text-text-faint font-mono-num">
                        {new Date(u.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-text-muted font-mono-num hidden sm:inline">
                      {u.total_flows.toLocaleString()} flows · {u.total_attacks.toLocaleString()} threats
                      {" "}({rate.toFixed(1)}%)
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-faint transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border-subtle"
                    >
                      <div className="px-5 py-4">
                        {loadingDetections === u.id && (
                          <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Loading detections…
                          </div>
                        )}
                        {detections[u.id]?.length === 0 && loadingDetections !== u.id && (
                          <p className="text-sm text-text-faint py-2">
                            No individual detection records for this upload.
                          </p>
                        )}
                        <div className="space-y-2">
                          {detections[u.id]?.map((d) => (
                            <div
                              key={d.id}
                              className="flex items-center justify-between gap-3 text-sm bg-ink/40 rounded-lg px-4 py-2.5"
                            >
                              <span className="text-text-primary font-medium">
                                {d.attack_type}
                              </span>
                              <span className="text-text-muted font-mono-num text-xs">
                                {(d.confidence * 100).toFixed(2)}%
                              </span>
                              <span
                                className={`text-xs font-bold uppercase tracking-wide ${
                                  SEVERITY_COLOR[d.severity ?? ""] ?? "text-text-muted"
                                }`}
                              >
                                {d.severity ?? "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
