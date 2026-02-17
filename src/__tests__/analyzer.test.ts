import { AnalysisResult } from "../core/types";
import { analyze, normalize, MAX_INPUT_LENGTH } from "../core/analyzer";
import { computeMetrics, resolveState, Metrics } from "../core/heuristics";
import { resolveStateByScore, THRESHOLDS } from "../core/states";

describe("Analyzer", () => {
  describe("computeMetrics - métricas básicas", () => {
    test("returns zero metrics for empty string", () => {
      const metrics = computeMetrics("");
      expect(metrics.chars).toBe(0);
      expect(metrics.words).toBe(0);
      expect(metrics.intensity).toBe(0);
      expect(metrics.repetition).toBe(0);
      expect(metrics.noise).toBe(0);
    });

    test("returns metrics structure", () => {
      const metrics = computeMetrics("hello world");
      expect(metrics).toHaveProperty("chars");
      expect(metrics).toHaveProperty("words");
      expect(metrics).toHaveProperty("intensity");
      expect(metrics).toHaveProperty("repetition");
      expect(metrics).toHaveProperty("noise");
    });

    test("computes actual char count", () => {
      const metrics = computeMetrics("hello");
      expect(metrics.chars).toBe(5);
    });

    test("computes actual word count", () => {
      const metrics = computeMetrics("hello world test");
      expect(metrics.words).toBe(3);
    });

    test("intensity is between 0 and 1", () => {
      const metrics = computeMetrics("TEST!!!");
      expect(metrics.intensity).toBeGreaterThanOrEqual(0);
      expect(metrics.intensity).toBeLessThanOrEqual(1);
    });

    test("repetition is between 0 and 1", () => {
      const metrics = computeMetrics("aaa bbb aaa");
      expect(metrics.repetition).toBeGreaterThanOrEqual(0);
      expect(metrics.repetition).toBeLessThanOrEqual(1);
    });

    test("noise is between 0 and 1", () => {
      const metrics = computeMetrics("!!!???...");
      expect(metrics.noise).toBeGreaterThanOrEqual(0);
      expect(metrics.noise).toBeLessThanOrEqual(1);
    });
  });

  describe("resolveState - clasificación CALM / NEUTRAL / TENSE", () => {
    test("returns CALM for low intensity", () => {
      const metrics: Metrics = {
        chars: 10,
        words: 2,
        intensity: 0.1,
        repetition: 0,
        noise: 0,
      };
      expect(resolveState(metrics)).toBe("CALM");
    });

    test("returns NEUTRAL for medium intensity", () => {
      const metrics: Metrics = {
        chars: 10,
        words: 2,
        intensity: 0.5,
        repetition: 0.3,
        noise: 0.2,
      };
      expect(resolveState(metrics)).toBe("NEUTRAL");
    });

    test("returns TENSE for high intensity", () => {
      const metrics: Metrics = {
        chars: 10,
        words: 2,
        intensity: 0.8,
        repetition: 0.5,
        noise: 0.3,
      };
      expect(resolveState(metrics)).toBe("TENSE");
    });

    test("returns valid state type", () => {
      const metrics: Metrics = {
        chars: 10,
        words: 2,
        intensity: 0.5,
        repetition: 0.3,
        noise: 0.2,
      };
      const state = resolveState(metrics);
      expect(["CALM", "NEUTRAL", "TENSE"]).toContain(state);
    });

    test("is deterministic - same input produces same output", () => {
      const metrics: Metrics = {
        chars: 20,
        words: 4,
        intensity: 0.7,
        repetition: 0.5,
        noise: 0.3,
      };
      const state1 = resolveState(metrics);
      const state2 = resolveState(metrics);
      expect(state1).toBe(state2);
    });
  });

  describe("resolveStateByScore - umbrales explícitos", () => {
    test("score < CALM_MAX returns CALM", () => {
      expect(resolveStateByScore(0)).toBe("CALM");
      expect(resolveStateByScore(0.1)).toBe("CALM");
      expect(resolveStateByScore(0.29)).toBe("CALM");
    });

    test("score >= TENSE_MIN returns TENSE", () => {
      expect(resolveStateByScore(0.7)).toBe("TENSE");
      expect(resolveStateByScore(0.8)).toBe("TENSE");
      expect(resolveStateByScore(1)).toBe("TENSE");
    });

    test("score between thresholds returns NEUTRAL", () => {
      expect(resolveStateByScore(0.3)).toBe("NEUTRAL");
      expect(resolveStateByScore(0.5)).toBe("NEUTRAL");
      expect(resolveStateByScore(0.69)).toBe("NEUTRAL");
    });

    test("clamps score to [0, 1]", () => {
      expect(resolveStateByScore(-1)).toBe("CALM");
      expect(resolveStateByScore(2)).toBe("TENSE");
    });
  });

  describe("normalize - validación de entrada", () => {
    test("trims whitespace", () => {
      expect(normalize("  hello  ")).toBe("hello");
    });

    test("collapses multiple spaces", () => {
      expect(normalize("hello    world")).toBe("hello world");
    });

    test("returns empty string for non-string input", () => {
      expect(normalize(null as any)).toBe("");
      expect(normalize(undefined as any)).toBe("");
    });

    test("truncates to MAX_INPUT_LENGTH", () => {
      const longText = "a".repeat(MAX_INPUT_LENGTH + 100);
      expect(normalize(longText).length).toBe(MAX_INPUT_LENGTH);
    });

    test("returns empty string for whitespace only", () => {
      expect(normalize("   ")).toBe("");
    });
  });

  describe("analyze - edge cases", () => {
    test("handles empty string with INVALID_INPUT reason", () => {
      const result: AnalysisResult = analyze("");
      expect(result.state).toBe("NEUTRAL");
      expect(result.reason).toBe("INVALID_INPUT");
    });

    test("handles string with only spaces", () => {
      const result: AnalysisResult = analyze("   ");
      expect(result.state).toBe("NEUTRAL");
      expect(result.reason).toBe("INVALID_INPUT");
    });

    test("handles uppercase text", () => {
      const result: AnalysisResult = analyze("HELLO WORLD");
      expect(["CALM", "NEUTRAL", "TENSE"]).toContain(result.state);
    });

    test("handles repeated signs", () => {
      const result: AnalysisResult = analyze("Hello!!!!!????");
      expect(["CALM", "NEUTRAL", "TENSE"]).toContain(result.state);
    });

    test("handles mixed case and punctuation", () => {
      const result: AnalysisResult = analyze("HeLLo WoRLD!!!");
      expect(result).toHaveProperty("state");
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("reason");
    });
  });

  describe("analyze - full pipeline", () => {
    test("returns AnalysisResult with all fields", () => {
      const result = analyze("Hello world");
      expect(result).toHaveProperty("state");
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("reason");
    });

    test("pipeline is deterministic", () => {
      const input = "Deterministic test";
      const result1 = analyze(input);
      const result2 = analyze(input);
      expect(result1.state).toBe(result2.state);
      expect(result1.score).toBe(result2.score);
      expect(result1.reason).toBe(result2.reason);
    });
  });
});
