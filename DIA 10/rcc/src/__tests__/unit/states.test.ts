/**
 * Unit Tests - States
 * RCC v1.0.0-DAY7
 * 
 * Deterministic tests against states API
 */

import { 
  isValidState, 
  resolveStateByScore, 
  THRESHOLDS 
} from '../../core/states';
import { RCCState } from '../../core/types';

describe('Unit: States', () => {

  // ─────────────────────────────────────────────────────────────
  // THRESHOLDS - Constants
  // ─────────────────────────────────────────────────────────────
  describe('THRESHOLDS', () => {
    test('CALM_MAX is defined', () => {
      expect(THRESHOLDS.CALM_MAX).toBeDefined();
      expect(typeof THRESHOLDS.CALM_MAX).toBe('number');
    });

    test('TENSE_MIN is defined', () => {
      expect(THRESHOLDS.TENSE_MIN).toBeDefined();
      expect(typeof THRESHOLDS.TENSE_MIN).toBe('number');
    });

    test('CALM_MAX < TENSE_MIN (non-overlapping)', () => {
      expect(THRESHOLDS.CALM_MAX).toBeLessThan(THRESHOLDS.TENSE_MIN);
    });

    test('CALM_MAX = 0.3', () => {
      expect(THRESHOLDS.CALM_MAX).toBe(0.3);
    });

    test('TENSE_MIN = 0.7', () => {
      expect(THRESHOLDS.TENSE_MIN).toBe(0.7);
    });

    test('thresholds are in valid range [0, 1]', () => {
      expect(THRESHOLDS.CALM_MAX).toBeGreaterThanOrEqual(0);
      expect(THRESHOLDS.CALM_MAX).toBeLessThanOrEqual(1);
      expect(THRESHOLDS.TENSE_MIN).toBeGreaterThanOrEqual(0);
      expect(THRESHOLDS.TENSE_MIN).toBeLessThanOrEqual(1);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // isValidState()
  // ─────────────────────────────────────────────────────────────
  describe('isValidState()', () => {
    test('CALM is valid', () => {
      expect(isValidState('CALM')).toBe(true);
    });

    test('NEUTRAL is valid', () => {
      expect(isValidState('NEUTRAL')).toBe(true);
    });

    test('TENSE is valid', () => {
      expect(isValidState('TENSE')).toBe(true);
    });

    test('lowercase states are invalid', () => {
      expect(isValidState('calm')).toBe(false);
      expect(isValidState('neutral')).toBe(false);
      expect(isValidState('tense')).toBe(false);
    });

    test('mixed case states are invalid', () => {
      expect(isValidState('Calm')).toBe(false);
      expect(isValidState('Neutral')).toBe(false);
      expect(isValidState('Tense')).toBe(false);
    });

    test('unknown states are invalid', () => {
      expect(isValidState('UNKNOWN')).toBe(false);
      expect(isValidState('ANGRY')).toBe(false);
      expect(isValidState('HAPPY')).toBe(false);
    });

    test('empty string is invalid', () => {
      expect(isValidState('')).toBe(false);
    });

    test('whitespace is invalid', () => {
      expect(isValidState(' ')).toBe(false);
      expect(isValidState('  CALM  ')).toBe(false);
    });

    test('only 3 valid states exist', () => {
      const validStates = ['CALM', 'NEUTRAL', 'TENSE'];
      const invalidStates = ['ANXIOUS', 'RELAXED', 'STRESSED', 'HAPPY', 'SAD'];
      
      validStates.forEach(s => expect(isValidState(s)).toBe(true));
      invalidStates.forEach(s => expect(isValidState(s)).toBe(false));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // resolveStateByScore() - CALM
  // ─────────────────────────────────────────────────────────────
  describe('resolveStateByScore() - CALM', () => {
    test('score 0 returns CALM', () => {
      expect(resolveStateByScore(0)).toBe('CALM');
    });

    test('score 0.1 returns CALM', () => {
      expect(resolveStateByScore(0.1)).toBe('CALM');
    });

    test('score 0.29 returns CALM', () => {
      expect(resolveStateByScore(0.29)).toBe('CALM');
    });

    test('score just below CALM_MAX returns CALM', () => {
      expect(resolveStateByScore(THRESHOLDS.CALM_MAX - 0.01)).toBe('CALM');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // resolveStateByScore() - NEUTRAL
  // ─────────────────────────────────────────────────────────────
  describe('resolveStateByScore() - NEUTRAL', () => {
    test('score at CALM_MAX returns NEUTRAL', () => {
      expect(resolveStateByScore(THRESHOLDS.CALM_MAX)).toBe('NEUTRAL');
    });

    test('score 0.3 returns NEUTRAL', () => {
      expect(resolveStateByScore(0.3)).toBe('NEUTRAL');
    });

    test('score 0.5 returns NEUTRAL', () => {
      expect(resolveStateByScore(0.5)).toBe('NEUTRAL');
    });

    test('score 0.69 returns NEUTRAL', () => {
      expect(resolveStateByScore(0.69)).toBe('NEUTRAL');
    });

    test('score just below TENSE_MIN returns NEUTRAL', () => {
      expect(resolveStateByScore(THRESHOLDS.TENSE_MIN - 0.01)).toBe('NEUTRAL');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // resolveStateByScore() - TENSE
  // ─────────────────────────────────────────────────────────────
  describe('resolveStateByScore() - TENSE', () => {
    test('score at TENSE_MIN returns TENSE', () => {
      expect(resolveStateByScore(THRESHOLDS.TENSE_MIN)).toBe('TENSE');
    });

    test('score 0.7 returns TENSE', () => {
      expect(resolveStateByScore(0.7)).toBe('TENSE');
    });

    test('score 0.8 returns TENSE', () => {
      expect(resolveStateByScore(0.8)).toBe('TENSE');
    });

    test('score 0.99 returns TENSE', () => {
      expect(resolveStateByScore(0.99)).toBe('TENSE');
    });

    test('score 1.0 returns TENSE', () => {
      expect(resolveStateByScore(1.0)).toBe('TENSE');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // resolveStateByScore() - Edge cases
  // ─────────────────────────────────────────────────────────────
  describe('resolveStateByScore() - edge cases', () => {
    test('negative scores clamp to CALM', () => {
      expect(resolveStateByScore(-1)).toBe('CALM');
      expect(resolveStateByScore(-0.5)).toBe('CALM');
      expect(resolveStateByScore(-100)).toBe('CALM');
    });

    test('scores > 1 clamp to TENSE', () => {
      expect(resolveStateByScore(1.5)).toBe('TENSE');
      expect(resolveStateByScore(2)).toBe('TENSE');
      expect(resolveStateByScore(100)).toBe('TENSE');
    });

    test('boundary score 0.3 is NEUTRAL (not CALM)', () => {
      expect(resolveStateByScore(0.3)).toBe('NEUTRAL');
    });

    test('boundary score 0.7 is TENSE (not NEUTRAL)', () => {
      expect(resolveStateByScore(0.7)).toBe('TENSE');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // resolveStateByScore() - Determinism
  // ─────────────────────────────────────────────────────────────
  describe('resolveStateByScore() - determinism', () => {
    test('same score always returns same state', () => {
      const testScores = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0];
      testScores.forEach(score => {
        const s1 = resolveStateByScore(score);
        const s2 = resolveStateByScore(score);
        expect(s1).toBe(s2);
      });
    });

    test('output is always valid RCCState', () => {
      const testScores = [-1, 0, 0.3, 0.5, 0.7, 1, 2];
      const validStates: RCCState[] = ['CALM', 'NEUTRAL', 'TENSE'];
      testScores.forEach(score => {
        const state = resolveStateByScore(score);
        expect(validStates).toContain(state);
      });
    });
  });
});
