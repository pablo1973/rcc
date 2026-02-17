import { runSuiteAndCompareToBaseline } from "../../../bench/perf.report";

describe("perf regression", () => {
  it("stays within thresholds", async () => {
    const ok = await runSuiteAndCompareToBaseline();
    expect(ok).toBe(true);
  });
});
