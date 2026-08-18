"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface TiltRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Tilt direction — alternate per section so it doesn't feel repetitive. */
  direction?: "left" | "right";
}

/**
 * Scroll-triggered reveal with a small 3D tilt + fade, instead of a flat
 * fade-in. Subtle on purpose: a few degrees of rotation, not a flip.
 * Needs perspective on an ancestor for the rotateY to read as 3D rather
 * than a plain skew — applied here via style on the wrapper.
 */
export default function TiltReveal({
  children,
  delay = 0,
  className,
  direction = "left",
}: TiltRevealProps) {
  const fromY = direction === "left" ? -6 : 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateX: 4, rotateY: fromY }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
