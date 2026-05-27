"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, MapPin, Route, Sparkles } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfilePicker } from "@/components/product/ProfilePicker";
import { AIExplanation } from "@/components/product/AIExplanation";
import { OptionCard } from "@/components/transport/OptionCard";
import { TradeoffMatrix } from "@/components/transport/TradeoffMatrix";
import { api } from "@/lib/api";
import type { ScoringProfile, TransportResponse } from "@/lib/types";

const SAMPLE_ROUTES = [
  { src: "Indiranagar", dest: "MG Road" },
  { src: "Whitefield", dest: "Cubbon Park" },
  { src: "Koramangala 5th Block", dest: "Koramangala 1st Block" },
  { src: "JP Nagar", dest: "Kempegowda Airport" },
];

export default function TransportPage() {
  const [source, setSource] = useState("Indiranagar");
  const [destination, setDestination] = useState("MG Road");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
  const [profile, setProfile] = useState<ScoringProfile>("balanced");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.optimizeTransport({
        source,
        destination,
        urgency,
        profile,
      });
      setResult(res);
    } catch (e: any) {
      setError(e?.message ?? "Optimization failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Transport Optimization"
      subtitle="Multi-objective ranking across 8 transport modes"
    >
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input panel */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-4 w-4 text-accent" />
              Route input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="src">Source</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim" />
                <Input
                  id="src"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="pl-9"
                  placeholder="e.g. Indiranagar"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dest">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent" />
                <Input
                  id="dest"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-9"
                  placeholder="e.g. MG Road"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Urgency</Label>
              <Select value={urgency} onValueChange={(v) => setUrgency(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low — flexible</SelectItem>
                  <SelectItem value="medium">Medium — typical</SelectItem>
                  <SelectItem value="high">High — time-critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scoring profile</Label>
              <ProfilePicker value={profile} onChange={setProfile} />
            </div>

            <Button onClick={run} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Optimizing
                </>
              ) : (
                <>
                  Run optimization
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim mb-2">
                Try a sample route
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_ROUTES.map((r) => (
                  <button
                    key={`${r.src}-${r.dest}`}
                    onClick={() => {
                      setSource(r.src);
                      setDestination(r.dest);
                    }}
                    className="text-[11px] px-2 py-1 rounded-md border border-line bg-bg-2/60 text-text-muted hover:text-text hover:border-accent/40 transition-all"
                  >
                    {r.src} → {r.dest}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !loading && (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-bg-2 border border-line">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <p className="mt-4 text-text">Run an optimization to view ranked options.</p>
                <p className="mt-1 text-sm text-text-muted">
                  Every option is scored on sustainability, cost, time, and convenience and ranked on the active profile.
                </p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
                <p className="mt-3 text-sm text-text-muted">
                  Computing tradeoffs across 8 modes…
                </p>
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
                  <CardTitle>Tradeoff matrix</CardTitle>
                  <Badge variant="outline">
                    {result.recommended.distance_km} km · {result.options.length} options
                  </Badge>
                </CardHeader>
                <CardContent>
                  <TradeoffMatrix options={result.options} />
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {result.options.slice(0, 6).map((opt, i) => (
                  <OptionCard
                    key={opt.mode}
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
