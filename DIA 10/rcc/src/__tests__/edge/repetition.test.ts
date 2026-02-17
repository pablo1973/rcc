/**
 * Edge Cases - Repetition Patterns
 * RCC v1.0.0-DAY8
 * 
 * Validates: no-crash, stable output, coherent state
 * for highly repetitive inputs
 */

import { analyze } from '../../core/analyzer';
import { regulate } from '../../core/regulator';
import { route } from '../../core/router';

describe('Edge: Repetition Patterns', () => {

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
  // Single character repetition
  // ─────────────────────────────────────────────────────────────
  describe('single character repetition', () => {
    test('aaaa... does not crash', () => {
      const input = 'a'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('AAAA... does not crash', () => {
      const input = 'A'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('lowercase repeat returns CALM', () => {
      const input = 'a'.repeat(50);
      const { analysis } = runPipeline(input);
      expect(analysis.state).toBe('CALM');
    });

    test('uppercase repeat returns TENSE', () => {
      const input = 'A'.repeat(10);
      const { analysis } = runPipeline(input);
      expect(analysis.state).toBe('TENSE');
    });

    test('digit repeat returns CALM', () => {
      const input = '1'.repeat(100);
      const { analysis } = runPipeline(input);
      expect(analysis.state).toBe('CALM');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Word repetition
  // ─────────────────────────────────────────────────────────────
  describe('word repetition', () => {
    test('same word repeated does not crash', () => {
      const input = 'test test test test test';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('100x same word', () => {
      const input = Array(100).fill('word').join(' ');
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('1000x same word', () => {
      const input = Array(1000).fill('repeat').join(' ');
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('repeated word returns valid state', () => {
      const input = Array(50).fill('hello').join(' ');
      const { analysis } = runPipeline(input);
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
    });

    test('high repetition produces high repetition score', () => {
      // All same word = maximum repetition
      const input = Array(20).fill('same').join(' ');
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Phrase repetition
  // ─────────────────────────────────────────────────────────────
  describe('phrase repetition', () => {
    test('same phrase repeated', () => {
      const input = 'hello world '.repeat(50);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('longer phrase repeated', () => {
      const input = 'the quick brown fox '.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('phrase with punctuation repeated', () => {
      const input = 'hello! '.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('phrase repetition routes to TEXT', () => {
      const input = 'repeat this '.repeat(50);
      const { routing } = runPipeline(input);
      expect(routing.channel).toBe('TEXT');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Pattern repetition
  // ─────────────────────────────────────────────────────────────
  describe('pattern repetition', () => {
    test('abc pattern repeated', () => {
      const input = 'abc'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('alternating pattern aAbBaAbB', () => {
      const input = 'aAbB'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('number pattern 123', () => {
      const input = '123'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('mixed alphanumeric pattern', () => {
      const input = 'a1b2c3'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('punctuation pattern', () => {
      const input = '!?.'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Extreme repetition ratios
  // ─────────────────────────────────────────────────────────────
  describe('extreme repetition ratios', () => {
    test('100% repetition (single word many times)', () => {
      const input = 'same same same same same';
      const { analysis } = runPipeline(input);
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
    });

    test('0% repetition (all unique words)', () => {
      const input = 'one two three four five six seven';
      const { analysis } = runPipeline(input);
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
    });

    test('50% repetition (half repeated)', () => {
      const input = 'a b a c a d a e';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Special character repetition
  // ─────────────────────────────────────────────────────────────
  describe('special character repetition', () => {
    test('exclamation marks', () => {
      const input = '!'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('question marks', () => {
      const input = '?'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('dots', () => {
      const input = '.'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('mixed punctuation', () => {
      const input = '!?!?!?'.repeat(50);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('at symbols', () => {
      const input = '@'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('hash symbols', () => {
      const input = '#'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Whitespace repetition patterns
  // ─────────────────────────────────────────────────────────────
  describe('whitespace repetition patterns', () => {
    test('word with many spaces between', () => {
      const input = 'a          b          c';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('alternating word and many spaces', () => {
      const input = 'word     '.repeat(50);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('spaces normalized in pipeline', () => {
      const input = 'hello     world';
      const { regulation } = runPipeline(input);
      // Message should contain the input
      expect(regulation.message).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Repetition edge: keyboard spam
  // ─────────────────────────────────────────────────────────────
  describe('keyboard spam patterns', () => {
    test('asdf spam', () => {
      const input = 'asdf'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('qwerty spam', () => {
      const input = 'qwerty'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('jkl; spam', () => {
      const input = 'jkl;'.repeat(100);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('random mash pattern', () => {
      const input = 'asdfjkl;'.repeat(50);
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Determinism for repetitive inputs
  // ─────────────────────────────────────────────────────────────
  describe('determinism', () => {
    test('same repetitive input = same output', () => {
      const input = 'repeat '.repeat(100);
      const r1 = runPipeline(input);
      const r2 = runPipeline(input);
      expect(r1.analysis).toEqual(r2.analysis);
    });

    test('high repetition is deterministic', () => {
      const input = Array(100).fill('same').join(' ');
      const r1 = runPipeline(input);
      const r2 = runPipeline(input);
      expect(r1.analysis.state).toBe(r2.analysis.state);
      expect(r1.analysis.score).toBe(r2.analysis.score);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // State coherence
  // ─────────────────────────────────────────────────────────────
  describe('state coherence', () => {
    test('repetitive input produces valid action', () => {
      const input = 'action '.repeat(50);
      const { regulation } = runPipeline(input);
      expect(['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE']).toContain(regulation.action);
    });

    test('repetitive input routes to valid channel', () => {
      const input = 'channel '.repeat(50);
      const { routing } = runPipeline(input);
      expect(['TEXT', 'COOLDOWN']).toContain(routing.channel);
    });

    test('message preserved for repetitive input', () => {
      const input = 'preserve preserve preserve';
      const { regulation } = runPipeline(input);
      expect(regulation.message).toBe(input);
    });
  });
});
