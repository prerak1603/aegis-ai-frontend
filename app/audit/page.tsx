import type { Metadata } from "next";
import AuditPageClient from "./AuditPageClient";

// Metadata must live in a Server Component — AuditPageClient stays a
// client component (it's fully interactive: upload, polling, PDF export),
// so this thin wrapper is the only structural change made to /audit. No
// behavior or UI below this line changes.
export const metadata: Metadata = {
  title: "Run a Live Audit",
  description:
    "Upload a CICFlowMeter-formatted CSV of your network flows and get a real AI-generated intrusion detection report in seconds.",
  alternates: { canonical: "/audit" },
  // Auth-gated page — kept out of search results even though robots.ts
  // already disallows crawling it.
  robots: { index: false, follow: false },
};

export default function AuditPage() {
  return <AuditPageClient />;
}
