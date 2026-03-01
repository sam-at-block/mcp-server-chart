// Performance tracking and metrics collection

export interface TestResult {
  testCase: string;
  type: string;
  category: string;
  dimension: string;
  status: "PASS" | "FAIL";
  duration: number;
  fileName: string;
  filePath?: string;
  error?: string;
  bufferSize?: number;
}

export class PerformanceTracker {
  private results: TestResult[] = [];
  private startTime = Date.now();

  addResult(result: TestResult): void {
    this.results.push(result);
  }

  getResults(): TestResult[] {
    return [...this.results];
  }

  getTotalDuration(): number {
    return Date.now() - this.startTime;
  }

  getPassedResults(): TestResult[] {
    return this.results.filter((r) => r.status === "PASS");
  }

  getFailedResults(): TestResult[] {
    return this.results.filter((r) => r.status === "FAIL");
  }

  getResultsByCategory(): Record<string, TestResult[]> {
    const categories: Record<string, TestResult[]> = {};
    for (const result of this.results) {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    }
    return categories;
  }

  getResultsByType(): Record<string, TestResult[]> {
    const types: Record<string, TestResult[]> = {};
    for (const result of this.results) {
      if (!types[result.type]) {
        types[result.type] = [];
      }
      types[result.type].push(result);
    }
    return types;
  }

  printSummary(): void {
    const totalDuration = this.getTotalDuration();
    const passed = this.getPassedResults();
    const failed = this.getFailedResults();

    console.log("📋 TEST SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(
      `⏱️  Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`,
    );
    console.log("");

    this.printPerformanceMetrics();
    this.printCategoryBreakdown();
    this.printChartTypeBreakdown();
    this.printFailedTests();

    console.log(
      "🎯 Test suite completed! Check generated files in test-charts/",
    );
  }

  private printPerformanceMetrics(): void {
    const passed = this.getPassedResults();
    if (passed.length === 0) return;

    const durations = passed.map((r) => r.duration);
    const avgDuration = Math.round(
      durations.reduce((sum, d) => sum + d, 0) / durations.length,
    );
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    // File size metrics
    const fileSizes = passed
      .map((r) => r.bufferSize || 0)
      .filter((size) => size > 0);
    const avgFileSize =
      fileSizes.length > 0
        ? Math.round(
            fileSizes.reduce((sum, size) => sum + size, 0) / fileSizes.length,
          )
        : 0;
    const minFileSize = fileSizes.length > 0 ? Math.min(...fileSizes) : 0;
    const maxFileSize = fileSizes.length > 0 ? Math.max(...fileSizes) : 0;

    console.log("⚡ PERFORMANCE METRICS");
    console.log("=".repeat(50));
    console.log(`Average Generation Time: ${avgDuration}ms`);
    console.log(`Fastest Generation: ${minDuration}ms`);
    console.log(`Slowest Generation: ${maxDuration}ms`);
    console.log(`Average File Size: ${Math.round(avgFileSize / 1024)}KB`);
    console.log(`Smallest File: ${Math.round(minFileSize / 1024)}KB`);
    console.log(`Largest File: ${Math.round(maxFileSize / 1024)}KB`);
    console.log("");
  }

  private printCategoryBreakdown(): void {
    const categories = this.getResultsByCategory();

    console.log("📂 TEST CATEGORY BREAKDOWN");
    console.log("=".repeat(50));

    for (const [category, results] of Object.entries(categories)) {
      const passed = results.filter((r) => r.status === "PASS").length;
      const total = results.length;
      const passRate = ((passed / total) * 100).toFixed(1);
      const avgDuration =
        results.length > 0
          ? Math.round(
              results.reduce((sum, r) => sum + r.duration, 0) / results.length,
            )
          : 0;

      console.log(
        `${category.padEnd(15)} ${passed}/${total} (${passRate}%) - avg ${avgDuration}ms`,
      );
    }
    console.log("");
  }

  private printChartTypeBreakdown(): void {
    const typeBreakdown: Record<string, { pass: number; fail: number }> = {};

    for (const result of this.results) {
      if (!typeBreakdown[result.type]) {
        typeBreakdown[result.type] = { pass: 0, fail: 0 };
      }
      typeBreakdown[result.type][
        result.status.toLowerCase() as "pass" | "fail"
      ]++;
    }

    console.log("📊 CHART TYPE BREAKDOWN");
    console.log("=".repeat(50));

    for (const [type, stats] of Object.entries(typeBreakdown)) {
      const total = stats.pass + stats.fail;
      const passRate = ((stats.pass / total) * 100).toFixed(1);
      console.log(`${type.padEnd(20)} ${stats.pass}/${total} (${passRate}%)`);
    }
    console.log("");
  }

  private printFailedTests(): void {
    const failed = this.getFailedResults();
    if (failed.length === 0) return;

    console.log("❌ FAILED TESTS");
    console.log("=".repeat(50));

    for (const result of failed) {
      console.log(`${result.testCase} (${result.type}): ${result.error}`);
    }
    console.log("");
  }

  // Performance analysis methods
  getSlowestTests(count = 5): TestResult[] {
    return this.getPassedResults()
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count);
  }

  getFastestTests(count = 5): TestResult[] {
    return this.getPassedResults()
      .sort((a, b) => a.duration - b.duration)
      .slice(0, count);
  }

  getLargestFiles(count = 5): TestResult[] {
    return this.getPassedResults()
      .filter((r) => r.bufferSize && r.bufferSize > 0)
      .sort((a, b) => (b.bufferSize || 0) - (a.bufferSize || 0))
      .slice(0, count);
  }

  getPerformanceByCategory(): Record<
    string,
    { avgDuration: number; avgFileSize: number }
  > {
    const categories = this.getResultsByCategory();
    const stats: Record<string, { avgDuration: number; avgFileSize: number }> =
      {};

    for (const [category, results] of Object.entries(categories)) {
      const passedResults = results.filter((r) => r.status === "PASS");

      const avgDuration =
        passedResults.length > 0
          ? Math.round(
              passedResults.reduce((sum, r) => sum + r.duration, 0) /
                passedResults.length,
            )
          : 0;

      const fileSizes = passedResults
        .map((r) => r.bufferSize || 0)
        .filter((size) => size > 0);
      const avgFileSize =
        fileSizes.length > 0
          ? Math.round(
              fileSizes.reduce((sum, size) => sum + size, 0) / fileSizes.length,
            )
          : 0;

      stats[category] = { avgDuration, avgFileSize };
    }

    return stats;
  }
}
