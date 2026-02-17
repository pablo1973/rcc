/**
 * Unit Tests - Regulator
 * RCC v1.0.0-DAY7
 * 
 * Deterministic tests against regulator API
 */

import { regulate } from '../../core/regulator';
import { AnalysisResult, RegulationResult } from '../../core/types';

describe('Unit: Regulator', () => {

  // ─────────────────────────────────────────────────────────────
  // regulate() - Structure
  // ─────────────────────────────────────────────────────────────
  describe('regulate() - output structure', () => {
    test('returns RegulationResult structure', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const result = regulate(analysis, 'test');
      expect(result).toHaveProperty('action');
      expect(result).toHaveProperty('message');
    });

    test('action is valid type', () => {
      const validActions = ['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE'];
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const result = regulate(analysis, 'test');
      expect(validActions).toContain(result.action);
    });

    test('message is string', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const result = regulate(analysis, 'input text');
      expect(typeof result.message).toBe('string');
    });

    test('meta is optional object', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const result = regulate(analysis, 'test');
      if (result.meta !== undefined) {
        expect(typeof result.meta).toBe('object');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // regulate() - CALM state
  // ─────────────────────────────────────────────────────────────
  describe('regulate() - CALM state', () => {
    test('CALM returns PASSTHROUGH action', () => {
      const analysis: AnalysisResult = { state: 'CALM', score: 0.1, reason: 'LOW_INTENSITY' };
      const result = regulate(analysis, 'calm message');
      expect(result.action).toBe('PASSTHROUGH');
    });

    test('CALM preserves message', () => {
      const analysis: AnalysisResult = { state: 'CALM', score: 0.1, reason: 'LOW_INTENSITY' };
      const input = 'calm message here';
      const result = regulate(analysis, input);
      expect(result.message).toBe(input);
    });

    test('CALM includes meta with state info', () => {
      const analysis: AnalysisResult = { state: 'CALM', score: 0.15, reason: 'LOW_INTENSITY' };
      const result = regulate(analysis, 'test');
      expect(result.meta).toBeDefined();
      expect(result.meta?.originalState).toBe('CALM');
      expect(result.meta?.score).toBe(0.15);
      expect(result.meta?.reason).toBe('LOW_INTENSITY');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // regulate() - NEUTRAL state
  // ─────────────────────────────────────────────────────────────
  describe('regulate() - NEUTRAL state', () => {
    test('NEUTRAL returns PASSTHROUGH action', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const result = regulate(analysis, 'neutral message');
      expect(result.action).toBe('PASSTHROUGH');
    });

    test('NEUTRAL preserves message', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const input = 'neutral message here';
      const result = regulate(analysis, input);
      expect(result.message).toBe(input);
    });

    test('NEUTRAL includes meta with state info', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const result = regulate(analysis, 'test');
      expect(result.meta).toBeDefined();
      expect(result.meta?.originalState).toBe('NEUTRAL');
      expect(result.meta?.score).toBe(0.5);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // regulate() - TENSE state
  // ─────────────────────────────────────────────────────────────
  describe('regulate() - TENSE state', () => {
    test('TENSE returns SOFTEN action', () => {
      const analysis: AnalysisResult = { state: 'TENSE', score: 0.8, reason: 'HIGH_INTENSITY' };
      const result = regulate(analysis, 'tense message');
      expect(result.action).toBe('SOFTEN');
    });

    test('TENSE preserves message content', () => {
      const analysis: AnalysisResult = { state: 'TENSE', score: 0.8, reason: 'HIGH_INTENSITY' };
      const input = 'tense message here';
      const result = regulate(analysis, input);
      expect(result.message).toBe(input);
    });

    test('TENSE includes meta with state info', () => {
      const analysis: AnalysisResult = { state: 'TENSE', score: 0.85, reason: 'HIGH_INTENSITY' };
      const result = regulate(analysis, 'test');
      expect(result.meta).toBeDefined();
      expect(result.meta?.originalState).toBe('TENSE');
      expect(result.meta?.score).toBe(0.85);
      expect(result.meta?.reason).toBe('HIGH_INTENSITY');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // regulate() - Fail-safe
  // ─────────────────────────────────────────────────────────────
  describe('regulate() - fail-safe behavior', () => {
    test('null analysis returns PASSTHROUGH', () => {
      const result = regulate(null as any, 'test');
      expect(result.action).toBe('PASSTHROUGH');
      expect(result.message).toBe('test');
    });

    test('undefined analysis returns PASSTHROUGH', () => {
      const result = regulate(undefined as any, 'test');
      expect(result.action).toBe('PASSTHROUGH');
    });

    test('invalid state returns PASSTHROUGH', () => {
      const badAnalysis = { state: 'INVALID', score: 0.5, reason: 'TEST' };
      const result = regulate(badAnalysis as any, 'test message');
      expect(result.action).toBe('PASSTHROUGH');
      expect(result.message).toBe('test message');
    });

    test('missing state property returns PASSTHROUGH', () => {
      const badAnalysis = { score: 0.5, reason: 'TEST' };
      const result = regulate(badAnalysis as any, 'test');
      expect(result.action).toBe('PASSTHROUGH');
    });

    test('empty input string preserved', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const result = regulate(analysis, '');
      expect(result.message).toBe('');
    });

    test('never throws exception', () => {
      const badInputs = [
        [null, 'test'],
        [undefined, 'test'],
        [{}, 'test'],
        [{ state: 123 }, 'test'],
        [{ state: 'NEUTRAL' }, null],
      ];
      badInputs.forEach(([analysis, input]) => {
        expect(() => regulate(analysis as any, input as any)).not.toThrow();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // regulate() - Determinism
  // ─────────────────────────────────────────────────────────────
  describe('regulate() - determinism', () => {
    test('same analysis + input = same output', () => {
      const analysis: AnalysisResult = { state: 'NEUTRAL', score: 0.5, reason: 'BASELINE' };
      const input = 'test message';
      const r1 = regulate(analysis, input);
      const r2 = regulate(analysis, input);
      expect(r1.action).toBe(r2.action);
      expect(r1.message).toBe(r2.message);
    });

    test('different states produce different actions', () => {
      const input = 'test';
      const calm: AnalysisResult = { state: 'CALM', score: 0.1, reason: 'LOW_INTENSITY' };
      const tense: AnalysisResult = { state: 'TENSE', score: 0.9, reason: 'HIGH_INTENSITY' };
      const calmResult = regulate(calm, input);
      const tenseResult = regulate(tense, input);
      expect(calmResult.action).toBe('PASSTHROUGH');
      expect(tenseResult.action).toBe('SOFTEN');
    });
  });
});
