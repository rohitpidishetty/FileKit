import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./FileAnalyticsDashboard.css";

const CHART_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#8b5cf6",
  "#64748b",
];

const CATEGORY_COLORS = {
  files: "#6366f1",
  folders: "#14b8a6",
  other: "#94a3b8",
};

function parseMemory(memoryValue) {
  if (!memoryValue) {
    return {
      value: 0,
      unit: "GB",
    };
  }

  const [value, unit = "GB"] = String(memoryValue).trim().split(/\s+/);

  return {
    value: Number.parseFloat(value) || 0,
    unit,
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function formatBytes(bytes) {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1
  );

  const convertedValue = size / Math.pow(1024, unitIndex);

  return `${convertedValue.toFixed(convertedValue >= 10 ? 1 : 2)} ${units[unitIndex]
    }`;
}

function formatPercentage(value) {
  return `${Number(value).toFixed(1)}%`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="analytics-tooltip">
      {label && <p className="analytics-tooltip-title">{label}</p>}

      {payload.map((item) => (
        <div className="analytics-tooltip-row" key={item.dataKey}>
          <span
            className="analytics-tooltip-dot"
            style={{ backgroundColor: item.color }}
          />

          <span>{item.name}</span>

          <strong>{formatNumber(item.value)}</strong>
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  tone = "purple",
}) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card-icon">{icon}</div>

      <div className="metric-card-content">
        <span className="metric-card-label">{label}</span>
        <strong className="metric-card-value">{value}</strong>

        {subtitle && (
          <span className="metric-card-subtitle">{subtitle}</span>
        )}
      </div>
    </article>
  );
}

export default function FileAnalyticsDashboard({ data }) {
  const analytics = useMemo(() => {
    const details = data?.Details ?? {};
    const distribution = Array.isArray(data?.distribution)
      ? [...data.distribution]
      : [];

    const sortedDistribution = distribution
      .filter((item) => item?.type && Number(item?.count) > 0)
      .map((item) => ({
        type: String(item.type),
        count: Number(item.count),
      }))
      .sort((a, b) => b.count - a.count);

    const totalFiles = Number(details.Files) || 0;
    const totalFolders = Number(details.Folders) || 0;
    const totalItems = totalFiles + totalFolders;

    const detectedFileCount = sortedDistribution.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const top12 = sortedDistribution.slice(0, 12);
    const remaining = sortedDistribution.slice(12);

    const remainingCount = remaining.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const donutData = [
      ...top12.slice(0, 7),
      ...(sortedDistribution.length > 7
        ? [
          {
            type: "Other",
            count: sortedDistribution
              .slice(7)
              .reduce((sum, item) => sum + item.count, 0),
          },
        ]
        : []),
    ];

    const topBarData = top12.map((item, index) => ({
      ...item,
      rank: index + 1,
      percentage:
        detectedFileCount > 0
          ? (item.count / detectedFileCount) * 100
          : 0,
    }));

    const rankedAreaData = sortedDistribution
      .slice(0, 20)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    const itemComparisonData = [
      {
        name: "Files",
        value: totalFiles,
      },
      {
        name: "Folders",
        value: totalFolders,
      },
    ];

    const fileTypeSummary = [
      {
        name: "Top 12 extensions",
        value: top12.reduce((sum, item) => sum + item.count, 0),
      },
      {
        name: "Other extensions",
        value: remainingCount,
      },
    ];

    const memory = parseMemory(details["Total Memory"]);

    const topExtension = sortedDistribution[0] ?? {
      type: "N/A",
      count: 0,
    };

    return {
      details,
      distribution: sortedDistribution,
      totalFiles,
      totalFolders,
      totalItems,
      detectedFileCount,
      top12,
      donutData,
      topBarData,
      rankedAreaData,
      itemComparisonData,
      fileTypeSummary,
      memory,
      topExtension,
      extensionCount: sortedDistribution.length,
    };
  }, [data]);

  if (!data?.Details) {
    return (
      <div className="analytics-empty-state">
        <div className="analytics-empty-icon">📊</div>
        <h3>No analytics data available</h3>
        <p>Run a folder statistics scan to generate charts.</p>
      </div>
    );
  }

  const {
    details,
    totalFiles,
    totalFolders,
    totalItems,
    detectedFileCount,
    donutData,
    topBarData,
    rankedAreaData,
    itemComparisonData,
    fileTypeSummary,
    memory,
    topExtension,
    extensionCount,
    distribution,
  } = analytics;

  const largestFile = details["Largest File"] ?? {};
  const smallestFile = details["Smallest File"] ?? {};

  return (
    <main className="file-analytics">
      <header className="analytics-header">
        <div>
          <span className="analytics-eyebrow">FILEKIT ANALYTICS</span>


          <p>
            A complete overview of files, folders, storage usage, hierarchy,
            and extension distribution.
          </p>
        </div>

        <div className="analytics-status">
          <span className="analytics-status-dot" />
          Scan completed
        </div>
      </header>

      <section className="metrics-grid">
        <MetricCard
          icon="📄"
          label="Total Files"
          value={formatNumber(totalFiles)}
          subtitle={`${formatNumber(detectedFileCount)} extensions detected`}
          tone="purple"
        />

        <MetricCard
          icon="📁"
          label="Total Folders"
          value={formatNumber(totalFolders)}
          subtitle={`${formatNumber(totalItems)} total items`}
          tone="teal"
        />

        <MetricCard
          icon="💾"
          label="Total Memory"
          value={`${memory.value.toFixed(3)} ${memory.unit}`}
          subtitle="Recursive folder size"
          tone="blue"
        />

        <MetricCard
          icon="🌲"
          label="Maximum Depth"
          value={formatNumber(details["Max Depth"])}
          subtitle="Directory hierarchy levels"
          tone="orange"
        />

        <MetricCard
          icon="🧩"
          label="File Types"
          value={formatNumber(extensionCount)}
          subtitle={`${topExtension.type} is most common`}
          tone="pink"
        />

        <MetricCard
          icon="🏆"
          label="Top Extension"
          value={`.${topExtension.type}`}
          subtitle={`${formatNumber(topExtension.count)} files`}
          tone="green"
        />
      </section>

      <section className="analytics-grid analytics-grid--primary">
        <article className="analytics-card analytics-card--large">
          <div className="analytics-card-header">
            <div>
              <span className="analytics-card-kicker">Distribution</span>
              <h2>Most Common File Types</h2>
              <p>Top 12 extensions ranked by file count.</p>
            </div>

            <div className="analytics-card-badge">
              {formatNumber(detectedFileCount)} files
            </div>
          </div>

          <div className="chart-container chart-container--large">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topBarData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  horizontal={false}
                  stroke="rgba(148, 163, 184, 0.18)"
                />

                <XAxis
                  type="number"
                  tickFormatter={formatNumber}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="type"
                  width={76}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `.${value}`}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="count"
                  name="Files"
                  radius={[0, 10, 10, 0]}
                  maxBarSize={26}
                >
                  {topBarData.map((entry, index) => (
                    <Cell
                      key={entry.type}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <span className="analytics-card-kicker">Composition</span>
              <h2>Extension Share</h2>
              <p>Top extensions versus remaining types.</p>
            </div>
          </div>

          <div className="chart-container chart-container--donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={112}
                  paddingAngle={3}
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={entry.type}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    formatNumber(value),
                    `.${name}`,
                  ]}
                />

                <Legend
                  iconType="circle"
                  formatter={(value) =>
                    value === "Other" ? value : `.${value}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>{formatNumber(detectedFileCount)}</strong>
              <span>Files</span>
            </div>
          </div>
        </article>
      </section>

      <section className="analytics-grid analytics-grid--secondary">
        <article className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <span className="analytics-card-kicker">Structure</span>
              <h2>Files vs Folders</h2>
              <p>Overall item composition.</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={itemComparisonData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.18)"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={formatNumber}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="value"
                  name="Count"
                  radius={[12, 12, 0, 0]}
                  maxBarSize={90}
                >
                  <Cell fill={CATEGORY_COLORS.files} />
                  <Cell fill={CATEGORY_COLORS.folders} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="comparison-summary">
            <div>
              <span className="comparison-dot comparison-dot--files" />
              <div>
                <span>Files</span>
                <strong>{formatNumber(totalFiles)}</strong>
              </div>
            </div>

            <div>
              <span className="comparison-dot comparison-dot--folders" />
              <div>
                <span>Folders</span>
                <strong>{formatNumber(totalFolders)}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <span className="analytics-card-kicker">Coverage</span>
              <h2>Top Types vs Others</h2>
              <p>Coverage of the 12 most frequent extensions.</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fileTypeSummary}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={105}
                  paddingAngle={4}
                  stroke="none"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#cbd5e1" />
                </Pie>

                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-card analytics-card--wide">
          <div className="analytics-card-header">
            <div>
              <span className="analytics-card-kicker">
                Ranked Frequency
              </span>
              <h2>Top 20 Extension Trend</h2>
              <p>
                A ranked view showing how quickly file counts decline.
              </p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={rankedAreaData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="extensionArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#6366f1"
                      stopOpacity={0.42}
                    />
                    <stop
                      offset="95%"
                      stopColor="#6366f1"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.18)"
                />

                <XAxis
                  dataKey="type"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `.${value}`}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                />

                <YAxis
                  tickFormatter={formatNumber}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="count"
                  name="Files"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#extensionArea)"
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="file-extremes-grid">
        <article className="file-detail-card file-detail-card--largest">
          <div className="file-detail-icon">📦</div>

          <div className="file-detail-content">
            <span className="file-detail-label">Largest File</span>

            <h3 title={largestFile.Name}>
              {largestFile.Name || "Unknown"}
            </h3>

            <strong>{formatBytes(largestFile.Size)}</strong>
          </div>

          <div className="file-detail-glow" />
        </article>

        <article className="file-detail-card file-detail-card--smallest">
          <div className="file-detail-icon">🪶</div>

          <div className="file-detail-content">
            <span className="file-detail-label">Smallest File</span>

            <h3 title={smallestFile.Name}>
              {smallestFile.Name || "Unknown"}
            </h3>

            <strong>{formatBytes(smallestFile.size)}</strong>
          </div>

          <div className="file-detail-glow" />
        </article>

        <article className="file-detail-card file-detail-card--depth">
          <div className="file-detail-icon">🌳</div>

          <div className="file-detail-content">
            <span className="file-detail-label">Directory Depth</span>
            <h3>Maximum hierarchy</h3>

            <strong>
              {formatNumber(details["Max Depth"])} levels
            </strong>
          </div>

          <div className="file-detail-glow" />
        </article>
      </section>

      <section className="analytics-card extension-table-card">
        <div className="analytics-card-header">
          <div>
            <span className="analytics-card-kicker">Complete Dataset</span>
            <h2>All File Extensions</h2>

            <p>
              Every detected file type, count, and percentage contribution.
            </p>
          </div>

          <div className="analytics-card-badge">
            {formatNumber(extensionCount)} types
          </div>
        </div>

        <div className="extension-table-wrapper">
          <table className="extension-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Extension</th>
                <th>Count</th>
                <th>Share</th>
                <th>Distribution</th>
              </tr>
            </thead>

            <tbody>
              {distribution.map((item, index) => {
                const percentage =
                  detectedFileCount > 0
                    ? (item.count / detectedFileCount) * 100
                    : 0;

                return (
                  <tr key={`${item.type}-${index}`}>
                    <td>
                      <span className="rank-badge">{index + 1}</span>
                    </td>

                    <td>
                      <code>.{item.type}</code>
                    </td>

                    <td>{formatNumber(item.count)}</td>

                    <td>{formatPercentage(percentage)}</td>

                    <td>
                      <div className="distribution-progress">
                        <span
                          style={{
                            width: `${Math.max(
                              percentage,
                              percentage > 0 ? 0.4 : 0
                            )}%`,
                            backgroundColor:
                              CHART_COLORS[
                              index % CHART_COLORS.length
                              ],
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}