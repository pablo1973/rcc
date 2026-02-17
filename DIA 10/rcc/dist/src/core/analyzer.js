"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_INPUT_LENGTH = void 0;
exports.analyze = analyze;
exports.normalize = normalize;
const heuristics_1 = require("./heuristics");
const states_1 = require("./states");
// ─────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────
const MAX_INPUT_LENGTH = 10000;
exports.MAX_INPUT_LENGTH = MAX_INPUT_LENGTH;
// ─────────────────────────────────────────────────────────────
// NORMALIZACIÓN
// ─────────────────────────────────────────────────────────────
function normalize(input) {
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
function analyze(input) {
    const normalized = normalize(input);
    if (!normalized) {
        return { state: 'NEUTRAL', score: 0, reason: 'INVALID_INPUT' };
    }
    // Procesar con thresholds explícitos
    const metrics = (0, heuristics_1.computeMetrics)(normalized);
    const score = metrics.intensity;
    const state = (0, states_1.resolveStateByScore)(score);
    // Reason basado en estado
    const reason = state === 'CALM' ? 'LOW_INTENSITY'
        : state === 'TENSE' ? 'HIGH_INTENSITY'
            : 'BASELINE';
    return { state, score, reason };
}
