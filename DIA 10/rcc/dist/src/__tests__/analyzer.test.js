"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../core/analyzer");
const heuristics_1 = require("../core/heuristics");
const states_1 = require("../core/states");
describe("Analyzer", () => {
    describe("computeMetrics - métricas básicas", () => {
        test("returns zero metrics for empty string", () => {
            const metrics = (0, heuristics_1.computeMetrics)("");
            expect(metrics.chars).toBe(0);
            expect(metrics.words).toBe(0);
            expect(metrics.intensity).toBe(0);
            expect(metrics.repetition).toBe(0);
            expect(metrics.noise).toBe(0);
        });
        test("returns metrics structure", () => {
            const metrics = (0, heuristics_1.computeMetrics)("hello world");
            expect(metrics).toHaveProperty("chars");
            expect(metrics).toHaveProperty("words");
            expect(metrics).toHaveProperty("intensity");
            expect(metrics).toHaveProperty("repetition");
            expect(metrics).toHaveProperty("noise");
        });
        test("computes actual char count", () => {
            const metrics = (0, heuristics_1.computeMetrics)("hello");
            expect(metrics.chars).toBe(5);
        });
        test("computes actual word count", () => {
            const metrics = (0, heuristics_1.computeMetrics)("hello world test");
            expect(metrics.words).toBe(3);
        });
        test("intensity is between 0 and 1", () => {
            const metrics = (0, heuristics_1.computeMetrics)("TEST!!!");
            expect(metrics.intensity).toBeGreaterThanOrEqual(0);
            expect(metrics.intensity).toBeLessThanOrEqual(1);
        });
        test("repetition is between 0 and 1", () => {
            const metrics = (0, heuristics_1.computeMetrics)("aaa bbb aaa");
            expect(metrics.repetition).toBeGreaterThanOrEqual(0);
            expect(metrics.repetition).toBeLessThanOrEqual(1);
        });
        test("noise is between 0 and 1", () => {
            const metrics = (0, heuristics_1.computeMetrics)("!!!???...");
            expect(metrics.noise).toBeGreaterThanOrEqual(0);
            expect(metrics.noise).toBeLessThanOrEqual(1);
        });
    });
    describe("resolveState - clasificación CALM / NEUTRAL / TENSE", () => {
        test("returns CALM for low intensity", () => {
            const metrics = {
                chars: 10,
                words: 2,
                intensity: 0.1,
                repetition: 0,
                noise: 0,
            };
            expect((0, heuristics_1.resolveState)(metrics)).toBe("CALM");
        });
        test("returns NEUTRAL for medium intensity", () => {
            const metrics = {
                chars: 10,
                words: 2,
                intensity: 0.5,
                repetition: 0.3,
                noise: 0.2,
            };
            expect((0, heuristics_1.resolveState)(metrics)).toBe("NEUTRAL");
        });
        test("returns TENSE for high intensity", () => {
            const metrics = {
                chars: 10,
                words: 2,
                intensity: 0.8,
                repetition: 0.5,
                noise: 0.3,
            };
            expect((0, heuristics_1.resolveState)(metrics)).toBe("TENSE");
        });
        test("returns valid state type", () => {
            const metrics = {
                chars: 10,
                words: 2,
                intensity: 0.5,
                repetition: 0.3,
                noise: 0.2,
            };
            const state = (0, heuristics_1.resolveState)(metrics);
            expect(["CALM", "NEUTRAL", "TENSE"]).toContain(state);
        });
        test("is deterministic - same input produces same output", () => {
            const metrics = {
                chars: 20,
                words: 4,
                intensity: 0.7,
                repetition: 0.5,
                noise: 0.3,
            };
            const state1 = (0, heuristics_1.resolveState)(metrics);
            const state2 = (0, heuristics_1.resolveState)(metrics);
            expect(state1).toBe(state2);
        });
    });
    describe("resolveStateByScore - umbrales explícitos", () => {
        test("score < CALM_MAX returns CALM", () => {
            expect((0, states_1.resolveStateByScore)(0)).toBe("CALM");
            expect((0, states_1.resolveStateByScore)(0.1)).toBe("CALM");
            expect((0, states_1.resolveStateByScore)(0.29)).toBe("CALM");
        });
        test("score >= TENSE_MIN returns TENSE", () => {
            expect((0, states_1.resolveStateByScore)(0.7)).toBe("TENSE");
            expect((0, states_1.resolveStateByScore)(0.8)).toBe("TENSE");
            expect((0, states_1.resolveStateByScore)(1)).toBe("TENSE");
        });
        test("score between thresholds returns NEUTRAL", () => {
            expect((0, states_1.resolveStateByScore)(0.3)).toBe("NEUTRAL");
            expect((0, states_1.resolveStateByScore)(0.5)).toBe("NEUTRAL");
            expect((0, states_1.resolveStateByScore)(0.69)).toBe("NEUTRAL");
        });
        test("clamps score to [0, 1]", () => {
            expect((0, states_1.resolveStateByScore)(-1)).toBe("CALM");
            expect((0, states_1.resolveStateByScore)(2)).toBe("TENSE");
        });
    });
    describe("normalize - validación de entrada", () => {
        test("trims whitespace", () => {
            expect((0, analyzer_1.normalize)("  hello  ")).toBe("hello");
        });
        test("collapses multiple spaces", () => {
            expect((0, analyzer_1.normalize)("hello    world")).toBe("hello world");
        });
        test("returns empty string for non-string input", () => {
            expect((0, analyzer_1.normalize)(null)).toBe("");
            expect((0, analyzer_1.normalize)(undefined)).toBe("");
        });
        test("truncates to MAX_INPUT_LENGTH", () => {
            const longText = "a".repeat(analyzer_1.MAX_INPUT_LENGTH + 100);
            expect((0, analyzer_1.normalize)(longText).length).toBe(analyzer_1.MAX_INPUT_LENGTH);
        });
        test("returns empty string for whitespace only", () => {
            expect((0, analyzer_1.normalize)("   ")).toBe("");
        });
    });
    describe("analyze - edge cases", () => {
        test("handles empty string with INVALID_INPUT reason", () => {
            const result = (0, analyzer_1.analyze)("");
            expect(result.state).toBe("NEUTRAL");
            expect(result.reason).toBe("INVALID_INPUT");
        });
        test("handles string with only spaces", () => {
            const result = (0, analyzer_1.analyze)("   ");
            expect(result.state).toBe("NEUTRAL");
            expect(result.reason).toBe("INVALID_INPUT");
        });
        test("handles uppercase text", () => {
            const result = (0, analyzer_1.analyze)("HELLO WORLD");
            expect(["CALM", "NEUTRAL", "TENSE"]).toContain(result.state);
        });
        test("handles repeated signs", () => {
            const result = (0, analyzer_1.analyze)("Hello!!!!!????");
            expect(["CALM", "NEUTRAL", "TENSE"]).toContain(result.state);
        });
        test("handles mixed case and punctuation", () => {
            const result = (0, analyzer_1.analyze)("HeLLo WoRLD!!!");
            expect(result).toHaveProperty("state");
            expect(result).toHaveProperty("score");
            expect(result).toHaveProperty("reason");
        });
    });
    describe("analyze - full pipeline", () => {
        test("returns AnalysisResult with all fields", () => {
            const result = (0, analyzer_1.analyze)("Hello world");
            expect(result).toHaveProperty("state");
            expect(result).toHaveProperty("score");
            expect(result).toHaveProperty("reason");
        });
        test("pipeline is deterministic", () => {
            const input = "Deterministic test";
            const result1 = (0, analyzer_1.analyze)(input);
            const result2 = (0, analyzer_1.analyze)(input);
            expect(result1.state).toBe(result2.state);
            expect(result1.score).toBe(result2.score);
            expect(result1.reason).toBe(result2.reason);
        });
    });
});
