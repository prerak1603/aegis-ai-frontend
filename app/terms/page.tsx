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

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full">
        <p className="text-signal text-sm font-mono-num tracking-wide mb-3">LEGAL</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Terms of Service</h1>
        <p className="text-text-faint text-sm mb-4">Last updated {LAST_UPDATED}</p>

        <div className="mb-12 rounded-lg border border-border-subtle bg-surface px-5 py-4 text-sm text-text-muted leading-relaxed">
          A plain-language draft written to accurately describe how Aegis AI actually
          works, not generic boilerplate. Not a substitute for legal advice — have a
          lawyer review this before treating it as binding, especially for anything
          jurisdiction-specific.
        </div>

        <Section title="1. Who you're contracting with">
          <p>
            Aegis AI is operated by Prerak Nain, an individual based in India (not a
            registered company). By creating an account or using the service, you&rsquo;re
            agreeing to these terms with Prerak Nain personally.
          </p>
        </Section>

        <Section title="2. What the service is — and isn't">
          <p>
            Aegis AI analyzes network flow data you upload (CICFlowMeter-formatted
            exports) using a machine learning classifier, and generates a plain-language
            explanation and recommendation for flagged flows using an AI agent.
          </p>
          <p>
            <b className="text-text-primary">It is not a complete security solution.</b> It analyzes
            network-layer flow metadata only — it does not cover endpoint security,
            application code, physical security, or provide continuous/real-time
            monitoring of your network. Classifications and AI-generated narratives are
            probabilistic outputs, not certainties, and can be wrong (false positives and
            false negatives both happen). Do not rely on Aegis AI as your sole security
            control, and always have a qualified human review any finding before acting on
            it in a way that affects production systems.
          </p>
        </Section>

        <Section title="3. Accounts and API keys">
          <p>
            You&rsquo;re responsible for keeping your API key confidential — it authenticates
            every request as you, including against your usage limits and billing tier.
            If you believe your key has been exposed, contact us and we&rsquo;ll help you
            rotate it.
          </p>
        </Section>

        <Section title="4. Subscriptions and billing">
          <p>
            Paid tiers are billed on a recurring monthly basis through our payment
            processor (currently Gumroad, acting as merchant of record). Your subscription
            renews automatically each month until you cancel. Refunds are handled per our
            payment processor&rsquo;s standard policy at the time of purchase — check the
            checkout page for the current terms before subscribing.
          </p>
          <p>
            Each tier includes a fixed number of analyses per month, resetting on a
            rolling monthly cycle from when you subscribed (or signed up, for the Free
            tier). Unused analyses do not roll over. Exceeding your limit blocks further
            analyses until the next reset or an upgrade — see{" "}
            <a href="/pricing" className="text-signal hover:underline">/pricing</a> for current limits.
          </p>
        </Section>

        <Section title="5. Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Upload network traffic data you don&rsquo;t have the right to analyze (e.g. traffic captured from a network you don&rsquo;t own or have authorization to monitor).</li>
            <li>Attempt to circumvent usage limits (e.g. creating multiple accounts to bypass the Free tier cap).</li>
            <li>Use the service to build a competing product by systematically extracting our classifier&rsquo;s outputs or the AI agent&rsquo;s narratives at scale.</li>
            <li>Attempt to disrupt, overload, or gain unauthorized access to the service or other customers&rsquo; data.</li>
          </ul>
        </Section>

        <Section title="6. Your data">
          <p>
            You retain ownership of the data you upload and the results generated from it.
            We don&rsquo;t claim any rights to it beyond what&rsquo;s needed to run the service (see
            our <a href="/privacy" className="text-signal hover:underline">Privacy Policy</a> for
            exactly what&rsquo;s stored and for how long).
          </p>
        </Section>

        <Section title="7. No warranty">
          <p>
            The service is provided &ldquo;as is,&rdquo; without warranty of any kind, express or
            implied — including any warranty that detections are accurate, complete, or
            that the service will be uninterrupted or error-free. You use Aegis AI&rsquo;s
            output at your own risk and are responsible for independently verifying any
            finding before acting on it.
          </p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Aegis AI (and Prerak Nain personally)
            will not be liable for any indirect, incidental, or consequential damages
            arising from your use of — or inability to use — the service, including
            damages resulting from a missed or misclassified threat. Our total liability
            for any claim is limited to the amount you paid us in the 3 months before the
            claim arose.
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            You can stop using the service and cancel your subscription at any time. We
            may suspend or terminate an account that violates the acceptable use section
            above, with notice where practical.
          </p>
        </Section>

        <Section title="10. Changes">
          <p>
            We may update these terms as the service evolves. Material changes will
            update the &ldquo;last updated&rdquo; date above.
          </p>
        </Section>

        <Section title="11. Governing law">
          <p>These terms are governed by the laws of India.</p>
        </Section>

        <Section title="12. Contact">
          <p>
            Questions:{" "}
            <a href="mailto:nainprerak15@gmail.com" className="text-signal hover:underline">
              nainprerak15@gmail.com
            </a>
          </p>
        </Section>
      </main>
    </>
  );
}
