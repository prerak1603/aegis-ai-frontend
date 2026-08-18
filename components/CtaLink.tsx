"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

interface CtaLinkProps {
  href: string;
  ctaId: string;
  className?: string;
  children: ReactNode;
}

/** Link/anchor wrapper that fires a cta_click GA4 event with which CTA was
 * clicked. Exists as its own client component because a Server Component
 * (app/page.tsx) can't pass an onClick closure directly to a Link. */
export default function CtaLink({ href, ctaId, className, children }: CtaLinkProps) {
  const handleClick = () => trackEvent("cta_click", { cta: ctaId });

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
