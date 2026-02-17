/**
 * RCC Heuristics
 * HARDENED v1.0.0-DAY6
 * 
 * INVARIANTES:
 * - Determinístico: mismo input → mismas métricas
 * - Métricas en rango [0, 1]
 * - Sin estado interno
 */

import { RCCState } from './types';
import { resolveStateByScore } from './states';

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────
export type Metrics = {
  chars: number;
  words: number;
  intensity: number;   // 0..1
  repetition: number;  // 0..1
  noise: number;       // 0..1
};

// ─────────────────────────────────────────────────────────────
// CÁLCULO DE MÉTRICAS
// Determinístico: mismo input → mismas métricas
// ─────────────────────────────────────────────────────────────
export function computeMetrics(text: string): Metrics {
  if (!text || typeof text !== 'string') {
    return { chars: 0, words: 0, intensity: 0, repetition: 0, noise: 0 };
  }
  
  const chars = text.length;
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  
  // Intensity: basado en mayúsculas y signos de exclamación/interrogación
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const punctuationCount = (text.match(/[!?]{1,}/g) || []).length;
  const intensity = Math.min(1, (upperCount / Math.max(chars, 1)) + (punctuationCount * 0.1));
  
  // Repetition: palabras repetidas
  const wordList = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(wordList).size;
  const repetition = words > 0 ? 1 - (uniqueWords / words) : 0;
  
  // Noise: caracteres no alfanuméricos
  const noiseChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const noise = Math.min(1, noiseChars / Math.max(chars, 1));
  
  return {
    chars,
    words,
    intensity: Math.min(1, Math.max(0, intensity)),
    repetition: Math.min(1, Math.max(0, repetition)),
    noise: Math.min(1, Math.max(0, noise))
  };
}

// ─────────────────────────────────────────────────────────────
// RESOLUCIÓN DE ESTADO
// ─────────────────────────────────────────────────────────────
export function resolveState(metrics: Metrics): RCCState {
  return resolveStateByScore(metrics.intensity);
}
