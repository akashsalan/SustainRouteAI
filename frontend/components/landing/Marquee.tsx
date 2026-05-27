const PHRASES = [
  "Multi-Objective Optimization",
  "Deterministic Scoring",
  "Explainable Recommendations",
  "Versioned Sustainability Datasets",
  "AI Explanation Layer",
  "City-Scale Impact Projections",
  "Real-Time Decision Intelligence",
  "Profile-Aware Tradeoffs",
];

export function Marquee() {
  return (
    <section className="border-y border-line bg-bg-1/40 py-5 overflow-hidden">
      <div className="marquee text-text-dim text-xs uppercase tracking-[0.22em]">
        {[...PHRASES, ...PHRASES].map((p, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}
