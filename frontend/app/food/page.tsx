"use client";
import { useState } from "react";
import { ArrowRight, Loader2, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfilePicker } from "@/components/product/ProfilePicker";
import { AIExplanation } from "@/components/product/AIExplanation";
import { FoodOptionCard } from "@/components/food/FoodOptionCard";
import { api } from "@/lib/api";
import type { FoodResponse, ScoringProfile } from "@/lib/types";
import { formatGrams } from "@/lib/utils";

export default function FoodPage() {
  const [restaurant, setRestaurant] = useState("Green Bowl");
  const [category, setCategory] = useState("local_independent");
  const [distance, setDistance] = useState("4.2");
  const [diet, setDiet] = useState("vegetarian");
  const [packaging, setPackaging] = useState("plastic_single_use");
  const [deliveryType, setDeliveryType] = useState("express");
  const [cutlery, setCutlery] = useState(true);
  const [profile, setProfile] = useState<ScoringProfile>("balanced");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.optimizeFood({
        restaurant_name: restaurant,
        restaurant_category: category,
        distance_km: parseFloat(distance) || 4.2,
        diet,
        packaging,
        delivery_type: deliveryType,
        plastic_cutlery: cutlery,
        profile,
      });
      setResult(res);
    } catch (e: any) {
      setError(e?.message ?? "Optimization failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Food Delivery Optimization"
      subtitle="Score your selection against three sustainability-leaning alternatives"
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-accent" />
              Order configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Restaurant</Label>
              <Input value={restaurant} onChange={(e) => setRestaurant(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certified_eco_kitchen">Eco kitchen</SelectItem>
                    <SelectItem value="local_independent">Local independent</SelectItem>
                    <SelectItem value="chain_quick_service">Chain QSR</SelectItem>
                    <SelectItem value="cloud_kitchen">Cloud kitchen</SelectItem>
                    <SelectItem value="premium_dine_in_delivery">Premium dine-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  min={0.5}
                  max={40}
                  step={0.1}
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Diet</Label>
                <Select value={diet} onValueChange={setDiet}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non_vegetarian_poultry">Poultry</SelectItem>
                    <SelectItem value="non_vegetarian_red_meat">Red meat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Packaging</Label>
                <Select value={packaging} onValueChange={setPackaging}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastic_single_use">Single-use plastic</SelectItem>
                    <SelectItem value="mixed_plastic_paper">Mixed plastic + paper</SelectItem>
                    <SelectItem value="compostable_paper">Compostable</SelectItem>
                    <SelectItem value="reusable_container">Reusable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Delivery</Label>
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="express">Express (under 20 min)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="grouped">Grouped</SelectItem>
                  <SelectItem value="scheduled_off_peak">Scheduled off-peak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={cutlery}
                onChange={(e) => setCutlery(e.target.checked)}
                className="h-4 w-4 rounded border-line bg-bg-2 accent-emerald-500"
              />
              Include disposable cutlery
            </label>

            <div className="space-y-2">
              <Label>Scoring profile</Label>
              <ProfilePicker value={profile} onChange={setProfile} />
            </div>

            <Button onClick={run} disabled={loading} size="lg" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Optimizing
                </>
              ) : (
                <>
                  Compare alternatives
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-8 space-y-6">
          {!result && !loading && (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-text">Configure an order to see four ranked alternatives.</p>
                <p className="mt-1 text-sm text-text-muted">
                  Your selection is compared against eco-packaging, grouped delivery, and reusable-container variants.
                </p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
                <p className="mt-3 text-sm text-text-muted">Scoring packaging, sourcing, and delivery…</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AIExplanation
                  text={result.ai_explanation}
                  source={result.ai_explanation_source}
                  tradeoff={result.tradeoff_summary}
                />
              </motion.div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Impact summary</CardTitle>
                  <Badge variant="accent">
                    Recommended: {result.recommended.label}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Stat
                      label="Recommended CO₂"
                      value={formatGrams(result.recommended.estimated_emissions_g)}
                    />
                    <Stat
                      label="Baseline CO₂"
                      value={formatGrams(result.baseline.estimated_emissions_g)}
                    />
                    <Stat
                      label="Sustainability"
                      value={`${Math.round(result.recommended.sustainability_score)}/100`}
                    />
                    <Stat
                      label="Packaging impact"
                      value={result.packaging_impact.replace("_", " ")}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {result.options.map((opt, i) => (
                  <FoodOptionCard
                    key={opt.option_id}
                    option={opt}
                    weights={result.profile_weights}
                    index={i}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-2/60 border border-line p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-dim">{label}</div>
      <div className="mt-1 font-medium tabular text-sm">{value}</div>
    </div>
  );
}
