import type { ReactNode } from "react";
import Nav from "@/components/Nav";

const LAST_UPDATED = "August 31, 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold text-text-primary mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-text-muted leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full">
        <p className="text-signal text-sm font-mono-num tracking-wide mb-3">LEGAL</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-text-faint text-sm mb-4">Last updated {LAST_UPDATED}</p>

        <div className="mb-12 rounded-lg border border-border-subtle bg-surface px-5 py-4 text-sm text-text-muted leading-relaxed">
          This is a plain-language description of what Aegis AI actually does with your
          data, written to accurately reflect how the system works — not generic
          boilerplate. It is not a substitute for legal advice; if you need this reviewed
          for a specific regulatory requirement (GDPR, HIPAA, etc.), have a lawyer look at
          it before relying on it.
        </div>

        <Section title="Who this covers">
          <p>
            Aegis AI is operated by Prerak Nain, an individual (not a registered company)
            based in India. Any reference to &ldquo;we&rdquo;/&ldquo;us&rdquo; below means Prerak Nain
            operating Aegis AI.
          </p>
        </Section>

        <Section title="What we collect">
          <p><b className="text-text-primary">Account information:</b> your name and email address, collected when you sign up (via Clerk, our authentication provider).</p>
          <p>
            <b className="text-text-primary">The files you upload:</b> when you submit a network flow
            file to /analyze, it is read into memory, processed, and discarded —{" "}
            <b className="text-text-primary">the original file itself is not written to disk or
            retained anywhere.</b> Only the results derived from it (see below) are stored.
          </p>
          <p>
            <b className="text-text-primary">Derived analysis results:</b> for each upload, we store the
            filename, detected format, flow/attack counts, and — for the flows our AI
            agent narrates — the attack classification, confidence score, severity,
            AI-generated narrative text, and recommended action. This is what powers your
            history page and PDF exports.
          </p>
          <p>
            <b className="text-text-primary">Usage and billing data:</b> your subscription tier, how many
            analyses you&rsquo;ve run this billing period, and (if you subscribe) billing
            identifiers from our payment processor. We do not see or store your card or
            PayPal details ourselves — those are handled entirely by our payment
            processor.
          </p>
          <p>
            <b className="text-text-primary">Alert settings you opt into:</b> if you configure a Slack
            webhook URL or an alert email address, we store exactly that — nothing else.
          </p>
        </Section>

        <Section title="Who else sees it (our subprocessors)">
          <p>We don&rsquo;t sell or share your data. The following third parties process it strictly to run the service:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><b className="text-text-primary">Clerk</b> — authentication, account/session management.</li>
            <li><b className="text-text-primary">Neon</b> — hosts our Postgres database (encrypted at rest, in a managed cloud environment).</li>
            <li><b className="text-text-primary">Anthropic</b> — the text of an attack&rsquo;s classification and attribution context is sent to Anthropic&rsquo;s Claude API to generate the plain-language narrative and recommendation. Your raw uploaded file is never sent to Anthropic — only derived, per-flow classification data.</li>
            <li><b className="text-text-primary">Gumroad</b> — processes subscription payments as merchant of record. We receive only your tier and subscription status, never your payment details.</li>
            <li><b className="text-text-primary">Resend</b> — sends CRITICAL-severity alert emails, only if you&rsquo;ve opted in with an alert email.</li>
            <li><b className="text-text-primary">Render and Vercel</b> — host the backend API and the website you&rsquo;re reading this on.</li>
          </ul>
        </Section>

        <Section title="How long we keep it">
          <p>
            Account and derived analysis data is kept for as long as your account is
            active. If you want your account and all associated data deleted, email us
            (below) and we&rsquo;ll delete it — there&rsquo;s no self-serve deletion flow yet.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask us at any time to see what we have on file for you, correct it, or
            delete it. Since this is a one-person-operated service, expect a personal
            response by email rather than an automated portal.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Clerk sets session cookies to keep you signed in. We don&rsquo;t run our own
            tracking/advertising cookies beyond what Clerk requires for authentication.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If this changes materially, the &ldquo;last updated&rdquo; date above will change and,
            for significant changes, we&rsquo;ll note it somewhere visible on the site.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about any of this:{" "}
            <a href="mailto:nainprerak15@gmail.com" className="text-signal hover:underline">
              nainprerak15@gmail.com
            </a>
          </p>
        </Section>
      </main>
    </>
  );
}
