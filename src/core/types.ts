/**
 * RCC Core Types
 * HARDENED v1.0.0-DAY6
 */

// ─────────────────────────────────────────────────────────────
// ESTADOS - Tipo unión cerrado (no extensible)
// ─────────────────────────────────────────────────────────────
export type RCCState = 'CALM' | 'NEUTRAL' | 'TENSE';

// ─────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────
export type Channel = 'cli' | 'slack';

export interface InputMessage {
  id: string;
  text: string;
  author: string;
  channel: Channel;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────
// ANALYSIS - Resultado del analyzer (SPEC exacto)
// ─────────────────────────────────────────────────────────────
export interface AnalysisResult {
  state: RCCState;
  score: number;
  reason: string;
}

// ─────────────────────────────────────────────────────────────
// REGULATION - Acciones posibles (SPEC exacto)
// ─────────────────────────────────────────────────────────────
export interface RegulationResult {
  action: 'PASSTHROUGH' | 'SOFTEN' | 'SUMMARIZE' | 'PAUSE';
  message: string;
  meta?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// ROUTER - Canales de salida (SPEC exacto)
// ─────────────────────────────────────────────────────────────
export interface RouterResult {
  channel: 'TEXT' | 'COOLDOWN';
}
