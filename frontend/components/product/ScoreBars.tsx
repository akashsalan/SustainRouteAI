"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DIMENSIONS: { key: "sustainability" | "cost" | "time" | "convenience"; label: string; color: string }[] = [
  { key: "sustainability", label: "Sustainability", color: "#34d399" },
  { key: "cost", label: "Cost", color: "#60a5fa" },
  { key: "time", label: "Time", color: "#a78bfa" },
  { key: "convenience", label: "Convenience", color: "#fbbf24" },
];

export function ScoreBars({
  scores,
  weights,
  compact = false,
}: {
  scores: { sustainability: number; cost: number; time: number; convenience: number };
  weights?: Record<string, number>;
  compact?: boolean;
}) {
  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      {DIMENSIONS.map((d, idx) => {
        const value = scores[d.key];
        const weight = weights?.[d.key];
        return (
          <div key={d.key}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-muted">
                {d.label}
                {weight !== undefined && (
                  <span className="ml-1.5 text-text-dim">
                    × {Math.round(weight * 100)}%
                  </span>
                )}
              </span>
              <span className="tabular text-text">{Math.round(value)}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-bg-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: d.color }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
