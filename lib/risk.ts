// Shared risk-level logic — used by both the audit page display and the
// PDF export, so the two never drift out of sync with each other.

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export function riskLevel(attackRate: number): RiskLevel {
  if (attackRate > 20) return "CRITICAL";
  if (attackRate > 5) return "HIGH";
  if (attackRate > 0) return "MODERATE";
  return "LOW";
}

export const RISK_COLOR: Record<RiskLevel, string> = {
  LOW: "#34c98e",
  MODERATE: "#e8a73b",
  HIGH: "#e8763b",
  CRITICAL: "#e8453b",
};
