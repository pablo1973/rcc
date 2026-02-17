/**
 * Unit Tests - Analyzer
 * RCC v1.0.0-DAY7
 * 
 * Deterministic tests against analyzer API
 */

import { analyze, normalize, MAX_INPUT_LENGTH } from '../../core/analyzer';
import { computeMetrics, Metrics } from '../../core/heuristics';

describe('Unit: Analyzer', () => {
  
  // ─────────────────────────────────────────────────────────────
  // normalize()
  // ─────────────────────────────────────────────────────────────
  describe('normalize()', () => {
    test('trims leading/trailing whitespace', () => {
      expect(normalize('  hello  ')).toBe('hello');
    });

    test('collapses multiple spaces to single', () => {
      expect(normalize('hello    world')).toBe('hello world');
    });

    test('handles tabs and newlines', () => {
      expect(normalize('hello\t\nworld')).toBe('hello world');
    });

    test('returns empty string for null', () => {
      expect(normalize(null as any)).toBe('');
    });

    test('returns empty string for undefined', () => {
      expect(normalize(undefined as any)).toBe('');
    });

    test('returns empty string for number', () => {
      expect(normalize(123 as any)).toBe('');
    });

    test('returns empty string for whitespace-only', () => {
      expect(normalize('   ')).toBe('');
      expect(normalize('\t\n')).toBe('');
    });

    test('truncates to MAX_INPUT_LENGTH', () => {
      const longText = 'x'.repeat(MAX_INPUT_LENGTH + 500);
      const result = normalize(longText);
      expect(result.length).toBe(MAX_INPUT_LENGTH);
    });

    test('preserves text under MAX_INPUT_LENGTH', () => {
      const shortText = 'hello world';
      expect(normalize(shortText)).toBe(shortText);
    });

    test('is deterministic', () => {
      const input = '  test   input  ';
      expect(normalize(input)).toBe(normalize(input));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // computeMetrics()
  // ─────────────────────────────────────────────────────────────
  describe('computeMetrics()', () => {
    test('returns zero metrics for empty string', () => {
      const m = computeMetrics('');
      expect(m.chars).toBe(0);
      expect(m.words).toBe(0);
      expect(m.intensity).toBe(0);
      expect(m.repetition).toBe(0);
      expect(m.noise).toBe(0);
    });

    test('returns zero metrics for null/undefined', () => {
      expect(computeMetrics(null as any).chars).toBe(0);
      expect(computeMetrics(undefined as any).chars).toBe(0);
    });

    test('counts chars correctly', () => {
      expect(computeMetrics('hello').chars).toBe(5);
      expect(computeMetrics('a b c').chars).toBe(5);
    });

    test('counts words correctly', () => {
      expect(computeMetrics('hello world').words).toBe(2);
      expect(computeMetrics('one two three four').words).toBe(4);
      expect(computeMetrics('single').words).toBe(1);
    });

    test('intensity in range [0, 1]', () => {
      const inputs = ['hello', 'HELLO', 'HELLO!!!', '!!!???', 'test'];
      inputs.forEach(input => {
        const m = computeMetrics(input);
        expect(m.intensity).toBeGreaterThanOrEqual(0);
        expect(m.intensity).toBeLessThanOrEqual(1);
      });
    });

    test('intensity increases with uppercase', () => {
      const low = computeMetrics('hello world');
      const high = computeMetrics('HELLO WORLD');
      expect(high.intensity).toBeGreaterThan(low.intensity);
    });

    test('intensity increases with exclamation marks', () => {
      const low = computeMetrics('hello');
      const high = computeMetrics('hello!!!');
      expect(high.intensity).toBeGreaterThan(low.intensity);
    });

    test('repetition in range [0, 1]', () => {
      const inputs = ['a a a', 'hello world', 'unique words here'];
      inputs.forEach(input => {
        const m = computeMetrics(input);
        expect(m.repetition).toBeGreaterThanOrEqual(0);
        expect(m.repetition).toBeLessThanOrEqual(1);
      });
    });

    test('repetition increases with repeated words', () => {
      const low = computeMetrics('one two three');
      const high = computeMetrics('one one one');
      expect(high.repetition).toBeGreaterThan(low.repetition);
    });

    test('noise in range [0, 1]', () => {
      const inputs = ['hello', '!!!', '@#$%', 'test123'];
      inputs.forEach(input => {
        const m = computeMetrics(input);
        expect(m.noise).toBeGreaterThanOrEqual(0);
        expect(m.noise).toBeLessThanOrEqual(1);
      });
    });

    test('noise increases with special characters', () => {
      const low = computeMetrics('hello');
      const high = computeMetrics('!!!???@@@');
      expect(high.noise).toBeGreaterThan(low.noise);
    });

    test('is deterministic', () => {
      const input = 'deterministic test';
      const m1 = computeMetrics(input);
      const m2 = computeMetrics(input);
      expect(m1).toEqual(m2);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // analyze()
  // ─────────────────────────────────────────────────────────────
  describe('analyze()', () => {
    test('returns AnalysisResult structure', () => {
      const result = analyze('hello');
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('reason');
    });

    test('state is valid RCCState', () => {
      const validStates = ['CALM', 'NEUTRAL', 'TENSE'];
      const inputs = ['hello', 'ANGRY!!!', '', 'normal text'];
      inputs.forEach(input => {
        const result = analyze(input);
        expect(validStates).toContain(result.state);
      });
    });

    test('score is number in [0, 1]', () => {
      const result = analyze('test input');
      expect(typeof result.score).toBe('number');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    test('reason is non-empty string', () => {
      const result = analyze('test');
      expect(typeof result.reason).toBe('string');
      expect(result.reason.length).toBeGreaterThan(0);
    });

    test('empty input returns NEUTRAL with INVALID_INPUT', () => {
      const result = analyze('');
      expect(result.state).toBe('NEUTRAL');
      expect(result.score).toBe(0);
      expect(result.reason).toBe('INVALID_INPUT');
    });

    test('whitespace-only returns NEUTRAL with INVALID_INPUT', () => {
      const result = analyze('   ');
      expect(result.state).toBe('NEUTRAL');
      expect(result.reason).toBe('INVALID_INPUT');
    });

    test('CALM state has LOW_INTENSITY reason', () => {
      const result = analyze('hello world');
      if (result.state === 'CALM') {
        expect(result.reason).toBe('LOW_INTENSITY');
      }
    });

    test('TENSE state has HIGH_INTENSITY reason', () => {
      // High uppercase ratio to trigger TENSE
      const result = analyze('AAAA');
      if (result.state === 'TENSE') {
        expect(result.reason).toBe('HIGH_INTENSITY');
      }
    });

    test('NEUTRAL state has BASELINE reason', () => {
      // Medium intensity to get NEUTRAL (not CALM, not TENSE)
      const result = analyze('Hello World Test Message Here');
      if (result.state === 'NEUTRAL') {
        expect(result.reason).toBe('BASELINE');
      }
    });

    test('is deterministic - same input same output', () => {
      const input = 'deterministic analysis test';
      const r1 = analyze(input);
      const r2 = analyze(input);
      expect(r1.state).toBe(r2.state);
      expect(r1.score).toBe(r2.score);
      expect(r1.reason).toBe(r2.reason);
    });

    test('never throws exception', () => {
      const badInputs = [null, undefined, 123, {}, [], () => {}];
      badInputs.forEach(input => {
        expect(() => analyze(input as any)).not.toThrow();
      });
    });
  });
});
