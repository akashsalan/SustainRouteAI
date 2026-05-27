"use client";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const LABELS: Record<string, string> = {
  solo_cab_to_pool: "Solo → Pool",
  solo_cab_to_metro: "Solo → Metro",
  solo_cab_to_active: "Solo → Active",
};
const COLORS: Record<string, string> = {
  solo_cab_to_pool: "#a78bfa",
  solo_cab_to_metro: "#34d399",
  solo_cab_to_active: "#fbbf24",
};

export function TransportShiftChart({ shift }: { shift: Record<string, number> }) {
  const data = Object.entries(shift).map(([k, v]) => ({
    key: k,
    label: LABELS[k] ?? k,
    pct: Math.round(v * 100),
    color: COLORS[k] ?? "#60a5fa",
  }));
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} width={36} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Adoption"]} />
          <Bar dataKey="pct" radius={[8, 8, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
