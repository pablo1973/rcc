/**
 * Unit Tests - Rules
 * RCC v1.0.0-DAY7
 * 
 * Deterministic tests against rules API
 */

import { applyRules } from '../../core/rules';
import { State } from '../../core/states';

describe('Unit: Rules', () => {

  // ─────────────────────────────────────────────────────────────
  // applyRules() - Structure
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - output structure', () => {
    test('returns string', () => {
      const result = applyRules('test', 'NEUTRAL');
      expect(typeof result).toBe('string');
    });

    test('returns non-null value', () => {
      const result = applyRules('test', 'NEUTRAL');
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // applyRules() - CALM state
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - CALM state', () => {
    test('CALM preserves text unchanged', () => {
      const input = 'hello world';
      const result = applyRules(input, 'CALM');
      expect(result).toBe(input);
    });

    test('CALM preserves empty string', () => {
      expect(applyRules('', 'CALM')).toBe('');
    });

    test('CALM preserves special characters', () => {
      const input = 'hello!!! @#$ world???';
      expect(applyRules(input, 'CALM')).toBe(input);
    });

    test('CALM preserves uppercase', () => {
      const input = 'HELLO WORLD';
      expect(applyRules(input, 'CALM')).toBe(input);
    });

    test('CALM preserves whitespace', () => {
      const input = '  hello   world  ';
      expect(applyRules(input, 'CALM')).toBe(input);
    });

    test('CALM preserves newlines', () => {
      const input = 'hello\nworld\n';
      expect(applyRules(input, 'CALM')).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // applyRules() - NEUTRAL state
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - NEUTRAL state', () => {
    test('NEUTRAL preserves text unchanged', () => {
      const input = 'hello world';
      const result = applyRules(input, 'NEUTRAL');
      expect(result).toBe(input);
    });

    test('NEUTRAL preserves empty string', () => {
      expect(applyRules('', 'NEUTRAL')).toBe('');
    });

    test('NEUTRAL preserves special characters', () => {
      const input = 'test!!! ???';
      expect(applyRules(input, 'NEUTRAL')).toBe(input);
    });

    test('NEUTRAL preserves mixed content', () => {
      const input = 'Hello World 123 !!!';
      expect(applyRules(input, 'NEUTRAL')).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // applyRules() - TENSE state
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - TENSE state', () => {
    test('TENSE preserves text (current implementation)', () => {
      const input = 'angry message here';
      const result = applyRules(input, 'TENSE');
      expect(result).toBe(input);
    });

    test('TENSE preserves empty string', () => {
      expect(applyRules('', 'TENSE')).toBe('');
    });

    test('TENSE preserves exclamation marks', () => {
      const input = 'THIS IS URGENT!!!';
      expect(applyRules(input, 'TENSE')).toBe(input);
    });

    test('TENSE preserves all caps', () => {
      const input = 'ANGRY MESSAGE';
      expect(applyRules(input, 'TENSE')).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // applyRules() - Default case
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - default case', () => {
    test('unknown state returns text unchanged', () => {
      const input = 'test message';
      const result = applyRules(input, 'UNKNOWN' as State);
      expect(result).toBe(input);
    });

    test('empty state returns text unchanged', () => {
      const input = 'test';
      const result = applyRules(input, '' as State);
      expect(result).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // applyRules() - Consistency across states
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - consistency', () => {
    test('all states preserve text in current implementation', () => {
      const input = 'test message here';
      const states: State[] = ['CALM', 'NEUTRAL', 'TENSE'];
      states.forEach(state => {
        expect(applyRules(input, state)).toBe(input);
      });
    });

    test('empty input returns empty for all states', () => {
      const states: State[] = ['CALM', 'NEUTRAL', 'TENSE'];
      states.forEach(state => {
        expect(applyRules('', state)).toBe('');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // applyRules() - Determinism
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - determinism', () => {
    test('same input + state = same output', () => {
      const input = 'deterministic test';
      const states: State[] = ['CALM', 'NEUTRAL', 'TENSE'];
      states.forEach(state => {
        const r1 = applyRules(input, state);
        const r2 = applyRules(input, state);
        expect(r1).toBe(r2);
      });
    });

    test('does not mutate input', () => {
      const input = 'original text';
      applyRules(input, 'TENSE');
      expect(input).toBe('original text');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // applyRules() - Edge cases
  // ─────────────────────────────────────────────────────────────
  describe('applyRules() - edge cases', () => {
    test('handles very long text', () => {
      const longText = 'x'.repeat(10000);
      const result = applyRules(longText, 'NEUTRAL');
      expect(result).toBe(longText);
    });

    test('handles unicode characters', () => {
      const unicode = '你好世界 🌍 مرحبا';
      expect(applyRules(unicode, 'NEUTRAL')).toBe(unicode);
    });

    test('handles special characters', () => {
      const special = '<script>alert("xss")</script>';
      expect(applyRules(special, 'NEUTRAL')).toBe(special);
    });

    test('handles tabs and newlines', () => {
      const whitespace = 'hello\t\n\rworld';
      expect(applyRules(whitespace, 'NEUTRAL')).toBe(whitespace);
    });
  });
});
