export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

// Shared between the homepage FAQ accordion (components/Faq.tsx) and the
// FAQPage JSON-LD block on the homepage, so the two never drift apart.
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "what-is-nids",
    question: "What is a network intrusion detection system (NIDS)?",
    answer:
      "A NIDS monitors network traffic for signs of attacks — unauthorized access, DDoS floods, port scans, and more. Aegis AI is a NIDS that pairs a trained machine learning ensemble with an AI agent that explains each detection in plain language instead of just a raw alert.",
  },
  {
    id: "how-accurate",
    question: "How accurate is the detection?",
    answer:
      "The ensemble scores 99.88% accuracy and a 98.43% macro F1-score across 13 attack categories on a 2.8M-flow benchmark (CIC-IDS-2017). Confidence scores are calibrated (Platt scaling), so a stated confidence is meant to actually track how often the model is right — not just look good on a slide.",
  },
  {
    id: "file-limits",
    question: "What file formats and size limits are supported?",
    answer:
      "Aegis AI expects a CICFlowMeter-formatted CSV export of your network flows. Uploads are capped at 2MB or 2,000 rows, whichever comes first — enough for a real demo run without turning into a long-running batch job.",
  },
  {
    id: "data-stored",
    question: "Is my data stored?",
    answer:
      "Yes — uploads and detection results are stored under your account so you can revisit them from your History page. Every table is scoped by customer ID; your data isn't visible to, or mixed with, any other account.",
  },
  {
    id: "cold-start",
    question: "Why is the first request so slow?",
    answer:
      "The detection engine runs on a free-tier host that spins down when idle, so the first request after a quiet period can take 30-60 seconds to wake up. After that first request, subsequent runs are fast (typically well under a few seconds per file).",
  },
  {
    id: "production-ready",
    question: "Is this production-ready? Who is this for?",
    answer:
      "It's a live, real deployment with real signed-up users and multi-tenant auth — not a notebook demo. That said, it's built and run by a solo developer on free/low-cost hosting, so treat it as a strong evaluation and portfolio-grade tool rather than a drop-in replacement for an enterprise SOC's existing stack.",
  },
];
