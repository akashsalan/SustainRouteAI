import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-r from-bg-2 via-bg-3 to-bg-2 bg-[length:1000px_100%] animate-shimmer",
        className
      )}
    />
  );
}
