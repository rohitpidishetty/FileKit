import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,


  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,


} from "recharts";

import { useEffect, useState } from "react";
import "./styles.css";
import FileAnalyticsDashboard from "./Charts/FileAnalyticsDashboard";




export default function StorageChart({ type, filePath = null }) {

  const [data, setData] = useState(null);

  if (filePath != null) {


    useEffect(() => {
      async function read() {
        const json = await window.electronAPI.readFile(filePath);
        setData([JSON.parse(json)]);
      }
      read();
    }, [])


    switch (type) {
      case "size":
        const COLORS = ["#4F46E5"];
        return (

          <div style={{ width: "100%", height: 350 }}>
            {data && <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="size"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, value }) => `${name} (${value.toFixed(2)})`}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>}
          </div>
        );

      case "top files":

        if (!data) return;



        let chartData = Object.values(data[0]).map((file) => ({
          name: file.fileName,
          size: Number(file.fileSize.toFixed(2)),
          measure: file.measure,
          path: file.filePath,
        }));

        function CustomTooltip({ active, payload }) {
          if (!active || !payload?.length) return null;

          const file = payload[0].payload;

          return (
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dddddd",
                borderRadius: "8px",
                padding: "10px",
                maxWidth: "350px",
              }}
            >
              <strong>{file.name}</strong>
              <p style={{ margin: "6px 0" }}>
                Size: {file.size} {file.measure}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  wordBreak: "break-all",
                }}
              >
                {file.path}
              </p>
            </div>
          );
        }
        return (<div style={{ width: "100%", height: 420 }}>
          {data && <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 140,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                tickFormatter={(value) => `${value}`}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 12 }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="size"
                name="File Size"
                fill="#4f46e5"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>}
        </div>);

      case "statistics":
        if (!data) return;

        return <FileAnalyticsDashboard data={data[0]} />

    }
  }

  return (<></>);
}