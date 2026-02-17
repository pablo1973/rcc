"use strict";
/**
 * Unit Tests - Router
 * RCC v1.0.0-DAY7
 *
 * Deterministic tests against router API
 */
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../core/router");
describe('Unit: Router', () => {
    // ─────────────────────────────────────────────────────────────
    // route() - Structure
    // ─────────────────────────────────────────────────────────────
    describe('route() - output structure', () => {
        test('returns RouterResult structure', () => {
            const reg = { action: 'PASSTHROUGH', message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(result).toHaveProperty('channel');
        });
        test('channel is valid type', () => {
            const validChannels = ['TEXT', 'COOLDOWN'];
            const reg = { action: 'PASSTHROUGH', message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(validChannels).toContain(result.channel);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // route() - PASSTHROUGH action
    // ─────────────────────────────────────────────────────────────
    describe('route() - PASSTHROUGH action', () => {
        test('PASSTHROUGH routes to TEXT', () => {
            const reg = { action: 'PASSTHROUGH', message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe('TEXT');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // route() - SOFTEN action
    // ─────────────────────────────────────────────────────────────
    describe('route() - SOFTEN action', () => {
        test('SOFTEN routes to TEXT', () => {
            const reg = { action: 'SOFTEN', message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe('TEXT');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // route() - SUMMARIZE action
    // ─────────────────────────────────────────────────────────────
    describe('route() - SUMMARIZE action', () => {
        test('SUMMARIZE routes to TEXT', () => {
            const reg = { action: 'SUMMARIZE', message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe('TEXT');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // route() - PAUSE action
    // ─────────────────────────────────────────────────────────────
    describe('route() - PAUSE action', () => {
        test('PAUSE routes to COOLDOWN', () => {
            const reg = { action: 'PAUSE', message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe('COOLDOWN');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // route() - Default behavior
    // ─────────────────────────────────────────────────────────────
    describe('route() - default behavior', () => {
        test('unknown action routes to TEXT (default)', () => {
            const reg = { action: 'UNKNOWN', message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe('TEXT');
        });
        test('missing action routes to TEXT (default)', () => {
            const reg = { message: 'test' };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe('TEXT');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // route() - Determinism
    // ─────────────────────────────────────────────────────────────
    describe('route() - determinism', () => {
        test('same input produces same output', () => {
            const reg = { action: 'SOFTEN', message: 'test' };
            const r1 = (0, router_1.route)(reg);
            const r2 = (0, router_1.route)(reg);
            expect(r1.channel).toBe(r2.channel);
        });
        test('all non-PAUSE actions route to TEXT', () => {
            const actions = ['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE'];
            actions.forEach(action => {
                const reg = { action, message: 'test' };
                expect((0, router_1.route)(reg).channel).toBe('TEXT');
            });
        });
        test('only PAUSE routes to COOLDOWN', () => {
            const reg = { action: 'PAUSE', message: 'test' };
            expect((0, router_1.route)(reg).channel).toBe('COOLDOWN');
        });
    });
    // ─────────────────────────────────────────────────────────────
    // route() - Edge cases
    // ─────────────────────────────────────────────────────────────
    describe('route() - edge cases', () => {
        test('handles meta in RegulationResult', () => {
            const reg = {
                action: 'SOFTEN',
                message: 'test',
                meta: { originalState: 'TENSE', score: 0.8 }
            };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe('TEXT');
        });
        test('message content does not affect routing', () => {
            const reg1 = { action: 'PASSTHROUGH', message: '' };
            const reg2 = { action: 'PASSTHROUGH', message: 'long message here' };
            expect((0, router_1.route)(reg1).channel).toBe((0, router_1.route)(reg2).channel);
        });
    });
});
