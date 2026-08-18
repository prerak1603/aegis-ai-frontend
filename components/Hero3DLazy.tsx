"use client";

import dynamic from "next/dynamic";

// next/dynamic with ssr:false can only be called from a Client Component —
// page.tsx (the actual homepage) is a Server Component, so this thin
// wrapper exists purely to host the dynamic import. Keeps the R3F/three.js
// bundle out of the initial JS the hero text/CTA depend on, so LCP isn't
// gated on WebGL init.
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => null,
});

export default function Hero3DLazy() {
  return <Hero3D />;
}
