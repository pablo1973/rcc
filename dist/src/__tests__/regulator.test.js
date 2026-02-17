"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regulator_1 = require("../core/regulator");
describe("Regulator", () => {
    describe("regulate - sin efectos colaterales", () => {
        test("returns RegulationResult with action and message", () => {
            const analysis = {
                state: "NEUTRAL",
                score: 0.5,
                reason: "BASELINE"
            };
            const result = (0, regulator_1.regulate)(analysis, "Hello world");
            expect(result).toHaveProperty("action");
            expect(result).toHaveProperty("message");
        });
        test("CALM state returns PASSTHROUGH action", () => {
            const analysis = {
                state: "CALM",
                score: 0.1,
                reason: "LOW_INTENSITY"
            };
            const result = (0, regulator_1.regulate)(analysis, "Hello");
            expect(result.action).toBe("PASSTHROUGH");
        });
        test("NEUTRAL state returns PASSTHROUGH action", () => {
            const analysis = {
                state: "NEUTRAL",
                score: 0.5,
                reason: "BASELINE"
            };
            const result = (0, regulator_1.regulate)(analysis, "Hello");
            expect(result.action).toBe("PASSTHROUGH");
        });
        test("TENSE state returns SOFTEN action", () => {
            const analysis = {
                state: "TENSE",
                score: 0.8,
                reason: "HIGH_INTENSITY"
            };
            const result = (0, regulator_1.regulate)(analysis, "Hello");
            expect(result.action).toBe("SOFTEN");
        });
        test("message contains regulated text", () => {
            const analysis = {
                state: "NEUTRAL",
                score: 0.5,
                reason: "BASELINE"
            };
            const result = (0, regulator_1.regulate)(analysis, "Test message");
            expect(result.message).toBe("Test message");
        });
        test("meta contains original state and score", () => {
            const analysis = {
                state: "TENSE",
                score: 0.8,
                reason: "HIGH_INTENSITY"
            };
            const result = (0, regulator_1.regulate)(analysis, "Test");
            expect(result.meta).toBeDefined();
            expect(result.meta?.originalState).toBe("TENSE");
            expect(result.meta?.score).toBe(0.8);
            expect(result.meta?.reason).toBe("HIGH_INTENSITY");
        });
    });
    describe("regulate - fail-safe behavior", () => {
        test("handles null analysis gracefully", () => {
            const result = (0, regulator_1.regulate)(null, "Test");
            expect(result.action).toBe("PASSTHROUGH");
            expect(result.message).toBe("Test");
        });
        test("handles undefined analysis gracefully", () => {
            const result = (0, regulator_1.regulate)(undefined, "Test");
            expect(result.action).toBe("PASSTHROUGH");
            expect(result.message).toBe("Test");
        });
        test("handles invalid state gracefully", () => {
            const analysis = {
                state: "INVALID",
                score: 0.5,
                reason: "TEST"
            };
            const result = (0, regulator_1.regulate)(analysis, "Test");
            expect(result.action).toBe("PASSTHROUGH");
        });
    });
    describe("regulate - determinism", () => {
        test("same input produces same output", () => {
            const analysis = {
                state: "TENSE",
                score: 0.8,
                reason: "HIGH_INTENSITY"
            };
            const result1 = (0, regulator_1.regulate)(analysis, "Test");
            const result2 = (0, regulator_1.regulate)(analysis, "Test");
            expect(result1.action).toBe(result2.action);
            expect(result1.message).toBe(result2.message);
        });
    });
    describe("regulate - no mutation", () => {
        test("does not mutate input analysis", () => {
            const analysis = {
                state: "TENSE",
                score: 0.8,
                reason: "HIGH_INTENSITY"
            };
            const originalState = analysis.state;
            const originalScore = analysis.score;
            (0, regulator_1.regulate)(analysis, "Original");
            expect(analysis.state).toBe(originalState);
            expect(analysis.score).toBe(originalScore);
        });
    });
});
