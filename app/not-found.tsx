import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center">
          <p className="text-signal text-sm font-mono-num tracking-wide mb-4">404</p>
          <h1 className="text-3xl font-semibold tracking-tight mb-4">Page not found</h1>
          <p className="text-text-muted leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist, or may have moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
            >
              <Home className="w-4 h-4" />
              Back to homepage
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-strong text-text-primary hover:border-accent transition-colors"
            >
              Run a Live Audit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
