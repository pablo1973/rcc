import { route } from "../core/router";
import { RegulationResult, RouterResult } from "../core/types";

describe("Router", () => {
  describe("route - ruteo determinístico", () => {
    test("PAUSE action routes to COOLDOWN", () => {
      const reg: RegulationResult = { action: "PAUSE", message: "test" };
      const result = route(reg);
      expect(result.channel).toBe("COOLDOWN");
    });

    test("PASSTHROUGH action routes to TEXT", () => {
      const reg: RegulationResult = { action: "PASSTHROUGH", message: "test" };
      const result = route(reg);
      expect(result.channel).toBe("TEXT");
    });

    test("SOFTEN action routes to TEXT", () => {
      const reg: RegulationResult = { action: "SOFTEN", message: "test" };
      const result = route(reg);
      expect(result.channel).toBe("TEXT");
    });

    test("SUMMARIZE action routes to TEXT", () => {
      const reg: RegulationResult = { action: "SUMMARIZE", message: "test" };
      const result = route(reg);
      expect(result.channel).toBe("TEXT");
    });

    test("is deterministic - same input produces same output", () => {
      const reg: RegulationResult = { action: "SOFTEN", message: "test" };
      const result1 = route(reg);
      const result2 = route(reg);
      expect(result1.channel).toBe(result2.channel);
    });
  });

  describe("RouterResult structure", () => {
    test("returns object with channel property", () => {
      const reg: RegulationResult = { action: "PASSTHROUGH", message: "test" };
      const result = route(reg);
      expect(result).toHaveProperty("channel");
      expect(typeof result.channel).toBe("string");
    });

    test("channel is valid RouterChannel type", () => {
      const reg: RegulationResult = { action: "PAUSE", message: "test" };
      const result = route(reg);
      expect(["TEXT", "COOLDOWN"]).toContain(result.channel);
    });
  });
});
