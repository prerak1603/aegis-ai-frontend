import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  UploadCloud,
  Radar,
  MessageSquareText,
  ListChecks,
} from "lucide-react";
import Nav from "@/components/Nav";
import Hero3D from "@/components/Hero3D";
import HeroTerminalTicker from "@/components/HeroTerminalTicker";
import StatRow from "@/components/StatRow";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Aegis AI — AI-Powered Network Intrusion Detection System (NIDS)",
  description:
    "Aegis AI is an AI-powered network intrusion detection system (NIDS) that detects attacks in real time and explains them in plain English — not just raw alerts. Try the live demo.",
};

const HOW_IT_WORKS = [
  {
    icon: UploadCloud,
    title: "Upload",
    body: "Drop in a CICFlowMeter-formatted CSV of your network flows.",
  },
  {
    icon: Radar,
    title: "Detect",
    body: "A 4-model ML ensemble classifies each flow across 13 attack categories.",
  },
  {
    icon: MessageSquareText,
    title: "Understand",
    body: "An AI agent analyzes the highest-confidence threats and writes a clear, human-readable report.",
  },
  {
    icon: ListChecks,
    title: "Act",
    body: "Get severity, context, and a recommended response — ready to export as a PDF.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative h-[86vh] min-h-[620px] overflow-hidden border-b border-border-subtle">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
          <p className="text-signal text-sm font-mono-num tracking-wide mb-4">
            NETWORK FLOW ANALYSIS · REAL-TIME CLASSIFICATION
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl leading-[1.05]">
            AI-Powered Network Intrusion Detection System (NIDS)
          </h1>
          <p className="text-text-muted text-lg max-w-xl mt-6 leading-relaxed">
            Most tools just flag &ldquo;suspicious traffic.&rdquo; Aegis AI
            tells you exactly what happened, how confident it is, and what to
            do next — automatically.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
            >
              Run a Live Audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border-strong text-text-primary hover:border-accent transition-colors"
            >
              See How It Works
            </a>
          </div>
          <div className="mt-5 text-xs text-text-faint leading-relaxed space-y-0.5">
            <p>
              ⚡ First request may take ~30–60s to spin up (free-tier
              hosting) — after that, it&apos;s fast.
            </p>
            <p>📁 Max file size: 2MB / 2,000 rows per upload.</p>
          </div>
        </div>
        <div className="absolute bottom-10 inset-x-0 z-10">
          <HeroTerminalTicker />
        </div>
      </section>

      {/* STAT ROW */}
      <StatRow />

      {/* WHAT IS A NIDS */}
      <FadeIn>
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
              What Is a Network Intrusion Detection System (NIDS)?
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              A network intrusion detection system (NIDS) monitors network
              traffic for signs of attacks — unauthorized access, DDoS
              floods, port scans, and more. Traditional NIDS tools are good
              at flagging that something looks wrong. They&apos;re not good
              at explaining why, or what a human should actually do about it.
            </p>
            <p className="text-text-muted text-lg leading-relaxed mt-6">
              Aegis AI is built differently. It pairs a trained machine
              learning ensemble with an AI agent that reads the detection
              and writes a real incident report — severity, context, and a
              recommended next step — the same judgment a security analyst
              would apply, generated in seconds.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-y border-border-subtle bg-surface/40"
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <FadeIn>
            <p className="text-signal text-sm font-mono-num tracking-wide mb-3">
              THE PIPELINE
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-12 max-w-lg">
              From Raw Traffic to a Real Answer
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-border-subtle bg-surface p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono-num text-text-faint">
                      0{i + 1}
                    </span>
                    <step.icon
                      className="w-4 h-4 text-signal"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT'S DIFFERENT */}
      <FadeIn>
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
              Built to Survive Production, Not Just a Demo
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Most AI security demos work great until real traffic hits
              them. Aegis AI is live, with real signed-up users — and
              it&apos;s already been through the failures that matter: a
              production memory crash, a retrieval architecture rebuilt from
              scratch, and a concurrency fix that cut response time
              dramatically.
            </p>
            <Link
              href="/blog/production-story"
              className="inline-flex items-center gap-2 mt-6 text-signal hover:underline"
            >
              Read the full story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* FOOTER CTA */}
      <FadeIn>
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-border-subtle bg-surface px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
              See It Catch a Real Attack
            </h2>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
            >
              Run a Live Audit — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </FadeIn>

      <footer className="border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-text-muted">
          <span>Aegis AI — built by Prerak Nain</span>
          <a
            href="mailto:nainprerak15@gmail.com"
            className="text-signal hover:underline"
          >
            nainprerak15@gmail.com
          </a>
        </div>
      </footer>
    </>
  );
}
