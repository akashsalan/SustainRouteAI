import { cn } from "@/lib/utils";

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid place-items-center h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-emerald-400 text-bg-0 font-bold shadow-[0_8px_30px_-8px_hsl(152_76%_50%_/_0.7)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            d="M3 12c4 0 6-3 9-3s4 3 9 3M3 6c4 0 6-3 9-3s4 3 9 3M3 18c4 0 6-3 9-3s4 3 9 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-semibold tracking-tight text-text">
          SustainRoute<span className="text-accent">.</span>AI
        </span>
      )}
    </div>
  );
}
