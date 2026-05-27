import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCurrency(value: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatGrams(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)} kg`;
  return `${Math.round(value)} g`;
}

export function formatMinutes(value: number): string {
  const m = Math.round(value);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}

export function tierColor(tier: string): string {
  const map: Record<string, string> = {
    minimal_impact: "#34d399",
    low_impact: "#22c55e",
    medium_impact: "#f59e0b",
    high_impact: "#ef4444",
    leader: "#34d399",
    advanced: "#22c55e",
    moderate: "#f59e0b",
    lagging: "#f97316",
    critical: "#ef4444",
  };
  return map[tier] || "#94a3b8";
}
