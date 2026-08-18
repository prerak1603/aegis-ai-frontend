export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  sections: BlogSection[];
}

// Small hardcoded registry — fine for a handful of posts. Content adapted
// from CASE_STUDY.md (the author's own writeup), not third-party material.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "production-story",
    title: "Built to Survive Production, Not Just a Demo",
    description:
      "How Aegis AI went from a 99% accuracy number that meant nothing to a live, multi-tenant product — a training bug at 52% accuracy, a 0%-recall attack class, a production memory crash, and a retrieval rebuild.",
    publishedAt: "2026-08-09",
    sections: [
      {
        paragraphs: [
          "Most intrusion-detection side projects stop at “trained a model, got 99% accuracy” — on a dataset where 80% of traffic is one easy class. That number means nothing on its own. I wanted to know: does the model actually catch rare, dangerous attacks, and can I get honest, calibrated confidence out of it — not just an accuracy score that looks good on a slide.",
          "I built Aegis AI on 2.8M+ real network flows (CIC-IDS-2017) to find out, and kept finding the model was worse than it looked.",
        ],
      },
      {
        heading: "What was actually broken",
        paragraphs: [
          "LightGBM was training at 52% accuracy. Buried in a misconfigured hyperparameter set. A 30-trial Optuna sweep found the real config — training accuracy jumped to 99.96%.",
          "Heartbleed recall was 0%. The model never once caught it — a handful of examples in millions of flows, drowned out completely. SMOTE oversampling helped some classes but not this one; a WGAN-GP trained specifically to generate realistic synthetic Heartbleed flows closed the gap: 0% to 100% recall.",
          "Confidence scores were lying. The model would say “94% confident” on flows it got wrong constantly — a 32.7 percentage-point gap between stated confidence and actual correctness. Platt scaling calibrated it down to 0.6pp. That number matters more than accuracy: it's what makes a “CRITICAL, block now” recommendation trustworthy instead of noise.",
        ],
        bullets: [
          "Macro F1-Score: 90.69% → 98.43%",
          "Heartbleed Recall: 0% → 100%",
          "LightGBM Training Accuracy: 52% → 99.96%",
          "Confidence Calibration Gap: 32.7pp → 0.6pp",
        ],
      },
      {
        heading: "Then I went further than “the model works”",
        paragraphs: ["A model in a notebook isn't a product. I built:"],
        bullets: [
          "Attribution — a sliding-window module that adaptively works out who an attack came from: full host-centric attribution (source IP, connection timing regularity, port-scan signature) when the source data has real IPs, honestly degraded to port-level attribution when it doesn't. It never fabricates data that isn't there.",
          "A LangGraph agent that turns a raw classification into a WHAT/WHERE/HOW/WHY/RECOMMENDATION report — RAG-grounded so the LLM explains and cites, never decides. Severity and recommended action are deterministic rule-based logic; the LLM only writes the narrative and a one-line justification.",
          "A multi-tenant backend — FastAPI + Postgres (Neon), every table scoped by customer_id, per-customer API keys, rate limiting, locked-down CORS. A Clerk signup webhook provisions a real isolated account automatically the moment someone signs up.",
          "A production memory fix under real constraints — the RAG layer originally used Chroma + neural sentence embeddings. On Render's 512MB free tier, it blew the memory ceiling and crashed the service. Redesigned retrieval around TF-IDF instead: no model to load into memory, and for a small, vocabulary-distinctive knowledge base, keyword similarity works just as well as neural embeddings would have.",
          "A Next.js frontend on Vercel — 3D flow visualization, live upload → analysis → threat cards, upload history, PDF export. The API key never touches the browser; a server-side route handler holds it.",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "FastAPI · scikit-learn/XGBoost/LightGBM (stacking ensemble) · imbalanced-learn (SMOTE) · PyTorch (WGAN-GP) · Optuna · LangGraph · LangChain + TF-IDF retrieval · Anthropic Claude · SQLAlchemy + Neon Postgres · Next.js 16 + Clerk · Vercel · Render",
        ],
      },
      {
        heading: "What's next",
        paragraphs: [
          "Retrain/validate against more current traffic (CIC-IDS-2017 is a solid benchmark but dated), wire in live threat-intel lookups (AbuseIPDB/AlienVault OTX), and add an automated test suite + CI/CD — the honest gaps, not hidden ones.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
