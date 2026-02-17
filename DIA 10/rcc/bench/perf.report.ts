/**
 * RCC Performance Report
 * v1.0.0-DAY9
 * 
 * Provides benchmark execution and comparison functions
 */

import { runOnce } from "./perf.run";
import * as fs from "fs";
import * as path from "path";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────
const configPath = path.join(__dirname, "perf.config.json");
const config: PerfConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const baselinePath = path.join(__dirname, "report.baseline.json");
const latestPath = path.join(__dirname, "report.latest.json");

// ─────────────────────────────────────────────────────────────
// Test Input
// ─────────────────────────────────────────────────────────────
function generateInput(): string {
  return "Hello World, this is a test message for performance benchmarking. ".repeat(5);
}

// ─────────────────────────────────────────────────────────────
// Benchmark Execution
// ─────────────────────────────────────────────────────────────
function runBenchmark(): number[] {
  const input = generateInput();
  const times: number[] = [];

  // Warmup
  for (let i = 0; i < config.warmupRuns; i++) {
    runOnce(input);
  }

  // Measurement
  for (let i = 0; i < config.measureRuns; i++) {
    const start = performance.now();
    runOnce(input);
    const end = performance.now();
    times.push(end - start);
  }

  return times;
}

function calculatePercentile(times: number[], percentile: number): number {
  const sorted = [...times].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * percentile);
  return sorted[idx];
}

function calculateThroughput(times: number[]): number {
  const totalMs = times.reduce((a, b) => a + b, 0);
  const avgMs = totalMs / times.length;
  return 1000 / avgMs; // ops per second
}

// ─────────────────────────────────────────────────────────────
// Report Generation
// ─────────────────────────────────────────────────────────────
function generateReport(times: number[]): PerfReport {
  const sorted = [...times].sort((a, b) => a - b);
  const memUsage = process.memoryUsage();
  
  return {
    p50_ms: Math.round(calculatePercentile(times, 0.50) * 1000) / 1000,
    p95_ms: Math.round(calculatePercentile(times, 0.95) * 1000) / 1000,
    p99_ms: Math.round(calculatePercentile(times, 0.99) * 1000) / 1000,
    throughput_ops_s: Math.round(calculateThroughput(times)),
    avg_ms: Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 1000) / 1000,
    min_ms: Math.round(sorted[0] * 1000) / 1000,
    max_ms: Math.round(sorted[sorted.length - 1] * 1000) / 1000,
    mem_heap_mb: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
    timestamp: new Date().toISOString()
  };
}

function saveReport(report: PerfReport, filepath: string): void {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
}

function loadReport(filepath: string): PerfReport | null {
  try {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Runs benchmark suite and returns performance report
 */
export async function runSuiteAndReadReport(): Promise<PerfReport> {
  const times = runBenchmark();
  const report = generateReport(times);
  
  // Save as latest
  saveReport(report, latestPath);
  
  // Save as baseline if none exists
  if (!loadReport(baselinePath)) {
    saveReport(report, baselinePath);
  }
  
  return report;
}

/**
 * Runs benchmark and compares to baseline
 * Returns true if within thresholds, false if regression detected
 */
export async function runSuiteAndCompareToBaseline(): Promise<boolean> {
  const times = runBenchmark();
  const current = generateReport(times);
  
  // Save as latest
  saveReport(current, latestPath);
  
  // Load baseline
  let baseline = loadReport(baselinePath);
  
  // If no baseline, save current as baseline and pass
  if (!baseline) {
    saveReport(current, baselinePath);
    return true;
  }
  
  // Compare p95 latency
  const p95DegradationPct = ((current.p95_ms - baseline.p95_ms) / baseline.p95_ms) * 100;
  if (p95DegradationPct > config.thresholds.p95MaxDegradationPct) {
    console.error(`P95 regression: ${p95DegradationPct.toFixed(2)}% (max ${config.thresholds.p95MaxDegradationPct}%)`);
    return false;
  }
  
  // Compare throughput
  const throughputDegradationPct = ((baseline.throughput_ops_s - current.throughput_ops_s) / baseline.throughput_ops_s) * 100;
  if (throughputDegradationPct > config.thresholds.throughputMinDegradationPct) {
    console.error(`Throughput regression: ${throughputDegradationPct.toFixed(2)}% (max ${config.thresholds.throughputMinDegradationPct}%)`);
    return false;
  }
  
  return true;
}

export { PerfReport, PerfConfig };
