"use client";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TransportOption } from "@/lib/types";

export function TradeoffMatrix({ options }: { options: TransportOption[] }) {
  const data = options.map((o) => ({
    mode: o.label,
    score: o.final_score,
    color: o.is_recommended ? "#34d399" : o.color,
  }));
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, left: -10, right: 8, bottom: 0 }} layout="vertical">
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="mode"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            width={120}
          />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} formatter={(v: number) => [`${v}/100`, "Final score"]} />
          <Bar dataKey="score" radius={[0, 8, 8, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
