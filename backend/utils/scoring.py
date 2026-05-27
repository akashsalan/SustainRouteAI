"""Numeric helpers used across the engines.

These functions are intentionally tiny, deterministic, and pure so that the
optimization engine remains explainable and unit-testable.
"""
from __future__ import annotations

from typing import Iterable


def clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    """Clamp a numeric value to a closed interval."""
    if value < low:
        return low
    if value > high:
        return high
    return value


def invert_to_score(value: float, max_value: float) -> float:
    """Invert a "lower is better" metric to a 0-100 "higher is better" score.

    Used for cost and time. A value of 0 yields 100, a value of ``max_value``
    yields 0, anything beyond is clamped.
    """
    if max_value <= 0:
        return 100.0
    return clamp(100.0 * (1.0 - value / max_value))


def normalize_min_max(values: Iterable[float], higher_is_better: bool = False) -> list[float]:
    """Normalize a sequence of values to 0-100 with min-max scaling.

    Used to compare options against each other within a single recommendation
    set so that ranking remains contextual.
    """
    values = list(values)
    if not values:
        return []
    lo = min(values)
    hi = max(values)
    if hi == lo:
        return [100.0 for _ in values]
    scaled = [100.0 * (v - lo) / (hi - lo) for v in values]
    if higher_is_better:
        return [clamp(s) for s in scaled]
    return [clamp(100.0 - s) for s in scaled]


def round1(value: float) -> float:
    """Round to one decimal for clean frontend display."""
    return float(f"{value:.1f}")
