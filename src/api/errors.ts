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
export class RCCError extends Error {
  public readonly code: RCCErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(code: RCCErrorCode, message: string, details?: Record<string, unknown>) {
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
  toInfo(): RCCErrorInfo {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }

  /**
   * Converts error to JSON-serializable object
   */
  toJSON(): RCCErrorInfo {
    return this.toInfo();
  }
}

/**
 * Error thrown when input is invalid (null, undefined, non-string)
 */
export class InvalidInputError extends RCCError {
  constructor(message: string = 'Input must be a non-empty string', details?: Record<string, unknown>) {
    super('INVALID_INPUT', message, details);
    this.name = 'InvalidInputError';
  }
}

/**
 * Error thrown when input exceeds maximum length
 */
export class InputTooLongError extends RCCError {
  public readonly maxLength: number;
  public readonly actualLength: number;

  constructor(actualLength: number, maxLength: number) {
    super(
      'INPUT_TOO_LONG',
      `Input length ${actualLength} exceeds maximum ${maxLength}`,
      { actualLength, maxLength }
    );
    this.name = 'InputTooLongError';
    this.maxLength = maxLength;
    this.actualLength = actualLength;
  }
}

/**
 * Error thrown when analysis fails
 */
export class AnalysisError extends RCCError {
  constructor(message: string = 'Analysis failed', details?: Record<string, unknown>) {
    super('ANALYSIS_FAILED', message, details);
    this.name = 'AnalysisError';
  }
}

/**
 * Error thrown when regulation fails
 */
export class RegulationError extends RCCError {
  constructor(message: string = 'Regulation failed', details?: Record<string, unknown>) {
    super('REGULATION_FAILED', message, details);
    this.name = 'RegulationError';
  }
}

/**
 * Error thrown when routing fails
 */
export class RoutingError extends RCCError {
  constructor(message: string = 'Routing failed', details?: Record<string, unknown>) {
    super('ROUTING_FAILED', message, details);
    this.name = 'RoutingError';
  }
}

/**
 * Type guard to check if an error is an RCCError
 */
export function isRCCError(error: unknown): error is RCCError {
  return error instanceof RCCError;
}

/**
 * Wraps unknown errors in RCCError
 */
export function wrapError(error: unknown, defaultCode: RCCErrorCode = 'ANALYSIS_FAILED'): RCCError {
  if (isRCCError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return new RCCError(defaultCode, error.message, { originalError: error.name });
  }
  
  return new RCCError(defaultCode, String(error));
}
