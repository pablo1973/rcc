/**
 * RCC Public API Types
 * v1.0.0-DAY10
 *
 * Public type definitions for RCC consumers
 */
/**
 * Input message for RCC processing
 */
export interface RCCInput {
    /** Raw message text to analyze */
    text: string;
    /** Optional metadata for context */
    meta?: Record<string, unknown>;
}
/**
 * Detected emotional state of the input
 */
export type RCCState = 'CALM' | 'NEUTRAL' | 'TENSE';
/**
 * Reason for the state classification
 */
export type RCCReason = 'LOW_INTENSITY' | 'BASELINE' | 'HIGH_INTENSITY' | 'INVALID_INPUT';
/**
 * Regulation action to apply
 */
export type RCCAction = 'PASSTHROUGH' | 'SOFTEN' | 'SUMMARIZE' | 'PAUSE';
/**
 * Output channel for routing
 */
export type RCCChannel = 'TEXT' | 'COOLDOWN';
/**
 * Analysis result from analyze()
 */
export interface RCCAnalysisResult {
    /** Detected emotional state */
    state: RCCState;
    /** Confidence score (0-1) */
    score: number;
    /** Reason for classification */
    reason: RCCReason;
}
/**
 * Regulation result from regulate()
 */
export interface RCCRegulationResult {
    /** Analysis of input */
    analysis: RCCAnalysisResult;
    /** Action taken */
    action: RCCAction;
    /** Processed message */
    message: string;
    /** Preserved metadata */
    meta: Record<string, unknown>;
}
/**
 * Full pipeline result from run()
 */
export interface RCCResult {
    /** Analysis of input */
    analysis: RCCAnalysisResult;
    /** Regulation applied */
    regulation: {
        action: RCCAction;
        message: string;
    };
    /** Routing decision */
    routing: {
        channel: RCCChannel;
    };
    /** Preserved metadata */
    meta: Record<string, unknown>;
}
/**
 * Error codes for RCC operations
 */
export type RCCErrorCode = 'INVALID_INPUT' | 'INPUT_TOO_LONG' | 'ANALYSIS_FAILED' | 'REGULATION_FAILED' | 'ROUTING_FAILED';
/**
 * Structured error information
 */
export interface RCCErrorInfo {
    code: RCCErrorCode;
    message: string;
    details?: Record<string, unknown>;
}
