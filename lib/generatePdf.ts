import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalyzeResponse } from "./types";
import { riskLevel, RISK_COLOR } from "./risk";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function generateAuditPdf(clientName: string, results: AnalyzeResponse) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const marginX = 48;
  let y = 56;

  const totalFlows = results.total_flows_analyzed ?? 0;
  const totalAttacks = results.total_attacks_detected ?? 0;
  const attackRate = totalFlows > 0 ? (totalAttacks / totalFlows) * 100 : 0;
  const risk = riskLevel(attackRate);

  // --- Cover ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(26, 26, 46);
  doc.text("AEGIS AI \u2014 Security Audit Report", marginX, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(
    `Prepared for: ${clientName || "Client"}   |   Date: ${dateStr}   |   File: ${results.filename}`,
    marginX,
    y
  );
  y += 30;

  // --- Executive Summary ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 46);
  doc.text("Executive Summary", marginX, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const summaryText = `This report analyzes ${totalFlows.toLocaleString()} network flows submitted for review. Of these, ${totalAttacks.toLocaleString()} flows (${attackRate.toFixed(
    1
  )}%) were classified as potential threats by Aegis AI's machine learning ensemble.`;
  const summaryLines = doc.splitTextToSize(summaryText, 500) as string[];
  doc.text(summaryLines, marginX, y);
  y += summaryLines.length * 14 + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text("Overall Risk Assessment:", marginX, y);
  const [r, g, b] = hexToRgb(RISK_COLOR[risk]);
  doc.setTextColor(r, g, b);
  doc.text(risk, marginX + 150, y);
  doc.setTextColor(30, 30, 30);
  y += 28;

  // --- Findings table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 46);
  doc.text("Detailed Findings", marginX, y);

  const breakdown = results.attack_breakdown ?? {};
  const rows = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => [
      label,
      count.toLocaleString(),
      totalFlows > 0 ? `${((count / totalFlows) * 100).toFixed(1)}%` : "0%",
    ]);

  autoTable(doc, {
    startY: y + 10,
    head: [["Category", "Count", "% of Total"]],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [26, 26, 46], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    margin: { left: marginX, right: marginX },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 24;

  // --- Recommendations ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 46);
  doc.text("Recommendations", marginX, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const recLines =
    totalAttacks > 0
      ? [
          "Based on the findings above, we recommend the following actions:",
          "1. Immediate review of flagged flows with highest confidence scores.",
          "2. Block or rate-limit source IPs associated with confirmed threats.",
          "3. Establish continuous monitoring to catch similar patterns in real time.",
          "4. Schedule a follow-up audit in 30 days to verify remediation effectiveness.",
        ]
      : [
          "No threats were detected in this analysis window. We recommend:",
          "1. Continue regular audits to maintain visibility into network activity.",
          "2. Establish a baseline monitoring cadence for early threat detection.",
          "3. Document this audit for compliance and security posture records.",
        ];
  recLines.forEach((line) => {
    doc.text(line, marginX, y);
    y += 16;
  });
  y += 14;

  // --- Methodology ---
  if (y > 620) {
    doc.addPage();
    y = 56;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 46);
  doc.text("Methodology & Scope", marginX, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const methodText =
    "This audit uses Aegis AI, a stacking ensemble (Random Forest, XGBoost, LightGBM) trained on millions of network flows. The system analyzes network flow metadata to classify traffic into 13 categories including DDoS, port scanning, brute-force attempts, and web application attacks. Scope: this analysis covers network-layer traffic patterns only. It does not include endpoint security, application code review, or physical security assessment. Results reflect a point-in-time analysis of the submitted data.";
  const methodLines = doc.splitTextToSize(methodText, 500) as string[];
  doc.text(methodLines, marginX, y);

  const safeClient = (clientName || "Client").replace(/\s+/g, "_");
  const fileDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  doc.save(`Aegis_Audit_${safeClient}_${fileDate}.pdf`);
}
