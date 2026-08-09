import Link from "next/link";
import { ArrowRight, Radar, Fingerprint, MessageSquareText, ListChecks } from "lucide-react";
import Nav from "@/components/Nav";
import Hero3D from "@/components/Hero3D";

const PIPELINE = [
  {
    icon: Radar,
    title: "Classify",
    body: "A stacked ensemble (Random Forest, XGBoost, LightGBM) scores every flow across 13 attack categories in under 40ms.",
  },
  {
    icon: Fingerprint,
    title: "Attribute",
    body: "Flags the destination port, likely service, and any host-level context available in the source data.",
  },
  {
    icon: MessageSquareText,
    title: "Explain",
    body: "A RAG-backed agent grounds its reasoning in your knowledge base before writing a plain-language narrative.",
  },
  {
    icon: ListChecks,
    title: "Recommend",
    body: "Every flagged flow gets a concrete action, an urgency level, and whether it's safe to auto-block.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative h-[86vh] min-h-[560px] overflow-hidden border-b border-border-subtle">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
          <p className="text-signal text-sm font-mono-num tracking-wide mb-4">
            NETWORK FLOW ANALYSIS · REAL-TIME CLASSIFICATION
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight max-w-2xl leading-[1.05]">
            Most traffic is calm.{" "}
            <span className="text-text-muted">Aegis finds what isn&apos;t.</span>
          </h1>
          <p className="text-text-muted text-lg max-w-xl mt-6 leading-relaxed">
            Upload a network flow export. Aegis classifies every flow, attributes
            the threat, and tells you — in plain language — exactly what to do
            about it.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
            >
              Run a live audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#pipeline"
              className="text-text-muted hover:text-text-primary text-sm transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* PIPELINE — a real sequence: this is the actual request path */}
      <section id="pipeline" className="max-w-6xl mx-auto px-6 py-24">
        <p className="text-signal text-sm font-mono-num tracking-wide mb-3">
          THE PIPELINE
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-12 max-w-lg">
          One upload triggers all four steps, in order, on every flagged flow.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PIPELINE.map((step, i) => (
            <div
              key={step.title}
              className="rounded-xl border border-border-subtle bg-surface p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono-num text-text-faint">
                  0{i + 1}
                </span>
                <step.icon className="w-4 h-4 text-signal" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border-subtle bg-surface/40">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            ["98.43%", "Macro F1-score"],
            ["99.88%", "Accuracy"],
            ["13", "Attack categories"],
            ["<40ms", "Inference per flow"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-3xl font-semibold font-mono-num text-text-primary">
                {value}
              </p>
              <p className="text-sm text-text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCOPE NOTE */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Scope & limitations</h2>
          <p className="text-text-muted leading-relaxed text-sm">
            Aegis analyzes network-layer flow metadata — it does not cover
            endpoint security, application code, or physical security. It's
            optimized for CICFlowMeter-formatted exports, and benefits from a
            short calibration period against your own traffic baseline in a
            new deployment.
          </p>
        </div>
      </section>

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
