"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Item = { icon: LucideIcon; title: string; description: string };

export function FeatureGrid({ items }: { items: Item[] }) {
  return (
    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: i * 0.04 }}
            className="group relative overflow-hidden rounded-2xl border border-line bg-bg-1/60 p-5 hover:border-accent/40 transition-all"
          >
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent/0 blur-3xl group-hover:bg-accent/15 transition-all" />
            <div className="relative">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-bg-2 border border-line">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <div className="mt-4 text-lg font-medium tracking-tight">
                {item.title}
              </div>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
