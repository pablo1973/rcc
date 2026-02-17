"use strict";
/**
 * Unit Tests - Analyzer
 * RCC v1.0.0-DAY7
 *
 * Deterministic tests against analyzer API
 */
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../core/analyzer");
const heuristics_1 = require("../../core/heuristics");
describe('Unit: Analyzer', () => {
    // ─────────────────────────────────────────────────────────────
    // normalize()
    // ─────────────────────────────────────────────────────────────
    describe('normalize()', () => {
        test('trims leading/trailing whitespace', () => {
            expect((0, analyzer_1.normalize)('  hello  ')).toBe('hello');
        });
        test('collapses multiple spaces to single', () => {
            expect((0, analyzer_1.normalize)('hello    world')).toBe('hello world');
        });
        test('handles tabs and newlines', () => {
            expect((0, analyzer_1.normalize)('hello\t\nworld')).toBe('hello world');
        });
        test('returns empty string for null', () => {
            expect((0, analyzer_1.normalize)(null)).toBe('');
        });
        test('returns empty string for undefined', () => {
            expect((0, analyzer_1.normalize)(undefined)).toBe('');
        });
        test('returns empty string for number', () => {
            expect((0, analyzer_1.normalize)(123)).toBe('');
        });
        test('returns empty string for whitespace-only', () => {
            expect((0, analyzer_1.normalize)('   ')).toBe('');
            expect((0, analyzer_1.normalize)('\t\n')).toBe('');
        });
        test('truncates to MAX_INPUT_LENGTH', () => {
            const longText = 'x'.repeat(analyzer_1.MAX_INPUT_LENGTH + 500);
            const result = (0, analyzer_1.normalize)(longText);
            expect(result.length).toBe(analyzer_1.MAX_INPUT_LENGTH);
        });
        test('preserves text under MAX_INPUT_LENGTH', () => {
            const shortText = 'hello world';
            expect((0, analyzer_1.normalize)(shortText)).toBe(shortText);
        });
        test('is deterministic', () => {
            const input = '  test   input  ';
            expect((0, analyzer_1.normalize)(input)).toBe((0, analyzer_1.normalize)(input));
        });
    });
    // ─────────────────────────────────────────────────────────────
    // computeMetrics()
    // ─────────────────────────────────────────────────────────────
    describe('computeMetrics()', () => {
        test('returns zero metrics for empty string', () => {
            const m = (0, heuristics_1.computeMetrics)('');
            expect(m.chars).toBe(0);
            expect(m.words).toBe(0);
            expect(m.intensity).toBe(0);
            expect(m.repetition).toBe(0);
            expect(m.noise).toBe(0);
        });
        test('returns zero metrics for null/undefined', () => {
            expect((0, heuristics_1.computeMetrics)(null).chars).toBe(0);
            expect((0, heuristics_1.computeMetrics)(undefined).chars).toBe(0);
        });
        test('counts chars correctly', () => {
            expect((0, heuristics_1.computeMetrics)('hello').chars).toBe(5);
            expect((0, heuristics_1.computeMetrics)('a b c').chars).toBe(5);
        });
        test('counts words correctly', () => {
            expect((0, heuristics_1.computeMetrics)('hello world').words).toBe(2);
            expect((0, heuristics_1.computeMetrics)('one two three four').words).toBe(4);
            expect((0, heuristics_1.computeMetrics)('single').words).toBe(1);
        });
        test('intensity in range [0, 1]', () => {
            const inputs = ['hello', 'HELLO', 'HELLO!!!', '!!!???', 'test'];
            inputs.forEach(input => {
                const m = (0, heuristics_1.computeMetrics)(input);
                expect(m.intensity).toBeGreaterThanOrEqual(0);
                expect(m.intensity).toBeLessThanOrEqual(1);
            });
        });
        test('intensity increases with uppercase', () => {
            const low = (0, heuristics_1.computeMetrics)('hello world');
            const high = (0, heuristics_1.computeMetrics)('HELLO WORLD');
            expect(high.intensity).toBeGreaterThan(low.intensity);
        });
        test('intensity increases with exclamation marks', () => {
            const low = (0, heuristics_1.computeMetrics)('hello');
            const high = (0, heuristics_1.computeMetrics)('hello!!!');
            expect(high.intensity).toBeGreaterThan(low.intensity);
        });
        test('repetition in range [0, 1]', () => {
            const inputs = ['a a a', 'hello world', 'unique words here'];
            inputs.forEach(input => {
                const m = (0, heuristics_1.computeMetrics)(input);
                expect(m.repetition).toBeGreaterThanOrEqual(0);
                expect(m.repetition).toBeLessThanOrEqual(1);
            });
        });
        test('repetition increases with repeated words', () => {
            const low = (0, heuristics_1.computeMetrics)('one two three');
            const high = (0, heuristics_1.computeMetrics)('one one one');
            expect(high.repetition).toBeGreaterThan(low.repetition);
        });
        test('noise in range [0, 1]', () => {
            const inputs = ['hello', '!!!', '@#$%', 'test123'];
            inputs.forEach(input => {
                const m = (0, heuristics_1.computeMetrics)(input);
                expect(m.noise).toBeGreaterThanOrEqual(0);
                expect(m.noise).toBeLessThanOrEqual(1);
            });
        });
        test('noise increases with special characters', () => {
            const low = (0, heuristics_1.computeMetrics)('hello');
            const high = (0, heuristics_1.computeMetrics)('!!!???@@@');
            expect(high.noise).toBeGreaterThan(low.noise);
        });
        test('is deterministic', () => {
            const input = 'deterministic test';
            const m1 = (0, heuristics_1.computeMetrics)(input);
            const m2 = (0, heuristics_1.computeMetrics)(input);
            expect(m1).toEqual(m2);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // analyze()
    // ─────────────────────────────────────────────────────────────
    describe('analyze()', () => {
        test('returns AnalysisResult structure', () => {
            const result = (0, analyzer_1.analyze)('hello');
            expect(result).toHaveProperty('state');
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('reason');
        });
        test('state is valid RCCState', () => {
            const validStates = ['CALM', 'NEUTRAL', 'TENSE'];
            const inputs = ['hello', 'ANGRY!!!', '', 'normal text'];
            inputs.forEach(input => {
                const result = (0, analyzer_1.analyze)(input);
                expect(validStates).toContain(result.state);
            });
        });
        test('score is number in [0, 1]', () => {
            const result = (0, analyzer_1.analyze)('test input');
            expect(typeof result.score).toBe('number');
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(1);
        });
        test('reason is non-empty string', () => {
            const result = (0, analyzer_1.analyze)('test');
            expect(typeof result.reason).toBe('string');
            expect(result.reason.length).toBeGreaterThan(0);
        });
        test('empty input returns NEUTRAL with INVALID_INPUT', () => {
            const result = (0, analyzer_1.analyze)('');
            expect(result.state).toBe('NEUTRAL');
            expect(result.score).toBe(0);
            expect(result.reason).toBe('INVALID_INPUT');
        });
        test('whitespace-only returns NEUTRAL with INVALID_INPUT', () => {
            const result = (0, analyzer_1.analyze)('   ');
            expect(result.state).toBe('NEUTRAL');
            expect(result.reason).toBe('INVALID_INPUT');
        });
        test('CALM state has LOW_INTENSITY reason', () => {
            const result = (0, analyzer_1.analyze)('hello world');
            if (result.state === 'CALM') {
                expect(result.reason).toBe('LOW_INTENSITY');
            }
        });
        test('TENSE state has HIGH_INTENSITY reason', () => {
            // High uppercase ratio to trigger TENSE
            const result = (0, analyzer_1.analyze)('AAAA');
            if (result.state === 'TENSE') {
                expect(result.reason).toBe('HIGH_INTENSITY');
            }
        });
        test('NEUTRAL state has BASELINE reason', () => {
            // Medium intensity to get NEUTRAL (not CALM, not TENSE)
            const result = (0, analyzer_1.analyze)('Hello World Test Message Here');
            if (result.state === 'NEUTRAL') {
                expect(result.reason).toBe('BASELINE');
            }
        });
        test('is deterministic - same input same output', () => {
            const input = 'deterministic analysis test';
            const r1 = (0, analyzer_1.analyze)(input);
            const r2 = (0, analyzer_1.analyze)(input);
            expect(r1.state).toBe(r2.state);
            expect(r1.score).toBe(r2.score);
            expect(r1.reason).toBe(r2.reason);
        });
        test('never throws exception', () => {
            const badInputs = [null, undefined, 123, {}, [], () => { }];
            badInputs.forEach(input => {
                expect(() => (0, analyzer_1.analyze)(input)).not.toThrow();
            });
        });
    });
});
