import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-line bg-bg-1/80 px-3 py-2 text-sm text-text placeholder:text-text-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50 tabular",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
