"use client";
import { motion } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AIExplanation({
  text,
  source,
  tradeoff,
}: {
  text: string;
  source: "openai" | "fallback";
  tradeoff?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-bg-2/80 to-bg-1/60 p-5"
    >
      <div className="absolute -top-12 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="flex items-center gap-2">
        <div className="grid place-items-center h-7 w-7 rounded-lg bg-accent/15 text-accent">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
          AI Explanation Layer
        </div>
        <Badge variant={source === "openai" ? "intel" : "outline"} className="ml-auto">
          <Cpu className="h-3 w-3" />
          {source === "openai" ? "OpenAI" : "Deterministic fallback"}
        </Badge>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-text">{text}</p>
      {tradeoff && (
        <>
          <div className="my-4 h-px bg-line" />
          <div className="text-[11px] uppercase tracking-[0.18em] text-text-dim">
            Deterministic Tradeoff
          </div>
          <p className="mt-1 text-sm text-text-muted">{tradeoff}</p>
        </>
      )}
    </motion.div>
  );
}
