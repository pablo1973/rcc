/**
 * Unit Tests - Router
 * RCC v1.0.0-DAY7
 * 
 * Deterministic tests against router API
 */

import { route } from '../../core/router';
import { RegulationResult, RouterResult } from '../../core/types';

describe('Unit: Router', () => {

  // ─────────────────────────────────────────────────────────────
  // route() - Structure
  // ─────────────────────────────────────────────────────────────
  describe('route() - output structure', () => {
    test('returns RouterResult structure', () => {
      const reg: RegulationResult = { action: 'PASSTHROUGH', message: 'test' };
      const result = route(reg);
      expect(result).toHaveProperty('channel');
    });

    test('channel is valid type', () => {
      const validChannels = ['TEXT', 'COOLDOWN'];
      const reg: RegulationResult = { action: 'PASSTHROUGH', message: 'test' };
      const result = route(reg);
      expect(validChannels).toContain(result.channel);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // route() - PASSTHROUGH action
  // ─────────────────────────────────────────────────────────────
  describe('route() - PASSTHROUGH action', () => {
    test('PASSTHROUGH routes to TEXT', () => {
      const reg: RegulationResult = { action: 'PASSTHROUGH', message: 'test' };
      const result = route(reg);
      expect(result.channel).toBe('TEXT');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // route() - SOFTEN action
  // ─────────────────────────────────────────────────────────────
  describe('route() - SOFTEN action', () => {
    test('SOFTEN routes to TEXT', () => {
      const reg: RegulationResult = { action: 'SOFTEN', message: 'test' };
      const result = route(reg);
      expect(result.channel).toBe('TEXT');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // route() - SUMMARIZE action
  // ─────────────────────────────────────────────────────────────
  describe('route() - SUMMARIZE action', () => {
    test('SUMMARIZE routes to TEXT', () => {
      const reg: RegulationResult = { action: 'SUMMARIZE', message: 'test' };
      const result = route(reg);
      expect(result.channel).toBe('TEXT');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // route() - PAUSE action
  // ─────────────────────────────────────────────────────────────
  describe('route() - PAUSE action', () => {
    test('PAUSE routes to COOLDOWN', () => {
      const reg: RegulationResult = { action: 'PAUSE', message: 'test' };
      const result = route(reg);
      expect(result.channel).toBe('COOLDOWN');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // route() - Default behavior
  // ─────────────────────────────────────────────────────────────
  describe('route() - default behavior', () => {
    test('unknown action routes to TEXT (default)', () => {
      const reg = { action: 'UNKNOWN', message: 'test' } as any;
      const result = route(reg);
      expect(result.channel).toBe('TEXT');
    });

    test('missing action routes to TEXT (default)', () => {
      const reg = { message: 'test' } as any;
      const result = route(reg);
      expect(result.channel).toBe('TEXT');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // route() - Determinism
  // ─────────────────────────────────────────────────────────────
  describe('route() - determinism', () => {
    test('same input produces same output', () => {
      const reg: RegulationResult = { action: 'SOFTEN', message: 'test' };
      const r1 = route(reg);
      const r2 = route(reg);
      expect(r1.channel).toBe(r2.channel);
    });

    test('all non-PAUSE actions route to TEXT', () => {
      const actions: Array<'PASSTHROUGH' | 'SOFTEN' | 'SUMMARIZE'> = ['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE'];
      actions.forEach(action => {
        const reg: RegulationResult = { action, message: 'test' };
        expect(route(reg).channel).toBe('TEXT');
      });
    });

    test('only PAUSE routes to COOLDOWN', () => {
      const reg: RegulationResult = { action: 'PAUSE', message: 'test' };
      expect(route(reg).channel).toBe('COOLDOWN');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // route() - Edge cases
  // ─────────────────────────────────────────────────────────────
  describe('route() - edge cases', () => {
    test('handles meta in RegulationResult', () => {
      const reg: RegulationResult = {
        action: 'SOFTEN',
        message: 'test',
        meta: { originalState: 'TENSE', score: 0.8 }
      };
      const result = route(reg);
      expect(result.channel).toBe('TEXT');
    });

    test('message content does not affect routing', () => {
      const reg1: RegulationResult = { action: 'PASSTHROUGH', message: '' };
      const reg2: RegulationResult = { action: 'PASSTHROUGH', message: 'long message here' };
      expect(route(reg1).channel).toBe(route(reg2).channel);
    });
  });
});
