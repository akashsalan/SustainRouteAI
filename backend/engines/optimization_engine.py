"""Multi-Objective Optimization Engine.

This is the deterministic intelligence core of SustainRoute AI. It blends
sustainability, cost, time, and convenience into a single, explainable
final score using weight profiles from
``datasets/sustainability_weights.json``.

The engine never calls the AI layer. The AI layer consumes its output.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from backend.engines.sustainability_engine import FoodEvaluation, TransportEvaluation
from backend.services.dataset_service import load_dataset
from backend.utils.scoring import invert_to_score, normalize_min_max, round1


@dataclass(frozen=True)
class ScoredOption:
    """A generic scored option used by both transport and food paths."""

    key: str
    sustainability: float
    cost: float
    time: float
    convenience: float
    final_score: float


# ---------------------------------------------------------------------------
# Weight profiles
# ---------------------------------------------------------------------------


def get_profile_weights(profile: str = "balanced") -> dict[str, float]:
    """Return the weight dict for a given profile, falling back to balanced."""
    weights_data = load_dataset("sustainability_weights")
    profiles = weights_data["profiles"]
    if profile not in profiles:
        profile = weights_data["_meta"].get("default_profile", "balanced")
    return dict(profiles[profile]["weights"])


def list_profiles() -> dict[str, dict]:
    return load_dataset("sustainability_weights")["profiles"]


# ---------------------------------------------------------------------------
# Core blend
# ---------------------------------------------------------------------------


def _blend(weights: dict[str, float], scores: dict[str, float]) -> float:
    return (
        weights["sustainability"] * scores["sustainability"]
        + weights["cost"] * scores["cost"]
        + weights["time"] * scores["time"]
        + weights["convenience"] * scores["convenience"]
    )


# ---------------------------------------------------------------------------
# Transport
# ---------------------------------------------------------------------------


def optimize_transport(
    evaluations: Iterable[TransportEvaluation],
    profile: str = "balanced",
) -> tuple[list[dict], dict[str, float]]:
    """Rank a list of transport evaluations.

    Returns the ranked options as plain dicts plus the weight profile used.
    Cost and time are normalized contextually so the optimization is fair
    across very different mode mixes (e.g. a walk vs a cab).
    """
    evals = list(evaluations)
    if not evals:
        return [], get_profile_weights(profile)

    weights = get_profile_weights(profile)

    costs = [e.estimated_cost for e in evals]
    times = [e.estimated_time_min for e in evals]

    cost_scores = normalize_min_max(costs, higher_is_better=False)
    time_scores = normalize_min_max(times, higher_is_better=False)

    scored: list[dict] = []
    for ev, cost_s, time_s in zip(evals, cost_scores, time_scores):
        sustainability_s = ev.sustainability_rating
        convenience_s = ev.convenience_score
        scores = {
            "sustainability": sustainability_s,
            "cost": cost_s,
            "time": time_s,
            "convenience": convenience_s,
        }
        final = _blend(weights, scores)
        scored.append(
            {
                "mode": ev.mode,
                "label": ev.label,
                "category": ev.category,
                "distance_km": ev.distance_km,
                "estimated_time_min": ev.estimated_time_min,
                "estimated_cost": ev.estimated_cost,
                "estimated_emissions_g": ev.estimated_emissions_g,
                "scores": {k: round1(v) for k, v in scores.items()},
                "final_score": round1(final),
                "tier": ev.tier,
                "color": ev.color,
            }
        )

    scored.sort(key=lambda x: x["final_score"], reverse=True)
    for idx, opt in enumerate(scored):
        opt["rank"] = idx + 1
        opt["is_recommended"] = idx == 0
    return scored, weights


# ---------------------------------------------------------------------------
# Food
# ---------------------------------------------------------------------------


def optimize_food(
    evaluations: Iterable[FoodEvaluation],
    profile: str = "balanced",
) -> tuple[list[dict], dict[str, float]]:
    """Rank a list of food/delivery evaluations."""
    evals = list(evaluations)
    if not evals:
        return [], get_profile_weights(profile)

    weights = get_profile_weights(profile)

    costs = [e.estimated_cost for e in evals]
    times = [e.estimated_time_min for e in evals]

    cost_scores = normalize_min_max(costs, higher_is_better=False)
    time_scores = normalize_min_max(times, higher_is_better=False)

    # convenience for food is derived from delivery type
    convenience_map = {
        "express": 90.0,
        "standard": 75.0,
        "grouped": 60.0,
        "scheduled_off_peak": 55.0,
    }

    scored: list[dict] = []
    for ev, cost_s, time_s in zip(evals, cost_scores, time_scores):
        sustainability_s = ev.sustainability_score
        convenience_s = convenience_map.get(ev.delivery_type, 65.0)
        scores = {
            "sustainability": sustainability_s,
            "cost": cost_s,
            "time": time_s,
            "convenience": convenience_s,
        }
        final = _blend(weights, scores)
        scored.append(
            {
                "option_id": ev.option_id,
                "label": ev.label,
                "delivery_type": ev.delivery_type,
                "packaging": ev.packaging,
                "distance_km": ev.distance_km,
                "estimated_time_min": ev.estimated_time_min,
                "estimated_cost": ev.estimated_cost,
                "estimated_emissions_g": ev.estimated_emissions_g,
                "sustainability_score": ev.sustainability_score,
                "scores": {k: round1(v) for k, v in scores.items()},
                "final_score": round1(final),
                "tier": ev.tier,
                "badge": ev.badge,
                "applied_modifiers": ev.applied_modifiers,
            }
        )

    scored.sort(key=lambda x: x["final_score"], reverse=True)
    for idx, opt in enumerate(scored):
        opt["rank"] = idx + 1
        opt["is_recommended"] = idx == 0
    return scored, weights


# ---------------------------------------------------------------------------
# Tradeoff helpers (used by recommendation engine and AI layer)
# ---------------------------------------------------------------------------


def emission_reduction_percent(reference_g: float, target_g: float) -> float:
    if reference_g <= 0:
        return 0.0
    return round1(max(0.0, (reference_g - target_g) / reference_g * 100.0))


def cost_savings(reference_cost: float, target_cost: float) -> float:
    return round1(max(0.0, reference_cost - target_cost))


def time_delta_min(reference_min: float, target_min: float) -> float:
    """Positive value means the target is slower."""
    return round1(target_min - reference_min)
