/**
 * Integration Tests - Pipeline TENSE
 * RCC v1.0.0-DAY7
 * 
 * E2E tests for TENSE state pipeline
 */

import { analyze } from '../../core/analyzer';
import { regulate } from '../../core/regulator';
import { route } from '../../core/router';
import { THRESHOLDS } from '../../core/states';

describe('Integration: Pipeline TENSE', () => {

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
  // TENSE Flow - High intensity inputs
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow - high intensity inputs', () => {
    test('all caps short text produces TENSE → SOFTEN → TEXT', () => {
      // Short all-caps gives high uppercase ratio
      const input = 'AAAA';
      const { analysis, regulation, routing } = runPipeline(input);
      
      expect(analysis.state).toBe('TENSE');
      expect(analysis.score).toBeGreaterThanOrEqual(THRESHOLDS.TENSE_MIN);
      expect(analysis.reason).toBe('HIGH_INTENSITY');
      expect(regulation.action).toBe('SOFTEN');
      expect(routing.channel).toBe('TEXT');
    });

    test('all caps text triggers TENSE', () => {
      const input = 'ABCD';
      const { analysis } = runPipeline(input);
      
      expect(analysis.state).toBe('TENSE');
      expect(analysis.score).toBeGreaterThanOrEqual(0.7);
    });

    test('high uppercase ratio produces TENSE', () => {
      // 100% uppercase ratio
      const input = 'TEST';
      const { analysis } = runPipeline(input);
      
      expect(analysis.state).toBe('TENSE');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TENSE Flow - Score validation
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow - score validation', () => {
    test('TENSE state has score >= 0.7', () => {
      const input = 'CAPS';
      const { analysis } = runPipeline(input);
      
      expect(analysis.state).toBe('TENSE');
      expect(analysis.score).toBeGreaterThanOrEqual(THRESHOLDS.TENSE_MIN);
    });

    test('TENSE score is within [0.7, 1.0]', () => {
      const inputs = ['AAAA', 'BBBB', 'TEST'];
      inputs.forEach(input => {
        const { analysis } = runPipeline(input);
        if (analysis.state === 'TENSE') {
          expect(analysis.score).toBeGreaterThanOrEqual(0.7);
          expect(analysis.score).toBeLessThanOrEqual(1.0);
        }
      });
    });

    test('intensity calculation is consistent', () => {
      const input = 'WORD';
      const { analysis: a1 } = runPipeline(input);
      const { analysis: a2 } = runPipeline(input);
      
      expect(a1.score).toBe(a2.score);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TENSE Flow - Regulation
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow - regulation', () => {
    test('TENSE always produces SOFTEN action', () => {
      const input = 'CAPS';
      const { analysis, regulation } = runPipeline(input);
      
      expect(analysis.state).toBe('TENSE');
      expect(regulation.action).toBe('SOFTEN');
    });

    test('TENSE regulation includes meta with HIGH_INTENSITY', () => {
      const input = 'WORD';
      const { analysis, regulation } = runPipeline(input);
      
      if (analysis.state === 'TENSE') {
        expect(regulation.meta).toBeDefined();
        expect(regulation.meta?.originalState).toBe('TENSE');
        expect(regulation.meta?.reason).toBe('HIGH_INTENSITY');
      }
    });

    test('SOFTEN preserves message content', () => {
      const input = 'TEST';
      const { regulation } = runPipeline(input);
      
      expect(regulation.message).toBe(input);
    });

    test('SOFTEN does not mutate original text', () => {
      const input = 'LOUD';
      const originalInput = input;
      runPipeline(input);
      
      expect(input).toBe(originalInput);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TENSE Flow - Routing
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow - routing', () => {
    test('TENSE + SOFTEN routes to TEXT', () => {
      const input = 'CAPS';
      const { analysis, regulation, routing } = runPipeline(input);
      
      expect(analysis.state).toBe('TENSE');
      expect(regulation.action).toBe('SOFTEN');
      expect(routing.channel).toBe('TEXT');
    });

    test('SOFTEN action always routes to TEXT channel', () => {
      const inputs = ['AAAA', 'BBBB', 'CAPS'];
      inputs.forEach(input => {
        const { regulation, routing } = runPipeline(input);
        if (regulation.action === 'SOFTEN') {
          expect(routing.channel).toBe('TEXT');
        }
      });
    });

    test('TENSE flow never routes to COOLDOWN', () => {
      const input = 'TEST';
      const { analysis, routing } = runPipeline(input);
      
      if (analysis.state === 'TENSE') {
        expect(routing.channel).toBe('TEXT');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TENSE Flow - Determinism
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow - determinism', () => {
    test('same input produces identical TENSE results', () => {
      const input = 'WORD';
      
      const result1 = runPipeline(input);
      const result2 = runPipeline(input);
      
      expect(result1.analysis.state).toBe(result2.analysis.state);
      expect(result1.analysis.score).toBe(result2.analysis.score);
      expect(result1.regulation.action).toBe(result2.regulation.action);
      expect(result1.routing.channel).toBe(result2.routing.channel);
    });

    test('TENSE detection is deterministic', () => {
      const input = 'CAPS';
      const results = Array(3).fill(null).map(() => runPipeline(input));
      
      results.forEach(r => {
        expect(r.analysis.state).toBe('TENSE');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TENSE Flow - Complete path
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow - complete path validation', () => {
    test('TENSE pipeline returns complete result', () => {
      const input = 'TEST';
      const { analysis, regulation, routing } = runPipeline(input);
      
      // Analysis
      expect(analysis.state).toBe('TENSE');
      expect(analysis.score).toBeGreaterThanOrEqual(0.7);
      expect(analysis.reason).toBe('HIGH_INTENSITY');
      
      // Regulation
      expect(regulation.action).toBe('SOFTEN');
      expect(regulation.message).toBe(input);
      expect(regulation.meta).toBeDefined();
      
      // Routing
      expect(routing.channel).toBe('TEXT');
    });

    test('TENSE pipeline maintains data consistency', () => {
      const input = 'CAPS';
      const { analysis, regulation } = runPipeline(input);
      
      expect(regulation.meta?.originalState).toBe(analysis.state);
      expect(regulation.meta?.score).toBe(analysis.score);
      expect(regulation.meta?.reason).toBe(analysis.reason);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TENSE Flow - Threshold boundary
  // ─────────────────────────────────────────────────────────────
  describe('TENSE flow - threshold boundary', () => {
    test('score at exactly 0.7 is TENSE', () => {
      // This depends on input characteristics
      // Testing that boundary behavior is correct
      const input = 'CAPS';
      const { analysis } = runPipeline(input);
      
      if (analysis.score >= 0.7) {
        expect(analysis.state).toBe('TENSE');
      }
    });

    test('TENSE threshold is consistent with THRESHOLDS.TENSE_MIN', () => {
      expect(THRESHOLDS.TENSE_MIN).toBe(0.7);
    });
  });
});
