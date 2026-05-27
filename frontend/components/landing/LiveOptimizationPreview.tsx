"use client";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/product/ScoreRing";

const DATA = [
  { mode: "Solo cab", score: 48, color: "#ef4444" },
  { mode: "Pool cab", score: 65, color: "#f59e0b" },
  { mode: "Bus", score: 72, color: "#22c55e" },
  { mode: "Metro", score: 88, color: "#34d399" },
];

export function LiveOptimizationPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-line bg-bg-1/60 backdrop-blur-md p-6 shadow-card"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
            Indiranagar → MG Road · 8.4 km
          </div>
          <div className="mt-1 text-lg font-medium">Live transport optimization</div>
        </div>
        <Badge variant="accent">
          <Sparkles className="h-3 w-3" />
          Balanced profile
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="col-span-2 rounded-2xl bg-bg-2/60 border border-line p-4">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <XAxis
                  dataKey="mode"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {DATA.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_hsl(152_76%_50%)]" />
            Final score · 0–100 · higher is better
          </div>
        </div>

        <div className="rounded-2xl bg-bg-2/60 border border-line p-4 flex flex-col items-center justify-center">
          <ScoreRing value={88} size={96} thickness={8} label="metro" />
          <div className="mt-3 text-xs text-text-muted text-center leading-snug">
            Recommended.
            <br />
            <span className="text-accent">−72% emissions</span> vs solo cab,
            <br />
            +8 min travel time.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-gradient-to-b from-bg-2/60 to-bg-1/40 p-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
          AI explanation
        </div>
        <p className="mt-2 text-sm text-text leading-relaxed">
          Taking the metro reduces estimated emissions by ~72% and saves about
          INR 185 versus a solo cab, with only 8 extra minutes of travel time.
        </p>
      </div>
    </motion.div>
  );
}
