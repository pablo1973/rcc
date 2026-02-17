/**
 * API Tests - run()
 * RCC v1.0.0-DAY10
 */

import {
  run,
  MAX_INPUT_LENGTH,
  VERSION,
  RCCError,
  InvalidInputError,
  isRCCError
} from '../../api';

describe('API: run()', () => {

  // ─────────────────────────────────────────────────────────────
  // Basic functionality
  // ─────────────────────────────────────────────────────────────
  describe('basic functionality', () => {
    test('returns analysis object', () => {
      const result = run('hello world');
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toHaveProperty('state');
      expect(result.analysis).toHaveProperty('score');
      expect(result.analysis).toHaveProperty('reason');
    });

    test('returns regulation object', () => {
      const result = run('hello world');
      expect(result).toHaveProperty('regulation');
      expect(result.regulation).toHaveProperty('action');
      expect(result.regulation).toHaveProperty('message');
    });

    test('returns routing object', () => {
      const result = run('hello world');
      expect(result).toHaveProperty('routing');
      expect(result.routing).toHaveProperty('channel');
    });

    test('returns meta object', () => {
      const result = run('hello world');
      expect(result).toHaveProperty('meta');
      expect(typeof result.meta).toBe('object');
    });

    test('accepts string input', () => {
      const result = run('hello world');
      expect(result.analysis.state).toBeDefined();
    });

    test('accepts RCCInput object', () => {
      const result = run({ text: 'hello world' });
      expect(result.analysis.state).toBeDefined();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Meta preservation
  // ─────────────────────────────────────────────────────────────
  describe('meta preservation', () => {
    test('preserves meta from input', () => {
      const result = run({ text: 'hello', meta: { key: 'value' } });
      expect(result.meta).toEqual({ key: 'value' });
    });

    test('preserves complex meta', () => {
      const meta = {
        userId: '123',
        sessionId: 'abc',
        extra: { nested: true }
      };
      const result = run({ text: 'hello', meta });
      expect(result.meta).toEqual(meta);
    });

    test('returns empty meta for string input', () => {
      const result = run('hello');
      expect(result.meta).toEqual({});
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Full pipeline - CALM flow
  // ─────────────────────────────────────────────────────────────
  describe('CALM flow', () => {
    test('CALM → PASSTHROUGH → TEXT', () => {
      const result = run('hello world');
      expect(result.analysis.state).toBe('CALM');
      expect(result.regulation.action).toBe('PASSTHROUGH');
      expect(result.routing.channel).toBe('TEXT');
    });

    test('lowercase input flows through TEXT', () => {
      const result = run('peaceful message here');
      expect(result.routing.channel).toBe('TEXT');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Full pipeline - TENSE flow
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow', () => {
    test('TENSE → SOFTEN → TEXT', () => {
      const result = run('AAAA');
      expect(result.analysis.state).toBe('TENSE');
      expect(result.regulation.action).toBe('SOFTEN');
      expect(result.routing.channel).toBe('TEXT');
    });

    test('uppercase input gets SOFTEN action', () => {
      const result = run('ANGRY MESSAGE');
      expect(result.regulation.action).toBe('SOFTEN');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Channel routing
  // ─────────────────────────────────────────────────────────────
  describe('channel routing', () => {
    test('returns valid channel', () => {
      const result = run('hello world');
      expect(['TEXT', 'COOLDOWN']).toContain(result.routing.channel);
    });

    test('PASSTHROUGH routes to TEXT', () => {
      const result = run('hello world');
      if (result.regulation.action === 'PASSTHROUGH') {
        expect(result.routing.channel).toBe('TEXT');
      }
    });

    test('SOFTEN routes to TEXT', () => {
      const result = run('ANGRY');
      if (result.regulation.action === 'SOFTEN') {
        expect(result.routing.channel).toBe('TEXT');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Error handling
  // ─────────────────────────────────────────────────────────────
  describe('error handling', () => {
    test('throws InvalidInputError for null', () => {
      expect(() => run(null as any)).toThrow(InvalidInputError);
    });

    test('throws InvalidInputError for undefined', () => {
      expect(() => run(undefined as any)).toThrow(InvalidInputError);
    });

    test('throws InvalidInputError for number', () => {
      expect(() => run(123 as any)).toThrow(InvalidInputError);
    });

    test('error is RCCError', () => {
      try {
        run(null as any);
      } catch (error) {
        expect(isRCCError(error)).toBe(true);
      }
    });

    test('error has toInfo method', () => {
      try {
        run(null as any);
      } catch (error) {
        const info = (error as RCCError).toInfo();
        expect(info).toHaveProperty('code');
        expect(info).toHaveProperty('message');
      }
    });

    test('error has toJSON method', () => {
      try {
        run(null as any);
      } catch (error) {
        const json = (error as RCCError).toJSON();
        expect(json.code).toBe('INVALID_INPUT');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Determinism
  // ─────────────────────────────────────────────────────────────
  describe('determinism', () => {
    test('same input produces same output', () => {
      const r1 = run('test input');
      const r2 = run('test input');
      expect(r1.analysis).toEqual(r2.analysis);
      expect(r1.regulation).toEqual(r2.regulation);
      expect(r1.routing).toEqual(r2.routing);
    });

    test('deterministic across multiple calls', () => {
      const input = 'Hello World';
      const results = Array(5).fill(null).map(() => run(input));
      results.forEach(r => {
        expect(r.analysis).toEqual(results[0].analysis);
        expect(r.regulation).toEqual(results[0].regulation);
        expect(r.routing).toEqual(results[0].routing);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Edge cases
  // ─────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    test('handles empty string', () => {
      const result = run('');
      expect(result.analysis.reason).toBe('INVALID_INPUT');
    });

    test('handles very long input', () => {
      const longInput = 'a'.repeat(10000);
      expect(() => run(longInput)).not.toThrow();
    });

    test('handles unicode and emoji', () => {
      const result = run('Hello 你好 🌍');
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(result.analysis.state);
    });
  });
});

describe('API: Constants', () => {
  test('MAX_INPUT_LENGTH is 10000', () => {
    expect(MAX_INPUT_LENGTH).toBe(10000);
  });

  test('VERSION is 1.0.0', () => {
    expect(VERSION).toBe('1.0.0');
  });
});

describe('API: Error utilities', () => {
  test('isRCCError returns true for RCCError', () => {
    const error = new InvalidInputError('test');
    expect(isRCCError(error)).toBe(true);
  });

  test('isRCCError returns false for regular Error', () => {
    const error = new Error('test');
    expect(isRCCError(error)).toBe(false);
  });

  test('isRCCError returns false for non-error', () => {
    expect(isRCCError('string')).toBe(false);
    expect(isRCCError(123)).toBe(false);
    expect(isRCCError(null)).toBe(false);
  });
});
