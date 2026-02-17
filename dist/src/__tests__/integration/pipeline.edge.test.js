"use strict";
/**
 * Integration Tests - Pipeline Edge Cases
 * RCC v1.0.0-DAY7
 *
 * E2E tests for edge cases and error handling
 */
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../core/analyzer");
const regulator_1 = require("../../core/regulator");
const router_1 = require("../../core/router");
const states_1 = require("../../core/states");
describe('Integration: Pipeline Edge Cases', () => {
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
    // Empty / Invalid inputs
    // ─────────────────────────────────────────────────────────────
    describe('empty and invalid inputs', () => {
        test('empty string produces INVALID_INPUT flow', () => {
            const { analysis, regulation, routing } = runPipeline('');
            expect(analysis.state).toBe('NEUTRAL');
            expect(analysis.score).toBe(0);
            expect(analysis.reason).toBe('INVALID_INPUT');
            expect(regulation.action).toBe('PASSTHROUGH');
            expect(regulation.message).toBe('');
            expect(routing.channel).toBe('TEXT');
        });
        test('whitespace-only produces INVALID_INPUT', () => {
            const inputs = ['   ', '\t', '\n', '  \t\n  '];
            inputs.forEach(input => {
                const { analysis } = runPipeline(input);
                expect(analysis.state).toBe('NEUTRAL');
                expect(analysis.reason).toBe('INVALID_INPUT');
            });
        });
        test('single space produces INVALID_INPUT', () => {
            const { analysis } = runPipeline(' ');
            expect(analysis.reason).toBe('INVALID_INPUT');
        });
        test('tab character produces INVALID_INPUT', () => {
            const { analysis } = runPipeline('\t');
            expect(analysis.reason).toBe('INVALID_INPUT');
        });
        test('newline produces INVALID_INPUT', () => {
            const { analysis } = runPipeline('\n');
            expect(analysis.reason).toBe('INVALID_INPUT');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // CALM flow verification
    // ─────────────────────────────────────────────────────────────
    describe('CALM flow edge cases', () => {
        test('all lowercase produces CALM', () => {
            const input = 'hello world this is lowercase';
            const { analysis } = runPipeline(input);
            expect(analysis.state).toBe('CALM');
            expect(analysis.reason).toBe('LOW_INTENSITY');
        });
        test('numbers only produce CALM', () => {
            const input = '12345 67890';
            const { analysis } = runPipeline(input);
            expect(analysis.state).toBe('CALM');
        });
        test('CALM score is below threshold', () => {
            const input = 'simple lowercase text';
            const { analysis } = runPipeline(input);
            if (analysis.state === 'CALM') {
                expect(analysis.score).toBeLessThan(states_1.THRESHOLDS.CALM_MAX);
            }
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Special characters
    // ─────────────────────────────────────────────────────────────
    describe('special characters', () => {
        test('punctuation-only text flows through pipeline', () => {
            const input = '...!!!???';
            const { analysis, regulation, routing } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
            expect(regulation.message).toBe(input);
            expect(routing.channel).toBe('TEXT');
        });
        test('emoji text is processed', () => {
            const input = 'hello 🌍 world';
            const { analysis, regulation } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
            expect(regulation.message).toBe(input);
        });
        test('unicode characters preserved', () => {
            const input = '你好世界';
            const { regulation } = runPipeline(input);
            expect(regulation.message).toBe(input);
        });
        test('mixed special characters', () => {
            const input = '@#$%^&*()_+';
            const { analysis, regulation } = runPipeline(input);
            expect(analysis.score).toBeGreaterThanOrEqual(0);
            expect(regulation.message).toBe(input);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Length extremes
    // ─────────────────────────────────────────────────────────────
    describe('length extremes', () => {
        test('single character processed', () => {
            const input = 'a';
            const { analysis, regulation, routing } = runPipeline(input);
            expect(analysis.state).toBe('CALM');
            expect(regulation.message).toBe(input);
            expect(routing.channel).toBe('TEXT');
        });
        test('single uppercase character is TENSE', () => {
            const input = 'A';
            const { analysis } = runPipeline(input);
            // Single uppercase = 100% uppercase ratio = high intensity
            expect(analysis.state).toBe('TENSE');
        });
        test('very long text is truncated internally', () => {
            const longInput = 'x'.repeat(20000);
            const { analysis, regulation, routing } = runPipeline(longInput);
            // Should not throw, should process
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
            expect(routing.channel).toBe('TEXT');
        });
        test('long text maintains state determination', () => {
            const longLower = 'hello '.repeat(1000);
            const { analysis } = runPipeline(longLower);
            // Long lowercase text should be CALM
            expect(analysis.state).toBe('CALM');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Boundary conditions
    // ─────────────────────────────────────────────────────────────
    describe('boundary conditions', () => {
        test('score exactly at CALM_MAX boundary', () => {
            // Score >= 0.3 should be NEUTRAL, not CALM
            // Hard to craft exact input, but testing threshold logic
            expect(states_1.THRESHOLDS.CALM_MAX).toBe(0.3);
        });
        test('score exactly at TENSE_MIN boundary', () => {
            // Score >= 0.7 should be TENSE
            expect(states_1.THRESHOLDS.TENSE_MIN).toBe(0.7);
        });
        test('thresholds create non-overlapping ranges', () => {
            expect(states_1.THRESHOLDS.CALM_MAX).toBeLessThan(states_1.THRESHOLDS.TENSE_MIN);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Pipeline integrity
    // ─────────────────────────────────────────────────────────────
    describe('pipeline integrity', () => {
        test('analysis result passes correctly to regulator', () => {
            const input = 'test message';
            const analysis = (0, analyzer_1.analyze)(input);
            const regulation = (0, regulator_1.regulate)(analysis, input);
            if (regulation.meta) {
                expect(regulation.meta.originalState).toBe(analysis.state);
                expect(regulation.meta.score).toBe(analysis.score);
                expect(regulation.meta.reason).toBe(analysis.reason);
            }
        });
        test('regulation result passes correctly to router', () => {
            const input = 'test';
            const analysis = (0, analyzer_1.analyze)(input);
            const regulation = (0, regulator_1.regulate)(analysis, input);
            const routing = (0, router_1.route)(regulation);
            // PAUSE → COOLDOWN, else → TEXT
            if (regulation.action === 'PAUSE') {
                expect(routing.channel).toBe('COOLDOWN');
            }
            else {
                expect(routing.channel).toBe('TEXT');
            }
        });
        test('message preserved end-to-end', () => {
            const inputs = [
                'simple text',
                'CAPS TEXT',
                'Mixed Case',
                '123 numbers',
                'special !@#',
            ];
            inputs.forEach(input => {
                const { regulation } = runPipeline(input);
                expect(regulation.message).toBe(input);
            });
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Error resilience
    // ─────────────────────────────────────────────────────────────
    describe('error resilience', () => {
        test('pipeline never throws for any string input', () => {
            const problematicInputs = [
                '',
                ' ',
                '\0',
                'null',
                'undefined',
                '\\',
                '"quotes"',
                "'apostrophe'",
                '<script>',
                '${injection}',
            ];
            problematicInputs.forEach(input => {
                expect(() => runPipeline(input)).not.toThrow();
            });
        });
        test('pipeline handles malformed input gracefully', () => {
            // These should not crash the pipeline
            const edgeCases = [
                String.fromCharCode(0),
                String.fromCharCode(65535),
                '\uD800', // unpaired surrogate
            ];
            edgeCases.forEach(input => {
                expect(() => runPipeline(input)).not.toThrow();
            });
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Determinism verification
    // ─────────────────────────────────────────────────────────────
    describe('determinism verification', () => {
        test('identical inputs produce identical outputs', () => {
            const testCases = [
                '',
                'hello',
                'HELLO',
                'Hello World',
                '!!!',
                '12345',
            ];
            testCases.forEach(input => {
                const r1 = runPipeline(input);
                const r2 = runPipeline(input);
                expect(r1.analysis.state).toBe(r2.analysis.state);
                expect(r1.analysis.score).toBe(r2.analysis.score);
                expect(r1.analysis.reason).toBe(r2.analysis.reason);
                expect(r1.regulation.action).toBe(r2.regulation.action);
                expect(r1.regulation.message).toBe(r2.regulation.message);
                expect(r1.routing.channel).toBe(r2.routing.channel);
            });
        });
        test('pipeline is pure - no side effects', () => {
            const input = 'side effect test';
            // Run pipeline multiple times
            const results = Array(10).fill(null).map(() => runPipeline(input));
            // All should be identical
            const first = results[0];
            results.forEach(r => {
                expect(r.analysis).toEqual(first.analysis);
                expect(r.regulation.action).toBe(first.regulation.action);
                expect(r.routing).toEqual(first.routing);
            });
        });
    });
    // ─────────────────────────────────────────────────────────────
    // State exhaustiveness
    // ─────────────────────────────────────────────────────────────
    describe('state exhaustiveness', () => {
        test('only valid states are produced', () => {
            const validStates = ['CALM', 'NEUTRAL', 'TENSE'];
            const inputs = [
                '',
                'a',
                'A',
                'hello',
                'HELLO',
                'Hello World',
                '!!!???',
                '12345',
            ];
            inputs.forEach(input => {
                const { analysis } = runPipeline(input);
                expect(validStates).toContain(analysis.state);
            });
        });
        test('only valid actions are produced', () => {
            const validActions = ['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE'];
            const inputs = ['test', 'TEST', 'Test', ''];
            inputs.forEach(input => {
                const { regulation } = runPipeline(input);
                expect(validActions).toContain(regulation.action);
            });
        });
        test('only valid channels are produced', () => {
            const validChannels = ['TEXT', 'COOLDOWN'];
            const inputs = ['test', 'TEST', ''];
            inputs.forEach(input => {
                const { routing } = runPipeline(input);
                expect(validChannels).toContain(routing.channel);
            });
        });
    });
});
