/**
 * RCC Analyzer
 * HARDENED v1.0.0-DAY6
 * 
 * INVARIANTES:
 * - Determinismo: mismo input → mismo output
 * - Normaliza input antes de procesar
 * - Input inválido → NEUTRAL con reason INVALID_INPUT
 * - Nunca lanza excepción
 */

import { computeMetrics } from './heuristics';
import { AnalysisResult } from './types';
import { resolveStateByScore } from './states';

// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────
const MAX_INPUT_LENGTH = 10000;

// ─────────────────────────────────────────────────────────────
// NORMALIZACIÓN
// ─────────────────────────────────────────────────────────────
function normalize(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, MAX_INPUT_LENGTH);
}

// ─────────────────────────────────────────────────────────────
// ANÁLISIS PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function analyze(input: string): AnalysisResult {
  const normalized = normalize(input);
  if (!normalized) {
    return { state: 'NEUTRAL', score: 0, reason: 'INVALID_INPUT' };
  }
  
  // Procesar con thresholds explícitos
  const metrics = computeMetrics(normalized);
  const score = metrics.intensity;
  const state = resolveStateByScore(score);
  
  // Reason basado en estado
  const reason = state === 'CALM' ? 'LOW_INTENSITY' 
               : state === 'TENSE' ? 'HIGH_INTENSITY' 
               : 'BASELINE';
  
  return { state, score, reason };
}

// ─────────────────────────────────────────────────────────────
// EXPORTS (para tests)
// ─────────────────────────────────────────────────────────────
export { normalize, MAX_INPUT_LENGTH };
