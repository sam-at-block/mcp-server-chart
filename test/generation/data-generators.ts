// Random data generators namespace
export const DataGenerator = {
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

  // STRESS TEST DATA GENERATORS (New!)

  // Generate large time series datasets
  generateLargeTimeSeries(points = 1000, groups = 1) {
    const data = [];
    const startDate = new Date("2020-01-01");

    for (let i = 0; i < points; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const timeStr = date.toISOString().split("T")[0];

      if (groups === 1) {
        data.push({
          time: timeStr,
          value: this.randomInt(50, 500) + Math.sin(i / 30) * 100, // Add some trend
        });
      } else {
        const groupNames = ["Series A", "Series B", "Series C"];
        for (let g = 0; g < Math.min(groups, groupNames.length); g++) {
          data.push({
            time: timeStr,
            value: this.randomInt(50, 500) + Math.sin((i + g * 10) / 30) * 100,
            group: groupNames[g],
          });
        }
      }
    }
    return data;
  },

  // Generate large categorical datasets
  generateLargeCategorical(categories = 100, groups = 1) {
    const data = [];

    for (let i = 0; i < categories; i++) {
      const categoryName = `Category ${String(i + 1).padStart(3, "0")}`;

      if (groups === 1) {
        data.push({
          category: categoryName,
          value: this.randomInt(100, 1000),
        });
      } else {
        const groupNames = ["Q1", "Q2", "Q3", "Q4"];
        for (let g = 0; g < Math.min(groups, groupNames.length); g++) {
          data.push({
            category: categoryName,
            value: this.randomInt(100, 1000),
            group: groupNames[g],
          });
        }
      }
    }
    return data;
  },

  // Generate large network datasets
  generateLargeNetworkData(nodes = 50, edges = 200) {
    const nodeList = [];
    for (let i = 0; i < nodes; i++) {
      nodeList.push({ name: `Node ${String(i + 1).padStart(3, "0")}` });
    }

    const edgeList = [];
    const nodeNames = nodeList.map((n) => n.name);

    for (let i = 0; i < edges && edgeList.length < edges; i++) {
      const source = this.randomChoice(nodeNames);
      const target = this.randomChoice(nodeNames);

      if (
        source !== target &&
        !edgeList.some((e) => e.source === source && e.target === target)
      ) {
        edgeList.push({
          source,
          target,
          name: `edge_${edgeList.length + 1}`,
        });
      }
    }

    return { nodes: nodeList, edges: edgeList };
  },

  // Generate large histogram datasets
  generateLargeHistogramData(count = 10000): number[] {
    // Generate normally distributed data for more realistic histograms
    const data = [];
    for (let i = 0; i < count; i++) {
      // Box-Muller transformation for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      data.push(Math.round(z0 * 15 + 50)); // Mean=50, StdDev=15
    }
    return data;
  },

  // Generate large word cloud datasets
  generateLargeWordCloudData(words = 500) {
    const data = [];
    for (let i = 0; i < words; i++) {
      data.push({
        text: `word_${String(i + 1).padStart(4, "0")}`,
        value: this.randomInt(1, 100),
      });
    }
    return data;
  },
};
