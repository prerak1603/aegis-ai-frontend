"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Realistic-looking sample lines — purely decorative, not live data.
const SAMPLE_LINES = [
  "flow_18492 classified: BENIGN (99.2%)",
  "flow_18493 classified: BENIGN (98.7%)",
  "flow_20117 classified: PORT_SCAN (94.1%) — flagged",
  "flow_20118 classified: BENIGN (99.5%)",
  "flow_20981 classified: DDoS (97.8%) — flagged",
  "flow_20982 classified: BENIGN (99.1%)",
  "flow_21440 classified: BENIGN (98.9%)",
  "flow_21503 classified: BRUTE_FORCE (95.6%) — flagged",
];

const INTERVAL_MS = 2800;

export default function HeroTerminalTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SAMPLE_LINES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none select-none h-5 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono-num text-xs text-text-faint/80 tracking-wide whitespace-nowrap"
        >
          {SAMPLE_LINES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
