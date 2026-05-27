"""POST /optimize-food.

Compares the user's current food/delivery configuration against three
sustainability-leaning alternatives. The optimization engine then ranks
them on the chosen weight profile.
"""
from __future__ import annotations

from fastapi import APIRouter

from backend.engines.optimization_engine import optimize_food
from backend.engines.recommendation_engine import (
    enrich_food_recommendations,
    food_tradeoff_summary,
)
from backend.engines.sustainability_engine import (
    evaluate_food_option,
    packaging_impact_label,
)
from backend.services.ai_service import explain_food
from backend.utils.schemas import FoodRequest, FoodResponse

router = APIRouter(tags=["food"])


def _candidate_set(req: FoodRequest):
    """Generate four delivery configurations to compare.

    1. The user's exact selection (baseline).
    2. Same restaurant, eco packaging swap.
    3. Grouped delivery with eco packaging.
    4. Reusable container with scheduled off-peak delivery.
    """
    base = dict(
        restaurant_category=req.restaurant_category,
        distance_km=req.distance_km,
        diet=req.diet,
        plastic_cutlery=req.plastic_cutlery,
    )
    return [
        evaluate_food_option(
            option_id="user_choice",
            label=f"Your selection — {req.restaurant_name}",
            packaging=req.packaging,
            delivery_type=req.delivery_type,
            **base,
        ),
        evaluate_food_option(
            option_id="eco_packaging_swap",
            label="Eco packaging swap",
            packaging="compostable_paper",
            delivery_type=req.delivery_type,
            **base,
        ),
        evaluate_food_option(
            option_id="grouped_eco",
            label="Grouped delivery + compostable packaging",
            packaging="compostable_paper",
            delivery_type="grouped",
            **base,
        ),
        evaluate_food_option(
            option_id="reusable_off_peak",
            label="Reusable container + off-peak window",
            packaging="reusable_container",
            delivery_type="scheduled_off_peak",
            **{**base, "plastic_cutlery": False},
        ),
    ]


@router.post("/optimize-food", response_model=FoodResponse)
def optimize_food_endpoint(request: FoodRequest) -> FoodResponse:
    evaluations = _candidate_set(request)
    ranked, weights = optimize_food(evaluations, request.profile)
    enriched, recommended, baseline = enrich_food_recommendations(ranked)

    tradeoff = food_tradeoff_summary(recommended, baseline)
    ai_text, ai_source = explain_food(
        recommended=recommended,
        baseline=baseline,
        profile=request.profile,
        weights=weights,
    )
    impact = packaging_impact_label(recommended["sustainability_score"])

    return FoodResponse(
        request=request,
        options=enriched,  # type: ignore[arg-type]
        recommended=recommended,  # type: ignore[arg-type]
        baseline=baseline,  # type: ignore[arg-type]
        profile_weights=weights,
        packaging_impact=impact,
        ai_explanation=ai_text,
        ai_explanation_source=ai_source,
        tradeoff_summary=tradeoff,
    )
