"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

const SIZE = 700;

/**
 * Soft radial-gradient spotlight that lags gently behind the cursor,
 * layered above the dark page background (pointer events pass through,
 * content stacks above it). Separate from the particle field: this is a
 * viewport-fixed ambient layer, not part of the R3F scene. No-ops on
 * touch devices (no cursor to follow).
 */
export default function CursorSpotlight() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  // Eased/lagged follow, not 1:1 — a soft spring reads as ambient rather
  // than a cursor-tracking gimmick.
  const springX = useSpring(x, { stiffness: 40, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 40, damping: 20, mass: 0.5 });

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    // Reads matchMedia — must stay false during SSR/hydration to avoid a
    // mismatch, so this can't move to a lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!isCoarse);
    if (isCoarse) return;

    function handleMove(e: PointerEvent) {
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed z-0 pointer-events-none rounded-full"
      style={{
        width: SIZE,
        height: SIZE,
        left: springX,
        top: springY,
        background:
          "radial-gradient(circle, rgba(76,211,219,0.07) 0%, rgba(76,211,219,0.03) 40%, transparent 70%)",
      }}
    />
  );
}
