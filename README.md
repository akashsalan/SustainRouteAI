# SustainRoute AI

**Real-Time Sustainability Decision Infrastructure**

SustainRoute AI is a decision intelligence platform that helps people make
better sustainability choices at the exact moment decisions are made — for
everyday transport, food delivery, and logistics. It is not a carbon
calculator, not a dashboard, and not a chatbot. It is a multi-objective
optimization engine that balances **sustainability**, **cost**, **time**, and
**convenience**, ranks the available options, and explains its recommendation
in human-readable language.

---

## Table of Contents

1. [Problem & Philosophy](#1-problem--philosophy)
2. [What the Product Actually Does](#2-what-the-product-actually-does)
3. [System Architecture](#3-system-architecture)
4. [Repository Layout](#4-repository-layout)
5. [Tech Stack](#5-tech-stack)
6. [Datasets — The Intelligence Foundation](#6-datasets--the-intelligence-foundation)
7. [Backend — Engines, Services, API](#7-backend--engines-services-api)
8. [Scoring & Optimization Logic](#8-scoring--optimization-logic)
9. [AI Explanation Layer](#9-ai-explanation-layer)
10. [API Reference](#10-api-reference)
11. [Frontend — Pages & Components](#11-frontend--pages--components)
12. [Design Language](#12-design-language)
13. [Setup & Running Locally](#13-setup--running-locally)
14. [Configuration & Environment Variables](#14-configuration--environment-variables)
15. [End-to-End Request Flow](#15-end-to-end-request-flow)
16. [Extensibility & Future Scope](#16-extensibility--future-scope)
17. [Hackathon Judging Alignment](#17-hackathon-judging-alignment)

---

## 1. Problem & Philosophy

### The Insight

> Users do not lack concern for sustainability. They lack sustainability
> intelligence at the exact moment decisions are made.

By the time someone reads a carbon report, the choices that produced the
emissions have already been made. SustainRoute AI inverts this: it computes
sustainability tradeoffs *during* decision-making — when a user is choosing
between a cab and the metro, between express and grouped delivery, between
plastic and compostable packaging.

### Design Principles

- **Optimization-first.** The intelligence core is deterministic, explainable,
  and auditable. The AI layer never makes decisions.
- **Multi-objective.** Sustainability never wins by sacrificing cost, time, or
  convenience to unrealistic levels. Every recommendation is balanced.
- **Low-friction.** Recommendations appear inline with the decision. No
  guilt-based nudges, no separate "track your footprint" workflow.
- **Dataset-driven.** Every coefficient, weight, and tier is versioned in
  `datasets/`. Swapping heuristics for verified APIs is a config change, not a
  rewrite.
- **Graceful degradation.** If the AI layer is offline, the platform still
  produces deterministic explanations.

---

## 2. What the Product Actually Does

The platform spans three decision domains and one collective view.

| Domain                  | Inputs                                                                           | Output                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Transport optimization  | source, destination, urgency, scoring profile                                    | Ranked list of up to 8 transport modes with sustainability/cost/time/convenience breakdown      |
| Food delivery           | restaurant, distance, diet, packaging, delivery type, plastic cutlery flag       | Your selection plus 3 sustainability-leaning alternatives, ranked                               |
| Logistics rules         | (composed inside food endpoint via `delivery_rules.json`)                        | Packaging, fleet, urgency, and consolidation modifiers feeding the food/delivery score          |
| City impact simulation  | city tier, adoption scenario                                                     | Monthly + yearly CO₂, fuel, packaging, tree-equivalent projections; transport-shift breakdown   |

Plus a recommendation analytics view for operators to see acceptance rate,
profile distribution, and recommended-vs-baseline radar.

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                    │
│   Landing · Dashboard · Transport · Food · City · Stats   │
└──────────────────────────────┬───────────────────────────┘
                               │ /api/* rewrites
                               ▼
┌──────────────────────────────────────────────────────────┐
│                    FastAPI API Layer                      │
│   routes_transport · routes_food · routes_city · health   │
└──────────────────────────────┬───────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────┐
│                   Sustainability Engine                   │
│   transport scoring · food scoring · packaging analysis   │
└──────────────────────────────┬───────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────┐
│                    Optimization Engine                    │
│   weighted blend · profile selection · normalized rank    │
└──────────────────────────────┬───────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────┐
│                  Recommendation Engine                    │
│   reasoning · tradeoff summary · frontend-ready objects   │
└──────────────────────────────┬───────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────┐
│              AI Explanation Service (OpenAI)              │
│      premium one-line rationale · deterministic fallback  │
└──────────────────────────────────────────────────────────┘
```

The pipeline is strictly one-way: each layer consumes the output of the layer
above it and never reaches across boundaries. The AI layer is a leaf — failure
there cannot break optimization.

---

## 4. Repository Layout

```
sustainroute-ai/
├── README.md                      ← you are here
├── PROJECT_VISION.md
├── .env                           ← OPENAI_API_KEY etc. (not committed)
│
├── datasets/                      ← versioned heuristic intelligence
│   ├── transport_emissions.json
│   ├── food_impact.json
│   ├── delivery_rules.json
│   ├── sustainability_weights.json
│   ├── city_simulation.json
│   ├── transport_route_samples.json
│   └── recommendation_templates.json
│
├── docs/                          ← source-of-truth product docs
│   ├── architecture.md
│   ├── system_design.md
│   ├── scoring_logic.md
│   ├── user_flow.md
│   └── api_flow.md
│
├── backend/                       ← FastAPI service
│   ├── main.py                    ← app entrypoint
│   ├── requirements.txt
│   ├── api/                       ← HTTP routes (thin orchestration only)
│   │   ├── routes_health.py
│   │   ├── routes_transport.py
│   │   ├── routes_food.py
│   │   └── routes_city.py
│   ├── engines/                   ← deterministic intelligence core
│   │   ├── sustainability_engine.py
│   │   ├── optimization_engine.py
│   │   └── recommendation_engine.py
│   ├── services/                  ← side-effect boundary
│   │   ├── dataset_service.py
│   │   ├── geo_service.py
│   │   └── ai_service.py
│   └── utils/                     ← pure helpers
│       ├── schemas.py             ← pydantic API contract
│       └── scoring.py             ← clamp / normalize / invert
│
└── frontend/                      ← Next.js 15 App Router
    ├── package.json
    ├── next.config.mjs            ← /api/* → backend rewrite
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── app/                       ← routes
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx               ← landing
    │   ├── dashboard/page.tsx
    │   ├── transport/page.tsx
    │   ├── food/page.tsx
    │   ├── city-impact/page.tsx
    │   └── analytics/page.tsx
    ├── components/
    │   ├── app/                   ← shell (sidebar, topbar, logo)
    │   ├── ui/                    ← shadcn-style primitives
    │   ├── product/               ← shared product components
    │   ├── landing/               ← hero, marquee, architecture diagram
    │   ├── dashboard/             ← KPIs, trend chart, profile chart
    │   ├── transport/             ← option card, tradeoff matrix
    │   ├── food/                  ← food option card
    │   └── city/                  ← adoption + transport-shift charts
    └── lib/
        ├── api.ts                 ← typed API client
        ├── types.ts               ← schema mirror
        └── utils.ts
```

---

## 5. Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| Frontend     | Next.js 15 (App Router), TypeScript, Tailwind CSS           |
| UI primitives| Radix UI + shadcn-style components, Framer Motion, Recharts |
| Icons        | lucide-react                                                |
| Backend      | Python 3.10+, FastAPI, Pydantic v2, Uvicorn                 |
| AI Layer     | OpenAI Python SDK (default model: `gpt-4o-mini`)            |
| Data         | Versioned JSON datasets in `datasets/`                      |
| Dev tooling  | python-dotenv, httpx (TestClient)                           |

There is intentionally no database, no auth, no queue. The hackathon scope is
*decision intelligence*. Persistence and identity are out of scope.

---

## 6. Datasets — The Intelligence Foundation

All datasets live in `datasets/` and are loaded once at process start by
`backend/services/dataset_service.py` (LRU-cached). They are the single source
of every coefficient used by the optimization core.

### `transport_emissions.json`

Heuristic per-mode coefficients for 8 transport modes
(`solo_cab`, `pool_cab`, `metro`, `bus`, `bike`, `walk`, `electric_scooter`,
`train`).

Each mode carries:

- `emission_per_km` (g CO₂e per passenger-km)
- `cost_per_km` (INR per passenger-km)
- `convenience_score` (0–10)
- `avg_speed` (km/h)
- `occupancy_factor`
- `sustainability_rating` (0–100)
- `tier` (`minimal_impact` / `low_impact` / `medium_impact` / `high_impact`)

Plus `tier_definitions` mapping tier → rating range → display color, used
verbatim by frontend chips and chart bars.

### `food_impact.json`

Additive sustainability modifiers applied to a base score per restaurant
category. Modifier groups:

- `packaging` — single-use plastic, mixed plastic + paper, compostable, reusable
- `sourcing` — local (≤5 km), regional (5–15 km), long distance (>15 km)
- `delivery_mode` — grouped, solo, express, scheduled off-peak
- `diet_bonuses` — vegan, vegetarian, poultry, red meat
- `penalties` — double packaging, plastic cutlery, disposable thermal liner
- `sustainability_tiers` — `leader` / `advanced` / `moderate` / `lagging` / `critical`
- `restaurant_categories` — eco kitchen, local independent, chain QSR, cloud
  kitchen, premium dine-in (each with a `default_base_score`)

### `delivery_rules.json`

Logistics modifiers used both directly and indirectly via the food endpoint:

- `urgency_modifiers` — same-day, express, standard, scheduled eco window
- `consolidation` — grouped shipping, neighborhood batch
- `packaging` — minimal, recycled, reusable tote, excess penalty
- `warehouse_logistics` — distance penalty, micro-fulfillment bonus
- `fleet` — electric, cargo bike, ICE baseline, diesel truck
- `delivery_efficiency_tiers` — platinum / gold / silver / bronze / non-compliant

### `sustainability_weights.json`

Five weight profiles, each summing to 1.0:

| Profile            | Sustainability | Cost | Time | Convenience |
| ------------------ | -------------: | ---: | ---: | ----------: |
| `balanced`         | 0.40           | 0.30 | 0.20 | 0.10        |
| `eco_priority`     | 0.65           | 0.15 | 0.10 | 0.10        |
| `budget_priority`  | 0.20           | 0.55 | 0.15 | 0.10        |
| `speed_priority`   | 0.15           | 0.15 | 0.60 | 0.10        |
| `comfort_priority` | 0.20           | 0.20 | 0.20 | 0.40        |

The `balanced` profile mirrors the documented default
(`docs/scoring_logic.md`).

### `city_simulation.json`

Heuristic city-scale projections.

- Two cities: `tier_1_metro`, `tier_2_city`
- Three scenarios per city: `low_adoption`, `medium_adoption`, `high_adoption`
- For each: estimated users, monthly + yearly projections (CO₂, fuel,
  packaging, trees-equivalent), transport-shift percentages
- 12-month seasonal multipliers used to render trend charts
- KPI targets per 10k users / year

### `transport_route_samples.json`

Six pre-computed scenario fixtures (urban peak, urban short hop, suburban, late
night, urgent airport with profile override, weekend leisure). Used to seed
the demo and as a reference for QA.

### `recommendation_templates.json`

Reusable AI explanation templates with `{{variable}}` placeholders. Grouped by:

- transport recommendations
- food recommendations
- delivery logistics recommendations
- tradeoff explanations
- sustainability nudges
- a generic fallback

These shape the prompt the AI service sends to OpenAI and document the desired
output style.

---

## 7. Backend — Engines, Services, API

### Module-Level Responsibilities

| Module                                   | Responsibility                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| `engines/sustainability_engine.py`       | Per-mode and per-option sustainability/emission/time/cost evaluation       |
| `engines/optimization_engine.py`         | Weighted multi-objective blend; min-max normalization; ranking             |
| `engines/recommendation_engine.py`       | Adds reasoning bullets; tradeoff summary; identifies baseline vs recommended |
| `services/dataset_service.py`            | Locates `datasets/` directory; cached JSON loading                         |
| `services/geo_service.py`                | Heuristic distance estimation (haversine for known nodes, hash fallback)   |
| `services/ai_service.py`                 | OpenAI integration with deterministic fallback                             |
| `utils/schemas.py`                       | Pydantic models — the public API contract                                  |
| `utils/scoring.py`                       | `clamp`, `invert_to_score`, `normalize_min_max`, `round1`                  |
| `api/routes_*.py`                        | Thin HTTP orchestration; no business logic lives here                      |
| `main.py`                                | FastAPI app factory, CORS, router registration                             |

### Why This Split

The router files are deliberately ~30 lines of orchestration. All scoring
math lives in `engines/`, all I/O in `services/`. This keeps the engines
*pure* and easy to reason about, swap, or unit-test.

---

## 8. Scoring & Optimization Logic

### Per-Dimension Scores

Each option is scored on four dimensions, all rescaled so **higher is better**:

- **Sustainability** — drawn directly from dataset coefficients.
- **Cost** — inverted via `100 × (1 − cost / max_cost_in_set)` so cheaper is
  higher. Min-max is applied across the candidate set so the comparison is
  *contextual*.
- **Time** — same inversion as cost.
- **Convenience** — comes from the dataset (transport) or a delivery-type map
  (food).

### Final Score

```
final = w_sus * sustainability + w_cost * cost + w_time * time + w_conv * convenience
```

Weights `w_*` come from the active profile in `sustainability_weights.json`.
Default (`balanced`): `0.40 / 0.30 / 0.20 / 0.10`.

### Ranking

Options are sorted by `final_score` descending. The top option is flagged
`is_recommended: true` and used by the recommendation engine as the headline
result.

### Distance & Practicality Filters

For transport, modes that are impractical at the requested distance are
dropped before scoring (walking past 4 km, biking past 12 km, electric scooter
past 18 km). This prevents nonsensical recommendations like "walk to the
airport".

### Reasoning Generation

The recommendation engine produces 1–4 reasoning bullets per option,
covering:

- whether it's the recommended option
- whether it sits in a sustainability tier extreme
- emission % drop vs baseline (solo cab for transport, user's selection for food)
- cost savings vs baseline
- time delta vs baseline
- packaging / delivery-type specific notes for food

### Tradeoff Summary

A deterministic single sentence such as:

> *Metro cuts emissions by ~72% vs a solo cab, saves about INR 185, with no
> meaningful time penalty.*

This sentence is also the **fallback** used by the AI explanation layer when
OpenAI is unavailable.

---

## 9. AI Explanation Layer

The AI service (`backend/services/ai_service.py`) is the only component that
calls OpenAI. Its scope is intentionally narrow.

### Inputs

A structured analytical context already produced by the deterministic engines
(emission deltas, time deltas, scores, weights, baseline vs recommended).

### Output

One concise, premium product-style sentence (≤220 chars) that quotes the
provided numbers. Tone: calm and analytical. Forbidden tokens include "should",
"must", "planet", "green" — to avoid eco-cliché phrasing.

### Failure Handling

The platform must keep working without the AI layer. If the API key is
missing, the SDK is uninstalled, a network error occurs, or the call times
out, the service returns the deterministic tradeoff summary and tags the
response `ai_explanation_source: "fallback"`.

The frontend visibly distinguishes the two via the badge in the
`AIExplanation` component.

### Why Not Let AI Rank Things

- determinism — the same inputs must always produce the same recommendation
- explainability — every score traces back to a dataset coefficient
- reliability — the platform never depends on a third-party LLM for its
  primary function

---

## 10. API Reference

Base URL: `http://127.0.0.1:8000` (proxied via `/api/*` from the Next.js dev
server).

### `GET /health`

```json
{
  "status": "healthy",
  "backend": "online",
  "optimization_engine": "active",
  "datasets_loaded": 7,
  "ai_layer": "fallback",
  "version": "1.0.0"
}
```

### `GET /profiles`

Returns the full `profiles` block of `sustainability_weights.json`. Used to
populate profile selectors in the UI.

### `GET /sample-routes`

Returns the contents of `transport_route_samples.json` — useful for instant
demo mode.

### `POST /optimize-transport`

Request:

```json
{
  "source": "Indiranagar",
  "destination": "MG Road",
  "urgency": "medium",
  "profile": "balanced",
  "distance_km": null
}
```

Response (truncated):

```json
{
  "request": { "...": "..." },
  "options": [
    {
      "mode": "metro",
      "label": "Metro",
      "category": "rail_transit",
      "distance_km": 8.4,
      "estimated_time_min": 28,
      "estimated_cost": 35,
      "estimated_emissions_g": 252,
      "scores": { "sustainability": 92, "cost": 90, "time": 85, "convenience": 78 },
      "final_score": 88.0,
      "rank": 1,
      "is_recommended": true,
      "tier": "minimal_impact",
      "color": "#0f9d58",
      "reasoning": [
        "Best balanced option across sustainability, cost, time, and convenience.",
        "Top-tier sustainability rating (92/100).",
        "Cuts emissions by ~83% versus a solo cab."
      ]
    }
  ],
  "recommended": { "...": "..." },
  "profile_weights": { "sustainability": 0.4, "cost": 0.3, "time": 0.2, "convenience": 0.1 },
  "ai_explanation": "Taking the metro reduces emissions by ~83% and saves about INR 185 vs a solo cab, with only a few extra minutes of travel time.",
  "ai_explanation_source": "openai",
  "tradeoff_summary": "Metro cuts emissions by ~83% vs a solo cab, saves about INR 185, with no meaningful time penalty."
}
```

### `POST /optimize-food`

Request:

```json
{
  "restaurant_name": "Green Bowl",
  "restaurant_category": "local_independent",
  "distance_km": 4.2,
  "diet": "vegetarian",
  "packaging": "plastic_single_use",
  "delivery_type": "express",
  "plastic_cutlery": true,
  "profile": "balanced"
}
```

Response includes the user's selection plus three sustainability-leaning
alternatives (eco packaging swap, grouped + compostable, reusable +
off-peak), each scored, ranked, and reasoned.

### `GET /city-impact?city=tier_1_metro&scenario=medium_adoption`

Returns the chosen city/scenario plus a 12-month seasonal trend, transport
shift percentages, KPI targets, and a one-line headline projection used as
the demo hero text.

---

## 11. Frontend — Pages & Components

### Pages

| Route           | Purpose                                                                              |
| --------------- | ------------------------------------------------------------------------------------ |
| `/`             | Landing — hero, live optimization preview, architecture diagram, capabilities grid   |
| `/dashboard`    | KPI overview, 12-week avoided-emissions trend, active profile chart, recommendation feed |
| `/transport`    | Live transport optimization. Inputs → ranked options + tradeoff matrix + AI explanation |
| `/food`         | Live food/delivery optimization with packaging and grouped-delivery comparisons      |
| `/city-impact`  | City + scenario tabs; KPIs, monthly trend, transport shift, KPI targets              |
| `/analytics`    | Operator-style view — acceptance rate, profile distribution, recommended-vs-baseline radar |

### Component Layers

- `components/app/` — application chrome
  - `Sidebar.tsx`, `TopBar.tsx`, `AppShell.tsx`, `Logo.tsx`
- `components/ui/` — shadcn-style primitives
  - `button`, `card`, `input`, `label`, `badge`, `select`, `tabs`,
    `separator`, `skeleton`
- `components/product/` — domain components shared across pages
  - `ScoreRing` — animated 0–100 circular indicator
  - `ScoreBars` — per-dimension bar breakdown with weight chips
  - `KpiTile` — KPI card with delta indicator
  - `ProfilePicker` — five-profile segmented control
  - `AIExplanation` — premium AI explanation panel with source badge
- `components/landing/` — landing-page-only components
  - `LandingHero`, `Marquee`, `LiveOptimizationPreview`,
    `ArchitectureDiagram`, `FeatureGrid`
- `components/dashboard/` — `TrendChart`, `ProfileWeightsChart`,
  `RecommendationFeed`
- `components/transport/` — `OptionCard`, `TradeoffMatrix`
- `components/food/` — `FoodOptionCard`
- `components/city/` — `AdoptionTrendChart`, `TransportShiftChart`

### Typed API Client

`frontend/lib/api.ts` exposes a thin typed client (`api.health()`,
`api.optimizeTransport()`, `api.optimizeFood()`, `api.cityImpact()`). All
responses are typed against `frontend/lib/types.ts`, which mirrors the
backend Pydantic schemas.

---

## 12. Design Language

### Tone

Linear / Vercel / Stripe / Notion AI / Tesla dashboard. Premium dark surface,
restrained green accent for sustainability, tabular numerics, glass surfaces,
generous spacing. No cartoon eco motifs, no childish leaf icons.

### Color System (Tailwind)

| Token         | Use                                       |
| ------------- | ----------------------------------------- |
| `bg-bg-0..3`  | Surface scale, dark to slightly lifted    |
| `text` / `text-muted` / `text-dim` | Foreground hierarchy   |
| `accent`      | Sustainability green (`hsl(152 76% 50%)`) |
| `intel`       | AI / informational blue                   |
| `warn`        | Soft amber                                |
| `danger`      | Restrained red                            |
| `line`        | Borders                                   |

### Motion

- Framer Motion for content reveals (`y: 8` → `0`, 300–600 ms easing curves)
- ScoreRing animates `strokeDashoffset` with cubic-bezier
- ScoreBars stagger by 50 ms per dimension
- Marquee loops at 28 s; aurora is a static blur layered behind the page

### Charts

Recharts everywhere. Tooltip styles overridden globally in `globals.css` to
match the dark glass aesthetic. Cartesian grids are dashed at 20% opacity,
no axis lines, tabular tick fonts.

---

## 13. Setup & Running Locally

### Prerequisites

- Python 3.10+
- Node.js 18+ (or 20+ recommended) and npm
- Optional: an `OPENAI_API_KEY` for live AI explanations

### Backend

```bash
# from the repo root
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

Backend will be live at `http://127.0.0.1:8000`. Verify with:

```bash
curl http://127.0.0.1:8000/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend boots at `http://127.0.0.1:3000`. The Next.js dev server proxies
`/api/*` to the backend via the rewrite rule in `next.config.mjs`, so the
client can call `/api/optimize-transport` directly.

### Build

```bash
cd frontend
npm run build
npm start
```

The production build is fully statically rendered for the landing page and
dashboard chrome; data-driven pages render on the client.

---

## 14. Configuration & Environment Variables

`.env` at the repo root:

```env
# Optional. If absent, the AI layer transparently falls back to deterministic
# explanations and the frontend shows "Deterministic fallback" as the source.
OPENAI_API_KEY=sk-...

# Optional model override (default: gpt-4o-mini).
OPENAI_MODEL=gpt-4o-mini

# Optional. Override the auto-detected datasets directory.
SUSTAINROUTE_DATASETS_DIR=
```

Frontend `.env.local` (only if backend lives on a non-default host):

```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

The OpenAI key is read inside `services/ai_service.py` only, never logged,
and never echoed in responses.

---

## 15. End-to-End Request Flow

A `POST /optimize-transport` walk-through:

1. **Frontend** — `app/transport/page.tsx` collects source, destination,
   urgency, profile and calls `api.optimizeTransport()`.
2. **Rewrite** — Next.js forwards `/api/optimize-transport` to FastAPI.
3. **Validation** — Pydantic enforces the `TransportRequest` schema
   (`utils/schemas.py`).
4. **Geo** — `services/geo_service.estimate_distance_km()` returns a haversine
   distance for known places, or a stable hash-derived fallback.
5. **Sustainability Engine** — `evaluate_transport_modes()` reads
   `transport_emissions.json`, computes per-mode time/cost/emissions and tier.
6. **Filtering** — `filter_modes_by_distance()` removes impractical modes
   (walk past 4 km, etc.).
7. **Optimization Engine** — min-max normalizes cost and time across the
   candidate set, blends with the active profile weights, and ranks.
8. **Recommendation Engine** — picks a baseline (solo cab if present), adds
   per-option reasoning bullets, and produces the deterministic tradeoff
   sentence.
9. **AI Service** — sends the structured context to OpenAI; on failure,
   returns the deterministic sentence and tags `source: "fallback"`.
10. **Response** — the frontend renders the AI explanation panel, the
    tradeoff matrix bar chart, and the option cards (each with score ring,
    per-dimension bars, and reasoning bullets).

The full chain is deterministic except for the AI sentence wording.

---

## 16. Extensibility & Future Scope

The system is intentionally modular. Likely next steps:

- **Live data sources** — replace `geo_service` with a Maps API; replace
  per-mode coefficients with verified carbon APIs (e.g. Climatiq).
- **Personalization** — derive profile weights from historical user choices
  rather than picking a preset.
- **More domains** — same pattern works for e-commerce checkout, energy
  routing, smart-home decisions. Add a new `engine` and a new router file.
- **Persistence** — when adoption metrics, streaks, and goals appear, plug in
  a database. Today the platform is intentionally stateless.
- **Auth & multi-tenant** — out of scope for the prototype but trivially
  composable on top of the existing FastAPI app.
- **Real-time pricing/traffic** — feed live signals into the cost and time
  inputs of the sustainability engine. The optimization core does not change.

The dataset structure is already versioned (`_meta.version`, `_meta.last_updated`),
so dataset migrations are explicit.

---

## 17. Hackathon Judging Alignment

| Criterion                           | Where it is demonstrated                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **System Design & Core Logic (30%)** | Clear engine separation; deterministic optimization; weight profiles; min-max normalization; AI is non-blocking      |
| **Problem Understanding (20%)**       | Decision-time intelligence framing in `docs/` and reflected in landing page copy                                     |
| **Innovation & Creativity (20%)**     | Multi-objective scoring with explicit profiles; AI as explanation-only layer; food + transport + city in one engine  |
| **Implementation Quality**            | Typed Pydantic API, typed frontend client, full build passes, end-to-end smoke-tested, graceful AI fallback          |
| **UX Polish**                         | Premium dark design system, animated dashboards, AI panel with source badge, score rings, tradeoff matrix            |
| **Demo Impact**                       | Landing → dashboard → live transport optimization → city impact projection in under 60 seconds                       |

---

### One-Line Pitch

> SustainRoute AI is a real-time decision intelligence layer that ranks
> everyday options on sustainability, cost, time, and convenience — and
> explains every recommendation in one sentence.
