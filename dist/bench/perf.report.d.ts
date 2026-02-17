/**
 * RCC Performance Report
 * v1.0.0-DAY9
 *
 * Provides benchmark execution and comparison functions
 */
interface PerfConfig {
    warmupRuns: number;
    measureRuns: number;
    batchSize: number;
    thresholds: {
        p95MaxDegradationPct: number;
        throughputMinDegradationPct: number;
        memMaxIncreasePct: number;
    };
}
interface PerfReport {
    p50_ms: number;
    p95_ms: number;
    p99_ms: number;
    throughput_ops_s: number;
    avg_ms: number;
    min_ms: number;
    max_ms: number;
    mem_heap_mb: number;
    timestamp: string;
}
/**
 * Runs benchmark suite and returns performance report
 */
export declare function runSuiteAndReadReport(): Promise<PerfReport>;
/**
 * Runs benchmark and compares to baseline
 * Returns true if within thresholds, false if regression detected
 */
export declare function runSuiteAndCompareToBaseline(): Promise<boolean>;
export { PerfReport, PerfConfig };
