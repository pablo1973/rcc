"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../core/analyzer");
const regulator_1 = require("../core/regulator");
describe("RCC Smoke Test", () => {
    const mockInput = {
        id: "test-1",
        text: "Hello world",
        author: "user",
        channel: "cli",
        timestamp: Date.now(),
    };
    test("types are defined", () => {
        expect(mockInput.id).toBe("test-1");
        expect(mockInput.channel).toBe("cli");
    });
    test("CognitiveState type exists", () => {
        const state = "NEUTRAL";
        expect(["CALM", "NEUTRAL", "TENSE"]).toContain(state);
    });
    test("analyze returns AnalysisResult with state", () => {
        const result = (0, analyzer_1.analyze)(mockInput.text);
        expect(["CALM", "NEUTRAL", "TENSE"]).toContain(result.state);
        expect(typeof result.score).toBe("number");
        expect(typeof result.reason).toBe("string");
    });
    test("regulate returns RegulationResult with action", () => {
        const analysis = { state: "NEUTRAL", score: 0.5, reason: "BASELINE" };
        const result = (0, regulator_1.regulate)(analysis, "Hello world");
        expect(["PASSTHROUGH", "SOFTEN", "SUMMARIZE", "PAUSE"]).toContain(result.action);
        expect(result.message).toBe("Hello world");
    });
    test("pipeline: input -> analyze -> regulate", () => {
        const input = {
            id: "pipe-1",
            text: "Test message",
            author: "tester",
            channel: "slack",
            timestamp: Date.now(),
        };
        const analysis = (0, analyzer_1.analyze)(input.text);
        const result = (0, regulator_1.regulate)(analysis, input.text);
        expect(["CALM", "NEUTRAL", "TENSE"]).toContain(analysis.state);
        expect(["PASSTHROUGH", "SOFTEN", "SUMMARIZE", "PAUSE"]).toContain(result.action);
    });
});
