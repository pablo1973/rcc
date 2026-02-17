/**
 * API Tests - analyze()
 * RCC v1.0.0-DAY10
 */

import {
  analyze,
  RCCError,
  InvalidInputError,
  isRCCError
} from '../../api';

describe('API: analyze()', () => {

  // ─────────────────────────────────────────────────────────────
  // Basic functionality
  // ─────────────────────────────────────────────────────────────
  describe('basic functionality', () => {
    test('accepts string input', () => {
      const result = analyze('hello world');
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('reason');
    });

    test('accepts RCCInput object', () => {
      const result = analyze({ text: 'hello world' });
      expect(result).toHaveProperty('state');
    });

    test('returns valid state', () => {
      const result = analyze('hello world');
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(result.state);
    });

    test('returns score between 0 and 1', () => {
      const result = analyze('hello world');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    test('returns valid reason', () => {
      const result = analyze('hello world');
      expect(['LOW_INTENSITY', 'BASELINE', 'HIGH_INTENSITY', 'INVALID_INPUT']).toContain(result.reason);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // State detection
  // ─────────────────────────────────────────────────────────────
  describe('state detection', () => {
    test('detects CALM for lowercase', () => {
      const result = analyze('hello world');
      expect(result.state).toBe('CALM');
    });

    test('detects TENSE for uppercase', () => {
      const result = analyze('AAAA');
      expect(result.state).toBe('TENSE');
    });

    test('returns valid state for mixed case', () => {
      const result = analyze('Hello WORLD Test MESSAGE');
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(result.state);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Error handling
  // ─────────────────────────────────────────────────────────────
  describe('error handling', () => {
    test('throws InvalidInputError for null', () => {
      expect(() => analyze(null as any)).toThrow(InvalidInputError);
    });

    test('throws InvalidInputError for undefined', () => {
      expect(() => analyze(undefined as any)).toThrow(InvalidInputError);
    });

    test('throws InvalidInputError for number', () => {
      expect(() => analyze(123 as any)).toThrow(InvalidInputError);
    });

    test('error is RCCError', () => {
      try {
        analyze(null as any);
      } catch (error) {
        expect(isRCCError(error)).toBe(true);
      }
    });

    test('error has code INVALID_INPUT', () => {
      try {
        analyze(null as any);
      } catch (error) {
        expect((error as RCCError).code).toBe('INVALID_INPUT');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Determinism
  // ─────────────────────────────────────────────────────────────
  describe('determinism', () => {
    test('same input produces same output', () => {
      const r1 = analyze('test input');
      const r2 = analyze('test input');
      expect(r1).toEqual(r2);
    });

    test('deterministic across multiple calls', () => {
      const input = 'Hello World Test';
      const results = Array(10).fill(null).map(() => analyze(input));
      results.forEach(r => expect(r).toEqual(results[0]));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Edge cases
  // ─────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    test('handles empty string', () => {
      const result = analyze('');
      expect(result.reason).toBe('INVALID_INPUT');
    });

    test('handles whitespace only', () => {
      const result = analyze('   ');
      expect(result.reason).toBe('INVALID_INPUT');
    });

    test('handles very long input', () => {
      const longInput = 'a'.repeat(10000);
      expect(() => analyze(longInput)).not.toThrow();
    });

    test('handles unicode', () => {
      const result = analyze('你好世界 🌍');
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(result.state);
    });
  });
});
