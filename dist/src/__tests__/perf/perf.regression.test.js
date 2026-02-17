"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_report_1 = require("../../../bench/perf.report");
describe("perf regression", () => {
    it("stays within thresholds", async () => {
        const ok = await (0, perf_report_1.runSuiteAndCompareToBaseline)();
        expect(ok).toBe(true);
    });
});
