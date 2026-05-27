"""AI Explanation Service.

This service is the ONLY component allowed to call the OpenAI API. It is
intentionally narrow:

- Receives a structured analytical context produced by the deterministic
  optimization and recommendation engines.
- Produces a concise, premium, product-style natural language explanation.
- Never makes ranking or scoring decisions.
- Falls back to a deterministic template if OpenAI is unavailable, the API
  key is missing, or any network error occurs. The platform must keep
  working end-to-end without the AI layer.
"""
from __future__ import annotations

import logging
import os
from typing import Any, Literal

from dotenv import load_dotenv

from backend.engines.recommendation_engine import (
    food_tradeoff_summary,
    transport_tradeoff_summary,
)

# Load .env once at import time. Safe even if no .env file is present.
load_dotenv()

logger = logging.getLogger(__name__)

# Lazy import so the backend can boot even if openai is not installed.
try:  # pragma: no cover - import guard
    from openai import OpenAI  # type: ignore

    _OPENAI_AVAILABLE = True
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore
    _OPENAI_AVAILABLE = False


_SYSTEM_PROMPT = (
    "You are the explanation layer of SustainRoute AI, a real-time "
    "sustainability decision intelligence platform. Convert analytical "
    "optimization output into ONE concise, premium, product-style sentence "
    "(max 220 characters) that explains why an option is recommended. "
    "Use a calm analytical tone. Avoid guilt, hype, emojis, motivational "
    "language, and the words 'should', 'must', 'planet', 'green'. Quote "
    "specific numbers when they are provided. Never invent numbers."
)


AISource = Literal["openai", "fallback"]


def _client() -> Any | None:
    if not _OPENAI_AVAILABLE:
        return None
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None
    try:
        return OpenAI(api_key=api_key)
    except Exception as exc:  # pragma: no cover
        logger.warning("Failed to initialize OpenAI client: %s", exc)
        return None


def _call_openai(prompt: str) -> str | None:
    client = _client()
    if client is None:
        return None
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            max_tokens=120,
            timeout=8.0,
        )
        text = completion.choices[0].message.content or ""
        text = text.strip().strip('"').strip()
        if not text:
            return None
        return text
    except Exception as exc:  # pragma: no cover - network/runtime guard
        logger.warning("OpenAI call failed, falling back: %s", exc)
        return None


# ---------------------------------------------------------------------------
# Transport
# ---------------------------------------------------------------------------


def explain_transport(
    *,
    recommended: dict,
    baseline: dict,
    profile: str,
    weights: dict[str, float],
) -> tuple[str, AISource]:
    """Generate a transport recommendation explanation.

    Returns ``(text, source)`` where source is either ``"openai"`` or
    ``"fallback"``.
    """
    fallback = transport_tradeoff_summary(recommended, baseline)

    prompt = (
        "Recommendation context (transport):\n"
        f"- recommended_mode: {recommended['label']}\n"
        f"- baseline_mode: {baseline['label']}\n"
        f"- recommended_emissions_g: {recommended['estimated_emissions_g']}\n"
        f"- baseline_emissions_g: {baseline['estimated_emissions_g']}\n"
        f"- recommended_time_min: {recommended['estimated_time_min']}\n"
        f"- baseline_time_min: {baseline['estimated_time_min']}\n"
        f"- recommended_cost: {recommended['estimated_cost']}\n"
        f"- baseline_cost: {baseline['estimated_cost']}\n"
        f"- final_score: {recommended['final_score']}/100\n"
        f"- profile: {profile} (weights: {weights})\n"
        "Write one sentence explaining why this is the best balanced option. "
        "Reference concrete numbers (emission % drop, time delta, or cost)."
    )

    text = _call_openai(prompt)
    if text:
        return text, "openai"
    return fallback, "fallback"


# ---------------------------------------------------------------------------
# Food
# ---------------------------------------------------------------------------


def explain_food(
    *,
    recommended: dict,
    baseline: dict,
    profile: str,
    weights: dict[str, float],
) -> tuple[str, AISource]:
    fallback = food_tradeoff_summary(recommended, baseline)

    prompt = (
        "Recommendation context (food delivery):\n"
        f"- recommended_label: {recommended['label']}\n"
        f"- baseline_label: {baseline['label']}\n"
        f"- recommended_delivery_type: {recommended['delivery_type']}\n"
        f"- recommended_packaging: {recommended['packaging']}\n"
        f"- recommended_emissions_g: {recommended['estimated_emissions_g']}\n"
        f"- baseline_emissions_g: {baseline['estimated_emissions_g']}\n"
        f"- recommended_time_min: {recommended['estimated_time_min']}\n"
        f"- baseline_time_min: {baseline['estimated_time_min']}\n"
        f"- recommended_cost: {recommended['estimated_cost']}\n"
        f"- recommended_sustainability_score: {recommended['sustainability_score']}\n"
        f"- profile: {profile} (weights: {weights})\n"
        "Write one sentence summarizing why this is the best balanced "
        "delivery configuration. Reference concrete numbers."
    )

    text = _call_openai(prompt)
    if text:
        return text, "openai"
    return fallback, "fallback"


# ---------------------------------------------------------------------------
# Diagnostics
# ---------------------------------------------------------------------------


def ai_layer_status() -> Literal["online", "fallback"]:
    if _client() is None:
        return "fallback"
    return "online"
