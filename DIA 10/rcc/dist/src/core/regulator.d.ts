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
export declare function regulate(analysis: AnalysisResult, input: string): RegulationResult;
