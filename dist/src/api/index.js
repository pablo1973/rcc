"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapError = exports.isRCCError = exports.RoutingError = exports.RegulationError = exports.AnalysisError = exports.InvalidInputError = exports.RCCError = exports.VERSION = exports.MAX_INPUT_LENGTH = void 0;
exports.analyze = analyze;
exports.regulate = regulate;
exports.run = run;
const analyzer_1 = require("../core/analyzer");
const regulator_1 = require("../core/regulator");
const router_1 = require("../core/router");
const errors_1 = require("./errors");
// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
/** Maximum allowed input length */
exports.MAX_INPUT_LENGTH = 10000;
/** RCC version */
exports.VERSION = '1.0.0';
// ─────────────────────────────────────────────────────────────
// Input Validation
// ─────────────────────────────────────────────────────────────
function validateInput(input) {
    // Handle string shorthand
    const text = typeof input === 'string' ? input : input?.text;
    // Validate type
    if (text === null || text === undefined) {
        throw new errors_1.InvalidInputError('Input text is required');
    }
    if (typeof text !== 'string') {
        throw new errors_1.InvalidInputError('Input text must be a string', {
            receivedType: typeof text
        });
    }
    return text;
}
function extractMeta(input) {
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
function analyze(input) {
    try {
        const text = validateInput(input);
        const result = (0, analyzer_1.analyze)(text);
        return {
            state: result.state,
            score: result.score,
            reason: result.reason
        };
    }
    catch (error) {
        if ((0, errors_1.isRCCError)(error))
            throw error;
        throw new errors_1.AnalysisError('Analysis failed', {
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
function regulate(input) {
    try {
        const text = validateInput(input);
        const meta = extractMeta(input);
        // Run analysis
        const analysisResult = (0, analyzer_1.analyze)(text);
        // Run regulation
        const regulationResult = (0, regulator_1.regulate)(analysisResult, text);
        return {
            analysis: {
                state: analysisResult.state,
                score: analysisResult.score,
                reason: analysisResult.reason
            },
            action: regulationResult.action,
            message: regulationResult.message,
            meta
        };
    }
    catch (error) {
        if ((0, errors_1.isRCCError)(error))
            throw error;
        throw new errors_1.RegulationError('Regulation failed', {
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
function run(input) {
    try {
        const text = validateInput(input);
        const meta = extractMeta(input);
        // Run analysis
        const analysisResult = (0, analyzer_1.analyze)(text);
        // Run regulation
        const regulationResult = (0, regulator_1.regulate)(analysisResult, text);
        // Run routing
        const routingResult = (0, router_1.route)(regulationResult);
        return {
            analysis: {
                state: analysisResult.state,
                score: analysisResult.score,
                reason: analysisResult.reason
            },
            regulation: {
                action: regulationResult.action,
                message: regulationResult.message
            },
            routing: {
                channel: routingResult.channel
            },
            meta
        };
    }
    catch (error) {
        if ((0, errors_1.isRCCError)(error))
            throw error;
        throw new errors_1.RoutingError('Pipeline failed', {
            originalError: error instanceof Error ? error.message : String(error)
        });
    }
}
// Errors
var errors_2 = require("./errors");
Object.defineProperty(exports, "RCCError", { enumerable: true, get: function () { return errors_2.RCCError; } });
Object.defineProperty(exports, "InvalidInputError", { enumerable: true, get: function () { return errors_2.InvalidInputError; } });
Object.defineProperty(exports, "AnalysisError", { enumerable: true, get: function () { return errors_2.AnalysisError; } });
Object.defineProperty(exports, "RegulationError", { enumerable: true, get: function () { return errors_2.RegulationError; } });
Object.defineProperty(exports, "RoutingError", { enumerable: true, get: function () { return errors_2.RoutingError; } });
Object.defineProperty(exports, "isRCCError", { enumerable: true, get: function () { return errors_2.isRCCError; } });
Object.defineProperty(exports, "wrapError", { enumerable: true, get: function () { return errors_2.wrapError; } });
