"use client";
import Link from "next/link";
import {
  ArrowRight,
  CarFront,
  CircuitBoard,
  Cpu,
  Database,
  Globe2,
  LineChart,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LandingHero } from "@/components/landing/LandingHero";
import { LiveOptimizationPreview } from "@/components/landing/LiveOptimizationPreview";
import { ArchitectureDiagram } from "@/components/landing/ArchitectureDiagram";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Marquee } from "@/components/landing/Marquee";

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-bg-0/70 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-text-muted">
            <Link href="#product" className="hover:text-text">Product</Link>
            <Link href="#architecture" className="hover:text-text">Architecture</Link>
            <Link href="#impact" className="hover:text-text">Impact</Link>
            <Link href="/dashboard" className="hover:text-text">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/transport">Try transport demo</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard">
                Open platform
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <LandingHero />

      {/* Trust marquee */}
      <Marquee />

      {/* PRODUCT SECTION */}
      <section id="product" className="relative py-24 lg:py-32">
        <div className="container grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <Badge variant="accent">
              <Sparkles className="h-3 w-3" />
              The product
            </Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-semibold tracking-tight">
              Sustainability intelligence at the moment of decision.
            </h2>
            <p className="mt-4 text-text-muted text-lg leading-relaxed">
              SustainRoute AI does not lecture, score, or shame. It compares the
              real options in front of you in real time and surfaces the best
              balanced choice — across sustainability, cost, time, and
              convenience.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat value="0.4 / 0.3 / 0.2 / 0.1" label="Default weighting" />
              <Stat value="Deterministic" label="Optimization core" />
              <Stat value="Explainable" label="AI layer" />
              <Stat value="7 datasets" label="Intelligence base" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <LiveOptimizationPreview />
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl">
            <Badge variant="intel">
              <CircuitBoard className="h-3 w-3" />
              Capabilities
            </Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-semibold tracking-tight">
              One decision layer. Three core domains.
            </h2>
            <p className="mt-3 text-text-muted">
              Built as infrastructure: modular, dataset-driven, and ready to
              extend into adjacent decisions.
            </p>
          </div>
          <FeatureGrid
            items={[
              {
                icon: CarFront,
                title: "Transport optimization",
                description:
                  "Compares 8 transport modes on a contextual route. Recommends the best balanced option for the chosen profile.",
              },
              {
                icon: UtensilsCrossed,
                title: "Food & delivery",
                description:
                  "Scores packaging, sourcing distance, grouped delivery, and delivery speed against your selection.",
              },
              {
                icon: Globe2,
                title: "City impact simulation",
                description:
                  "Projects collective monthly and yearly impact for low, medium, and high adoption scenarios.",
              },
              {
                icon: LineChart,
                title: "Multi-objective optimization",
                description:
                  "Five built-in weight profiles. Every score is explainable down to a per-dimension breakdown.",
              },
              {
                icon: Cpu,
                title: "AI explanation layer",
                description:
                  "OpenAI is used only to translate optimization output into human-readable insight, never to make decisions.",
              },
              {
                icon: Database,
                title: "Dataset-driven core",
                description:
                  "Heuristic coefficients are versioned, modular, and ready to be replaced with verified APIs.",
              },
            ]}
          />
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="py-24 lg:py-32 bg-bg-1/40 border-y border-line">
        <div className="container grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Badge variant="outline">Architecture</Badge>
            <h2 className="mt-4 text-3xl lg:text-4xl font-semibold tracking-tight">
              Optimization-first. AI is the explanation layer.
            </h2>
            <p className="mt-4 text-text-muted leading-relaxed">
              Decisions are deterministic. Sustainability and tradeoffs are
              calculated from versioned datasets and weighted profiles. The AI
              layer only translates optimization output into product-grade
              language. If the AI is unavailable, every recommendation still
              ships.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Frontend → FastAPI orchestration",
                "Sustainability engine → emission and impact scoring",
                "Optimization engine → multi-objective weighted ranking",
                "Recommendation engine → reasoning + tradeoff summary",
                "AI service → premium natural-language explanation",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(152_76%_50%)]" />
                  <span className="text-text">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      {/* CITY IMPACT TEASER */}
      <section id="impact" className="py-24 lg:py-32">
        <div className="container text-center max-w-3xl mx-auto">
          <Badge variant="accent">
            <Globe2 className="h-3 w-3" />
            City impact
          </Badge>
          <h2 className="mt-4 text-3xl lg:text-5xl font-semibold tracking-tight">
            One choice scales into a city-wide outcome.
          </h2>
          <p className="mt-4 text-text-muted text-lg leading-relaxed">
            Every recommendation contributes to a deterministic city projection.
            Watch the simulation move from individual decision to collective
            impact.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/city-impact">
                Open city simulation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-dim">
          <Logo />
          <div>
            Real-Time Sustainability Decision Infrastructure · v1.0
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-1/60 p-4">
      <div className="text-base font-medium text-text">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-text-dim">
        {label}
      </div>
    </div>
  );
}
