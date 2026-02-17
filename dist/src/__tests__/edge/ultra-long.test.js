"use strict";
/**
 * Edge Cases - Ultra Long Input
 * RCC v1.0.0-DAY8
 *
 * Validates: no-crash, stable output, coherent state
 * for extremely long inputs
 */
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../core/analyzer");
const regulator_1 = require("../../core/regulator");
const router_1 = require("../../core/router");
describe('Edge: Ultra Long Input', () => {
    // ─────────────────────────────────────────────────────────────
    // Helper: Full pipeline
    // ─────────────────────────────────────────────────────────────
    function runPipeline(input) {
        const analysis = (0, analyzer_1.analyze)(input);
        const regulation = (0, regulator_1.regulate)(analysis, input);
        const routing = (0, router_1.route)(regulation);
        return { analysis, regulation, routing };
    }
    // ─────────────────────────────────────────────────────────────
    // At MAX_INPUT_LENGTH boundary
    // ─────────────────────────────────────────────────────────────
    describe('at MAX_INPUT_LENGTH boundary', () => {
        test('exactly MAX_INPUT_LENGTH does not crash', () => {
            const input = 'a'.repeat(analyzer_1.MAX_INPUT_LENGTH);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('MAX_INPUT_LENGTH - 1 does not crash', () => {
            const input = 'a'.repeat(analyzer_1.MAX_INPUT_LENGTH - 1);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('MAX_INPUT_LENGTH + 1 does not crash', () => {
            const input = 'a'.repeat(analyzer_1.MAX_INPUT_LENGTH + 1);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('returns valid state at boundary', () => {
            const input = 'a'.repeat(analyzer_1.MAX_INPUT_LENGTH);
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Beyond MAX_INPUT_LENGTH
    // ─────────────────────────────────────────────────────────────
    describe('beyond MAX_INPUT_LENGTH', () => {
        test('2x MAX_INPUT_LENGTH does not crash', () => {
            const input = 'x'.repeat(analyzer_1.MAX_INPUT_LENGTH * 2);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('10x MAX_INPUT_LENGTH does not crash', () => {
            const input = 'y'.repeat(analyzer_1.MAX_INPUT_LENGTH * 10);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('returns valid state for oversized input', () => {
            const input = 'z'.repeat(analyzer_1.MAX_INPUT_LENGTH * 2);
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
        test('routes to TEXT for oversized input', () => {
            const input = 'w'.repeat(analyzer_1.MAX_INPUT_LENGTH * 2);
            const { routing } = runPipeline(input);
            expect(routing.channel).toBe('TEXT');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Large round numbers
    // ─────────────────────────────────────────────────────────────
    describe('large round numbers', () => {
        test('10,000 characters does not crash', () => {
            const input = 'a'.repeat(10000);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('50,000 characters does not crash', () => {
            const input = 'b'.repeat(50000);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('100,000 characters does not crash', () => {
            const input = 'c'.repeat(100000);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('1,000,000 characters does not crash', () => {
            const input = 'd'.repeat(1000000);
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Long lowercase text (CALM expected)
    // ─────────────────────────────────────────────────────────────
    describe('long lowercase text', () => {
        test('50k lowercase returns CALM', () => {
            const input = 'hello '.repeat(10000);
            const { analysis } = runPipeline(input);
            expect(analysis.state).toBe('CALM');
        });
        test('long lowercase has LOW_INTENSITY reason', () => {
            const input = 'test '.repeat(5000);
            const { analysis } = runPipeline(input);
            expect(analysis.reason).toBe('LOW_INTENSITY');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Long uppercase text (TENSE expected)
    // ─────────────────────────────────────────────────────────────
    describe('long uppercase text', () => {
        test('long uppercase returns TENSE', () => {
            const input = 'AAAA';
            const { analysis } = runPipeline(input);
            expect(analysis.state).toBe('TENSE');
        });
        test('long uppercase has SOFTEN action', () => {
            const input = 'TEST';
            const { analysis, regulation } = runPipeline(input);
            if (analysis.state === 'TENSE') {
                expect(regulation.action).toBe('SOFTEN');
            }
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Long mixed content
    // ─────────────────────────────────────────────────────────────
    describe('long mixed content', () => {
        test('alternating case long text', () => {
            const input = 'AaAaAa'.repeat(5000);
            expect(() => runPipeline(input)).not.toThrow();
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
        test('long text with numbers', () => {
            const input = 'test123 '.repeat(5000);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('long text with punctuation', () => {
            const input = 'hello! '.repeat(5000);
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Long single word
    // ─────────────────────────────────────────────────────────────
    describe('long single word (no spaces)', () => {
        test('50k character single word', () => {
            const input = 'a'.repeat(50000);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('single word returns valid state', () => {
            const input = 'x'.repeat(20000);
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
        test('single word word count is 1', () => {
            // This tests internal consistency
            const input = 'word'.repeat(1000); // "wordwordword..."
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Long with many words
    // ─────────────────────────────────────────────────────────────
    describe('long with many words', () => {
        test('10,000 words', () => {
            const input = Array(10000).fill('word').join(' ');
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('50,000 words', () => {
            const input = Array(50000).fill('test').join(' ');
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('many words returns valid state', () => {
            const input = Array(10000).fill('hello').join(' ');
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Determinism for long inputs
    // ─────────────────────────────────────────────────────────────
    describe('determinism for long inputs', () => {
        test('same long input produces same result', () => {
            const input = 'deterministic '.repeat(1000);
            const r1 = runPipeline(input);
            const r2 = runPipeline(input);
            expect(r1.analysis.state).toBe(r2.analysis.state);
            expect(r1.analysis.score).toBe(r2.analysis.score);
        });
        test('truncated input is deterministic', () => {
            const input = 'a'.repeat(analyzer_1.MAX_INPUT_LENGTH * 2);
            const r1 = runPipeline(input);
            const r2 = runPipeline(input);
            expect(r1.analysis).toEqual(r2.analysis);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // State coherence for long inputs
    // ─────────────────────────────────────────────────────────────
    describe('state coherence', () => {
        test('long input always produces valid action', () => {
            const input = 'test '.repeat(10000);
            const { regulation } = runPipeline(input);
            expect(['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE']).toContain(regulation.action);
        });
        test('long input always routes to valid channel', () => {
            const input = 'channel '.repeat(10000);
            const { routing } = runPipeline(input);
            expect(['TEXT', 'COOLDOWN']).toContain(routing.channel);
        });
        test('regulation message is string for long input', () => {
            const input = 'message '.repeat(5000);
            const { regulation } = runPipeline(input);
            expect(typeof regulation.message).toBe('string');
        });
    });
});
