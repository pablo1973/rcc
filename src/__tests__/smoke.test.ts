import { InputMessage, Channel, AnalysisResult, RegulationResult } from "../core/types";
import { CognitiveState } from "../core/states";
import { analyze } from "../core/analyzer";
import { regulate } from "../core/regulator";

describe("RCC Smoke Test", () => {
  const mockInput: InputMessage = {
    id: "test-1",
    text: "Hello world",
    author: "user",
    channel: "cli" as Channel,
    timestamp: Date.now(),
  };

  test("types are defined", () => {
    expect(mockInput.id).toBe("test-1");
    expect(mockInput.channel).toBe("cli");
  });

  test("CognitiveState type exists", () => {
    const state: CognitiveState = "NEUTRAL";
    expect(["CALM", "NEUTRAL", "TENSE"]).toContain(state);
  });

  test("analyze returns AnalysisResult with state", () => {
    const result: AnalysisResult = analyze(mockInput.text);
    expect(["CALM", "NEUTRAL", "TENSE"]).toContain(result.state);
    expect(typeof result.score).toBe("number");
    expect(typeof result.reason).toBe("string");
  });

  test("regulate returns RegulationResult with action", () => {
    const analysis: AnalysisResult = { state: "NEUTRAL", score: 0.5, reason: "BASELINE" };
    const result: RegulationResult = regulate(analysis, "Hello world");
    expect(["PASSTHROUGH", "SOFTEN", "SUMMARIZE", "PAUSE"]).toContain(result.action);
    expect(result.message).toBe("Hello world");
  });

  test("pipeline: input -> analyze -> regulate", () => {
    const input: InputMessage = {
      id: "pipe-1",
      text: "Test message",
      author: "tester",
      channel: "slack",
      timestamp: Date.now(),
    };
    const analysis = analyze(input.text);
    const result = regulate(analysis, input.text);
    expect(["CALM", "NEUTRAL", "TENSE"]).toContain(analysis.state);
    expect(["PASSTHROUGH", "SOFTEN", "SUMMARIZE", "PAUSE"]).toContain(result.action);
  });
});
