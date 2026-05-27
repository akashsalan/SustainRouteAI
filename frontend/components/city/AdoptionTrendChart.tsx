"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdoptionTrendChart({
  data,
}: {
  data: { month: string; co2_reduction_tons: number }[];
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, left: -10, right: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="cityGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            width={50}
          />
          <Tooltip
            formatter={(v: number) => [`${v.toLocaleString()} t`, "CO₂ avoided"]}
          />
          <Area
            type="monotone"
            dataKey="co2_reduction_tons"
            stroke="#34d399"
            strokeWidth={2.4}
            fill="url(#cityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
