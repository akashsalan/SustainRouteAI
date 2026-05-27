"""GET /health and meta endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from backend.services.ai_service import ai_layer_status
from backend.services.dataset_service import datasets_loaded_count, load_dataset
from backend.utils.schemas import HealthResponse

router = APIRouter(tags=["meta"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    loaded = datasets_loaded_count()
    return HealthResponse(
        status="healthy" if loaded == 7 else "degraded",
        backend="online",
        optimization_engine="active",
        datasets_loaded=loaded,
        ai_layer=ai_layer_status(),
        version="1.0.0",
    )


@router.get("/profiles")
def profiles() -> dict:
    """Return the available scoring weight profiles for the frontend selector."""
    return load_dataset("sustainability_weights")["profiles"]


@router.get("/sample-routes")
def sample_routes() -> dict:
    """Return the seeded route comparisons for instant demo mode."""
    return load_dataset("transport_route_samples")
