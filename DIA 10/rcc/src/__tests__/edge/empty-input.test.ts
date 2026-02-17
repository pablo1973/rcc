/**
 * Edge Cases - Empty Input
 * RCC v1.0.0-DAY8
 * 
 * Validates: no-crash, stable output, coherent state
 * for empty and near-empty inputs
 */

import { analyze } from '../../core/analyzer';
import { regulate } from '../../core/regulator';
import { route } from '../../core/router';

describe('Edge: Empty Input', () => {

  // ─────────────────────────────────────────────────────────────
  // Helper: Full pipeline
  // ─────────────────────────────────────────────────────────────
  function runPipeline(input: string) {
    const analysis = analyze(input);
    const regulation = regulate(analysis, input);
    const routing = route(regulation);
    return { analysis, regulation, routing };
  }

  // ─────────────────────────────────────────────────────────────
  // Empty string
  // ─────────────────────────────────────────────────────────────
  describe('empty string ""', () => {
    test('does not crash', () => {
      expect(() => runPipeline('')).not.toThrow();
    });

    test('returns NEUTRAL state', () => {
      const { analysis } = runPipeline('');
      expect(analysis.state).toBe('NEUTRAL');
    });

    test('returns score 0', () => {
      const { analysis } = runPipeline('');
      expect(analysis.score).toBe(0);
    });

    test('returns INVALID_INPUT reason', () => {
      const { analysis } = runPipeline('');
      expect(analysis.reason).toBe('INVALID_INPUT');
    });

    test('regulation action is PASSTHROUGH', () => {
      const { regulation } = runPipeline('');
      expect(regulation.action).toBe('PASSTHROUGH');
    });

    test('regulation message is empty', () => {
      const { regulation } = runPipeline('');
      expect(regulation.message).toBe('');
    });

    test('routes to TEXT', () => {
      const { routing } = runPipeline('');
      expect(routing.channel).toBe('TEXT');
    });

    test('is deterministic', () => {
      const r1 = runPipeline('');
      const r2 = runPipeline('');
      expect(r1.analysis).toEqual(r2.analysis);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Single space
  // ─────────────────────────────────────────────────────────────
  describe('single space " "', () => {
    test('does not crash', () => {
      expect(() => runPipeline(' ')).not.toThrow();
    });

    test('returns NEUTRAL with INVALID_INPUT', () => {
      const { analysis } = runPipeline(' ');
      expect(analysis.state).toBe('NEUTRAL');
      expect(analysis.reason).toBe('INVALID_INPUT');
    });

    test('routes to TEXT', () => {
      const { routing } = runPipeline(' ');
      expect(routing.channel).toBe('TEXT');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Multiple spaces
  // ─────────────────────────────────────────────────────────────
  describe('multiple spaces "     "', () => {
    test('does not crash', () => {
      expect(() => runPipeline('     ')).not.toThrow();
    });

    test('returns INVALID_INPUT', () => {
      const { analysis } = runPipeline('     ');
      expect(analysis.reason).toBe('INVALID_INPUT');
    });

    test('100 spaces', () => {
      const input = ' '.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
      const { analysis } = runPipeline(input);
      expect(analysis.reason).toBe('INVALID_INPUT');
    });

    test('1000 spaces', () => {
      const input = ' '.repeat(1000);
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Tab character
  // ─────────────────────────────────────────────────────────────
  describe('tab character "\\t"', () => {
    test('does not crash', () => {
      expect(() => runPipeline('\t')).not.toThrow();
    });

    test('returns INVALID_INPUT', () => {
      const { analysis } = runPipeline('\t');
      expect(analysis.reason).toBe('INVALID_INPUT');
    });

    test('multiple tabs', () => {
      expect(() => runPipeline('\t\t\t')).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Newline character
  // ─────────────────────────────────────────────────────────────
  describe('newline character "\\n"', () => {
    test('does not crash', () => {
      expect(() => runPipeline('\n')).not.toThrow();
    });

    test('returns INVALID_INPUT', () => {
      const { analysis } = runPipeline('\n');
      expect(analysis.reason).toBe('INVALID_INPUT');
    });

    test('multiple newlines', () => {
      expect(() => runPipeline('\n\n\n')).not.toThrow();
    });

    test('CRLF', () => {
      expect(() => runPipeline('\r\n')).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Mixed whitespace
  // ─────────────────────────────────────────────────────────────
  describe('mixed whitespace', () => {
    test('space + tab + newline', () => {
      expect(() => runPipeline(' \t\n')).not.toThrow();
      const { analysis } = runPipeline(' \t\n');
      expect(analysis.reason).toBe('INVALID_INPUT');
    });

    test('complex whitespace pattern', () => {
      const input = '  \t\t  \n\n  \r\n  ';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('unicode whitespace characters', () => {
      const inputs = [
        '\u00A0',  // non-breaking space
        '\u2003',  // em space
        '\u200B',  // zero-width space
      ];
      inputs.forEach(input => {
        expect(() => runPipeline(input)).not.toThrow();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Null byte
  // ─────────────────────────────────────────────────────────────
  describe('null byte "\\0"', () => {
    test('does not crash', () => {
      expect(() => runPipeline('\0')).not.toThrow();
    });

    test('returns valid state', () => {
      const { analysis } = runPipeline('\0');
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
    });

    test('multiple null bytes', () => {
      expect(() => runPipeline('\0\0\0')).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Type coercion safety (defensive)
  // ─────────────────────────────────────────────────────────────
  describe('type safety - analyze handles non-strings', () => {
    test('null does not crash analyze', () => {
      expect(() => analyze(null as any)).not.toThrow();
    });

    test('undefined does not crash analyze', () => {
      expect(() => analyze(undefined as any)).not.toThrow();
    });

    test('number does not crash analyze', () => {
      expect(() => analyze(123 as any)).not.toThrow();
    });

    test('object does not crash analyze', () => {
      expect(() => analyze({} as any)).not.toThrow();
    });

    test('array does not crash analyze', () => {
      expect(() => analyze([] as any)).not.toThrow();
    });

    test('boolean does not crash analyze', () => {
      expect(() => analyze(true as any)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // State coherence
  // ─────────────────────────────────────────────────────────────
  describe('state coherence for empty inputs', () => {
    test('all empty-like inputs produce NEUTRAL', () => {
      const emptyInputs = ['', ' ', '  ', '\t', '\n', '\r\n', '   \t\n   '];
      emptyInputs.forEach(input => {
        const { analysis } = runPipeline(input);
        expect(analysis.state).toBe('NEUTRAL');
      });
    });

    test('all empty-like inputs produce INVALID_INPUT reason', () => {
      const emptyInputs = ['', ' ', '\t', '\n'];
      emptyInputs.forEach(input => {
        const { analysis } = runPipeline(input);
        expect(analysis.reason).toBe('INVALID_INPUT');
      });
    });

    test('all empty-like inputs route to TEXT', () => {
      const emptyInputs = ['', ' ', '\t', '\n'];
      emptyInputs.forEach(input => {
        const { routing } = runPipeline(input);
        expect(routing.channel).toBe('TEXT');
      });
    });
  });
});
