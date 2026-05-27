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

const DATA = [
  { week: "W-12", value: 120 },
  { week: "W-11", value: 142 },
  { week: "W-10", value: 168 },
  { week: "W-9", value: 188 },
  { week: "W-8", value: 198 },
  { week: "W-7", value: 220 },
  { week: "W-6", value: 246 },
  { week: "W-5", value: 268 },
  { week: "W-4", value: 284 },
  { week: "W-3", value: 312 },
  { week: "W-2", value: 348 },
  { week: "W-1", value: 412 },
];

export function TrendChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 10, left: -10, right: 6, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            width={36}
          />
          <Tooltip
            formatter={(v: number) => [`${v} kg`, "CO₂ avoided"]}
            contentStyle={{ background: "#0b1220" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#g1)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
