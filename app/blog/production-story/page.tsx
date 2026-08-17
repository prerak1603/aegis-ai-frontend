import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "The Production Story — Aegis AI",
  description:
    "How Aegis AI survived real production traffic: a memory crash, a retrieval rebuild, and a concurrency fix. Full write-up coming soon.",
};

export default function ProductionStoryPage() {
  return (
    <>
      <Nav />
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="text-signal text-sm font-mono-num tracking-wide mb-4">
          COMING SOON
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
          The Production Story
        </h1>
        <p className="text-text-muted text-lg leading-relaxed max-w-xl mx-auto">
          The full write-up — a production memory crash, a retrieval
          architecture rebuilt from scratch, and a concurrency fix that cut
          response time dramatically — is being polished. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-10 text-signal hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </section>
    </>
  );
}
