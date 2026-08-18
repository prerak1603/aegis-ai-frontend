"use client";

import { useState } from "react";
import { ChevronDown, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { FAQ_ENTRIES } from "@/lib/faq";
import { trackEvent } from "@/lib/analytics";

function FaqItem({ id, question, answer }: { id: string; question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  function giveFeedback(vote: "up" | "down") {
    if (feedback) return; // one vote per question per page load
    setFeedback(vote);
    trackEvent("faq_feedback", { question_id: id, vote });
  }

  return (
    <div className="border-b border-border-subtle py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`faq-answer-${id}`}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <h3 className="font-medium text-text-primary">{question}</h3>
        <ChevronDown
          className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div id={`faq-answer-${id}`} className="mt-3 space-y-3">
          <p className="text-sm text-text-muted leading-relaxed max-w-2xl">{answer}</p>
          <div className="flex items-center gap-3 text-xs text-text-faint">
            {feedback ? (
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-severity-low" aria-hidden="true" />
                Thanks for the feedback
              </span>
            ) : (
              <>
                <span>Was this helpful?</span>
                <button
                  onClick={() => giveFeedback("up")}
                  aria-label="Yes, this was helpful"
                  className="hover:text-severity-low transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => giveFeedback("down")}
                  aria-label="No, this wasn't helpful"
                  className="hover:text-severity-critical transition-colors"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Faq() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
          Frequently Asked Questions
        </h2>
        <div>
          {FAQ_ENTRIES.map((entry) => (
            <FaqItem key={entry.id} {...entry} />
          ))}
        </div>
        <p className="text-sm text-text-muted mt-8">
          Still have questions?{" "}
          <a href="mailto:nainprerak15@gmail.com" className="text-signal hover:underline">
            Get in touch
          </a>
          .
        </p>
      </div>
    </section>
  );
}
