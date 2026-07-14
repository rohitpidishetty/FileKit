import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useEffect, useState } from "react";




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
    }
  }

  return (<></>);
}