"use client";
import { motion } from "framer-motion";
import { CircuitBoard, Cpu, Database, Layers, Sparkles } from "lucide-react";

const NODES: { title: string; description: string; icon: React.ComponentType<{ className?: string }>; tone: "accent" | "intel" | "muted" }[] = [
  {
    title: "Frontend",
    description: "Next.js 15 · App Router",
    icon: Layers,
    tone: "muted",
  },
  {
    title: "API Layer",
    description: "FastAPI orchestration",
    icon: CircuitBoard,
    tone: "muted",
  },
  {
    title: "Sustainability Engine",
    description: "Emission scoring · packaging impact",
    icon: Database,
    tone: "accent",
  },
  {
    title: "Optimization Engine",
    description: "Multi-objective weighted ranking",
    icon: Sparkles,
    tone: "accent",
  },
  {
    title: "Recommendation Engine",
    description: "Reasoning · tradeoff summary",
    icon: Sparkles,
    tone: "accent",
  },
  {
    title: "AI Explanation",
    description: "OpenAI · graceful fallback",
    icon: Cpu,
    tone: "intel",
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="relative rounded-3xl border border-line bg-bg-1/60 p-6 shadow-card overflow-hidden">
      <div className="absolute inset-0 grid-backdrop opacity-40 pointer-events-none" />
      <div className="relative grid sm:grid-cols-2 gap-3">
        {NODES.map((n, i) => {
          const Icon = n.icon;
          const tone =
            n.tone === "accent"
              ? "border-accent/30 bg-accent/5"
              : n.tone === "intel"
              ? "border-intel/30 bg-intel/5"
              : "border-line bg-bg-2/50";
          return (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`rounded-2xl border ${tone} p-4`}
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-dim">
                <Icon className="h-3.5 w-3.5" />
                Layer {i + 1}
              </div>
              <div className="mt-2 font-medium">{n.title}</div>
              <div className="text-sm text-text-muted">{n.description}</div>
            </motion.div>
          );
        })}
      </div>
      <div className="relative mt-6 flex items-center gap-3 text-xs text-text-muted">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <span>flow</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>
      <div className="relative mt-2 text-xs text-text-dim text-center">
        Frontend → API → Sustainability → Optimization → Recommendation → AI
      </div>
    </div>
  );
}
