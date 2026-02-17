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

import { analyze as coreAnalyze } from '../core/analyzer';
import { regulate as coreRegulate } from '../core/regulator';
import { route as coreRoute } from '../core/router';

import {
  RCCInput,
  RCCAnalysisResult,
  RCCRegulationResult,
  RCCResult,
  RCCState,
  RCCReason,
  RCCAction,
  RCCChannel
} from './types';

import {
  RCCError,
  InvalidInputError,
  AnalysisError,
  RegulationError,
  RoutingError,
  isRCCError,
  wrapError
} from './errors';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

/** Maximum allowed input length */
export const MAX_INPUT_LENGTH = 10000;

/** RCC version */
export const VERSION = '1.0.0';

// ─────────────────────────────────────────────────────────────
// Input Validation
// ─────────────────────────────────────────────────────────────

function validateInput(input: RCCInput | string): string {
  // Handle string shorthand
  const text = typeof input === 'string' ? input : input?.text;
  
  // Validate type
  if (text === null || text === undefined) {
    throw new InvalidInputError('Input text is required');
  }
  
  if (typeof text !== 'string') {
    throw new InvalidInputError('Input text must be a string', { 
      receivedType: typeof text 
    });
  }
  
  return text;
}

function extractMeta(input: RCCInput | string): Record<string, unknown> {
  if (typeof input === 'string') {
    return {};
  }
  return input?.meta ?? {};
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

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
export function analyze(input: RCCInput | string): RCCAnalysisResult {
  try {
    const text = validateInput(input);
    const result = coreAnalyze(text);
    
    return {
      state: result.state as RCCState,
      score: result.score,
      reason: result.reason as RCCReason
    };
  } catch (error) {
    if (isRCCError(error)) throw error;
    throw new AnalysisError('Analysis failed', { 
      originalError: error instanceof Error ? error.message : String(error) 
    });
  }
}

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
export function regulate(input: RCCInput | string): RCCRegulationResult {
  try {
    const text = validateInput(input);
    const meta = extractMeta(input);
    
    // Run analysis
    const analysisResult = coreAnalyze(text);
    
    // Run regulation
    const regulationResult = coreRegulate(analysisResult, text);
    
    return {
      analysis: {
        state: analysisResult.state as RCCState,
        score: analysisResult.score,
        reason: analysisResult.reason as RCCReason
      },
      action: regulationResult.action as RCCAction,
      message: regulationResult.message,
      meta
    };
  } catch (error) {
    if (isRCCError(error)) throw error;
    throw new RegulationError('Regulation failed', { 
      originalError: error instanceof Error ? error.message : String(error) 
    });
  }
}

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
export function run(input: RCCInput | string): RCCResult {
  try {
    const text = validateInput(input);
    const meta = extractMeta(input);
    
    // Run analysis
    const analysisResult = coreAnalyze(text);
    
    // Run regulation
    const regulationResult = coreRegulate(analysisResult, text);
    
    // Run routing
    const routingResult = coreRoute(regulationResult);
    
    return {
      analysis: {
        state: analysisResult.state as RCCState,
        score: analysisResult.score,
        reason: analysisResult.reason as RCCReason
      },
      regulation: {
        action: regulationResult.action as RCCAction,
        message: regulationResult.message
      },
      routing: {
        channel: routingResult.channel as RCCChannel
      },
      meta
    };
  } catch (error) {
    if (isRCCError(error)) throw error;
    throw new RoutingError('Pipeline failed', { 
      originalError: error instanceof Error ? error.message : String(error) 
    });
  }
}

// ─────────────────────────────────────────────────────────────
// Re-exports
// ─────────────────────────────────────────────────────────────

// Types
export type {
  RCCInput,
  RCCAnalysisResult,
  RCCRegulationResult,
  RCCResult,
  RCCState,
  RCCReason,
  RCCAction,
  RCCChannel,
  RCCErrorCode,
  RCCErrorInfo
} from './types';

// Errors
export {
  RCCError,
  InvalidInputError,
  AnalysisError,
  RegulationError,
  RoutingError,
  isRCCError,
  wrapError
} from './errors';
