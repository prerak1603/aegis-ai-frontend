import type { ReactNode } from "react";
import Nav from "@/components/Nav";

const API_BASE_URL = process.env.AEGIS_API_URL ?? "https://aegis-ai-v2.onrender.com";

function Code({ children }: { children: string }) {
  return (
    <pre className="rounded-lg border border-border-subtle bg-ink px-5 py-4 overflow-x-auto text-xs leading-relaxed font-mono-num text-text-primary">
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-surface-raised text-signal text-[0.85em] font-mono-num">
      {children}
    </code>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <h2 className="text-xl font-semibold text-text-primary mb-4">{title}</h2>
      <div className="space-y-4 text-sm text-text-muted leading-relaxed">{children}</div>
    </section>
  );
}

const NAV_LINKS = [
  ["auth", "Authentication"],
  ["analyze", "POST /analyze"],
  ["formats", "File formats"],
  ["errors", "Errors & status codes"],
  ["rate-limits", "Rate limits"],
  ["other-endpoints", "Other endpoints"],
];

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-16 w-full grid md:grid-cols-[180px_1fr] gap-12">
        {/* SIDEBAR */}
        <nav className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs uppercase tracking-wide text-text-faint mb-3">
              On this page
            </p>
            {NAV_LINKS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="block text-sm text-text-muted hover:text-signal transition-colors py-1"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div>
          <p className="text-signal text-sm font-mono-num tracking-wide mb-3">
            API REFERENCE
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Aegis AI API
          </h1>
          <p className="text-text-muted text-lg leading-relaxed mb-4 max-w-2xl">
            One authenticated endpoint does the real work: upload a network
            flow export, get back a full classification + threat narrative.
            Base URL:
          </p>
          <Code>{API_BASE_URL}</Code>

          <div className="mt-16">
            <Section id="auth" title="Authentication">
              <p>
                Every request (except <InlineCode>/health</InlineCode> and{" "}
                <InlineCode>/</InlineCode>) needs your API key in an{" "}
                <InlineCode>X-API-Key</InlineCode> header. Find yours on the{" "}
                <a href="/account" className="text-signal hover:underline">
                  Account
                </a>{" "}
                page after signing up — a key is provisioned automatically the
                moment you create an account.
              </p>
              <Code>{`X-API-Key: aegis_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</Code>
              <p>
                A missing key returns <InlineCode>401</InlineCode>. An invalid
                key returns <InlineCode>401</InlineCode>. A disabled account
                returns <InlineCode>403</InlineCode>.
              </p>
            </Section>

            <Section id="analyze" title="POST /analyze">
              <p>
                Upload a network flow export. Aegis parses it, classifies every
                flow across 13 attack categories, attributes the highest-
                confidence threats, and generates a plain-language narrative +
                recommendation for each — grounded by a RAG-backed agent. This
                is the endpoint every tier&rsquo;s monthly analysis count is
                metered against.
              </p>

              <p className="text-text-primary font-medium mt-6 mb-2">Request</p>
              <p>
                <InlineCode>multipart/form-data</InlineCode> with a single
                field, <InlineCode>file</InlineCode>.
              </p>
              <Code>{`curl -X POST ${API_BASE_URL}/analyze \\
  -H "X-API-Key: aegis_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -F "file=@network_flows.csv"`}</Code>

              <p className="text-text-primary font-medium mt-6 mb-2">
                Response — <InlineCode>200 OK</InlineCode>
              </p>
              <Code>{`{
  "upload_id": "b3f1...",
  "filename": "network_flows.csv",
  "detected_format": "CICFlowMeter CSV",
  "total_flows_analyzed": 1000,
  "total_attacks_detected": 42,
  "attack_breakdown": { "BENIGN": 958, "DDoS": 40, "PortScan": 2 },
  "high_confidence_attacks": [
    { "row": 17, "attack_type": "DDoS", "confidence": 0.998 }
  ],
  "ai_analysis": {
    "flows_analyzed": 8,
    "flows_available": 42,
    "note": "Full AI agent analysis generated for the top 8 ...",
    "reports": [
      {
        "row": 17,
        "report": {
          "classification": { "attack_type": "DDoS", "confidence": 0.998 },
          "severity": { "level": "CRITICAL", "reasons": ["..."] },
          "attribution": { "destination_port": 80, "likely_service": "http" },
          "narrative": "This flow shows a high-volume, low-payload burst ...",
          "recommendation": {
            "recommended_action": "Rate-limit or block source ...",
            "auto_blockable": false,
            "urgency": "immediate"
          }
        }
      }
    ]
  },
  "status": "analysis_complete"
}`}</Code>
              <p>
                Only the top{" "}
                <InlineCode>N</InlineCode> highest-confidence flows get a full
                agent narrative per request (8 on Free/Starter, 15 on Pro) —{" "}
                <InlineCode>attack_breakdown</InlineCode> and{" "}
                <InlineCode>high_confidence_attacks</InlineCode> still cover
                every flow in the upload.
              </p>
            </Section>

            <Section id="formats" title="File formats & limits">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <b className="text-text-primary">CICFlowMeter CSV</b> — fully
                  supported end to end. Needs exactly 78 numeric flow-feature
                  columns (standard CICFlowMeter output); an optional{" "}
                  <InlineCode>Label</InlineCode> column is ignored.
                </li>
                <li>
                  <b className="text-text-primary">Zeek conn.log</b> — detected
                  and parsed, but not yet run through the classifier. The
                  response comes back with{" "}
                  <InlineCode>&quot;status&quot;: &quot;parsed_only&quot;</InlineCode>{" "}
                  and doesn&rsquo;t count against your monthly analyses.
                </li>
                <li>Max file size: <b className="text-text-primary">2 MB</b>.</li>
                <li>Max rows per upload: <b className="text-text-primary">2,000</b>.</li>
              </ul>
            </Section>

            <Section id="errors" title="Errors & status codes">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-text-faint text-xs uppercase tracking-wide">
                      <th className="py-2 pr-4 font-medium">Code</th>
                      <th className="py-2 font-medium">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono-num">
                    {[
                      ["400", "Malformed request (e.g. file couldn't be parsed)."],
                      ["401", "Missing or invalid X-API-Key."],
                      ["402", "Monthly analysis limit reached — upgrade your plan to continue."],
                      ["403", "Account disabled."],
                      ["413", "File over 2 MB, or over 2,000 rows."],
                      ["422", "Wrong number of numeric feature columns."],
                      ["429", "Too many requests — see rate limits below."],
                      ["500", "Internal error — logged server-side, safe to retry."],
                    ].map(([code, meaning]) => (
                      <tr key={code} className="border-b border-border-subtle/60">
                        <td className="py-2.5 pr-4 text-text-primary">{code}</td>
                        <td className="py-2.5 text-text-muted font-sans">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                A <InlineCode>402</InlineCode> response body includes{" "}
                <InlineCode>tier</InlineCode>, <InlineCode>limit</InlineCode>,{" "}
                <InlineCode>reset_date</InlineCode>, and{" "}
                <InlineCode>upgrade_url</InlineCode> so you can surface a clear
                upgrade prompt without guessing.
              </p>
            </Section>

            <Section id="rate-limits" title="Rate limits">
              <p>
                Two independent limits apply to <InlineCode>/analyze</InlineCode>:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <b className="text-text-primary">5 requests / minute</b>,
                  regardless of plan — protects the inference engine from
                  bursts.
                </li>
                <li>
                  <b className="text-text-primary">A monthly analysis cap</b>{" "}
                  by tier: <b className="text-text-primary">5</b> on Free,{" "}
                  <b className="text-text-primary">100</b> on Starter,{" "}
                  <b className="text-text-primary">1,000</b> on Pro. See{" "}
                  <a href="/pricing" className="text-signal hover:underline">
                    pricing
                  </a>
                  .
                </li>
              </ul>
              <p>
                <InlineCode>/history/*</InlineCode> and{" "}
                <InlineCode>/billing/*</InlineCode> are limited to 60 requests
                / minute; <InlineCode>/predict</InlineCode> to 30 / minute.
              </p>
            </Section>

            <Section id="other-endpoints" title="Other endpoints">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-text-faint text-xs uppercase tracking-wide">
                      <th className="py-2 pr-4 font-medium">Endpoint</th>
                      <th className="py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono-num">
                    {[
                      ["GET /health", "Public, unauthenticated. Model + service status."],
                      ["POST /predict", "Classify a single 78-feature vector directly (no file, no narrative)."],
                      ["GET /history/uploads", "List your past uploads, most recent first."],
                      ["GET /history/detections", "List detections, optionally filtered by upload_id."],
                      ["GET /billing/status", "Current tier, usage this month, and reset date."],
                    ].map(([ep, desc]) => (
                      <tr key={ep} className="border-b border-border-subtle/60">
                        <td className="py-2.5 pr-4 text-text-primary whitespace-nowrap">{ep}</td>
                        <td className="py-2.5 text-text-muted font-sans">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </div>
      </main>
    </>
  );
}
