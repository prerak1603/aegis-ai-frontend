import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";
import AnalyticsGate from "@/components/AnalyticsGate";

export const SITE_URL = "https://aegis-ai-frontend-tau.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aegis AI — AI-Powered Network Intrusion Detection System (NIDS)",
    template: "%s — Aegis AI",
  },
  description:
    "AI-powered network flow analysis. Classifies traffic, attributes threats, and explains what to do about them.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Aegis AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7c8cf8",
        },
      }}
    >
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-ink text-text-primary">
          {children}
          <AnalyticsGate />
        </body>
      </html>
    </ClerkProvider>
  );
}
