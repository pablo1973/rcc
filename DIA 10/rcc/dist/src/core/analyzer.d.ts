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
import { AnalysisResult } from './types';
declare const MAX_INPUT_LENGTH = 10000;
declare function normalize(input: string): string;
export declare function analyze(input: string): AnalysisResult;
export { normalize, MAX_INPUT_LENGTH };
