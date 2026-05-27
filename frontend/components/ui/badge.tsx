import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "intel" | "warn" | "danger" | "outline";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    default: "bg-bg-2 text-text-muted border border-line",
    accent: "bg-accent/10 text-accent border border-accent/30",
    intel: "bg-intel/10 text-intel border border-intel/30",
    warn: "bg-warn/10 text-warn border border-warn/30",
    danger: "bg-danger/10 text-danger border border-danger/30",
    outline: "border border-line text-text-muted",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
