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
export type Metrics = {
    chars: number;
    words: number;
    intensity: number;
    repetition: number;
    noise: number;
};
export declare function computeMetrics(text: string): Metrics;
export declare function resolveState(metrics: Metrics): RCCState;
