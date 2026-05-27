"""Recommendation Engine.

Turns the raw output of the optimization engine into frontend-ready
recommendation objects with reasoning, a tradeoff summary, and the inputs
the AI explanation layer needs.

This engine is still fully deterministic. The AI layer is invoked by the
API router after the recommendation engine has produced its output.
"""
from __future__ import annotations

from backend.engines.optimization_engine import (
    cost_savings,
    emission_reduction_percent,
    time_delta_min,
)


# ---------------------------------------------------------------------------
# Reasoning generators
# ---------------------------------------------------------------------------


def _transport_reasoning(option: dict, baseline: dict | None) -> list[str]:
    reasons: list[str] = []
    s = option["scores"]

    if option["is_recommended"]:
        reasons.append("Best balanced option across sustainability, cost, time, and convenience.")

    if s["sustainability"] >= 85:
        reasons.append(f"Top-tier sustainability rating ({int(s['sustainability'])}/100).")
    elif s["sustainability"] <= 30:
        reasons.append(f"Low sustainability rating ({int(s['sustainability'])}/100).")

    if option["estimated_emissions_g"] == 0:
        reasons.append("Zero direct emissions on this trip.")

    if baseline and option["mode"] != baseline["mode"]:
        emission_drop = emission_reduction_percent(
            baseline["estimated_emissions_g"], option["estimated_emissions_g"]
        )
        if emission_drop >= 30:
            reasons.append(
                f"Cuts emissions by ~{int(emission_drop)}% versus a solo cab."
            )
        money_saved = cost_savings(baseline["estimated_cost"], option["estimated_cost"])
        if money_saved >= 25:
            reasons.append(f"Saves about INR {int(money_saved)} versus a solo cab.")
        time_diff = time_delta_min(baseline["estimated_time_min"], option["estimated_time_min"])
        if -5 <= time_diff <= 10:
            reasons.append("Travel time stays competitive with the fastest option.")
        elif time_diff > 15:
            reasons.append(f"Adds about {int(time_diff)} min versus a solo cab.")
    return reasons


def _food_reasoning(option: dict, baseline: dict | None) -> list[str]:
    reasons: list[str] = []

    if option["is_recommended"]:
        reasons.append("Best balanced delivery option for your profile.")

    if option["sustainability_score"] >= 85:
        reasons.append("Sustainability leader tier.")
    elif option["sustainability_score"] <= 45:
        reasons.append("High-impact delivery configuration.")

    if option["delivery_type"] == "grouped":
        reasons.append("Batched with nearby orders to amortize delivery emissions.")
    if option["delivery_type"] == "express":
        reasons.append("Express dispatch increases per-order emissions.")
    if option["packaging"] == "reusable_container":
        reasons.append("Reusable container effectively eliminates packaging waste.")
    elif option["packaging"] == "compostable_paper":
        reasons.append("Compostable packaging instead of single-use plastic.")
    elif option["packaging"] == "plastic_single_use":
        reasons.append("Single-use plastic packaging adds avoidable waste.")

    if baseline and option["option_id"] != baseline["option_id"]:
        emission_drop = emission_reduction_percent(
            baseline["estimated_emissions_g"], option["estimated_emissions_g"]
        )
        if emission_drop >= 20:
            reasons.append(
                f"Cuts delivery emissions by ~{int(emission_drop)}% versus the baseline."
            )
        time_diff = time_delta_min(
            baseline["estimated_time_min"], option["estimated_time_min"]
        )
        if -3 <= time_diff <= 8:
            reasons.append("Delivery time stays close to the fastest option.")
    return reasons


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def enrich_transport_recommendations(options: list[dict]) -> tuple[list[dict], dict]:
    """Annotate ranked transport options with reasoning. Returns (options, recommended)."""
    if not options:
        return [], {}
    # Baseline is the solo_cab if present, else the highest-emission option.
    baseline = next((o for o in options if o["mode"] == "solo_cab"), None)
    if baseline is None:
        baseline = max(options, key=lambda o: o["estimated_emissions_g"])

    enriched: list[dict] = []
    for opt in options:
        clone = dict(opt)
        clone["reasoning"] = _transport_reasoning(opt, baseline)
        enriched.append(clone)

    recommended = next(o for o in enriched if o["is_recommended"])
    return enriched, recommended


def enrich_food_recommendations(options: list[dict]) -> tuple[list[dict], dict, dict]:
    """Annotate food options with reasoning. Returns (options, recommended, baseline)."""
    if not options:
        return [], {}, {}
    # Baseline = the user's submitted configuration (option_id="user_choice").
    baseline = next((o for o in options if o["option_id"] == "user_choice"), options[0])

    enriched: list[dict] = []
    for opt in options:
        clone = dict(opt)
        clone["reasoning"] = _food_reasoning(opt, baseline)
        enriched.append(clone)

    recommended = next(o for o in enriched if o["is_recommended"])
    baseline_enriched = next(
        (o for o in enriched if o["option_id"] == baseline["option_id"]), enriched[0]
    )
    return enriched, recommended, baseline_enriched


# ---------------------------------------------------------------------------
# Tradeoff summary (deterministic, also used as AI fallback seed)
# ---------------------------------------------------------------------------


def transport_tradeoff_summary(recommended: dict, baseline: dict) -> str:
    if recommended["mode"] == baseline["mode"]:
        return (
            f"{recommended['label']} is the strongest balanced option for this trip "
            f"with a final score of {recommended['final_score']}/100."
        )
    drop = emission_reduction_percent(
        baseline["estimated_emissions_g"], recommended["estimated_emissions_g"]
    )
    time_diff = time_delta_min(baseline["estimated_time_min"], recommended["estimated_time_min"])
    money = cost_savings(baseline["estimated_cost"], recommended["estimated_cost"])
    parts = [f"{recommended['label']} cuts emissions by ~{int(drop)}% vs a solo cab"]
    if money > 0:
        parts.append(f"saves about INR {int(money)}")
    if time_diff <= 5:
        parts.append("with no meaningful time penalty")
    elif time_diff <= 15:
        parts.append(f"for only ~{int(time_diff)} extra minutes")
    else:
        parts.append(f"with about {int(time_diff)} extra minutes")
    return ", ".join(parts) + "."


def food_tradeoff_summary(recommended: dict, baseline: dict) -> str:
    if recommended["option_id"] == baseline["option_id"]:
        return (
            f"Your current selection scores {recommended['final_score']}/100. "
            "It is already the best balanced option in this comparison."
        )
    drop = emission_reduction_percent(
        baseline["estimated_emissions_g"], recommended["estimated_emissions_g"]
    )
    time_diff = time_delta_min(baseline["estimated_time_min"], recommended["estimated_time_min"])
    parts = [f"{recommended['label']} reduces delivery emissions by ~{int(drop)}%"]
    if time_diff <= 3:
        parts.append("with no meaningful delivery delay")
    else:
        parts.append(f"with about {int(time_diff)} extra minutes of delivery time")
    return ", ".join(parts) + "."
