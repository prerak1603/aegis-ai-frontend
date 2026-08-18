import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UploadCloud, Radar, MessageSquareText, ListChecks } from "lucide-react";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How Aegis AI turns a raw network flow export into a real answer: a 4-model ML ensemble classifies traffic across 13 attack categories, then an AI agent writes a plain-English incident report.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  {
    icon: UploadCloud,
    title: "1. Upload",
    body: "Drop in a CICFlowMeter-formatted CSV export of your network flows — up to 2MB or 2,000 rows per upload.",
  },
  {
    icon: Radar,
    title: "2. Detect",
    body: "A 4-model ML ensemble (Random Forest, XGBoost, LightGBM, and a stacking meta-learner) scores every flow across 13 attack categories, with calibrated confidence — not just a raw softmax score.",
  },
  {
    icon: MessageSquareText,
    title: "3. Understand",
    body: "For the highest-confidence threats, an AI agent reads the classification plus any available attribution context and writes a clear WHAT / WHERE / HOW / WHY report — grounded in a retrieval step so it explains and cites, never invents.",
  },
  {
    icon: ListChecks,
    title: "4. Act",
    body: "Every flagged flow gets a severity level, a recommended action, and an urgency rating — the same judgment call a security analyst would make, ready to export as a PDF.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-20 w-full flex-1">
        <p className="text-signal text-sm font-mono-num tracking-wide mb-4">THE PIPELINE</p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-6 max-w-2xl">
          From Raw Traffic to a Real Answer
        </h1>
        <p className="text-text-muted text-lg leading-relaxed max-w-xl mb-14">
          Most NIDS tools stop at flagging that something looks wrong. Here&apos;s
          exactly what happens between an upload and a finished incident
          report.
        </p>

        <div className="space-y-6">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-border-subtle bg-surface p-6 flex gap-5"
            >
              <step.icon
                className="w-6 h-6 text-signal shrink-0 mt-1"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div>
                <h2 className="font-semibold text-text-primary mb-2">{step.title}</h2>
                <p className="text-sm text-text-muted leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
          >
            Run a Live Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </>
  );
}
