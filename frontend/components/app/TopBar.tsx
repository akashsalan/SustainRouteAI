"use client";
import { useEffect, useState } from "react";
import { Activity, Cpu, Database } from "lucide-react";
import { api } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    api
      .health()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <div className="sticky top-0 z-30 border-b border-line bg-bg-0/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={health?.status === "healthy" ? "accent" : "warn"}>
            <Activity className="h-3 w-3" />
            {health ? health.status.toUpperCase() : "OFFLINE"}
          </Badge>
          <Badge variant="outline" className="hidden md:inline-flex">
            <Database className="h-3 w-3" />
            {health?.datasets_loaded ?? 0}/7 datasets
          </Badge>
          <Badge
            variant={health?.ai_layer === "online" ? "intel" : "outline"}
            className="hidden md:inline-flex"
          >
            <Cpu className="h-3 w-3" />
            AI {health?.ai_layer ?? "fallback"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
