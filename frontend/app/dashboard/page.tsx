"use client";
import Link from "next/link";
import {
  ArrowRight,
  CarFront,
  Globe2,
  Layers,
  Leaf,
  Sparkles,
  TrendingDown,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { KpiTile } from "@/components/product/KpiTile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileWeightsChart } from "@/components/dashboard/ProfileWeightsChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RecommendationFeed } from "@/components/dashboard/RecommendationFeed";

export default function DashboardPage() {
  return (
    <AppShell
      title="Decision Intelligence"
      subtitle="Live optimization snapshot across all decision domains"
    >
      <div className="space-y-8">
        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiTile
            label="CO₂ avoided · today"
            value="284"
            unit="kg"
            delta={12.4}
            deltaLabel="vs last 7 days"
            icon={Leaf}
            accent="accent"
          />
          <KpiTile
            label="Decisions optimized"
            value="1,248"
            delta={6.8}
            deltaLabel="vs last 7 days"
            icon={Sparkles}
            accent="intel"
          />
          <KpiTile
            label="Avg final score"
            value="84"
            unit="/100"
            delta={2.1}
            deltaLabel="balanced profile"
            icon={Layers}
            accent="accent"
          />
          <KpiTile
            label="Cost saved · today"
            value="₹38,420"
            delta={9.2}
            icon={Wallet}
            accent="warn"
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Avoided emissions · last 12 weeks</CardTitle>
                <p className="text-xs text-text-muted mt-1">
                  Aggregated across transport and delivery decisions
                </p>
              </div>
              <Badge variant="accent">
                <TrendingDown className="h-3 w-3" />
                −18% week over week
              </Badge>
            </CardHeader>
            <CardContent>
              <TrendChart />
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Active scoring profile</CardTitle>
              <p className="text-xs text-text-muted mt-1">
                Default weighting per scoring_logic.md
              </p>
            </CardHeader>
            <CardContent>
              <ProfileWeightsChart />
              <p className="mt-4 text-xs text-text-muted leading-relaxed">
                Sustainability is the dominant signal, but cost, time, and
                convenience prevent recommendations from becoming impractical.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recommendation feed</CardTitle>
              <Badge variant="outline">live</Badge>
            </CardHeader>
            <CardContent>
              <RecommendationFeed />
            </CardContent>
          </Card>

          <div className="lg:col-span-5 space-y-4">
            <ShortcutCard
              icon={CarFront}
              title="Transport optimization"
              description="Compare 8 modes for your next trip and view full tradeoffs."
              href="/transport"
            />
            <ShortcutCard
              icon={UtensilsCrossed}
              title="Food delivery"
              description="Score packaging, sourcing distance, and grouped delivery."
              href="/food"
            />
            <ShortcutCard
              icon={Globe2}
              title="City impact simulation"
              description="Project monthly and yearly outcomes at scale."
              href="/city-impact"
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ShortcutCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-line bg-bg-1/60 p-5 hover:border-accent/40 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-bg-2 border border-line">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium">{title}</div>
            <ArrowRight className="h-4 w-4 text-text-dim group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="mt-1 text-sm text-text-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
