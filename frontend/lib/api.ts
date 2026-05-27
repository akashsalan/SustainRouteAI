import type {
  CityImpactResponse,
  FoodResponse,
  HealthResponse,
  ScoringProfile,
  TransportResponse,
} from "./types";

// Routed through Next.js rewrites in next.config.mjs.
const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () => request<HealthResponse>("/health"),

  optimizeTransport: (payload: {
    source: string;
    destination: string;
    urgency: "low" | "medium" | "high";
    profile: ScoringProfile;
    distance_km?: number;
  }) =>
    request<TransportResponse>("/optimize-transport", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  optimizeFood: (payload: {
    restaurant_name: string;
    restaurant_category: string;
    distance_km: number;
    diet: string;
    packaging: string;
    delivery_type: string;
    plastic_cutlery: boolean;
    profile: ScoringProfile;
  }) =>
    request<FoodResponse>("/optimize-food", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  cityImpact: (city: string, scenario: string) =>
    request<CityImpactResponse>(
      `/city-impact?city=${encodeURIComponent(city)}&scenario=${encodeURIComponent(scenario)}`
    ),
};
