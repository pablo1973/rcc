import { applyRules } from "../core/rules";
import { State } from "../core/states";

describe("Rules", () => {
  describe("applyRules - cada estado aplica regla", () => {
    test("CALM state returns text", () => {
      const text = "Hello world";
      const result = applyRules(text, "CALM");
      expect(typeof result).toBe("string");
    });

    test("NEUTRAL state returns text", () => {
      const text = "Hello world";
      const result = applyRules(text, "NEUTRAL");
      expect(typeof result).toBe("string");
    });

    test("TENSE state returns text", () => {
      const text = "Hello world";
      const result = applyRules(text, "TENSE");
      expect(typeof result).toBe("string");
    });

    test("all states are handled", () => {
      const states: State[] = ["CALM", "NEUTRAL", "TENSE"];
      const text = "Test message";
      states.forEach((state) => {
        const result = applyRules(text, state);
        expect(result).toBeDefined();
      });
    });
  });

  describe("applyRules - no elimina palabras clave del texto original", () => {
    test("preserves all words for CALM", () => {
      const text = "important keyword message";
      const result = applyRules(text, "CALM");
      expect(result).toContain("important");
      expect(result).toContain("keyword");
      expect(result).toContain("message");
    });

    test("preserves all words for NEUTRAL", () => {
      const text = "important keyword message";
      const result = applyRules(text, "NEUTRAL");
      expect(result).toContain("important");
      expect(result).toContain("keyword");
      expect(result).toContain("message");
    });

    test("preserves all words for TENSE", () => {
      const text = "important keyword message";
      const result = applyRules(text, "TENSE");
      expect(result).toContain("important");
      expect(result).toContain("keyword");
      expect(result).toContain("message");
    });

    test("preserves original text exactly in baseline", () => {
      const text = "Original text with keywords";
      const states: State[] = ["CALM", "NEUTRAL", "TENSE"];
      states.forEach((state) => {
        const result = applyRules(text, state);
        expect(result).toBe(text);
      });
    });

    test("does not drop any characters", () => {
      const text = "Test 123 !@#";
      const states: State[] = ["CALM", "NEUTRAL", "TENSE"];
      states.forEach((state) => {
        const result = applyRules(text, state);
        expect(result.length).toBe(text.length);
      });
    });
  });

  describe("applyRules - edge cases", () => {
    test("handles empty string", () => {
      const states: State[] = ["CALM", "NEUTRAL", "TENSE"];
      states.forEach((state) => {
        const result = applyRules("", state);
        expect(result).toBe("");
      });
    });

    test("handles string with only whitespace", () => {
      const text = "   ";
      const result = applyRules(text, "NEUTRAL");
      expect(result).toBe(text);
    });

    test("handles special characters", () => {
      const text = "Hello! @user #hashtag $100";
      const result = applyRules(text, "NEUTRAL");
      expect(result).toBe(text);
    });

    test("is deterministic", () => {
      const text = "Deterministic test";
      const state: State = "NEUTRAL";
      const result1 = applyRules(text, state);
      const result2 = applyRules(text, state);
      expect(result1).toBe(result2);
    });
  });
});
