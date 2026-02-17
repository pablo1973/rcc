import { runSuiteAndReadReport } from "../../../bench/perf.report";

describe("perf baseline", () => {
  it("generates report JSON", async () => {
    const rep = await runSuiteAndReadReport();
    expect(rep).toHaveProperty("p50_ms");
    expect(rep).toHaveProperty("p95_ms");
    expect(rep).toHaveProperty("p99_ms");
    expect(rep).toHaveProperty("throughput_ops_s");
    expect(rep).toHaveProperty("mem_heap_mb");
  });
});
