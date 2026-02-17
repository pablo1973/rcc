"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const states_1 = require("../core/states");
describe("States - Hardened", () => {
    describe("THRESHOLDS", () => {
        test("CALM_MAX is defined", () => {
            expect(states_1.THRESHOLDS.CALM_MAX).toBeDefined();
            expect(typeof states_1.THRESHOLDS.CALM_MAX).toBe("number");
        });
        test("TENSE_MIN is defined", () => {
            expect(states_1.THRESHOLDS.TENSE_MIN).toBeDefined();
            expect(typeof states_1.THRESHOLDS.TENSE_MIN).toBe("number");
        });
        test("CALM_MAX < TENSE_MIN (invariant)", () => {
            expect(states_1.THRESHOLDS.CALM_MAX).toBeLessThan(states_1.THRESHOLDS.TENSE_MIN);
        });
        test("thresholds have expected values", () => {
            expect(states_1.THRESHOLDS.CALM_MAX).toBe(0.3);
            expect(states_1.THRESHOLDS.TENSE_MIN).toBe(0.7);
        });
    });
    describe("isValidState", () => {
        test("CALM is valid", () => {
            expect((0, states_1.isValidState)("CALM")).toBe(true);
        });
        test("NEUTRAL is valid", () => {
            expect((0, states_1.isValidState)("NEUTRAL")).toBe(true);
        });
        test("TENSE is valid", () => {
            expect((0, states_1.isValidState)("TENSE")).toBe(true);
        });
        test("invalid state returns false", () => {
            expect((0, states_1.isValidState)("INVALID")).toBe(false);
            expect((0, states_1.isValidState)("")).toBe(false);
            expect((0, states_1.isValidState)("calm")).toBe(false);
            expect((0, states_1.isValidState)("Calm")).toBe(false);
        });
    });
    describe("resolveStateByScore - determinism", () => {
        test("same score always produces same state", () => {
            for (let i = 0; i <= 10; i++) {
                const score = i / 10;
                const state1 = (0, states_1.resolveStateByScore)(score);
                const state2 = (0, states_1.resolveStateByScore)(score);
                expect(state1).toBe(state2);
            }
        });
    });
    describe("resolveStateByScore - boundary conditions", () => {
        test("score 0 returns CALM", () => {
            expect((0, states_1.resolveStateByScore)(0)).toBe("CALM");
        });
        test("score 1 returns TENSE", () => {
            expect((0, states_1.resolveStateByScore)(1)).toBe("TENSE");
        });
        test("score below CALM_MAX returns CALM", () => {
            expect((0, states_1.resolveStateByScore)(0.1)).toBe("CALM");
            expect((0, states_1.resolveStateByScore)(0.29)).toBe("CALM");
        });
        test("score at or above CALM_MAX but below TENSE_MIN returns NEUTRAL", () => {
            expect((0, states_1.resolveStateByScore)(0.3)).toBe("NEUTRAL");
            expect((0, states_1.resolveStateByScore)(0.5)).toBe("NEUTRAL");
            expect((0, states_1.resolveStateByScore)(0.69)).toBe("NEUTRAL");
        });
        test("score at or above TENSE_MIN returns TENSE", () => {
            expect((0, states_1.resolveStateByScore)(0.7)).toBe("TENSE");
            expect((0, states_1.resolveStateByScore)(0.8)).toBe("TENSE");
            expect((0, states_1.resolveStateByScore)(0.9)).toBe("TENSE");
        });
    });
    describe("resolveStateByScore - clamping", () => {
        test("negative score clamps to CALM", () => {
            expect((0, states_1.resolveStateByScore)(-0.5)).toBe("CALM");
            expect((0, states_1.resolveStateByScore)(-100)).toBe("CALM");
        });
        test("score > 1 clamps to TENSE", () => {
            expect((0, states_1.resolveStateByScore)(1.5)).toBe("TENSE");
            expect((0, states_1.resolveStateByScore)(100)).toBe("TENSE");
        });
    });
    describe("State invariants", () => {
        test("only 3 valid states exist", () => {
            expect((0, states_1.isValidState)("CALM")).toBe(true);
            expect((0, states_1.isValidState)("NEUTRAL")).toBe(true);
            expect((0, states_1.isValidState)("TENSE")).toBe(true);
            // Any other string is invalid
            expect((0, states_1.isValidState)("OTHER")).toBe(false);
            expect((0, states_1.isValidState)("ANXIOUS")).toBe(false);
        });
        test("resolveStateByScore only returns valid states", () => {
            const scores = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
            scores.forEach(score => {
                const state = (0, states_1.resolveStateByScore)(score);
                expect((0, states_1.isValidState)(state)).toBe(true);
            });
        });
    });
});
