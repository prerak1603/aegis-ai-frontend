"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowRight, FileText } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Nav from "@/components/Nav";
import type { Tier } from "@/lib/types";

interface PlanFeature {
  label: string;
}

interface Plan {
  tier: Tier;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: PlanFeature[];
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Try the full pipeline on real traffic, no card required.",
    features: [
      { label: "5 analyses / month" },
      { label: "Classification across 13 attack categories" },
      { label: "Attribution + RAG-backed narrative" },
      { label: "Up to 8 flows narrated per upload" },
    ],
  },
  {
    tier: "starter",
    name: "Starter",
    price: "$29",
    cadence: "/ month",
    blurb: "For a single security team monitoring one environment.",
    features: [
      { label: "100 analyses / month" },
      { label: "Everything in Free" },
      { label: "Full history + PDF audit exports" },
      { label: "Slack / email alerts on CRITICAL findings" },
    ],
    highlight: true,
  },
  {
    tier: "pro",
    name: "Pro",
    price: "$99",
    cadence: "/ month",
    blurb: "For MSSPs and teams running audits across many clients.",
    features: [
      { label: "1,000 analyses / month" },
      { label: "Everything in Starter" },
      { label: "Priority narrative generation — up to 15 flows narrated per upload" },
      { label: "Priority support" },
    ],
  },
];

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(tier: Tier) {
    setError(null);
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? data.detail ?? "Could not start checkout.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoadingTier(null);
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-signal text-sm font-mono-num tracking-wide mb-3">
            PRICING
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Simple pricing, no surprises.
          </h1>
          <p className="text-text-muted text-lg leading-relaxed mb-6">
            Every plan runs the same pipeline — classify, attribute, explain,
            recommend. The only thing that changes is how much of it you get
            per month.
          </p>
          <a
            href="/sample-report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-signal hover:underline"
          >
            <FileText className="w-4 h-4" />
            See a sample report — a real audit, not a mockup
          </a>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const isFree = plan.tier === "free";
            const isLoading = loadingTier === plan.tier;

            return (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "border-accent bg-surface-raised"
                    : "border-border-subtle bg-surface"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-accent text-ink text-xs font-semibold tracking-wide">
                    MOST POPULAR
                  </span>
                )}

                <h2 className="text-lg font-semibold text-text-primary mb-1">
                  {plan.name}
                </h2>
                <p className="text-sm text-text-muted mb-6 leading-relaxed min-h-[2.5rem]">
                  {plan.blurb}
                </p>

                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-4xl font-semibold font-mono-num text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-sm text-text-muted">{plan.cadence}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-text-primary">{f.label}</span>
                    </li>
                  ))}
                </ul>

                {isFree ? (
                  <Link
                    href={!isLoaded ? "#" : isSignedIn ? "/audit" : "/sign-up"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border-strong text-text-primary font-medium hover:bg-surface-raised transition-colors"
                  >
                    {isSignedIn ? "Run an audit" : "Get started free"}
                  </Link>
                ) : !isLoaded ? (
                  <div className="h-[46px]" />
                ) : isSignedIn ? (
                  <button
                    onClick={() => handleSubscribe(plan.tier)}
                    disabled={isLoading}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-opacity disabled:opacity-60 ${
                      plan.highlight
                        ? "bg-accent text-ink hover:opacity-90"
                        : "border border-border-strong text-text-primary hover:bg-surface-raised"
                    }`}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Redirecting to checkout…" : `Subscribe to ${plan.name}`}
                  </button>
                ) : (
                  <Link
                    href="/sign-up"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-opacity ${
                      plan.highlight
                        ? "bg-accent text-ink hover:opacity-90"
                        : "border border-border-strong text-text-primary hover:bg-surface-raised"
                    }`}
                  >
                    Sign up to subscribe
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {error && (
          <p className="mt-6 text-sm text-severity-critical">{error}</p>
        )}

        {/* WHAT HAPPENS AT YOUR LIMIT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20 max-w-3xl rounded-xl border border-border-subtle bg-surface p-8"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            What happens when you hit your limit?
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Every plan&rsquo;s analysis count resets on a rolling monthly cycle.
            If you submit an upload after using your month&rsquo;s allotment,
            Aegis returns a clear <code className="font-mono-num text-text-primary">402</code>{" "}
            response instead of a confusing failure — telling you exactly
            how many analyses you&rsquo;ve used, when your count resets, and
            linking straight back here to upgrade. Nothing is throttled or
            degraded mid-analysis; a request either runs the full pipeline
            or doesn&rsquo;t start at all.
          </p>
        </motion.div>

        <p className="mt-10 text-sm text-text-faint">
          Questions about a custom plan or on-prem deployment?{" "}
          <a href="mailto:nainprerak15@gmail.com" className="text-signal hover:underline">
            nainprerak15@gmail.com
          </a>
        </p>
      </main>
    </>
  );
}
