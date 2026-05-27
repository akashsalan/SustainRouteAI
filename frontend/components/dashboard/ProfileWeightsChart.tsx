"use client";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DATA = [
  { name: "Sustainability", value: 40, color: "#34d399" },
  { name: "Cost", value: 30, color: "#60a5fa" },
  { name: "Time", value: 20, color: "#a78bfa" },
  { name: "Convenience", value: 10, color: "#fbbf24" },
];

export function ProfileWeightsChart() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-36 w-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
            <Pie
              data={DATA}
              dataKey="value"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={3}
              stroke="none"
            >
              {DATA.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2 text-sm">
        {DATA.map((d) => (
          <li key={d.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="tabular text-text">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
