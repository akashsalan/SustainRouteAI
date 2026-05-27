"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Globe2, Leaf, Loader2, Sparkles, TreePine, Users } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiTile } from "@/components/product/KpiTile";
import { AdoptionTrendChart } from "@/components/city/AdoptionTrendChart";
import { TransportShiftChart } from "@/components/city/TransportShiftChart";
import { api } from "@/lib/api";
import type { CityImpactResponse } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

const SCENARIOS = [
  { id: "low_adoption", label: "Low" },
  { id: "medium_adoption", label: "Medium" },
  { id: "high_adoption", label: "High" },
];
const CITIES = [
  { id: "tier_1_metro", label: "Tier 1 Metro" },
  { id: "tier_2_city", label: "Tier 2 City" },
];

export default function CityImpactPage() {
  const [city, setCity] = useState("tier_1_metro");
  const [scenario, setScenario] = useState("medium_adoption");
  const [data, setData] = useState<CityImpactResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .cityImpact(city, scenario)
      .then(setData)
      .finally(() => setLoading(false));
  }, [city, scenario]);

  return (
    <AppShell
      title="City Impact Simulation"
      subtitle="Project collective outcomes at scale"
    >
      <div className="space-y-8">
        <Card className="overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-bg-2 border border-line">
                <Globe2 className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Adoption scenario</CardTitle>
                <p className="text-xs text-text-muted mt-1">
                  Driven by datasets/city_simulation.json — every tile recomputes deterministically.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Tabs value={city} onValueChange={setCity}>
                <TabsList>
                  {CITIES.map((c) => (
                    <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Tabs value={scenario} onValueChange={setScenario}>
                <TabsList>
                  {SCENARIOS.map((s) => (
                    <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          {loading || !data ? (
            <CardContent className="py-16 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
            </CardContent>
          ) : (
            <CardContent className="space-y-6">
              <motion.div
                key={`${city}-${scenario}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-line bg-gradient-to-b from-bg-2/80 to-bg-1/40 p-5 lg:p-6"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
                    Headline projection
                  </span>
                </div>
                <p className="mt-2 text-xl lg:text-2xl font-medium leading-snug">
                  {data.headline}
                </p>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiTile
                  label="Estimated users"
                  value={formatNumber(data.estimated_users)}
                  icon={Users}
                  accent="intel"
                />
                <KpiTile
                  label="Yearly CO₂ avoided"
                  value={formatNumber(data.yearly_projections.co2_reduction_tons)}
                  unit="tons"
                  icon={Leaf}
                  accent="accent"
                />
                <KpiTile
                  label="Packaging waste avoided"
                  value={formatNumber(
                    Math.round(data.yearly_projections.packaging_waste_reduction_kg / 1000)
                  )}
                  unit="t / yr"
                  icon={Droplets}
                  accent="warn"
                />
                <KpiTile
                  label="Trees equivalent"
                  value={formatNumber(data.yearly_projections.trees_equivalent)}
                  icon={TreePine}
                  accent="accent"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                <Card className="lg:col-span-8">
                  <CardHeader>
                    <CardTitle>Monthly CO₂ avoidance · 12-month projection</CardTitle>
                    <p className="text-xs text-text-muted mt-1">
                      Seasonal multipliers applied to the base monthly projection.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <AdoptionTrendChart data={data.monthly_trend} />
                  </CardContent>
                </Card>

                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Transport shift</CardTitle>
                    <p className="text-xs text-text-muted mt-1">
                      Estimated migration away from solo cab.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <TransportShiftChart shift={data.transport_shift} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <KpiBlock
                  label="Monthly CO₂ avoided"
                  value={`${formatNumber(data.monthly_projections.co2_reduction_tons)} t`}
                />
                <KpiBlock
                  label="Monthly fuel saved"
                  value={`${formatNumber(data.monthly_projections.fuel_saved_liters)} L`}
                />
                <KpiBlock
                  label="Grouped delivery adoption"
                  value={`${data.monthly_projections.grouped_delivery_adoption_percent}%`}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Targets · per 10,000 users / year</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-4">
                  {Object.entries(data.kpi_targets).map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-line bg-bg-2/60 p-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-text-dim">
                        {k.replace(/_/g, " ")}
                      </div>
                      <div className="mt-1 text-lg font-semibold tabular text-text">
                        {formatNumber(v)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>{data.city_label} · {data.scenario.replace("_", " ")}</span>
                <Badge variant="outline">deterministic projection</Badge>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

function KpiBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-1/60 p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-dim">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular">{value}</div>
    </div>
  );
}
