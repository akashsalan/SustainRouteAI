// Mirror of backend response schemas. Kept in sync manually.

export type ScoringProfile =
  | "balanced"
  | "eco_priority"
  | "budget_priority"
  | "speed_priority"
  | "comfort_priority";

export type DimensionScores = {
  sustainability: number;
  cost: number;
  time: number;
  convenience: number;
};

export type TransportOption = {
  mode: string;
  label: string;
  category: string;
  distance_km: number;
  estimated_time_min: number;
  estimated_cost: number;
  estimated_emissions_g: number;
  scores: DimensionScores;
  final_score: number;
  rank: number;
  is_recommended: boolean;
  tier: string;
  color: string;
  reasoning: string[];
};

export type TransportResponse = {
  request: {
    source: string;
    destination: string;
    urgency: "low" | "medium" | "high";
    profile: ScoringProfile;
    distance_km?: number | null;
  };
  options: TransportOption[];
  recommended: TransportOption;
  profile_weights: Record<string, number>;
  ai_explanation: string;
  ai_explanation_source: "openai" | "fallback";
  tradeoff_summary: string;
};

export type FoodOption = {
  option_id: string;
  label: string;
  delivery_type: "express" | "standard" | "grouped" | "scheduled_off_peak";
  packaging:
    | "plastic_single_use"
    | "mixed_plastic_paper"
    | "compostable_paper"
    | "reusable_container";
  distance_km: number;
  estimated_time_min: number;
  estimated_cost: number;
  estimated_emissions_g: number;
  sustainability_score: number;
  scores: DimensionScores;
  final_score: number;
  rank: number;
  is_recommended: boolean;
  tier: string;
  badge: string;
  reasoning: string[];
};

export type FoodResponse = {
  request: {
    restaurant_name: string;
    restaurant_category: string;
    distance_km: number;
    diet: string;
    packaging: string;
    delivery_type: string;
    plastic_cutlery: boolean;
    profile: ScoringProfile;
  };
  options: FoodOption[];
  recommended: FoodOption;
  baseline: FoodOption;
  profile_weights: Record<string, number>;
  packaging_impact: string;
  ai_explanation: string;
  ai_explanation_source: "openai" | "fallback";
  tradeoff_summary: string;
};

export type CityImpactResponse = {
  city: string;
  city_label: string;
  scenario: string;
  estimated_users: number;
  monthly_projections: {
    co2_reduction_tons: number;
    packaging_waste_reduction_kg: number;
    grouped_delivery_adoption_percent: number;
    fuel_saved_liters: number;
  };
  yearly_projections: {
    co2_reduction_tons: number;
    packaging_waste_reduction_kg: number;
    grouped_delivery_adoption_percent: number;
    fuel_saved_liters: number;
    trees_equivalent: number;
  };
  transport_shift: Record<string, number>;
  monthly_trend: {
    month: string;
    co2_reduction_tons: number;
    packaging_waste_reduction_kg: number;
    fuel_saved_liters: number;
  }[];
  kpi_targets: Record<string, number>;
  headline: string;
};

export type HealthResponse = {
  status: "healthy" | "degraded";
  backend: "online" | "offline";
  optimization_engine: "active" | "inactive";
  datasets_loaded: number;
  ai_layer: "online" | "fallback";
  version: string;
};
