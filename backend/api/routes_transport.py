"""POST /optimize-transport.

End-to-end orchestration:
1. Validate input.
2. Estimate distance (heuristic geo service).
3. Sustainability engine evaluates candidate modes.
4. Optimization engine ranks them with the chosen weight profile.
5. Recommendation engine adds reasoning and tradeoff summary.
6. AI service produces a polished explanation (with deterministic fallback).
"""
from __future__ import annotations

from fastapi import APIRouter

from backend.engines.optimization_engine import optimize_transport
from backend.engines.recommendation_engine import (
    enrich_transport_recommendations,
    transport_tradeoff_summary,
)
from backend.engines.sustainability_engine import (
    evaluate_transport_modes,
    filter_modes_by_distance,
)
from backend.services.ai_service import explain_transport
from backend.services.dataset_service import load_dataset
from backend.services.geo_service import estimate_distance_km
from backend.utils.schemas import TransportRequest, TransportResponse

router = APIRouter(tags=["transport"])


@router.post("/optimize-transport", response_model=TransportResponse)
def optimize_transport_endpoint(request: TransportRequest) -> TransportResponse:
    transport_data = load_dataset("transport_emissions")
    all_modes = list(transport_data["modes"].keys())

    distance_km = request.distance_km or estimate_distance_km(
        request.source, request.destination
    )
    candidate_modes = filter_modes_by_distance(distance_km, all_modes)
    if not candidate_modes:
        # Always keep at least one motorized fallback for very long trips.
        candidate_modes = ["solo_cab", "pool_cab", "metro", "train", "bus"]

    evaluations = evaluate_transport_modes(distance_km, request.urgency, candidate_modes)
    ranked, weights = optimize_transport(evaluations, request.profile)
    enriched, recommended = enrich_transport_recommendations(ranked)

    baseline = next((o for o in enriched if o["mode"] == "solo_cab"), enriched[-1])
    tradeoff = transport_tradeoff_summary(recommended, baseline)
    ai_text, ai_source = explain_transport(
        recommended=recommended,
        baseline=baseline,
        profile=request.profile,
        weights=weights,
    )

    return TransportResponse(
        request=request,
        options=enriched,  # type: ignore[arg-type]
        recommended=recommended,  # type: ignore[arg-type]
        profile_weights=weights,
        ai_explanation=ai_text,
        ai_explanation_source=ai_source,
        tradeoff_summary=tradeoff,
    )
