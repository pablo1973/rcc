"use strict";
/**
 * RCC Public API Errors
 * v1.0.0-DAY10
 *
 * Typed error classes for RCC operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingError = exports.RegulationError = exports.AnalysisError = exports.InputTooLongError = exports.InvalidInputError = exports.RCCError = void 0;
exports.isRCCError = isRCCError;
exports.wrapError = wrapError;
/**
 * Base error class for all RCC errors
 */
class RCCError extends Error {
    constructor(code, message, details) {
        super(message);
        this.name = 'RCCError';
        this.code = code;
        this.details = details;
        // Maintains proper stack trace in V8
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RCCError);
        }
    }
    /**
     * Converts error to structured info object
     */
    toInfo() {
        return {
            code: this.code,
            message: this.message,
            details: this.details
        };
    }
    /**
     * Converts error to JSON-serializable object
     */
    toJSON() {
        return this.toInfo();
    }
}
exports.RCCError = RCCError;
/**
 * Error thrown when input is invalid (null, undefined, non-string)
 */
class InvalidInputError extends RCCError {
    constructor(message = 'Input must be a non-empty string', details) {
        super('INVALID_INPUT', message, details);
        this.name = 'InvalidInputError';
    }
}
exports.InvalidInputError = InvalidInputError;
/**
 * Error thrown when input exceeds maximum length
 */
class InputTooLongError extends RCCError {
    constructor(actualLength, maxLength) {
        super('INPUT_TOO_LONG', `Input length ${actualLength} exceeds maximum ${maxLength}`, { actualLength, maxLength });
        this.name = 'InputTooLongError';
        this.maxLength = maxLength;
        this.actualLength = actualLength;
    }
}
exports.InputTooLongError = InputTooLongError;
/**
 * Error thrown when analysis fails
 */
class AnalysisError extends RCCError {
    constructor(message = 'Analysis failed', details) {
        super('ANALYSIS_FAILED', message, details);
        this.name = 'AnalysisError';
    }
}
exports.AnalysisError = AnalysisError;
/**
 * Error thrown when regulation fails
 */
class RegulationError extends RCCError {
    constructor(message = 'Regulation failed', details) {
        super('REGULATION_FAILED', message, details);
        this.name = 'RegulationError';
    }
}
exports.RegulationError = RegulationError;
/**
 * Error thrown when routing fails
 */
class RoutingError extends RCCError {
    constructor(message = 'Routing failed', details) {
        super('ROUTING_FAILED', message, details);
        this.name = 'RoutingError';
    }
}
exports.RoutingError = RoutingError;
/**
 * Type guard to check if an error is an RCCError
 */
function isRCCError(error) {
    return error instanceof RCCError;
}
/**
 * Wraps unknown errors in RCCError
 */
function wrapError(error, defaultCode = 'ANALYSIS_FAILED') {
    if (isRCCError(error)) {
        return error;
    }
    if (error instanceof Error) {
        return new RCCError(defaultCode, error.message, { originalError: error.name });
    }
    return new RCCError(defaultCode, String(error));
}
