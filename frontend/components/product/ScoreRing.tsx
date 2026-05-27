"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScoreRing({
  value,
  size = 72,
  thickness = 6,
  label = "score",
  className,
  color,
}: {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  className?: string;
  color?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - v / 100);
  const stroke =
    color ?? (v >= 80 ? "#34d399" : v >= 60 ? "#a3e635" : v >= 40 ? "#fbbf24" : "#f87171");

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(220 14% 18%)"
          strokeWidth={thickness}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold tabular leading-none">{Math.round(v)}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-text-dim">
          {label}
        </div>
      </div>
    </div>
  );
}
