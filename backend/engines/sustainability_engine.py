"""Sustainability Engine.

Computes deterministic sustainability metrics for transport and food/delivery
decisions using the heuristic coefficients in ``datasets/``.

Design rules:
- Pure functions, no I/O beyond reading cached datasets.
- Returns rich metric dicts so the optimization engine and the AI layer can
  both consume the same structured output.
- Never depends on the AI layer.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from backend.services.dataset_service import load_dataset
from backend.utils.scoring import clamp, round1


# ---------------------------------------------------------------------------
# Transport
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class TransportEvaluation:
    mode: str
    label: str
    category: str
    distance_km: float
    estimated_time_min: float
    estimated_cost: float
    estimated_emissions_g: float
    convenience_score: float
    sustainability_rating: float
    tier: str
    color: str


def _tier_for_rating(tier_defs: dict[str, Any], rating: float) -> tuple[str, str]:
    for tier_name, defn in tier_defs.items():
        lo, hi = defn["rating_range"]
        if lo <= rating <= hi:
            return tier_name, defn["color"]
    return "medium_impact", "#fbbc05"


def _urgency_time_multiplier(urgency: str) -> float:
    return {"low": 1.10, "medium": 1.00, "high": 0.92}.get(urgency, 1.00)


def evaluate_transport_modes(
    distance_km: float,
    urgency: str = "medium",
    candidate_modes: list[str] | None = None,
) -> list[TransportEvaluation]:
    """Evaluate every transport mode for a given trip distance.

    The evaluation is purely heuristic. All "magic numbers" come from
    ``datasets/transport_emissions.json``.
    """
    data = load_dataset("transport_emissions")
    modes = data["modes"]
    tier_defs = data["tier_definitions"]
    time_mult = _urgency_time_multiplier(urgency)

    selected = candidate_modes or list(modes.keys())
    evaluations: list[TransportEvaluation] = []

    for mode_id in selected:
        if mode_id not in modes:
            continue
        m = modes[mode_id]
        emissions_g = m["emission_per_km"] * distance_km
        cost = m["cost_per_km"] * distance_km
        time_min = (distance_km / max(m["avg_speed"], 1)) * 60.0 * time_mult
        tier, color = _tier_for_rating(tier_defs, m["sustainability_rating"])

        evaluations.append(
            TransportEvaluation(
                mode=mode_id,
                label=m["label"],
                category=m["category"],
                distance_km=round1(distance_km),
                estimated_time_min=round1(time_min),
                estimated_cost=round1(cost),
                estimated_emissions_g=round1(emissions_g),
                convenience_score=round1(m["convenience_score"] * 10.0),
                sustainability_rating=float(m["sustainability_rating"]),
                tier=tier,
                color=color,
            )
        )
    return evaluations


def filter_modes_by_distance(distance_km: float, all_modes: list[str]) -> list[str]:
    """Filter out impractical modes given the trip distance.

    Walking past 4 km and biking past 12 km are dropped to keep
    recommendations realistic.
    """
    cutoffs = {"walk": 4.0, "bike": 12.0, "electric_scooter": 18.0}
    return [m for m in all_modes if distance_km <= cutoffs.get(m, 1e9)]


# ---------------------------------------------------------------------------
# Food and delivery
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class FoodEvaluation:
    option_id: str
    label: str
    delivery_type: str
    packaging: str
    distance_km: float
    estimated_time_min: float
    estimated_cost: float
    estimated_emissions_g: float
    sustainability_score: float
    tier: str
    badge: str
    applied_modifiers: list[str]


_BASE_FOOD_DELIVERY_EMISSIONS_PER_KM = 110.0  # grams CO2e per km baseline scooter delivery
_BASE_DELIVERY_TIME_MIN_PER_KM = 3.5
_BASE_DELIVERY_COST = 35.0  # platform delivery fee baseline (INR)


def _food_packaging_modifier(food_data: dict, packaging: str) -> tuple[float, float]:
    pkg = food_data["packaging"][packaging]
    return float(pkg["score_modifier"]), float(pkg["co2_grams_per_order"])


def _food_delivery_modifier(food_data: dict, delivery_type: str) -> float:
    mode_map = {
        "express": "express_under_20min",
        "grouped": "grouped_delivery",
        "scheduled_off_peak": "scheduled_off_peak",
        "standard": "solo_delivery",
    }
    key = mode_map.get(delivery_type, "solo_delivery")
    return float(food_data["delivery_mode"][key]["score_modifier"])


def _food_diet_modifier(food_data: dict, diet: str) -> float:
    return float(food_data["diet_bonuses"][diet]["score_modifier"])


def _food_sourcing_modifier(food_data: dict, distance_km: float) -> float:
    if distance_km <= 5:
        return float(food_data["sourcing"]["local_under_5km"]["score_modifier"])
    if distance_km <= 15:
        return float(food_data["sourcing"]["regional_5_to_15km"]["score_modifier"])
    return float(food_data["sourcing"]["long_distance_over_15km"]["score_modifier"])


def _delivery_emissions_multiplier(delivery_rules: dict, delivery_type: str) -> float:
    mapping = {
        "express": "express_delivery_penalty",
        "standard": "standard_delivery",
        "grouped": "scheduled_eco_window",
        "scheduled_off_peak": "scheduled_eco_window",
    }
    rule = delivery_rules["urgency_modifiers"][mapping.get(delivery_type, "standard_delivery")]
    base = float(rule["co2_multiplier"])
    if delivery_type == "grouped":
        # additionally compound the grouped shipping bonus
        base *= float(delivery_rules["consolidation"]["grouped_shipping_bonus"]["co2_multiplier"])
    return base


def _delivery_time_multiplier(delivery_type: str) -> float:
    return {
        "express": 0.6,
        "standard": 1.0,
        "grouped": 1.25,
        "scheduled_off_peak": 1.15,
    }.get(delivery_type, 1.0)


def _delivery_cost_multiplier(delivery_type: str) -> float:
    return {
        "express": 1.5,
        "standard": 1.0,
        "grouped": 0.7,
        "scheduled_off_peak": 0.85,
    }.get(delivery_type, 1.0)


def _tier_for_food_score(food_data: dict, score: float) -> tuple[str, str]:
    for tier in food_data["sustainability_tiers"]:
        lo, hi = tier["score_range"]
        if lo <= score <= hi:
            return tier["tier"], tier["badge"]
    return "moderate", "leaf_yellow"


def evaluate_food_option(
    *,
    option_id: str,
    label: str,
    restaurant_category: str,
    distance_km: float,
    diet: str,
    packaging: str,
    delivery_type: str,
    plastic_cutlery: bool,
) -> FoodEvaluation:
    """Score a single food delivery option deterministically."""
    food_data = load_dataset("food_impact")
    delivery_rules = load_dataset("delivery_rules")

    base_score = float(
        food_data["restaurant_categories"][restaurant_category]["default_base_score"]
    )

    pkg_modifier, packaging_co2 = _food_packaging_modifier(food_data, packaging)
    delivery_mod = _food_delivery_modifier(food_data, delivery_type)
    diet_mod = _food_diet_modifier(food_data, diet)
    sourcing_mod = _food_sourcing_modifier(food_data, distance_km)

    cutlery_mod = 0.0
    applied: list[str] = [
        f"packaging:{packaging}",
        f"delivery:{delivery_type}",
        f"diet:{diet}",
        "sourcing:" + (
            "local" if distance_km <= 5 else "regional" if distance_km <= 15 else "long_distance"
        ),
    ]
    if plastic_cutlery:
        cutlery_mod = float(food_data["penalties"]["plastic_cutlery_included"]["score_modifier"])
        applied.append("penalty:plastic_cutlery")

    sustainability_score = clamp(
        base_score + pkg_modifier + delivery_mod + diet_mod + sourcing_mod + cutlery_mod
    )

    delivery_co2_per_km = (
        _BASE_FOOD_DELIVERY_EMISSIONS_PER_KM
        * _delivery_emissions_multiplier(delivery_rules, delivery_type)
    )
    estimated_emissions_g = round1(delivery_co2_per_km * distance_km + packaging_co2)
    estimated_time_min = round1(
        15.0 + _BASE_DELIVERY_TIME_MIN_PER_KM * distance_km * _delivery_time_multiplier(delivery_type)
    )
    estimated_cost = round1(_BASE_DELIVERY_COST * _delivery_cost_multiplier(delivery_type))

    tier, badge = _tier_for_food_score(food_data, sustainability_score)

    return FoodEvaluation(
        option_id=option_id,
        label=label,
        delivery_type=delivery_type,
        packaging=packaging,
        distance_km=round1(distance_km),
        estimated_time_min=estimated_time_min,
        estimated_cost=estimated_cost,
        estimated_emissions_g=estimated_emissions_g,
        sustainability_score=round1(sustainability_score),
        tier=tier,
        badge=badge,
        applied_modifiers=applied,
    )


def packaging_impact_label(score: float) -> str:
    if score >= 80:
        return "very_low"
    if score >= 65:
        return "low"
    if score >= 50:
        return "moderate"
    if score >= 35:
        return "high"
    return "critical"
