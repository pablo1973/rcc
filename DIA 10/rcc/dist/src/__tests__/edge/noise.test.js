"use strict";
/**
 * Edge Cases - Noise Patterns
 * RCC v1.0.0-DAY8
 *
 * Validates: no-crash, stable output, coherent state
 * for noisy/garbage inputs
 */
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../core/analyzer");
const regulator_1 = require("../../core/regulator");
const router_1 = require("../../core/router");
describe('Edge: Noise Patterns', () => {
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
    // Pure punctuation
    // ─────────────────────────────────────────────────────────────
    describe('pure punctuation', () => {
        test('only exclamation marks', () => {
            const input = '!!!!!!!!!';
            expect(() => runPipeline(input)).not.toThrow();
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
        test('only question marks', () => {
            const input = '?????????';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('mixed exclamation and question', () => {
            const input = '!?!?!?!?!?';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('only dots', () => {
            const input = '..........';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('ellipsis repeated', () => {
            const input = '... ... ... ...';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('only commas', () => {
            const input = ',,,,,,,,,,';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Special symbols
    // ─────────────────────────────────────────────────────────────
    describe('special symbols', () => {
        test('at symbols', () => {
            const input = '@@@@@@@@@@';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('hash symbols', () => {
            const input = '##########';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('dollar signs', () => {
            const input = '$$$$$$$$$$';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('percent signs', () => {
            const input = '%%%%%%%%%%';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('ampersands', () => {
            const input = '&&&&&&&&&&';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('asterisks', () => {
            const input = '**********';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('mixed symbols', () => {
            const input = '@#$%^&*()!';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Brackets and delimiters
    // ─────────────────────────────────────────────────────────────
    describe('brackets and delimiters', () => {
        test('parentheses', () => {
            const input = '((((()))))';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('square brackets', () => {
            const input = '[[[[[]]]]]';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('curly braces', () => {
            const input = '{{{{{}}}}}';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('angle brackets', () => {
            const input = '<<<<<>>>>>';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('mixed brackets', () => {
            const input = '([{<>}])';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('unbalanced brackets', () => {
            const input = '(((([[[[';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Quotes and apostrophes
    // ─────────────────────────────────────────────────────────────
    describe('quotes and apostrophes', () => {
        test('single quotes', () => {
            const input = "''''''''''";
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('double quotes', () => {
            const input = '""""""""""';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('backticks', () => {
            const input = '``````````';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('smart quotes', () => {
            const input = '\u201C\u201D\u2018\u2019\u2018\u2019\u201C\u201D';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Escape sequences as literal text
    // ─────────────────────────────────────────────────────────────
    describe('escape-like sequences', () => {
        test('backslashes', () => {
            const input = '\\\\\\\\\\\\';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('forward slashes', () => {
            const input = '//////////';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('mixed slashes', () => {
            const input = '\\/\\/\\/\\/';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('escape-n literal', () => {
            const input = '\\n\\n\\n\\n';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // High noise ratio
    // ─────────────────────────────────────────────────────────────
    describe('high noise ratio', () => {
        test('100% noise (all symbols)', () => {
            const input = '@#$%^&*()!';
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
        test('high noise long string', () => {
            const input = '!@#$%'.repeat(100);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('noise with some letters', () => {
            const input = 'a!@#b$%^c&*()';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('noise ratio affects scoring', () => {
            const lowNoise = 'hello world';
            const highNoise = '!!!???@@@';
            const r1 = runPipeline(lowNoise);
            const r2 = runPipeline(highNoise);
            // Both should produce valid results
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(r1.analysis.state);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(r2.analysis.state);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Control characters
    // ─────────────────────────────────────────────────────────────
    describe('control characters', () => {
        test('null byte', () => {
            const input = '\0';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('bell character', () => {
            const input = '\x07';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('backspace', () => {
            const input = '\x08';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('form feed', () => {
            const input = '\x0C';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('vertical tab', () => {
            const input = '\x0B';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('mixed control chars', () => {
            const input = '\x00\x07\x08\x0B\x0C';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('control chars with text', () => {
            const input = 'hello\x00world\x07test';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Binary-like patterns
    // ─────────────────────────────────────────────────────────────
    describe('binary-like patterns', () => {
        test('zeros and ones', () => {
            const input = '01010101010101';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('hex-like string', () => {
            const input = '0xDEADBEEF';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('base64-like', () => {
            const input = 'SGVsbG8gV29ybGQ=';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('random hex chars', () => {
            const input = 'ABCDEF0123456789';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Code injection patterns (treated as text)
    // ─────────────────────────────────────────────────────────────
    describe('code-like patterns', () => {
        test('HTML tags', () => {
            const input = '<script>alert("xss")</script>';
            expect(() => runPipeline(input)).not.toThrow();
            const { regulation } = runPipeline(input);
            expect(regulation.message).toBe(input);
        });
        test('SQL-like', () => {
            const input = "'; DROP TABLE users; --";
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('template literals', () => {
            const input = '${process.env.SECRET}';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('regex-like', () => {
            const input = '/^[a-z]+$/gi';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('JSON-like', () => {
            const input = '{"key": "value", "num": 123}';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // URL and path patterns
    // ─────────────────────────────────────────────────────────────
    describe('URL and path patterns', () => {
        test('URL', () => {
            const input = 'https://example.com/path?query=value&other=123';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('file path Unix', () => {
            const input = '/usr/local/bin/program';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('file path Windows', () => {
            const input = 'C:\\Users\\test\\Documents\\file.txt';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('email-like', () => {
            const input = 'test@example.com';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Determinism for noisy inputs
    // ─────────────────────────────────────────────────────────────
    describe('determinism', () => {
        test('same noisy input = same output', () => {
            const input = '!@#$%^&*()';
            const r1 = runPipeline(input);
            const r2 = runPipeline(input);
            expect(r1.analysis).toEqual(r2.analysis);
        });
        test('deterministic for control chars', () => {
            const input = '\x00\x07\x08';
            const r1 = runPipeline(input);
            const r2 = runPipeline(input);
            expect(r1.analysis.state).toBe(r2.analysis.state);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // State coherence
    // ─────────────────────────────────────────────────────────────
    describe('state coherence', () => {
        test('noisy input produces valid state', () => {
            const input = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
        test('noisy input produces valid action', () => {
            const input = '@#$%^';
            const { regulation } = runPipeline(input);
            expect(['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE']).toContain(regulation.action);
        });
        test('noisy input routes to valid channel', () => {
            const input = '!!!???';
            const { routing } = runPipeline(input);
            expect(['TEXT', 'COOLDOWN']).toContain(routing.channel);
        });
        test('message preserved for noisy input', () => {
            const input = '!@#test$%^';
            const { regulation } = runPipeline(input);
            expect(regulation.message).toBe(input);
        });
    });
});
