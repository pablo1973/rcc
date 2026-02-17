"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../core/router");
describe("Router", () => {
    describe("route - ruteo determinístico", () => {
        test("PAUSE action routes to COOLDOWN", () => {
            const reg = { action: "PAUSE", message: "test" };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe("COOLDOWN");
        });
        test("PASSTHROUGH action routes to TEXT", () => {
            const reg = { action: "PASSTHROUGH", message: "test" };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe("TEXT");
        });
        test("SOFTEN action routes to TEXT", () => {
            const reg = { action: "SOFTEN", message: "test" };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe("TEXT");
        });
        test("SUMMARIZE action routes to TEXT", () => {
            const reg = { action: "SUMMARIZE", message: "test" };
            const result = (0, router_1.route)(reg);
            expect(result.channel).toBe("TEXT");
        });
        test("is deterministic - same input produces same output", () => {
            const reg = { action: "SOFTEN", message: "test" };
            const result1 = (0, router_1.route)(reg);
            const result2 = (0, router_1.route)(reg);
            expect(result1.channel).toBe(result2.channel);
        });
    });
    describe("RouterResult structure", () => {
        test("returns object with channel property", () => {
            const reg = { action: "PASSTHROUGH", message: "test" };
            const result = (0, router_1.route)(reg);
            expect(result).toHaveProperty("channel");
            expect(typeof result.channel).toBe("string");
        });
        test("channel is valid RouterChannel type", () => {
            const reg = { action: "PAUSE", message: "test" };
            const result = (0, router_1.route)(reg);
            expect(["TEXT", "COOLDOWN"]).toContain(result.channel);
        });
    });
});
