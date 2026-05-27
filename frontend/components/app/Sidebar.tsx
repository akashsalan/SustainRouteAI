"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CarFront,
  Globe2,
  LayoutDashboard,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transport", label: "Transport", icon: CarFront },
  { href: "/food", label: "Food Delivery", icon: UtensilsCrossed },
  { href: "/city-impact", label: "City Impact", icon: Globe2 },
  { href: "/analytics", label: "Analytics", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-line bg-bg-1/70 backdrop-blur-md">
      <div className="px-5 py-5 border-b border-line">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">
          Decision Intelligence
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                active
                  ? "bg-bg-2 text-text border border-line shadow-card"
                  : "text-text-muted hover:text-text hover:bg-bg-2/60"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-accent" : "")} />
              <span>{label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_hsl(152_76%_50%)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-line bg-bg-2/60 p-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-dim">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          AI Layer
        </div>
        <p className="mt-1 text-xs text-text-muted leading-relaxed">
          Optimization is deterministic. The AI layer only translates results into
          human-readable explanations.
        </p>
      </div>
    </aside>
  );
}
