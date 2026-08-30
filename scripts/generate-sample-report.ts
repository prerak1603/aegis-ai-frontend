/**
 * Generates the "sample report" PDF linked from the pricing page
 * (public/sample-report.pdf), off a real /analyze response saved to JSON —
 * not synthetic data. Reuses the exact same rendering logic
 * (lib/generatePdf.ts's buildAuditPdf) that the live "Download full audit
 * report" button on /audit uses; this script only swaps the browser
 * download for a filesystem write.
 *
 * Usage:
 *   npx tsx scripts/generate-sample-report.ts <path-to-analyze-response.json>
 *
 * Regenerate any time you want a fresher example: run a real file through
 * a running backend's /analyze, save the JSON response, then re-run this.
 */
import { writeFileSync } from "fs";
import { buildAuditPdf } from "../lib/generatePdf";
import type { AnalyzeResponse } from "../lib/types";

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? "public/sample-report.pdf";
const clientName = process.argv[4] ?? "Acme Corp";

if (!inputPath) {
  console.error("Usage: npx tsx scripts/generate-sample-report.ts <analyze-response.json> [output.pdf] [clientName]");
  process.exit(1);
}

const raw = require("fs").readFileSync(inputPath, "utf-8");
const results: AnalyzeResponse = JSON.parse(raw);

const doc = buildAuditPdf(clientName, results);
const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
writeFileSync(outputPath, Buffer.from(new Uint8Array(arrayBuffer)));

console.log(`Wrote ${outputPath} (${(arrayBuffer.byteLength / 1024).toFixed(0)} KB)`);
