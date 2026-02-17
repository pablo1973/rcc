/**
 * RCC Public API
 * v1.0.0-DAY10
 *
 * Public facade for RCC (Regulador Cognitivo Conversacional)
 *
 * @example
 * ```typescript
 * import { analyze, regulate, run } from 'rcc';
 *
 * // Full pipeline
 * const result = run({ text: 'Hello world' });
 *
 * // Analysis only
 * const analysis = analyze({ text: 'Hello world' });
 *
 * // Analysis + regulation
 * const regulated = regulate({ text: 'Hello world' });
 * ```
 */
import { RCCInput, RCCAnalysisResult, RCCRegulationResult, RCCResult } from './types';
/** Maximum allowed input length */
export declare const MAX_INPUT_LENGTH = 10000;
/** RCC version */
export declare const VERSION = "1.0.0";
/**
 * Analyzes input text and returns emotional state classification
 *
 * @param input - Text to analyze (string or RCCInput object)
 * @returns Analysis result with state, score, reason, and metrics
 * @throws {InvalidInputError} If input is invalid
 * @throws {AnalysisError} If analysis fails
 *
 * @example
 * ```typescript
 * const result = analyze({ text: 'Hello world' });
 * console.log(result.state);  // 'CALM' | 'NEUTRAL' | 'TENSE'
 * console.log(result.score);  // 0-1
 * ```
 */
export declare function analyze(input: RCCInput | string): RCCAnalysisResult;
/**
 * Analyzes and regulates input text
 *
 * @param input - Text to regulate (string or RCCInput object)
 * @returns Regulation result with analysis, action, and processed message
 * @throws {InvalidInputError} If input is invalid
 * @throws {AnalysisError} If analysis fails
 * @throws {RegulationError} If regulation fails
 *
 * @example
 * ```typescript
 * const result = regulate({ text: 'ANGRY MESSAGE!!!' });
 * console.log(result.action);   // 'SOFTEN'
 * console.log(result.message);  // processed message
 * ```
 */
export declare function regulate(input: RCCInput | string): RCCRegulationResult;
/**
 * Runs full RCC pipeline: analyze → regulate → route
 *
 * @param input - Text to process (string or RCCInput object)
 * @returns Full pipeline result with analysis, regulation, and routing
 * @throws {InvalidInputError} If input is invalid
 * @throws {AnalysisError} If analysis fails
 * @throws {RegulationError} If regulation fails
 * @throws {RoutingError} If routing fails
 *
 * @example
 * ```typescript
 * const result = run({ text: 'Hello world', meta: { userId: '123' } });
 * console.log(result.analysis.state);    // 'CALM'
 * console.log(result.regulation.action); // 'PASSTHROUGH'
 * console.log(result.routing.channel);   // 'TEXT'
 * console.log(result.meta);              // { userId: '123' }
 * ```
 */
export declare function run(input: RCCInput | string): RCCResult;
export type { RCCInput, RCCAnalysisResult, RCCRegulationResult, RCCResult, RCCState, RCCReason, RCCAction, RCCChannel, RCCErrorCode, RCCErrorInfo } from './types';
export { RCCError, InvalidInputError, AnalysisError, RegulationError, RoutingError, isRCCError, wrapError } from './errors';
