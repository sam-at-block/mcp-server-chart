import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dirname } from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import type { Chart } from "@antv/g2-ssr";
import type { Graph } from "@antv/g6-ssr";
import { render } from "../../src/render/index.js";
import { PerformanceTracker, type TestResult } from "./performance-tracker.js";
import {
  ALL_TEST_CASES,
  DIMENSIONS,
  TEST_CASES_BY_CATEGORY,
  type TestCase,
} from "./test-cases.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(dirname(__dirname));
const outputDir = join(projectRoot, "test-charts");

// Global performance tracker
const performanceTracker = new PerformanceTracker();

// Chart generation function
async function generateChart(
  type: string,
  options: Record<string, unknown>,
  fileName: string,
): Promise<{ filePath: string; bufferSize: number }> {
  let vis: Chart | Graph | null = null;

  try {
    // Render the chart
    const renderOptions = { type, ...options };
    vis = await render(renderOptions);

    // Generate buffer
    const buffer = vis.toBuffer();

    // Save to file
    const filePath = join(outputDir, fileName);
    await writeFile(filePath, buffer);

    return { filePath, bufferSize: buffer.length };
  } finally {
    // Clean up resources
    if (vis && typeof vis.destroy === "function") {
      try {
        vis.destroy();
      } catch (cleanupError) {
        console.warn(
          `Warning: Failed to cleanup ${type} chart resources:`,
          cleanupError,
        );
      }
    }
  }
}

// Test execution function
async function runChartTest(
  testCase: TestCase,
  dimension: (typeof DIMENSIONS)[number],
): Promise<void> {
  const testStartTime = Date.now();
  const fileName = `${testCase.name}-${dimension.label}-${dimension.width}x${dimension.height}.png`;

  console.log(
    `🧪 Testing: ${testCase.type} - ${testCase.name} (${dimension.width}×${dimension.height})`,
  );

  try {
    // Generate test configuration
    const config = testCase.config();
    const options = {
      ...config,
      width: dimension.width,
      height: dimension.height,
    };

    // Generate chart
    const { filePath, bufferSize } = await generateChart(
      testCase.type,
      options,
      fileName,
    );
    const testDuration = Date.now() - testStartTime;

    // Record success
    const result: TestResult = {
      testCase: testCase.name,
      type: testCase.type,
      category: testCase.category,
      dimension: `${dimension.width}×${dimension.height}`,
      status: "PASS",
      duration: testDuration,
      fileName,
      filePath,
      bufferSize,
    };

    performanceTracker.addResult(result);
    console.log(
      `   ✅ PASS (${testDuration}ms) - ${fileName} (${Math.round(bufferSize / 1024)}KB)`,
    );
  } catch (error) {
    const testDuration = Date.now() - testStartTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Record failure
    const result: TestResult = {
      testCase: testCase.name,
      type: testCase.type,
      category: testCase.category,
      dimension: `${dimension.width}×${dimension.height}`,
      status: "FAIL",
      duration: testDuration,
      fileName,
      error: errorMessage,
    };

    performanceTracker.addResult(result);
    console.log(`   ❌ FAIL (${testDuration}ms) - ${errorMessage}`);

    // Re-throw to fail the test
    throw new Error(`Chart generation failed: ${errorMessage}`);
  }

  console.log(""); // Empty line for readability
}

// Setup function
async function setupTestEnvironment(): Promise<void> {
  try {
    await mkdir(outputDir, { recursive: true });
    console.log(`📁 Output directory: ${outputDir}`);
  } catch (error) {
    throw new Error(`Failed to create output directory: ${error}`);
  }
}

// Test suite organization
describe("Chart Generation Tests", () => {
  // Setup
  test("setup test environment", async () => {
    console.log("🚀 Starting Chart Generation Test Suite");
    console.log(
      `📊 Running ${ALL_TEST_CASES.length} test cases across 15 chart types\n`,
    );
    await setupTestEnvironment();
    console.log("");
  });

  // Basic tests
  describe("Basic Chart Tests", () => {
    const basicTests = TEST_CASES_BY_CATEGORY.basic;
    let dimensionIndex = 0;

    for (const testCase of basicTests) {
      test(`${testCase.type} - ${testCase.name}`, async () => {
        const dimension = DIMENSIONS[dimensionIndex % DIMENSIONS.length];
        dimensionIndex++;
        await runChartTest(testCase, dimension);
      });
    }
  });

  // Property tests
  describe("Property Combination Tests", () => {
    const propertyTests = TEST_CASES_BY_CATEGORY.property;
    let dimensionIndex = 0;

    for (const testCase of propertyTests) {
      test(`${testCase.type} - ${testCase.name}`, async () => {
        const dimension = DIMENSIONS[dimensionIndex % DIMENSIONS.length];
        dimensionIndex++;
        await runChartTest(testCase, dimension);
      });
    }
  });

  // Stress tests
  describe("Stress Tests", () => {
    const stressTests = TEST_CASES_BY_CATEGORY.stress;
    let dimensionIndex = 0;

    for (const testCase of stressTests) {
      test(`${testCase.type} - ${testCase.name}`, async () => {
        const dimension = DIMENSIONS[dimensionIndex % DIMENSIONS.length];
        dimensionIndex++;
        await runChartTest(testCase, dimension);
      });
    }
  });

  // Summary and cleanup
  test("print performance summary", () => {
    performanceTracker.printSummary();

    // Additional detailed analysis
    console.log("🔍 DETAILED PERFORMANCE ANALYSIS");
    console.log("=".repeat(50));

    const slowestTests = performanceTracker.getSlowestTests(3);
    console.log("Slowest Tests:");
    for (const test of slowestTests) {
      console.log(`  ${test.testCase} (${test.type}): ${test.duration}ms`);
    }

    const largestFiles = performanceTracker.getLargestFiles(3);
    console.log("\nLargest Files:");
    for (const test of largestFiles) {
      console.log(
        `  ${test.testCase} (${test.type}): ${Math.round((test.bufferSize || 0) / 1024)}KB`,
      );
    }

    const categoryStats = performanceTracker.getPerformanceByCategory();
    console.log("\nPerformance by Category:");
    for (const [category, stats] of Object.entries(categoryStats)) {
      console.log(
        `  ${category}: ${stats.avgDuration}ms avg, ${Math.round(stats.avgFileSize / 1024)}KB avg`,
      );
    }
    console.log("");
  });
});
