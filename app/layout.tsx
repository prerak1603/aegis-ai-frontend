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

export const metadata: Metadata = {
  title: "Aegis AI — Network Intrusion Detection",
  description:
    "AI-powered network flow analysis. Classifies traffic, attributes threats, and explains what to do about them.",
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
        </body>
      </html>
    </ClerkProvider>
  );
}
