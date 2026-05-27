"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiTile } from "@/components/product/KpiTile";

const PROFILE_DISTRIBUTION = [
  { profile: "Balanced", count: 1248, color: "#34d399" },
  { profile: "Eco", count: 612, color: "#22c55e" },
  { profile: "Budget", count: 430, color: "#60a5fa" },
  { profile: "Speed", count: 268, color: "#a78bfa" },
  { profile: "Comfort", count: 184, color: "#fbbf24" },
];

const ACCEPTANCE_RATE = [
  { week: "W-12", rate: 58 },
  { week: "W-11", rate: 61 },
  { week: "W-10", rate: 64 },
  { week: "W-9", rate: 66 },
  { week: "W-8", rate: 70 },
  { week: "W-7", rate: 71 },
  { week: "W-6", rate: 73 },
  { week: "W-5", rate: 75 },
  { week: "W-4", rate: 78 },
  { week: "W-3", rate: 81 },
  { week: "W-2", rate: 83 },
  { week: "W-1", rate: 86 },
];

const RADAR = [
  { dim: "Sustainability", recommended: 92, baseline: 24 },
  { dim: "Cost", recommended: 88, baseline: 30 },
  { dim: "Time", recommended: 78, baseline: 95 },
  { dim: "Convenience", recommended: 76, baseline: 90 },
];

export default function AnalyticsPage() {
  return (
    <AppShell title="Recommendation Analytics" subtitle="Operational view of optimization output">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiTile label="Recommendations served" value="2,742" delta={4.6} icon={Sparkles} />
        <KpiTile label="Acceptance rate" value="86%" delta={3.2} icon={Activity} accent="accent" />
        <KpiTile label="Avg final score" value="84" unit="/100" delta={1.8} accent="intel" />
        <KpiTile label="AI fallback rate" value="11%" delta={-2.4} accent="warn" />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Acceptance rate trend</CardTitle>
            <Badge variant="outline">12 weeks</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ACCEPTANCE_RATE} margin={{ top: 10, left: -10, right: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 6" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis domain={[40, 100]} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} width={36} />
                  <Tooltip formatter={(v: number) => [`${v}%`, "acceptance"]} />
                  <Line type="monotone" dataKey="rate" stroke="#34d399" strokeWidth={2.4} dot={{ r: 3, fill: "#34d399" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Recommended vs baseline · radar</CardTitle>
            <p className="text-xs text-text-muted mt-1">Average per-dimension scores across all served recommendations.</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR}>
                  <PolarGrid stroke="#1f2937" />
                  <PolarAngleAxis dataKey="dim" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: "#475569", fontSize: 10 }} angle={30} />
                  <Tooltip />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Radar name="Recommended" dataKey="recommended" stroke="#34d399" fill="#34d399" fillOpacity={0.35} />
                  <Radar name="Baseline" dataKey="baseline" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.18} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile distribution</CardTitle>
            <p className="text-xs text-text-muted mt-1">Profile selected at the moment of decision.</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROFILE_DISTRIBUTION} margin={{ top: 10, left: -10, right: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 6" vertical={false} />
                  <XAxis dataKey="profile" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} width={36} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {PROFILE_DISTRIBUTION.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
