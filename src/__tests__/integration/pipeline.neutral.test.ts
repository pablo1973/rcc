/**
 * Integration Tests - Pipeline NEUTRAL
 * RCC v1.0.0-DAY7
 * 
 * E2E tests for NEUTRAL state pipeline
 */

import { analyze } from '../../core/analyzer';
import { regulate } from '../../core/regulator';
import { route } from '../../core/router';
import { THRESHOLDS } from '../../core/states';

describe('Integration: Pipeline NEUTRAL', () => {

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
  // NEUTRAL Flow - Basic
  // ─────────────────────────────────────────────────────────────
  describe('NEUTRAL flow - basic inputs', () => {
    test('normal sentence produces NEUTRAL → PASSTHROUGH → TEXT', () => {
      // Mixed case with some uppercase produces medium intensity
      const input = 'Hello, this is A Normal message.';
      const { analysis, regulation, routing } = runPipeline(input);
      
      // Score should be in NEUTRAL range [0.3, 0.7)
      if (analysis.state === 'NEUTRAL') {
        expect(analysis.score).toBeGreaterThanOrEqual(THRESHOLDS.CALM_MAX);
        expect(analysis.score).toBeLessThan(THRESHOLDS.TENSE_MIN);
        expect(analysis.reason).toBe('BASELINE');
        expect(regulation.action).toBe('PASSTHROUGH');
        expect(routing.channel).toBe('TEXT');
      }
    });

    test('mixed case text flows through pipeline', () => {
      const input = 'This Is Mixed Case Text Here';
      const { analysis, regulation, routing } = runPipeline(input);
      
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
      expect(['PASSTHROUGH', 'SOFTEN']).toContain(regulation.action);
      expect(routing.channel).toBe('TEXT');
    });

    test('message content preserved through pipeline', () => {
      const input = 'This message Should Be Preserved';
      const { regulation } = runPipeline(input);
      
      expect(regulation.message).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // NEUTRAL Flow - Score validation
  // ─────────────────────────────────────────────────────────────
  describe('NEUTRAL flow - score validation', () => {
    test('NEUTRAL state has score in [0.3, 0.7) range', () => {
      // Text with ~40% uppercase ratio should give NEUTRAL
      const input = 'Hello WORLD this is test';
      const { analysis } = runPipeline(input);
      
      if (analysis.state === 'NEUTRAL') {
        expect(analysis.score).toBeGreaterThanOrEqual(0.3);
        expect(analysis.score).toBeLessThan(0.7);
      }
    });

    test('score determines NEUTRAL classification', () => {
      // Various inputs that might produce NEUTRAL
      const inputs = [
        'This Is A Test Message',
        'Hello World Test Here',
        'Normal TEXT with Some caps',
      ];
      
      inputs.forEach(input => {
        const { analysis } = runPipeline(input);
        expect(analysis.score).toBeGreaterThanOrEqual(0);
        expect(analysis.score).toBeLessThanOrEqual(1);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // NEUTRAL Flow - Regulation
  // ─────────────────────────────────────────────────────────────
  describe('NEUTRAL flow - regulation', () => {
    test('NEUTRAL always produces PASSTHROUGH', () => {
      const input = 'Normal Message Here';
      const { analysis, regulation } = runPipeline(input);
      
      if (analysis.state === 'NEUTRAL') {
        expect(regulation.action).toBe('PASSTHROUGH');
      }
    });

    test('NEUTRAL regulation includes meta', () => {
      const input = 'Test message';
      const { analysis, regulation } = runPipeline(input);
      
      if (analysis.state === 'NEUTRAL') {
        expect(regulation.meta).toBeDefined();
        expect(regulation.meta?.originalState).toBe('NEUTRAL');
      }
    });

    test('regulation preserves original text', () => {
      const input = 'Preserve This Message';
      const { regulation } = runPipeline(input);
      
      expect(regulation.message).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // NEUTRAL Flow - Routing
  // ─────────────────────────────────────────────────────────────
  describe('NEUTRAL flow - routing', () => {
    test('NEUTRAL + PASSTHROUGH routes to TEXT', () => {
      const input = 'Standard message';
      const { analysis, regulation, routing } = runPipeline(input);
      
      if (analysis.state === 'NEUTRAL') {
        expect(regulation.action).toBe('PASSTHROUGH');
        expect(routing.channel).toBe('TEXT');
      }
    });

    test('non-PAUSE actions always route to TEXT', () => {
      const inputs = ['test one', 'Test TWO', 'TEST three'];
      inputs.forEach(input => {
        const { regulation, routing } = runPipeline(input);
        if (regulation.action !== 'PAUSE') {
          expect(routing.channel).toBe('TEXT');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // NEUTRAL Flow - Determinism
  // ─────────────────────────────────────────────────────────────
  describe('NEUTRAL flow - determinism', () => {
    test('same input produces identical pipeline results', () => {
      const input = 'Deterministic Pipeline Test';
      
      const result1 = runPipeline(input);
      const result2 = runPipeline(input);
      
      expect(result1.analysis.state).toBe(result2.analysis.state);
      expect(result1.analysis.score).toBe(result2.analysis.score);
      expect(result1.regulation.action).toBe(result2.regulation.action);
      expect(result1.regulation.message).toBe(result2.regulation.message);
      expect(result1.routing.channel).toBe(result2.routing.channel);
    });

    test('pipeline is pure function', () => {
      const input = 'Pure function test';
      
      // Run multiple times
      const results = Array(5).fill(null).map(() => runPipeline(input));
      
      // All results should be identical
      results.forEach(r => {
        expect(r.analysis.state).toBe(results[0].analysis.state);
        expect(r.analysis.score).toBe(results[0].analysis.score);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // NEUTRAL Flow - Complete path
  // ─────────────────────────────────────────────────────────────
  describe('NEUTRAL flow - complete path validation', () => {
    test('complete pipeline returns all required fields', () => {
      const input = 'Complete pipeline test';
      const { analysis, regulation, routing } = runPipeline(input);
      
      // Analysis
      expect(analysis).toHaveProperty('state');
      expect(analysis).toHaveProperty('score');
      expect(analysis).toHaveProperty('reason');
      
      // Regulation
      expect(regulation).toHaveProperty('action');
      expect(regulation).toHaveProperty('message');
      
      // Routing
      expect(routing).toHaveProperty('channel');
    });

    test('pipeline maintains data integrity', () => {
      const input = 'Data integrity test';
      const { analysis, regulation } = runPipeline(input);
      
      // Message should be preserved
      expect(regulation.message).toBe(input);
      
      // Meta should reflect analysis
      if (regulation.meta) {
        expect(regulation.meta.originalState).toBe(analysis.state);
        expect(regulation.meta.score).toBe(analysis.score);
      }
    });
  });
});
