"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_report_1 = require("../../../bench/perf.report");
describe("perf baseline", () => {
    it("generates report JSON", async () => {
        const rep = await (0, perf_report_1.runSuiteAndReadReport)();
        expect(rep).toHaveProperty("p50_ms");
        expect(rep).toHaveProperty("p95_ms");
        expect(rep).toHaveProperty("p99_ms");
        expect(rep).toHaveProperty("throughput_ops_s");
        expect(rep).toHaveProperty("mem_heap_mb");
    });
});
