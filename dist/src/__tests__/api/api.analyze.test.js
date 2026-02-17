"use strict";
/**
 * API Tests - analyze()
 * RCC v1.0.0-DAY10
 */
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../../api");
describe('API: analyze()', () => {
    // ─────────────────────────────────────────────────────────────
    // Basic functionality
    // ─────────────────────────────────────────────────────────────
    describe('basic functionality', () => {
        test('accepts string input', () => {
            const result = (0, api_1.analyze)('hello world');
            expect(result).toHaveProperty('state');
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('reason');
        });
        test('accepts RCCInput object', () => {
            const result = (0, api_1.analyze)({ text: 'hello world' });
            expect(result).toHaveProperty('state');
        });
        test('returns valid state', () => {
            const result = (0, api_1.analyze)('hello world');
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(result.state);
        });
        test('returns score between 0 and 1', () => {
            const result = (0, api_1.analyze)('hello world');
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(1);
        });
        test('returns valid reason', () => {
            const result = (0, api_1.analyze)('hello world');
            expect(['LOW_INTENSITY', 'BASELINE', 'HIGH_INTENSITY', 'INVALID_INPUT']).toContain(result.reason);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // State detection
    // ─────────────────────────────────────────────────────────────
    describe('state detection', () => {
        test('detects CALM for lowercase', () => {
            const result = (0, api_1.analyze)('hello world');
            expect(result.state).toBe('CALM');
        });
        test('detects TENSE for uppercase', () => {
            const result = (0, api_1.analyze)('AAAA');
            expect(result.state).toBe('TENSE');
        });
        test('returns valid state for mixed case', () => {
            const result = (0, api_1.analyze)('Hello WORLD Test MESSAGE');
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(result.state);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Error handling
    // ─────────────────────────────────────────────────────────────
    describe('error handling', () => {
        test('throws InvalidInputError for null', () => {
            expect(() => (0, api_1.analyze)(null)).toThrow(api_1.InvalidInputError);
        });
        test('throws InvalidInputError for undefined', () => {
            expect(() => (0, api_1.analyze)(undefined)).toThrow(api_1.InvalidInputError);
        });
        test('throws InvalidInputError for number', () => {
            expect(() => (0, api_1.analyze)(123)).toThrow(api_1.InvalidInputError);
        });
        test('error is RCCError', () => {
            try {
                (0, api_1.analyze)(null);
            }
            catch (error) {
                expect((0, api_1.isRCCError)(error)).toBe(true);
            }
        });
        test('error has code INVALID_INPUT', () => {
            try {
                (0, api_1.analyze)(null);
            }
            catch (error) {
                expect(error.code).toBe('INVALID_INPUT');
            }
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Determinism
    // ─────────────────────────────────────────────────────────────
    describe('determinism', () => {
        test('same input produces same output', () => {
            const r1 = (0, api_1.analyze)('test input');
            const r2 = (0, api_1.analyze)('test input');
            expect(r1).toEqual(r2);
        });
        test('deterministic across multiple calls', () => {
            const input = 'Hello World Test';
            const results = Array(10).fill(null).map(() => (0, api_1.analyze)(input));
            results.forEach(r => expect(r).toEqual(results[0]));
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Edge cases
    // ─────────────────────────────────────────────────────────────
    describe('edge cases', () => {
        test('handles empty string', () => {
            const result = (0, api_1.analyze)('');
            expect(result.reason).toBe('INVALID_INPUT');
        });
        test('handles whitespace only', () => {
            const result = (0, api_1.analyze)('   ');
            expect(result.reason).toBe('INVALID_INPUT');
        });
        test('handles very long input', () => {
            const longInput = 'a'.repeat(10000);
            expect(() => (0, api_1.analyze)(longInput)).not.toThrow();
        });
        test('handles unicode', () => {
            const result = (0, api_1.analyze)('你好世界 🌍');
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(result.state);
        });
    });
});
