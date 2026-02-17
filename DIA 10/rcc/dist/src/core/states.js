"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.THRESHOLDS = void 0;
exports.isValidState = isValidState;
exports.resolveStateByScore = resolveStateByScore;
// ─────────────────────────────────────────────────────────────
// UMBRALES EXPLÍCITOS
// Invariante: CALM < NEUTRAL < TENSE
// ─────────────────────────────────────────────────────────────
exports.THRESHOLDS = {
    /** Score < CALM_MAX → CALM */
    CALM_MAX: 0.3,
    /** Score >= TENSE_MIN → TENSE */
    TENSE_MIN: 0.7,
};
// ─────────────────────────────────────────────────────────────
// VALIDACIÓN DE ESTADO
// ─────────────────────────────────────────────────────────────
const VALID_STATES = ['CALM', 'NEUTRAL', 'TENSE'];
function isValidState(state) {
    return VALID_STATES.includes(state);
}
// ─────────────────────────────────────────────────────────────
// RESOLUCIÓN DE ESTADO POR SCORE
// Determinístico: mismo score → mismo estado
// ─────────────────────────────────────────────────────────────
function resolveStateByScore(score) {
    // Clamp score a [0, 1]
    const clampedScore = Math.max(0, Math.min(1, score));
    if (clampedScore < exports.THRESHOLDS.CALM_MAX) {
        return 'CALM';
    }
    if (clampedScore >= exports.THRESHOLDS.TENSE_MIN) {
        return 'TENSE';
    }
    return 'NEUTRAL';
}
