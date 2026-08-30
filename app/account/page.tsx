"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  BellRing,
} from "lucide-react";
import Nav from "@/components/Nav";
import type { BillingStatus, AlertSettings } from "@/lib/types";

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default function AccountPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const [slackUrl, setSlackUrl] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertsLoaded, setAlertsLoaded] = useState(false);
  const [savingAlerts, setSavingAlerts] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [alertsSaved, setAlertsSaved] = useState(false);

  useEffect(() => {
    fetch("/api/billing/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.tier) setStatus(data);
        else throw new Error(data.error ?? data.detail ?? "Failed to load account status.");
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load account status.")
      );

    fetch("/api/account/alert-settings")
      .then((r) => r.json())
      .then((data: AlertSettings) => {
        setSlackUrl(data.slack_webhook_url ?? "");
        setAlertEmail(data.alert_email ?? "");
      })
      .catch(() => {})
      .finally(() => setAlertsLoaded(true));
  }, []);

  async function handleManageBilling() {
    setPortalError(null);
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? data.detail ?? "Could not open the billing portal.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Something went wrong.");
      setPortalLoading(false);
    }
  }

  async function handleSaveAlerts() {
    setAlertsError(null);
    setAlertsSaved(false);
    setSavingAlerts(true);
    try {
      const res = await fetch("/api/account/alert-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slack_webhook_url: slackUrl, alert_email: alertEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail ?? data.error ?? "Could not save alert settings.");
      }
      setSlackUrl(data.slack_webhook_url ?? "");
      setAlertEmail(data.alert_email ?? "");
      setAlertsSaved(true);
    } catch (err) {
      setAlertsError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSavingAlerts(false);
    }
  }

  const pct = status ? Math.min(100, (status.usage_count / Math.max(status.usage_limit, 1)) * 100) : 0;
  const nearLimit = status ? status.usage_count / Math.max(status.usage_limit, 1) >= 0.8 : false;
  const atLimit = status ? status.usage_count >= status.usage_limit : false;
  const remaining = status ? status.usage_reset_date && daysUntil(status.usage_reset_date) : null;

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-semibold mb-2">Account</h1>
        <p className="text-text-muted mb-10">
          Your plan, usage this month, and billing.
        </p>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-severity-critical/40 bg-severity-critical/10 px-4 py-3 mb-8">
            <AlertTriangle className="w-4 h-4 text-severity-critical shrink-0 mt-0.5" />
            <p className="text-sm text-text-primary">{error}</p>
          </div>
        )}

        {!status && !error && (
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading account…
          </div>
        )}

        {status && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* PLAN + USAGE */}
            <div className="rounded-xl border border-border-subtle bg-surface p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted mb-1">
                    Current plan
                  </p>
                  <p className="text-xl font-semibold text-text-primary">
                    {status.tier_label}
                  </p>
                </div>
                {status.tier !== "pro" && (
                  <a
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 text-sm text-signal hover:underline"
                  >
                    Upgrade
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-sm text-text-muted">Analyses used this month</p>
                <p className="text-sm font-mono-num text-text-primary">
                  {status.usage_count.toLocaleString()} / {status.usage_limit.toLocaleString()}
                </p>
              </div>
              <div className="w-full h-2 rounded-full bg-ink overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: atLimit
                      ? "var(--severity-critical)"
                      : nearLimit
                      ? "var(--severity-medium)"
                      : "var(--signal)",
                  }}
                />
              </div>
              <p className="text-xs text-text-faint">
                {remaining !== null
                  ? `Resets in ${remaining} day${remaining === 1 ? "" : "s"}.`
                  : "Resets monthly."}
              </p>

              {atLimit && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-severity-critical/40 bg-severity-critical/10 px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-severity-critical shrink-0 mt-0.5" />
                  <p className="text-sm text-text-primary">
                    You&rsquo;ve used all of this month&rsquo;s analyses. New uploads
                    will be rejected until your plan resets, or upgrade now to
                    keep going immediately.
                  </p>
                </div>
              )}
              {!atLimit && nearLimit && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-severity-medium/40 bg-severity-medium/10 px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-severity-medium shrink-0 mt-0.5" />
                  <p className="text-sm text-text-primary">
                    You&rsquo;re close to this month&rsquo;s limit — consider
                    upgrading so an upload doesn&rsquo;t get rejected mid-week.
                  </p>
                </div>
              )}
            </div>

            {/* BILLING */}
            <div className="rounded-xl border border-border-subtle bg-surface p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-signal" />
                <h2 className="text-sm font-semibold text-text-primary">Billing</h2>
              </div>

              {status.has_billing_account ? (
                <>
                  <p className="text-sm text-text-muted mb-4">
                    Update your payment method, change plans, or cancel — all
                    handled securely by our billing partner.
                  </p>
                  <button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-strong text-text-primary text-sm font-medium hover:bg-surface-raised transition-colors disabled:opacity-50"
                  >
                    {portalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {portalLoading ? "Opening…" : "Manage billing"}
                  </button>
                  {portalError && (
                    <p className="mt-3 text-sm text-severity-critical">{portalError}</p>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-text-faint shrink-0 mt-0.5" />
                  <p className="text-sm text-text-muted">
                    You&rsquo;re on the Free plan — no billing account yet.{" "}
                    <a href="/pricing" className="text-signal hover:underline">
                      Subscribe to Starter or Pro
                    </a>{" "}
                    to unlock billing management here.
                  </p>
                </div>
              )}
            </div>

            {/* ALERT SETTINGS */}
            <div className="rounded-xl border border-border-subtle bg-surface p-6">
              <div className="flex items-center gap-2 mb-2">
                <BellRing className="w-4 h-4 text-signal" />
                <h2 className="text-sm font-semibold text-text-primary">Alert settings</h2>
              </div>
              <p className="text-sm text-text-muted mb-5">
                Get pinged the moment an upload turns up a CRITICAL-severity
                threat — leave either field blank to skip that channel.
              </p>

              {!alertsLoaded ? (
                <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading…
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">
                      Slack incoming webhook URL
                    </label>
                    <input
                      type="text"
                      value={slackUrl}
                      onChange={(e) => {
                        setSlackUrl(e.target.value);
                        setAlertsSaved(false);
                      }}
                      placeholder="https://hooks.slack.com/services/…"
                      className="w-full rounded-lg border border-border-subtle bg-ink px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:border-signal outline-none font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-text-muted mb-2">
                      Alert email
                    </label>
                    <input
                      type="email"
                      value={alertEmail}
                      onChange={(e) => {
                        setAlertEmail(e.target.value);
                        setAlertsSaved(false);
                      }}
                      placeholder="security@yourcompany.com"
                      className="w-full rounded-lg border border-border-subtle bg-ink px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:border-signal outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveAlerts}
                      disabled={savingAlerts}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-strong text-text-primary text-sm font-medium hover:bg-surface-raised transition-colors disabled:opacity-50"
                    >
                      {savingAlerts && <Loader2 className="w-4 h-4 animate-spin" />}
                      {savingAlerts ? "Saving…" : "Save alert settings"}
                    </button>
                    {alertsSaved && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-severity-low">
                        <CheckCircle2 className="w-4 h-4" />
                        Saved
                      </span>
                    )}
                  </div>
                  {alertsError && (
                    <p className="text-sm text-severity-critical">{alertsError}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
}
