export interface PerformanceBenchmarkLog {
  queryName: string;
  durationMs: number;
  recordsScanned: number;
  passedThreshold: boolean; // Must be < 2000ms
}
