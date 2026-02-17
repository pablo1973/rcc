/**
 * RCC Public API Errors
 * v1.0.0-DAY10
 *
 * Typed error classes for RCC operations
 */
import { RCCErrorCode, RCCErrorInfo } from './types';
/**
 * Base error class for all RCC errors
 */
export declare class RCCError extends Error {
    readonly code: RCCErrorCode;
    readonly details?: Record<string, unknown>;
    constructor(code: RCCErrorCode, message: string, details?: Record<string, unknown>);
    /**
     * Converts error to structured info object
     */
    toInfo(): RCCErrorInfo;
    /**
     * Converts error to JSON-serializable object
     */
    toJSON(): RCCErrorInfo;
}
/**
 * Error thrown when input is invalid (null, undefined, non-string)
 */
export declare class InvalidInputError extends RCCError {
    constructor(message?: string, details?: Record<string, unknown>);
}
/**
 * Error thrown when input exceeds maximum length
 */
export declare class InputTooLongError extends RCCError {
    readonly maxLength: number;
    readonly actualLength: number;
    constructor(actualLength: number, maxLength: number);
}
/**
 * Error thrown when analysis fails
 */
export declare class AnalysisError extends RCCError {
    constructor(message?: string, details?: Record<string, unknown>);
}
/**
 * Error thrown when regulation fails
 */
export declare class RegulationError extends RCCError {
    constructor(message?: string, details?: Record<string, unknown>);
}
/**
 * Error thrown when routing fails
 */
export declare class RoutingError extends RCCError {
    constructor(message?: string, details?: Record<string, unknown>);
}
/**
 * Type guard to check if an error is an RCCError
 */
export declare function isRCCError(error: unknown): error is RCCError;
/**
 * Wraps unknown errors in RCCError
 */
export declare function wrapError(error: unknown, defaultCode?: RCCErrorCode): RCCError;
