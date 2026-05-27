"""SustainRoute AI — FastAPI application entrypoint.

Run from the repo root:

    uvicorn backend.main:app --reload --port 8000

Environment:
    OPENAI_API_KEY   Optional. If absent, the AI layer transparently falls
                     back to deterministic explanations.
    OPENAI_MODEL     Optional. Defaults to gpt-4o-mini.
    SUSTAINROUTE_DATASETS_DIR  Optional. Overrides the auto-detected
                     datasets directory.
"""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api import routes_city, routes_food, routes_health, routes_transport

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(
    title="SustainRoute AI",
    version="1.0.0",
    description=(
        "Real-time sustainability decision intelligence infrastructure. "
        "Deterministic optimization with an AI explanation layer."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tightened in deploy
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(routes_health.router)
app.include_router(routes_transport.router)
app.include_router(routes_food.router)
app.include_router(routes_city.router)


@app.get("/")
def root() -> dict:
    return {
        "name": "SustainRoute AI",
        "tagline": "Real-Time Sustainability Decision Infrastructure",
        "endpoints": [
            "GET  /health",
            "GET  /profiles",
            "GET  /sample-routes",
            "POST /optimize-transport",
            "POST /optimize-food",
            "GET  /city-impact",
        ],
    }
