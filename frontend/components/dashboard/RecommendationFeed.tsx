"use client";
import { motion } from "framer-motion";
import { Train, Bus, Bike, Package, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ITEMS = [
  {
    icon: Train,
    title: "Indiranagar → MG Road",
    detail: "Recommended: Metro · 88/100",
    impact: "−72% emissions vs solo cab",
    href: "/transport",
    accent: "accent" as const,
  },
  {
    icon: Bus,
    title: "Whitefield → Cubbon Park",
    detail: "Recommended: Suburban Train · 87/100",
    impact: "−86% emissions, ₹510 saved",
    href: "/transport",
    accent: "accent" as const,
  },
  {
    icon: UtensilsCrossed,
    title: "Order from Green Bowl",
    detail: "Recommended: Grouped + compostable",
    impact: "−58% delivery emissions",
    href: "/food",
    accent: "intel" as const,
  },
  {
    icon: Bike,
    title: "Koramangala 5 → Koramangala 1",
    detail: "Recommended: Bicycle · 86/100",
    impact: "Zero emissions, 11 min",
    href: "/transport",
    accent: "accent" as const,
  },
  {
    icon: Package,
    title: "Logistics consolidation",
    detail: "3 open orders eligible for grouping",
    impact: "−35% packaging waste",
    href: "/dashboard",
    accent: "warn" as const,
  },
];

export function RecommendationFeed() {
  return (
    <div className="space-y-2">
      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Link
              href={item.href}
              className="group flex items-center gap-3 rounded-xl border border-line bg-bg-1/60 px-3 py-3 hover:border-accent/30 hover:bg-bg-2/60 transition-all"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-bg-2 border border-line">
                <Icon className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.title}</div>
                <div className="text-xs text-text-muted truncate">{item.detail}</div>
              </div>
              <Badge variant={item.accent}>{item.impact}</Badge>
              <ArrowRight className="h-4 w-4 text-text-dim group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
