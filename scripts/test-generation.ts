#!/usr/bin/env tsx

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Chart } from "@antv/g2-ssr";
import type { Graph } from "@antv/g6-ssr";
import { render } from "../src/render/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);
const outputDir = join(projectRoot, "test-charts");

// Test configuration
const DIMENSIONS = [
  { width: 600, height: 400, label: "small" },
  { width: 800, height: 600, label: "medium" },
  { width: 1200, height: 800, label: "large" },
] as const;

const THEMES = ["default", "academy"] as const;

// Random data generators namespace
const DataGenerator = {
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomFloat(min: number, max: number, decimals = 2): number {
    return Number.parseFloat(
      (Math.random() * (max - min) + min).toFixed(decimals),
    );
  },

  randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  },

  randomString(length = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  },

  // Time series data for line/area charts
  generateTimeSeries(points = 10, groups = 1) {
    const months = [
      "2023-01",
      "2023-02",
      "2023-03",
      "2023-04",
      "2023-05",
      "2023-06",
      "2023-07",
      "2023-08",
      "2023-09",
      "2023-10",
      "2023-11",
      "2023-12",
    ];
    const data = [];

    for (let i = 0; i < Math.min(points, months.length); i++) {
      if (groups === 1) {
        data.push({
          time: months[i],
          value: this.randomInt(50, 500),
        });
      } else {
        const groupNames = ["Series A", "Series B", "Series C"];
        for (let g = 0; g < Math.min(groups, groupNames.length); g++) {
          data.push({
            time: months[i],
            value: this.randomInt(50, 500),
            group: groupNames[g],
          });
        }
      }
    }
    return data;
  },

  // Categorical data for column/bar charts
  generateCategorical(categories = 5, groups = 1) {
    const categoryNames = [
      "Product A",
      "Product B",
      "Product C",
      "Product D",
      "Product E",
      "Product F",
      "Product G",
      "Product H",
      "Product I",
      "Product J",
    ];
    const data = [];

    for (let i = 0; i < Math.min(categories, categoryNames.length); i++) {
      if (groups === 1) {
        data.push({
          category: categoryNames[i],
          value: this.randomInt(100, 1000),
        });
      } else {
        const groupNames = ["Q1", "Q2", "Q3", "Q4"];
        for (let g = 0; g < Math.min(groups, groupNames.length); g++) {
          data.push({
            category: categoryNames[i],
            value: this.randomInt(100, 1000),
            group: groupNames[g],
          });
        }
      }
    }
    return data;
  },

  // Pie chart data
  generatePieData(slices = 6) {
    const categories = [
      "Segment A",
      "Segment B",
      "Segment C",
      "Segment D",
      "Segment E",
      "Segment F",
    ];
    return categories.slice(0, slices).map((category) => ({
      category,
      value: this.randomInt(10, 100),
    }));
  },

  // Scatter plot data
  generateScatterData(points = 20) {
    return Array.from({ length: points }, () => ({
      x: this.randomInt(1, 100),
      y: this.randomInt(1, 100),
      category: this.randomChoice(["Type A", "Type B", "Type C"]),
    }));
  },

  // Radar chart data
  generateRadarData(dimensions = 5, series = 2) {
    const metrics = [
      "Speed",
      "Quality",
      "Cost",
      "Reliability",
      "Innovation",
      "Support",
    ];
    const seriesNames = ["Product X", "Product Y", "Product Z"];
    const data = [];

    for (let s = 0; s < Math.min(series, seriesNames.length); s++) {
      for (let d = 0; d < Math.min(dimensions, metrics.length); d++) {
        data.push({
          group: seriesNames[s],
          name: metrics[d],
          value: this.randomInt(20, 100),
        });
      }
    }
    return data;
  },

  // Histogram data (raw values)
  generateHistogramData(count = 100): number[] {
    return Array.from({ length: count }, () => this.randomInt(0, 100));
  },

  // Hierarchical data for treemap
  generateTreemapData() {
    return {
      name: "Root",
      children: [
        {
          name: "Category A",
          children: [
            { name: "Item A1", value: this.randomInt(10, 50) },
            { name: "Item A2", value: this.randomInt(10, 50) },
            { name: "Item A3", value: this.randomInt(10, 50) },
          ],
        },
        {
          name: "Category B",
          children: [
            { name: "Item B1", value: this.randomInt(10, 50) },
            { name: "Item B2", value: this.randomInt(10, 50) },
          ],
        },
        {
          name: "Category C",
          children: [
            { name: "Item C1", value: this.randomInt(10, 50) },
            { name: "Item C2", value: this.randomInt(10, 50) },
            { name: "Item C3", value: this.randomInt(10, 50) },
            { name: "Item C4", value: this.randomInt(10, 50) },
          ],
        },
      ],
    };
  },

  // Word cloud data
  generateWordCloudData(words = 30) {
    const wordList = [
      "technology",
      "innovation",
      "data",
      "analysis",
      "visualization",
      "chart",
      "graph",
      "business",
      "strategy",
      "growth",
      "development",
      "solution",
      "platform",
      "system",
      "performance",
      "optimization",
      "efficiency",
      "quality",
      "service",
      "customer",
      "market",
      "product",
      "design",
      "user",
      "experience",
      "interface",
      "digital",
      "transformation",
      "automation",
      "intelligence",
      "machine",
      "learning",
      "artificial",
    ];

    return wordList.slice(0, words).map((word) => ({
      text: word,
      value: this.randomInt(10, 100),
    }));
  },

  // Network graph data
  generateNetworkData(nodes = 8, edges = 12) {
    const nodeNames = [
      "Node A",
      "Node B",
      "Node C",
      "Node D",
      "Node E",
      "Node F",
      "Node G",
      "Node H",
    ];
    const nodeList = nodeNames.slice(0, nodes).map((name) => ({ name }));

    const edgeList = [];
    for (let i = 0; i < edges && edgeList.length < edges; i++) {
      const source = this.randomChoice(nodeNames.slice(0, nodes));
      const target = this.randomChoice(nodeNames.slice(0, nodes));

      if (
        source !== target &&
        !edgeList.some((e) => e.source === source && e.target === target)
      ) {
        edgeList.push({
          source,
          target,
          name: `connects_${edgeList.length + 1}`,
        });
      }
    }

    return { nodes: nodeList, edges: edgeList };
  },

  // Flow diagram data (directed graph)
  generateFlowData(nodes = 6, edges = 8) {
    const nodeNames = [
      "Start",
      "Process A",
      "Decision",
      "Process B",
      "Process C",
      "End",
    ];
    const nodeList = nodeNames.slice(0, nodes).map((name) => ({ name }));

    const edgeList = [];
    for (let i = 0; i < edges && edgeList.length < edges; i++) {
      const source = this.randomChoice(nodeNames.slice(0, nodes));
      const target = this.randomChoice(nodeNames.slice(0, nodes));

      if (
        source !== target &&
        !edgeList.some((e) => e.source === source && e.target === target)
      ) {
        edgeList.push({
          source,
          target,
          name: `flow_${edgeList.length + 1}`,
        });
      }
    }

    return { nodes: nodeList, edges: edgeList };
  },

  // Mind map data
  generateMindMapData() {
    return {
      name: "Central Topic",
      children: [
        {
          name: "Branch 1",
          children: [
            {
              name: "Sub-topic 1.1",
              children: [{ name: "Detail 1.1.1" }, { name: "Detail 1.1.2" }],
            },
            { name: "Sub-topic 1.2", children: [{ name: "Detail 1.2.1" }] },
            { name: "Sub-topic 1.3" },
          ],
        },
        {
          name: "Branch 2",
          children: [
            {
              name: "Sub-topic 2.1",
              children: [{ name: "Detail 2.1.1" }, { name: "Detail 2.1.2" }],
            },
            { name: "Sub-topic 2.2" },
          ],
        },
        {
          name: "Branch 3",
          children: [
            { name: "Sub-topic 3.1" },
            { name: "Sub-topic 3.2", children: [{ name: "Detail 3.2.1" }] },
            { name: "Sub-topic 3.3" },
          ],
        },
      ],
    };
  },

  // Fishbone diagram data
  generateFishboneData() {
    return {
      name: "Problem Statement",
      children: [
        {
          name: "People",
          children: [
            { name: "Training" },
            { name: "Skills" },
            { name: "Motivation" },
          ],
        },
        {
          name: "Process",
          children: [
            { name: "Workflow" },
            { name: "Standards" },
            { name: "Documentation" },
          ],
        },
        {
          name: "Technology",
          children: [
            { name: "Tools" },
            { name: "Systems" },
            { name: "Integration" },
          ],
        },
        {
          name: "Environment",
          children: [
            { name: "Physical" },
            { name: "Cultural" },
            { name: "Resources" },
          ],
        },
      ],
    };
  },

  // Dual-axes chart data
  generateDualAxesData(categories = 5) {
    const categoryNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const cats = categoryNames.slice(0, categories);

    return {
      categories: cats,
      series: [
        {
          type: "column",
          data: cats.map(() => this.randomInt(100, 500)),
          axisYTitle: "Sales",
        },
        {
          type: "line",
          data: cats.map(() => this.randomFloat(0.01, 0.1, 3)),
          axisYTitle: "Profit Rate",
        },
      ],
    };
  },
};

// Test case definitions
interface TestCase {
  type: string;
  name: string;
  config: () => Record<string, unknown>;
}

const TEST_CASES: TestCase[] = [
  // Line Chart Tests
  {
    type: "line",
    name: "line-basic-default",
    config: () => ({
      data: DataGenerator.generateTimeSeries(10, 1),
      theme: "default",
      title: "Basic Line Chart",
      axisXTitle: "Time",
      axisYTitle: "Value",
    }),
  },
  {
    type: "line",
    name: "line-grouped-academy",
    config: () => ({
      data: DataGenerator.generateTimeSeries(10, 3),
      theme: "academy",
      title: "Grouped Line Chart",
      axisXTitle: "Time",
      axisYTitle: "Value",
    }),
  },
  {
    type: "line",
    name: "line-stress-default",
    config: () => ({
      data: DataGenerator.generateTimeSeries(12, 1), // Limited by months array
      theme: "default",
      title: "Line Chart Stress Test",
    }),
  },

  // Column Chart Tests
  {
    type: "column",
    name: "column-basic-default",
    config: () => ({
      data: DataGenerator.generateCategorical(5, 1),
      theme: "default",
      title: "Basic Column Chart",
      axisXTitle: "Category",
      axisYTitle: "Value",
    }),
  },
  {
    type: "column",
    name: "column-grouped-academy",
    config: () => ({
      data: DataGenerator.generateCategorical(5, 3),
      group: true,
      theme: "academy",
      title: "Grouped Column Chart",
    }),
  },
  {
    type: "column",
    name: "column-stacked-default",
    config: () => ({
      data: DataGenerator.generateCategorical(5, 3),
      stack: true,
      theme: "default",
      title: "Stacked Column Chart",
    }),
  },
  {
    type: "column",
    name: "column-stress-default",
    config: () => ({
      data: DataGenerator.generateCategorical(10, 1), // Limited by category names
      theme: "default",
      title: "Column Chart Stress Test",
    }),
  },

  // Bar Chart Tests
  {
    type: "bar",
    name: "bar-basic-default",
    config: () => ({
      data: DataGenerator.generateCategorical(5, 1),
      theme: "default",
      title: "Basic Bar Chart",
      axisXTitle: "Value",
      axisYTitle: "Category",
    }),
  },
  {
    type: "bar",
    name: "bar-grouped-academy",
    config: () => ({
      data: DataGenerator.generateCategorical(5, 2),
      group: true,
      theme: "academy",
      title: "Grouped Bar Chart",
    }),
  },
  {
    type: "bar",
    name: "bar-stress-default",
    config: () => ({
      data: DataGenerator.generateCategorical(10, 1),
      theme: "default",
      title: "Bar Chart Stress Test",
    }),
  },

  // Dual-Axes Chart Tests
  {
    type: "dual-axes",
    name: "dual-axes-basic-default",
    config: () => ({
      ...DataGenerator.generateDualAxesData(5),
      theme: "default",
      title: "Basic Dual-Axes Chart",
      axisXTitle: "Month",
    }),
  },
  {
    type: "dual-axes",
    name: "dual-axes-complex-academy",
    config: () => ({
      categories: ["Q1", "Q2", "Q3", "Q4"],
      series: [
        { type: "column", data: [120, 150, 180, 200], axisYTitle: "Revenue" },
        {
          type: "line",
          data: [0.02, 0.035, 0.045, 0.06],
          axisYTitle: "Growth Rate",
        },
        { type: "column", data: [80, 90, 110, 130], axisYTitle: "Costs" },
      ],
      theme: "academy",
      title: "Complex Dual-Axes Chart",
    }),
  },
  {
    type: "dual-axes",
    name: "dual-axes-stress-default",
    config: () => ({
      ...DataGenerator.generateDualAxesData(6),
      theme: "default",
      title: "Dual-Axes Stress Test",
    }),
  },

  // Area Chart Tests
  {
    type: "area",
    name: "area-basic-default",
    config: () => ({
      data: DataGenerator.generateTimeSeries(10, 1),
      theme: "default",
      title: "Basic Area Chart",
      axisXTitle: "Time",
      axisYTitle: "Value",
    }),
  },
  {
    type: "area",
    name: "area-stacked-academy",
    config: () => ({
      data: DataGenerator.generateTimeSeries(10, 3),
      stack: true,
      theme: "academy",
      title: "Stacked Area Chart",
    }),
  },

  // Pie Chart Tests
  {
    type: "pie",
    name: "pie-basic-default",
    config: () => ({
      data: DataGenerator.generatePieData(6),
      theme: "default",
      title: "Basic Pie Chart",
    }),
  },
  {
    type: "pie",
    name: "pie-donut-academy",
    config: () => ({
      data: DataGenerator.generatePieData(6),
      innerRadius: 0.4,
      theme: "academy",
      title: "Donut Chart",
    }),
  },

  // Scatter Chart Tests
  {
    type: "scatter",
    name: "scatter-basic-default",
    config: () => ({
      data: DataGenerator.generateScatterData(20),
      theme: "default",
      title: "Basic Scatter Chart",
      axisXTitle: "X Value",
      axisYTitle: "Y Value",
    }),
  },

  // Radar Chart Tests
  {
    type: "radar",
    name: "radar-basic-academy",
    config: () => ({
      data: DataGenerator.generateRadarData(5, 2),
      theme: "academy",
      title: "Basic Radar Chart",
    }),
  },

  // Histogram Chart Tests
  {
    type: "histogram",
    name: "histogram-basic-default",
    config: () => ({
      data: DataGenerator.generateHistogramData(100),
      theme: "default",
      title: "Basic Histogram",
      axisXTitle: "Value",
      axisYTitle: "Frequency",
    }),
  },
  {
    type: "histogram",
    name: "histogram-custom-bins-academy",
    config: () => ({
      data: DataGenerator.generateHistogramData(100),
      binNumber: 20,
      theme: "academy",
      title: "Custom Bins Histogram",
    }),
  },

  // Treemap Chart Tests
  {
    type: "treemap",
    name: "treemap-basic-default",
    config: () => ({
      data: DataGenerator.generateTreemapData(),
      theme: "default",
      title: "Basic Treemap Chart",
    }),
  },

  // Word Cloud Chart Tests
  {
    type: "word-cloud",
    name: "word-cloud-basic-academy",
    config: () => ({
      data: DataGenerator.generateWordCloudData(30),
      theme: "academy",
      title: "Basic Word Cloud",
    }),
  },

  // Network Graph Tests
  {
    type: "network-graph",
    name: "network-graph-basic-default",
    config: () => ({
      data: DataGenerator.generateNetworkData(8, 12),
      theme: "default",
      title: "Basic Network Graph",
    }),
  },

  // Flow Diagram Tests
  {
    type: "flow-diagram",
    name: "flow-diagram-basic-academy",
    config: () => ({
      data: DataGenerator.generateFlowData(6, 8),
      theme: "academy",
      title: "Basic Flow Diagram",
    }),
  },

  // Mind Map Tests
  {
    type: "mind-map",
    name: "mind-map-basic-default",
    config: () => ({
      data: DataGenerator.generateMindMapData(),
      theme: "default",
      title: "Basic Mind Map",
    }),
  },

  // Fishbone Diagram Tests
  {
    type: "fishbone-diagram",
    name: "fishbone-diagram-basic-academy",
    config: () => ({
      data: DataGenerator.generateFishboneData(),
      theme: "academy",
      title: "Basic Fishbone Diagram",
    }),
  },
];

// Test result interface
interface TestResult {
  testCase: string;
  type: string;
  dimension: string;
  status: "PASS" | "FAIL";
  duration: number;
  fileName: string;
  filePath?: string;
  error?: string;
  bufferSize?: number;
}

// Direct chart generation function
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

// Test execution
class TestRunner {
  private results: TestResult[] = [];
  private startTime = Date.now();

  async runAllTests(): Promise<void> {
    console.log("🚀 Starting Chart Generation Test Suite");
    console.log(
      `📊 Running ${TEST_CASES.length} test cases across 15 chart types\n`,
    );

    // Ensure output directory exists
    try {
      await mkdir(outputDir, { recursive: true });
      console.log(`📁 Output directory: ${outputDir}\n`);
    } catch (error) {
      console.error("❌ Failed to create output directory:", error);
      return;
    }

    // Run tests with dimension rotation
    let dimensionIndex = 0;
    for (const testCase of TEST_CASES) {
      const dimension = DIMENSIONS[dimensionIndex % DIMENSIONS.length];
      dimensionIndex++;

      await this.runSingleTest(testCase, dimension);
    }

    this.printSummary();
  }

  private async runSingleTest(
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
      this.results.push({
        testCase: testCase.name,
        type: testCase.type,
        dimension: `${dimension.width}×${dimension.height}`,
        status: "PASS",
        duration: testDuration,
        fileName,
        filePath,
        bufferSize,
      });

      console.log(
        `   ✅ PASS (${testDuration}ms) - ${fileName} (${Math.round(bufferSize / 1024)}KB)`,
      );
    } catch (error) {
      const testDuration = Date.now() - testStartTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Record failure
      this.results.push({
        testCase: testCase.name,
        type: testCase.type,
        dimension: `${dimension.width}×${dimension.height}`,
        status: "FAIL",
        duration: testDuration,
        fileName,
        error: errorMessage,
      });

      console.log(`   ❌ FAIL (${testDuration}ms) - ${errorMessage}`);
    }

    console.log(""); // Empty line for readability
  }

  private printSummary(): void {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;

    console.log("📋 TEST SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(
      `⏱️  Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`,
    );
    console.log("");

    // Performance metrics summary
    if (passed > 0) {
      const passedResults = this.results.filter((r) => r.status === "PASS");
      const avgDuration = Math.round(
        passedResults.reduce((sum, r) => sum + r.duration, 0) /
          passedResults.length,
      );
      const minDuration = Math.min(...passedResults.map((r) => r.duration));
      const maxDuration = Math.max(...passedResults.map((r) => r.duration));

      // File size metrics
      const fileSizes = passedResults
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

    // Chart type breakdown
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

    // Failed tests details
    if (failed > 0) {
      console.log("❌ FAILED TESTS");
      console.log("=".repeat(50));
      for (const result of this.results.filter((r) => r.status === "FAIL")) {
        console.log(`${result.testCase} (${result.type}): ${result.error}`);
      }
      console.log("");
    }

    console.log(
      `🎯 Test suite completed! Check generated files in: ${outputDir}`,
    );
  }
}

// Main execution
async function main(): Promise<void> {
  const runner = new TestRunner();
  await runner.runAllTests();
}

main().catch(console.error);
