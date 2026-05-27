"""Dataset loader.

The datasets in ``datasets/`` are the intelligence foundation of
SustainRoute AI. The loader caches them in memory at import time so that
the engines can stay deterministic and fast.
"""
from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

DATASET_FILES = (
    "transport_emissions.json",
    "food_impact.json",
    "delivery_rules.json",
    "sustainability_weights.json",
    "city_simulation.json",
    "transport_route_samples.json",
    "recommendation_templates.json",
)


def _resolve_dataset_dir() -> Path:
    """Find the datasets/ directory relative to the repo root.

    Allows both ``cd backend && uvicorn`` and running from the repo root.
    """
    override = os.environ.get("SUSTAINROUTE_DATASETS_DIR")
    if override:
        path = Path(override).resolve()
        if path.is_dir():
            return path

    here = Path(__file__).resolve()
    for parent in (here.parent, *here.parents):
        candidate = parent / "datasets"
        if candidate.is_dir() and (candidate / "transport_emissions.json").exists():
            return candidate
    raise FileNotFoundError(
        "datasets/ directory not found. Set SUSTAINROUTE_DATASETS_DIR or run from repo root."
    )


DATASETS_DIR = _resolve_dataset_dir()


@lru_cache(maxsize=None)
def load_dataset(name: str) -> dict[str, Any]:
    """Load a single dataset by file name (with or without extension)."""
    if not name.endswith(".json"):
        name = f"{name}.json"
    path = DATASETS_DIR / name
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_all_datasets() -> dict[str, dict[str, Any]]:
    """Load every known dataset as a dict keyed by stem."""
    return {name.replace(".json", ""): load_dataset(name) for name in DATASET_FILES}


def datasets_loaded_count() -> int:
    return sum(1 for name in DATASET_FILES if (DATASETS_DIR / name).exists())
