import { ImageResponse } from "next/og";

export const alt = "Aegis AI — AI-Powered Network Intrusion Detection System (NIDS)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0a0d13";
const SIGNAL = "#4cd3db";
const ACCENT = "#7c8cf8";
const TEXT_MUTED = "#8891a3";

// Deterministic "random" dots so this renders identically every build —
// a static echo of the homepage's particle-field hero, not a live render.
function seededDots(count: number) {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: count }, () => ({
    x: rand() * 1200,
    y: rand() * 630,
    r: 2 + rand() * 3,
  }));
}

export default function OpengraphImage() {
  const dots = seededDots(60);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: INK,
          position: "relative",
          padding: "80px",
        }}
      >
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.r,
              height: d.r,
              borderRadius: "50%",
              backgroundColor: SIGNAL,
              opacity: 0.5,
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            color: SIGNAL,
            letterSpacing: 2,
            marginBottom: 24,
          }}
        >
          AEGIS AI
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 700,
            color: "#e8eaf1",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          AI-Powered Network Intrusion Detection System
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: TEXT_MUTED,
            marginTop: 28,
            maxWidth: 800,
          }}
        >
          Detects attacks in real time — and explains them in plain English.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 48,
            fontSize: 22,
            color: ACCENT,
          }}
        >
          aegis-ai-frontend-tau.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
