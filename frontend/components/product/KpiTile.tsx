"use client";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiTile({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  icon: Icon,
  accent = "accent",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: "accent" | "intel" | "warn";
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-line bg-bg-1/60 backdrop-blur-md p-5 shadow-card"
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px",
          accent === "accent" && "bg-gradient-to-r from-transparent via-accent to-transparent",
          accent === "intel" && "bg-gradient-to-r from-transparent via-intel to-transparent",
          accent === "warn" && "bg-gradient-to-r from-transparent via-warn to-transparent"
        )}
      />
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
          {label}
        </div>
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4",
              accent === "accent" && "text-accent",
              accent === "intel" && "text-intel",
              accent === "warn" && "text-warn"
            )}
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-text tabular">
          {value}
        </span>
        {unit && <span className="text-sm text-text-muted">{unit}</span>}
      </div>
      {(delta !== undefined || deltaLabel) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 tabular",
                positive
                  ? "text-accent bg-accent/10 border border-accent/20"
                  : "text-danger bg-danger/10 border border-danger/20"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {deltaLabel && <span className="text-text-muted">{deltaLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
