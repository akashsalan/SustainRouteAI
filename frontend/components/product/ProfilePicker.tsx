"use client";
import { Sparkles, Wallet, Leaf, Gauge, Sofa } from "lucide-react";
import { motion } from "framer-motion";
import type { ScoringProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const PROFILES: {
  id: ScoringProfile;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  weights: { sustainability: number; cost: number; time: number; convenience: number };
}[] = [
  {
    id: "balanced",
    label: "Balanced",
    description: "Default optimization profile",
    icon: Sparkles,
    weights: { sustainability: 0.4, cost: 0.3, time: 0.2, convenience: 0.1 },
  },
  {
    id: "eco_priority",
    label: "Eco priority",
    description: "Sustainability-led decisions",
    icon: Leaf,
    weights: { sustainability: 0.65, cost: 0.15, time: 0.1, convenience: 0.1 },
  },
  {
    id: "budget_priority",
    label: "Budget",
    description: "Cost-sensitive routing",
    icon: Wallet,
    weights: { sustainability: 0.2, cost: 0.55, time: 0.15, convenience: 0.1 },
  },
  {
    id: "speed_priority",
    label: "Speed",
    description: "Time-critical decisions",
    icon: Gauge,
    weights: { sustainability: 0.15, cost: 0.15, time: 0.6, convenience: 0.1 },
  },
  {
    id: "comfort_priority",
    label: "Comfort",
    description: "Convenience-led",
    icon: Sofa,
    weights: { sustainability: 0.2, cost: 0.2, time: 0.2, convenience: 0.4 },
  },
];

export function ProfilePicker({
  value,
  onChange,
  compact = false,
}: {
  value: ScoringProfile;
  onChange: (next: ScoringProfile) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        compact ? "grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      )}
    >
      {PROFILES.map((p) => {
        const active = p.id === value;
        const Icon = p.icon;
        return (
          <motion.button
            key={p.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(p.id)}
            className={cn(
              "relative rounded-xl border p-3 text-left transition-all",
              active
                ? "border-accent/50 bg-accent/8 shadow-[0_8px_30px_-12px_hsl(152_76%_50%_/_0.5)]"
                : "border-line bg-bg-1/60 hover:bg-bg-2"
            )}
          >
            <div className="flex items-center gap-2">
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-accent" : "text-text-muted"
                )}
              />
              <span className="text-sm font-medium">{p.label}</span>
            </div>
            {!compact && (
              <p className="mt-1 text-[11px] text-text-dim leading-snug">
                {p.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-1">
              {Object.values(p.weights).map((w, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full bg-line",
                    active && "bg-accent/30"
                  )}
                  style={{ width: `${Math.max(10, w * 80)}px` }}
                />
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
