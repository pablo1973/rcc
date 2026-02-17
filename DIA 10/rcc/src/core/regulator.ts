/**
 * RCC Regulator
 * HARDENED v1.0.0-DAY6
 * 
 * INVARIANTES:
 * - No muta input original
 * - Produce RegulationResult puro
 * - Nunca lanza excepción: fail-safe → PASSTHROUGH
 * - Sin efectos colaterales
 */

import { AnalysisResult, RegulationResult } from './types';
import { applyRules } from './rules';

// ─────────────────────────────────────────────────────────────
// REGULACIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function regulate(
  analysis: AnalysisResult,
  input: string
): RegulationResult {
  // Fail-safe: si analysis es inválido
  if (!analysis || typeof analysis.state !== 'string') {
    return {
      action: 'PASSTHROUGH',
      message: input || ''
    };
  }
  
  const regulatedText = applyRules(input, analysis.state);
  
  // Switch exhaustivo por estado
  switch (analysis.state) {
    case 'CALM':
      return {
        action: 'PASSTHROUGH',
        message: regulatedText,
        meta: { originalState: analysis.state, score: analysis.score, reason: analysis.reason }
      };
    case 'NEUTRAL':
      return {
        action: 'PASSTHROUGH',
        message: regulatedText,
        meta: { originalState: analysis.state, score: analysis.score, reason: analysis.reason }
      };
    case 'TENSE':
      return {
        action: 'SOFTEN',
        message: regulatedText,
        meta: { originalState: analysis.state, score: analysis.score, reason: analysis.reason }
      };
    default:
      // Fail-safe: estado desconocido → passthrough
      return {
        action: 'PASSTHROUGH',
        message: input
      };
  }
}
