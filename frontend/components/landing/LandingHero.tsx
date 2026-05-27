"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-backdrop absolute inset-0 -z-10" />
      <div className="container py-20 lg:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="accent" className="mx-auto">
            <Sparkles className="h-3 w-3" />
            Real-Time Decision Infrastructure
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-4xl text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          Sustainability intelligence,
          <br />
          <span className="text-gradient">computed at decision time.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted leading-relaxed"
        >
          SustainRoute AI is a multi-objective decision engine that balances
          sustainability, cost, time, and convenience for everyday transport,
          food, and delivery decisions — and explains every recommendation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/dashboard">
              Open platform
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/transport">Run a transport optimization</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line/60"
        >
          {[
            { v: "−72%", l: "emissions vs solo cab" },
            { v: "+8 min", l: "average time delta" },
            { v: "92/100", l: "balanced final score" },
          ].map((item, i) => (
            <div key={i} className="bg-bg-1/70 p-5 text-center">
              <div className="text-2xl font-semibold tabular text-text">{item.v}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">
                {item.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
