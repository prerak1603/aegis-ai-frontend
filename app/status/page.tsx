"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import type { HealthResponse } from "@/lib/types";

type State = "operational" | "degraded" | "down" | "checking";

const POLL_MS = 30_000;
const SLOW_MS = 2_000; // above this, the API is "operational" but visibly slow -> degraded

interface HealthCheck extends HealthResponse {
  response_ms?: number;
}

function stateFor(health: HealthCheck | null): State {
  if (!health) return "checking";
  if (health.status !== "healthy" || !health.model_loaded) return "down";
  if ((health.response_ms ?? 0) > SLOW_MS) return "degraded";
  return "operational";
}

const STATE_META: Record<State, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
  operational: { label: "Operational", color: "var(--severity-low)", Icon: CheckCircle2 },
  degraded: { label: "Degraded", color: "var(--severity-medium)", Icon: AlertTriangle },
  down: { label: "Down", color: "var(--severity-critical)", Icon: XCircle },
  checking: { label: "Checking…", color: "var(--text-faint)", Icon: Loader2 },
};

function Row({ name, state, detail }: { name: string; state: State; detail?: string }) {
  const meta = STATE_META[state];
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border-subtle bg-surface px-6 py-5">
      <div>
        <p className="text-sm font-medium text-text-primary">{name}</p>
        {detail && <p className="text-xs text-text-faint mt-0.5 font-mono-num">{detail}</p>}
      </div>
      <div className="flex items-center gap-2" style={{ color: meta.color }}>
        <meta.Icon className={`w-4 h-4 ${state === "checking" ? "animate-spin" : ""}`} />
        <span className="text-sm font-medium">{meta.label}</span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) {
          setHealth({ status: "unhealthy", version: "", model_loaded: false, timestamp: "" });
        }
      }
      if (!cancelled) setLastChecked(new Date());
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const apiState = stateFor(health);
  // The frontend answering this request at all means it's up — so overall
  // status just tracks the API check.
  const frontendState: State = "operational";
  const overall: State = apiState;

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-16 w-full">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-signal text-sm font-mono-num tracking-wide mb-3">SYSTEM STATUS</p>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {overall === "operational" && "All systems operational"}
              {overall === "degraded" && "Partial degradation"}
              {overall === "down" && "Experiencing an outage"}
              {overall === "checking" && "Checking systems…"}
            </h1>
          </div>
          <p className="text-text-muted mb-10 text-sm">
            {lastChecked
              ? `Last checked ${lastChecked.toLocaleTimeString()} — refreshes automatically every 30s.`
              : "Checking…"}
          </p>

          <div className="space-y-3">
            <Row
              name="Analysis API"
              state={apiState}
              detail={
                health?.response_ms !== undefined
                  ? `${health.response_ms}ms response · v${health.version || "—"}`
                  : undefined
              }
            />
            <Row name="Frontend (this page)" state={frontendState} />
          </div>

          <p className="mt-10 text-xs text-text-faint leading-relaxed">
            This page pings the live <code className="font-mono-num">/health</code> endpoint
            directly from your browser via our server — it reflects real-time
            status, not a cached or manually-updated page. &quot;Degraded&quot;
            means the API responded but slowly (&gt;{SLOW_MS / 1000}s);
            &quot;Down&quot; means it didn&rsquo;t respond correctly at all.
          </p>
        </motion.div>
      </main>
    </>
  );
}
