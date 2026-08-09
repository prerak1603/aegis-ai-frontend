// Mirrors the real Aegis AI v2.1.1 API response shapes exactly —
// see v2/api/app/main.py and app/schemas.py on the backend.

export interface HealthResponse {
  status: string;
  version: string;
  model_loaded: boolean;
  timestamp: string;
}

export interface HighConfidenceAttack {
  row: number;
  attack_type: string;
  confidence: number;
}

export interface Severity {
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  reasons: string[];
}

export interface Attribution {
  mode: string;
  available: boolean;
  host_ip: string | null;
  destination_port: number | null;
  likely_service: string | null;
  risk_note: string | null;
  disclosure: string | null;
}

export interface Recommendation {
  severity: string;
  severity_reasons: string[];
  recommended_action: string;
  auto_blockable: boolean;
  urgency: string;
  target_port: number | null;
  port_action: string | null;
  justification: string | null;
}

export interface Classification {
  attack_type: string;
  confidence: number;
  is_attack: boolean;
}

export interface AgentReport {
  classification?: Classification;
  severity?: Severity;
  attribution?: Attribution;
  narrative?: string;
  recommendation?: Recommendation;
  error?: string;
}

export interface AIAnalysisItem {
  row: number;
  report: AgentReport;
}

export interface AIAnalysis {
  flows_analyzed: number;
  flows_available: number;
  note: string;
  reports: AIAnalysisItem[];
}

export interface AnalyzeResponse {
  upload_id?: string;
  filename: string;
  detected_format: string;
  total_flows_analyzed?: number;
  total_attacks_detected?: number;
  attack_breakdown?: Record<string, number>;
  high_confidence_attacks?: HighConfidenceAttack[];
  ai_analysis?: AIAnalysis;
  status: string;
  // present only on the "parsed_only" (non-CICFlowMeter) variant
  rows_parsed?: number;
  note?: string;
}

export interface ApiErrorResponse {
  detail?: string;
  error?: string;
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  detected_format: string | null;
  total_flows: number;
  total_attacks: number;
  status: string;
  created_at: string;
}

export interface DetectionHistoryItem {
  id: string;
  upload_id: string;
  attack_type: string;
  confidence: number;
  severity: string | null;
  narrative: string | null;
  recommendation: string | null;
  created_at: string;
}
