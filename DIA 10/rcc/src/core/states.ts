/**
 * RCC Cognitive States
 * HARDENED v1.0.0-DAY6
 * 
 * INVARIANTES:
 * - Solo 3 estados permitidos: CALM, NEUTRAL, TENSE
 * - Prohibido agregar estados nuevos
 * - Umbrales son constantes inmutables
 * - Determinismo: mismo score → mismo estado
 */

import { RCCState } from './types';

// ─────────────────────────────────────────────────────────────
// ESTADOS PERMITIDOS (cerrado, no extensible)
// ─────────────────────────────────────────────────────────────
export type CognitiveState = RCCState;
export type State = CognitiveState;

// ─────────────────────────────────────────────────────────────
// UMBRALES EXPLÍCITOS
// Invariante: CALM < NEUTRAL < TENSE
// ─────────────────────────────────────────────────────────────
export const THRESHOLDS = {
  /** Score < CALM_MAX → CALM */
  CALM_MAX: 0.3,
  /** Score >= TENSE_MIN → TENSE */
  TENSE_MIN: 0.7,
} as const;

// ─────────────────────────────────────────────────────────────
// VALIDACIÓN DE ESTADO
// ─────────────────────────────────────────────────────────────
const VALID_STATES: readonly RCCState[] = ['CALM', 'NEUTRAL', 'TENSE'] as const;

export function isValidState(state: string): state is RCCState {
  return VALID_STATES.includes(state as RCCState);
}

// ─────────────────────────────────────────────────────────────
// RESOLUCIÓN DE ESTADO POR SCORE
// Determinístico: mismo score → mismo estado
// ─────────────────────────────────────────────────────────────
export function resolveStateByScore(score: number): RCCState {
  // Clamp score a [0, 1]
  const clampedScore = Math.max(0, Math.min(1, score));
  
  if (clampedScore < THRESHOLDS.CALM_MAX) {
    return 'CALM';
  }
  if (clampedScore >= THRESHOLDS.TENSE_MIN) {
    return 'TENSE';
  }
  return 'NEUTRAL';
}
