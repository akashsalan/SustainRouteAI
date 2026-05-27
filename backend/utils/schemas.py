"""Pydantic schemas for request and response payloads.

These schemas define the public API contract of SustainRoute AI. They are
deliberately strict so that the optimization engine receives well-formed
inputs and the frontend can rely on stable, typed responses.
"""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared
# ---------------------------------------------------------------------------

ScoringProfile = Literal[
    "balanced",
    "eco_priority",
    "budget_priority",
    "speed_priority",
    "comfort_priority",
]

UrgencyLevel = Literal["low", "medium", "high"]


class DimensionScores(BaseModel):
    """Normalized 0-100 scores for the four optimization dimensions."""

    sustainability: float = Field(..., ge=0, le=100)
    cost: float = Field(..., ge=0, le=100)
    time: float = Field(..., ge=0, le=100)
    convenience: float = Field(..., ge=0, le=100)


# ---------------------------------------------------------------------------
# Transport optimization
# ---------------------------------------------------------------------------


class TransportRequest(BaseModel):
    source: str = Field(..., min_length=1, max_length=120)
    destination: str = Field(..., min_length=1, max_length=120)
    urgency: UrgencyLevel = "medium"
    profile: ScoringProfile = "balanced"
    distance_km: Optional[float] = Field(
        default=None,
        gt=0,
        le=500,
        description="Optional override. If omitted, the backend estimates distance heuristically.",
    )


class TransportOption(BaseModel):
    mode: str
    label: str
    category: str
    distance_km: float
    estimated_time_min: float
    estimated_cost: float
    estimated_emissions_g: float
    scores: DimensionScores
    final_score: float
    rank: int
    is_recommended: bool
    tier: str
    color: str
    reasoning: list[str]


class TransportResponse(BaseModel):
    request: TransportRequest
    options: list[TransportOption]
    recommended: TransportOption
    profile_weights: dict[str, float]
    ai_explanation: str
    ai_explanation_source: Literal["openai", "fallback"]
    tradeoff_summary: str


# ---------------------------------------------------------------------------
# Food optimization
# ---------------------------------------------------------------------------

DeliveryType = Literal["express", "standard", "grouped", "scheduled_off_peak"]
DietType = Literal["vegan", "vegetarian", "non_vegetarian_poultry", "non_vegetarian_red_meat"]
PackagingType = Literal[
    "plastic_single_use",
    "mixed_plastic_paper",
    "compostable_paper",
    "reusable_container",
]


class FoodRequest(BaseModel):
    restaurant_name: str = Field(..., min_length=1, max_length=120)
    restaurant_category: Literal[
        "certified_eco_kitchen",
        "local_independent",
        "chain_quick_service",
        "cloud_kitchen",
        "premium_dine_in_delivery",
    ] = "local_independent"
    distance_km: float = Field(..., gt=0, le=60)
    diet: DietType = "vegetarian"
    packaging: PackagingType = "mixed_plastic_paper"
    delivery_type: DeliveryType = "standard"
    plastic_cutlery: bool = False
    profile: ScoringProfile = "balanced"


class FoodOption(BaseModel):
    option_id: str
    label: str
    delivery_type: DeliveryType
    packaging: PackagingType
    distance_km: float
    estimated_time_min: float
    estimated_cost: float
    estimated_emissions_g: float
    sustainability_score: float
    scores: DimensionScores
    final_score: float
    rank: int
    is_recommended: bool
    tier: str
    badge: str
    reasoning: list[str]


class FoodResponse(BaseModel):
    request: FoodRequest
    options: list[FoodOption]
    recommended: FoodOption
    baseline: FoodOption
    profile_weights: dict[str, float]
    packaging_impact: str
    ai_explanation: str
    ai_explanation_source: Literal["openai", "fallback"]
    tradeoff_summary: str


# ---------------------------------------------------------------------------
# City impact simulation
# ---------------------------------------------------------------------------


class CityImpactRequest(BaseModel):
    city: Literal["tier_1_metro", "tier_2_city"] = "tier_1_metro"
    scenario: Literal["low_adoption", "medium_adoption", "high_adoption"] = "medium_adoption"


class CityImpactResponse(BaseModel):
    city: str
    city_label: str
    scenario: str
    estimated_users: int
    monthly_projections: dict
    yearly_projections: dict
    transport_shift: dict
    monthly_trend: list[dict]
    kpi_targets: dict
    headline: str


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


class HealthResponse(BaseModel):
    status: Literal["healthy", "degraded"]
    backend: Literal["online", "offline"]
    optimization_engine: Literal["active", "inactive"]
    datasets_loaded: int
    ai_layer: Literal["online", "fallback"]
    version: str
