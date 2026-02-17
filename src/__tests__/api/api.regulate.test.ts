/**
 * API Tests - regulate()
 * RCC v1.0.0-DAY10
 */

import {
  regulate,
  InvalidInputError,
  isRCCError
} from '../../api';

describe('API: regulate()', () => {

  // ─────────────────────────────────────────────────────────────
  // Basic functionality
  // ─────────────────────────────────────────────────────────────
  describe('basic functionality', () => {
    test('returns analysis object', () => {
      const result = regulate('hello world');
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toHaveProperty('state');
      expect(result.analysis).toHaveProperty('score');
      expect(result.analysis).toHaveProperty('reason');
    });

    test('returns action', () => {
      const result = regulate('hello world');
      expect(result).toHaveProperty('action');
      expect(['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE']).toContain(result.action);
    });

    test('returns message', () => {
      const result = regulate('hello world');
      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
    });

    test('returns meta object', () => {
      const result = regulate('hello world');
      expect(result).toHaveProperty('meta');
      expect(typeof result.meta).toBe('object');
    });

    test('accepts string input', () => {
      const result = regulate('hello world');
      expect(result.analysis.state).toBeDefined();
    });

    test('accepts RCCInput object', () => {
      const result = regulate({ text: 'hello world' });
      expect(result.analysis.state).toBeDefined();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Meta preservation
  // ─────────────────────────────────────────────────────────────
  describe('meta preservation', () => {
    test('preserves meta from input', () => {
      const result = regulate({ text: 'hello', meta: { userId: '123' } });
      expect(result.meta).toEqual({ userId: '123' });
    });

    test('preserves complex meta', () => {
      const meta = { 
        userId: '123', 
        timestamp: 1234567890,
        nested: { key: 'value' }
      };
      const result = regulate({ text: 'hello', meta });
      expect(result.meta).toEqual(meta);
    });

    test('returns empty meta for string input', () => {
      const result = regulate('hello');
      expect(result.meta).toEqual({});
    });

    test('returns empty meta when not provided', () => {
      const result = regulate({ text: 'hello' });
      expect(result.meta).toEqual({});
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Action mapping
  // ─────────────────────────────────────────────────────────────
  describe('action mapping', () => {
    test('CALM state produces PASSTHROUGH', () => {
      const result = regulate('hello world');
      expect(result.analysis.state).toBe('CALM');
      expect(result.action).toBe('PASSTHROUGH');
    });

    test('TENSE state produces SOFTEN', () => {
      const result = regulate('AAAA');
      expect(result.analysis.state).toBe('TENSE');
      expect(result.action).toBe('SOFTEN');
    });

    test('action is consistent with state', () => {
      const inputs = ['hello', 'HELLO', 'Hello World', 'ANGRY!!!'];
      inputs.forEach(input => {
        const result = regulate(input);
        if (result.analysis.state === 'TENSE') {
          expect(result.action).toBe('SOFTEN');
        } else {
          expect(result.action).toBe('PASSTHROUGH');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Message handling
  // ─────────────────────────────────────────────────────────────
  describe('message handling', () => {
    test('message contains original text', () => {
      const input = 'hello world';
      const result = regulate(input);
      expect(result.message).toBe(input);
    });

    test('message preserved for CALM input', () => {
      const input = 'peaceful message';
      const result = regulate(input);
      expect(result.message).toBe(input);
    });

    test('message preserved for TENSE input', () => {
      const input = 'ANGRY MESSAGE';
      const result = regulate(input);
      expect(result.message).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Error handling
  // ─────────────────────────────────────────────────────────────
  describe('error handling', () => {
    test('throws InvalidInputError for null', () => {
      expect(() => regulate(null as any)).toThrow(InvalidInputError);
    });

    test('throws InvalidInputError for undefined', () => {
      expect(() => regulate(undefined as any)).toThrow(InvalidInputError);
    });

    test('error is RCCError', () => {
      try {
        regulate(null as any);
      } catch (error) {
        expect(isRCCError(error)).toBe(true);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Determinism
  // ─────────────────────────────────────────────────────────────
  describe('determinism', () => {
    test('same input produces same output', () => {
      const r1 = regulate('test input');
      const r2 = regulate('test input');
      expect(r1.analysis).toEqual(r2.analysis);
      expect(r1.action).toBe(r2.action);
      expect(r1.message).toBe(r2.message);
    });
  });
});
