import { regulate } from "../core/regulator";
import { AnalysisResult, RegulationResult } from "../core/types";

describe("Regulator", () => {
  describe("regulate - sin efectos colaterales", () => {
    test("returns RegulationResult with action and message", () => {
      const analysis: AnalysisResult = {
        state: "NEUTRAL",
        score: 0.5,
        reason: "BASELINE"
      };
      const result = regulate(analysis, "Hello world");
      expect(result).toHaveProperty("action");
      expect(result).toHaveProperty("message");
    });

    test("CALM state returns PASSTHROUGH action", () => {
      const analysis: AnalysisResult = {
        state: "CALM",
        score: 0.1,
        reason: "LOW_INTENSITY"
      };
      const result = regulate(analysis, "Hello");
      expect(result.action).toBe("PASSTHROUGH");
    });

    test("NEUTRAL state returns PASSTHROUGH action", () => {
      const analysis: AnalysisResult = {
        state: "NEUTRAL",
        score: 0.5,
        reason: "BASELINE"
      };
      const result = regulate(analysis, "Hello");
      expect(result.action).toBe("PASSTHROUGH");
    });

    test("TENSE state returns SOFTEN action", () => {
      const analysis: AnalysisResult = {
        state: "TENSE",
        score: 0.8,
        reason: "HIGH_INTENSITY"
      };
      const result = regulate(analysis, "Hello");
      expect(result.action).toBe("SOFTEN");
    });

    test("message contains regulated text", () => {
      const analysis: AnalysisResult = {
        state: "NEUTRAL",
        score: 0.5,
        reason: "BASELINE"
      };
      const result = regulate(analysis, "Test message");
      expect(result.message).toBe("Test message");
    });

    test("meta contains original state and score", () => {
      const analysis: AnalysisResult = {
        state: "TENSE",
        score: 0.8,
        reason: "HIGH_INTENSITY"
      };
      const result = regulate(analysis, "Test");
      expect(result.meta).toBeDefined();
      expect(result.meta?.originalState).toBe("TENSE");
      expect(result.meta?.score).toBe(0.8);
      expect(result.meta?.reason).toBe("HIGH_INTENSITY");
    });
  });

  describe("regulate - fail-safe behavior", () => {
    test("handles null analysis gracefully", () => {
      const result = regulate(null as any, "Test");
      expect(result.action).toBe("PASSTHROUGH");
      expect(result.message).toBe("Test");
    });

    test("handles undefined analysis gracefully", () => {
      const result = regulate(undefined as any, "Test");
      expect(result.action).toBe("PASSTHROUGH");
      expect(result.message).toBe("Test");
    });

    test("handles invalid state gracefully", () => {
      const analysis = {
        state: "INVALID" as any,
        score: 0.5,
        reason: "TEST"
      };
      const result = regulate(analysis, "Test");
      expect(result.action).toBe("PASSTHROUGH");
    });
  });

  describe("regulate - determinism", () => {
    test("same input produces same output", () => {
      const analysis: AnalysisResult = {
        state: "TENSE",
        score: 0.8,
        reason: "HIGH_INTENSITY"
      };
      const result1 = regulate(analysis, "Test");
      const result2 = regulate(analysis, "Test");
      expect(result1.action).toBe(result2.action);
      expect(result1.message).toBe(result2.message);
    });
  });

  describe("regulate - no mutation", () => {
    test("does not mutate input analysis", () => {
      const analysis: AnalysisResult = {
        state: "TENSE",
        score: 0.8,
        reason: "HIGH_INTENSITY"
      };
      const originalState = analysis.state;
      const originalScore = analysis.score;
      
      regulate(analysis, "Original");
      
      expect(analysis.state).toBe(originalState);
      expect(analysis.score).toBe(originalScore);
    });
  });
});
