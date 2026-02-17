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
export type CognitiveState = RCCState;
export type State = CognitiveState;
export declare const THRESHOLDS: {
    /** Score < CALM_MAX → CALM */
    readonly CALM_MAX: 0.3;
    /** Score >= TENSE_MIN → TENSE */
    readonly TENSE_MIN: 0.7;
};
export declare function isValidState(state: string): state is RCCState;
export declare function resolveStateByScore(score: number): RCCState;
