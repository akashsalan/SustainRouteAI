"use client";
import { motion } from "framer-motion";
import { Box, Leaf, Package, Recycle, Timer, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScoreBars } from "@/components/product/ScoreBars";
import { ScoreRing } from "@/components/product/ScoreRing";
import type { FoodOption } from "@/lib/types";
import { formatCurrency, formatGrams, formatMinutes } from "@/lib/utils";

const PACKAGING_LABELS: Record<string, string> = {
  plastic_single_use: "Single-use plastic",
  mixed_plastic_paper: "Plastic + paper",
  compostable_paper: "Compostable",
  reusable_container: "Reusable",
};
const DELIVERY_LABELS: Record<string, string> = {
  express: "Express",
  standard: "Standard",
  grouped: "Grouped",
  scheduled_off_peak: "Off-peak",
};
const DELIVERY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  express: Zap,
  standard: Timer,
  grouped: Package,
  scheduled_off_peak: Recycle,
};
const PACKAGING_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  plastic_single_use: Box,
  mixed_plastic_paper: Box,
  compostable_paper: Leaf,
  reusable_container: Recycle,
};

export function FoodOptionCard({
  option,
  weights,
  index,
}: {
  option: FoodOption;
  weights?: Record<string, number>;
  index: number;
}) {
  const DeliveryIcon = DELIVERY_ICONS[option.delivery_type] ?? Timer;
  const PackagingIcon = PACKAGING_ICONS[option.packaging] ?? Box;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        option.is_recommended
          ? "border-accent/50 bg-accent/5 shadow-[0_30px_60px_-30px_hsl(152_76%_50%_/_0.4)]"
          : "border-line bg-bg-1/60"
      }`}
    >
      {option.is_recommended && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-bg-2 border border-line shrink-0">
            <DeliveryIcon className="h-5 w-5 text-text" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight truncate">
                {option.label}
              </h3>
              <Badge variant="outline">#{option.rank}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1">
                <DeliveryIcon className="h-3 w-3" />
                {DELIVERY_LABELS[option.delivery_type]}
              </span>
              <span className="text-text-dim">·</span>
              <span className="inline-flex items-center gap-1">
                <PackagingIcon className="h-3 w-3" />
                {PACKAGING_LABELS[option.packaging]}
              </span>
            </div>
          </div>
        </div>
        <ScoreRing value={option.final_score} size={64} thickness={6} label="final" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Metric label="ETA" value={formatMinutes(option.estimated_time_min)} />
        <Metric label="Fee" value={formatCurrency(option.estimated_cost)} />
        <Metric label="CO₂" value={formatGrams(option.estimated_emissions_g)} />
      </div>

      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim mb-2">
          Per-dimension breakdown
        </div>
        <ScoreBars scores={option.scores} weights={weights} compact />
      </div>

      {option.reasoning?.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {option.reasoning.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-accent" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-2/60 border border-line p-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-dim">{label}</div>
      <div className="mt-0.5 font-medium tabular text-sm">{value}</div>
    </div>
  );
}
