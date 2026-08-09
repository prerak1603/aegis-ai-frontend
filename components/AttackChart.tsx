"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AttackChartProps {
  breakdown: Record<string, number>;
}

export default function AttackChart({ breakdown }: AttackChartProps) {
  const data = Object.entries(breakdown)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.count - b.count);

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 44)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={110}
            tick={{ fill: "#8891a3", fontSize: 12, fontFamily: "IBM Plex Mono, monospace" }}
            axisLine={{ stroke: "#212736" }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              background: "#161b28",
              border: "1px solid #2c3346",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "IBM Plex Mono, monospace",
            }}
            labelStyle={{ color: "#e8eaf1" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={entry.category === "BENIGN" ? "#4cd3db" : "#e8763b"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
