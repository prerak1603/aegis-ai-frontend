"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import StatusBadge from "@/components/StatusBadge";

export default function Nav() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="w-full border-b border-border-subtle bg-ink/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="w-5 h-5 text-signal" strokeWidth={1.75} />
            <span className="font-semibold tracking-tight text-text-primary">
              Aegis AI
            </span>
          </Link>
          <StatusBadge />
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/how-it-works"
            className="text-text-muted hover:text-text-primary transition-colors hidden sm:inline"
          >
            How it works
          </Link>

          {/* Avoid a flash of the wrong state before Clerk has loaded */}
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link
                href="/history"
                className="text-text-muted hover:text-text-primary transition-colors hidden sm:inline"
              >
                Past reports
              </Link>
              <Link
                href="/account"
                className="text-text-muted hover:text-text-primary transition-colors hidden sm:inline"
              >
                Account
              </Link>
              <Link
                href="/audit"
                className="px-4 py-2 rounded-md bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
              >
                Run an audit
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-text-muted hover:text-text-primary transition-colors text-sm">
                  Sign in
                </button>
              </SignInButton>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-md bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
