import { DataGenerator } from "./data-generators.js";

// Test case interface
export interface TestCase {
  type: string;
  name: string;
  config: () => Record<string, unknown>;
  category: "basic" | "variant" | "stress" | "property";
}

// Test configuration
export const DIMENSIONS = [
  { width: 600, height: 400, label: "small" },
  { width: 800, height: 600, label: "medium" },
  { width: 1200, height: 800, label: "large" },
] as const;

export const THEMES = ["default", "academy"] as const;

// Basic test cases (existing functionality)
const BASIC_TEST_CASES: TestCase[] = [
  // Line Chart Tests
  {
    type: "line",
    name: "line-basic-default",
    category: "basic",
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
    category: "variant",
    config: () => ({
      data: DataGenerator.generateTimeSeries(10, 3),
      theme: "academy",
      title: "Grouped Line Chart",
      axisXTitle: "Time",
      axisYTitle: "Value",
    }),
  },

  // Column Chart Tests
  {
    type: "column",
    name: "column-basic-default",
    category: "basic",
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
    category: "variant",
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
    category: "variant",
    config: () => ({
      data: DataGenerator.generateCategorical(5, 3),
      stack: true,
      theme: "default",
      title: "Stacked Column Chart",
    }),
  },

  // Bar Chart Tests
  {
    type: "bar",
    name: "bar-basic-default",
    category: "basic",
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
    category: "variant",
    config: () => ({
      data: DataGenerator.generateCategorical(5, 2),
      group: true,
      theme: "academy",
      title: "Grouped Bar Chart",
    }),
  },

  // Dual-Axes Chart Tests
  {
    type: "dual-axes",
    name: "dual-axes-basic-default",
    category: "basic",
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
    category: "variant",
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

  // Area Chart Tests
  {
    type: "area",
    name: "area-basic-default",
    category: "basic",
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
    category: "variant",
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
    category: "basic",
    config: () => ({
      data: DataGenerator.generatePieData(6),
      theme: "default",
      title: "Basic Pie Chart",
    }),
  },
  {
    type: "pie",
    name: "pie-donut-academy",
    category: "variant",
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
    category: "basic",
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
    category: "basic",
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
    category: "basic",
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
    category: "variant",
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
    category: "basic",
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
    category: "basic",
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
    category: "basic",
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
    category: "basic",
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
    category: "basic",
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
    category: "basic",
    config: () => ({
      data: DataGenerator.generateFishboneData(),
      theme: "academy",
      title: "Basic Fishbone Diagram",
    }),
  },
];

// Stress test cases (large datasets)
const STRESS_TEST_CASES: TestCase[] = [
  {
    type: "line",
    name: "line-stress-1000-points",
    category: "stress",
    config: () => ({
      data: DataGenerator.generateLargeTimeSeries(1000, 1),
      theme: "default",
      title: "Line Chart - 1000 Data Points",
    }),
  },
  {
    type: "line",
    name: "line-stress-multi-series",
    category: "stress",
    config: () => ({
      data: DataGenerator.generateLargeTimeSeries(500, 3),
      theme: "academy",
      title: "Line Chart - 500 Points × 3 Series",
    }),
  },
  {
    type: "column",
    name: "column-stress-100-categories",
    category: "stress",
    config: () => ({
      data: DataGenerator.generateLargeCategorical(100, 1),
      theme: "default",
      title: "Column Chart - 100 Categories",
    }),
  },
  {
    type: "bar",
    name: "bar-stress-100-categories",
    category: "stress",
    config: () => ({
      data: DataGenerator.generateLargeCategorical(100, 1),
      theme: "academy",
      title: "Bar Chart - 100 Categories",
    }),
  },
  {
    type: "histogram",
    name: "histogram-stress-10k-points",
    category: "stress",
    config: () => ({
      data: DataGenerator.generateLargeHistogramData(10000),
      theme: "default",
      title: "Histogram - 10,000 Data Points",
    }),
  },
  {
    type: "network-graph",
    name: "network-stress-50-nodes",
    category: "stress",
    config: () => ({
      data: DataGenerator.generateLargeNetworkData(50, 200),
      theme: "academy",
      title: "Network Graph - 50 Nodes, 200 Edges",
    }),
  },
  {
    type: "word-cloud",
    name: "word-cloud-stress-500-words",
    category: "stress",
    config: () => ({
      data: DataGenerator.generateLargeWordCloudData(500),
      theme: "default",
      title: "Word Cloud - 500 Words",
    }),
  },
];

// Property-based test cases (systematic property combinations)
const PROPERTY_TEST_CASES: TestCase[] = [
  // Line chart property combinations
  {
    type: "line",
    name: "line-props-all-titles",
    category: "property",
    config: () => ({
      data: DataGenerator.generateTimeSeries(8, 1),
      theme: "default",
      title: "Line Chart with All Titles",
      axisXTitle: "Custom X Axis",
      axisYTitle: "Custom Y Axis",
    }),
  },
  {
    type: "line",
    name: "line-props-no-titles",
    category: "property",
    config: () => ({
      data: DataGenerator.generateTimeSeries(8, 1),
      theme: "academy",
      // No titles to test default behavior
    }),
  },

  // Column chart property combinations
  {
    type: "column",
    name: "column-props-group-stack-conflict",
    category: "property",
    config: () => ({
      data: DataGenerator.generateCategorical(4, 3),
      group: true,
      stack: true, // Test conflicting properties
      theme: "default",
      title: "Column Chart - Group + Stack",
    }),
  },

  // Bar chart property combinations
  {
    type: "bar",
    name: "bar-props-grouped-all-themes",
    category: "property",
    config: () => ({
      data: DataGenerator.generateCategorical(3, 4),
      group: true,
      theme: DataGenerator.randomChoice(["default", "academy"]),
      title: "Bar Chart - Random Theme",
    }),
  },

  // Pie chart property combinations
  {
    type: "pie",
    name: "pie-props-inner-radius-variations",
    category: "property",
    config: () => ({
      data: DataGenerator.generatePieData(8),
      innerRadius: DataGenerator.randomChoice([0, 0.2, 0.4, 0.6, 0.8]),
      theme: "default",
      title: "Pie Chart - Variable Inner Radius",
    }),
  },
  {
    type: "pie",
    name: "pie-props-minimal-slices",
    category: "property",
    config: () => ({
      data: DataGenerator.generatePieData(2), // Minimal data
      theme: "academy",
      title: "Pie Chart - Only 2 Slices",
    }),
  },
  {
    type: "pie",
    name: "pie-props-many-slices",
    category: "property",
    config: () => ({
      data: DataGenerator.generatePieData(12), // Many slices
      theme: "default",
      title: "Pie Chart - 12 Slices",
    }),
  },

  // Histogram property combinations
  {
    type: "histogram",
    name: "histogram-props-bin-variations",
    category: "property",
    config: () => ({
      data: DataGenerator.generateHistogramData(200),
      binNumber: DataGenerator.randomChoice([5, 10, 20, 50, 100]),
      theme: "academy",
      title: "Histogram - Variable Bins",
    }),
  },

  // Area chart property combinations
  {
    type: "area",
    name: "area-props-stacked-themes",
    category: "property",
    config: () => ({
      data: DataGenerator.generateTimeSeries(12, 4),
      stack: true,
      theme: DataGenerator.randomChoice(["default", "academy"]),
      title: "Area Chart - Stacked Random Theme",
    }),
  },

  // Dual-axes property combinations
  {
    type: "dual-axes",
    name: "dual-axes-props-mixed-series",
    category: "property",
    config: () => ({
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      series: [
        {
          type: "column",
          data: Array.from({ length: 8 }, () =>
            DataGenerator.randomInt(100, 500),
          ),
          axisYTitle: "Sales",
        },
        {
          type: "line",
          data: Array.from({ length: 8 }, () =>
            DataGenerator.randomFloat(0.01, 0.1, 3),
          ),
          axisYTitle: "Rate",
        },
        {
          type: "column",
          data: Array.from({ length: 8 }, () =>
            DataGenerator.randomInt(50, 300),
          ),
          axisYTitle: "Costs",
        },
        {
          type: "line",
          data: Array.from({ length: 8 }, () =>
            DataGenerator.randomFloat(0.005, 0.05, 3),
          ),
          axisYTitle: "Margin",
        },
      ],
      theme: "academy",
      title: "Dual-Axes - 4 Series Mixed",
    }),
  },

  // Scatter chart property combinations
  {
    type: "scatter",
    name: "scatter-props-large-dataset",
    category: "property",
    config: () => ({
      data: DataGenerator.generateScatterData(100),
      theme: "default",
      title: "Scatter Chart - 100 Points",
      axisXTitle: "X Coordinate",
      axisYTitle: "Y Coordinate",
    }),
  },

  // Radar chart property combinations
  {
    type: "radar",
    name: "radar-props-max-dimensions",
    category: "property",
    config: () => ({
      data: DataGenerator.generateRadarData(6, 3), // Max dimensions
      theme: "academy",
      title: "Radar Chart - 6 Dimensions, 3 Series",
    }),
  },
];

// Export all test cases
export const ALL_TEST_CASES = [
  ...BASIC_TEST_CASES,
  ...STRESS_TEST_CASES,
  ...PROPERTY_TEST_CASES,
];

// Export by category for selective testing
export const TEST_CASES_BY_CATEGORY = {
  basic: BASIC_TEST_CASES,
  stress: STRESS_TEST_CASES,
  property: PROPERTY_TEST_CASES,
  all: ALL_TEST_CASES,
};
