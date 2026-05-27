"""Heuristic geo helpers.

The hackathon prototype does not depend on Maps APIs, so distance is
estimated from a small in-memory lookup of known sample locations plus a
deterministic hash-based fallback that yields stable distances for any
free-text input. This keeps the demo reproducible.
"""
from __future__ import annotations

import hashlib

# Coarse sample locations roughly within Bengaluru. Real deployments would
# replace this with a Maps/Distance Matrix API call.
_SAMPLE_LOCATIONS = {
    "indiranagar": (12.9719, 77.6412),
    "mg road": (12.9756, 77.6097),
    "koramangala": (12.9352, 77.6245),
    "koramangala 1st block": (12.9389, 77.6190),
    "koramangala 5th block": (12.9279, 77.6271),
    "whitefield": (12.9698, 77.7500),
    "cubbon park": (12.9762, 77.5929),
    "hsr layout": (12.9116, 77.6446),
    "yeshwanthpur": (13.0286, 77.5546),
    "jp nagar": (12.9082, 77.5854),
    "kempegowda airport": (13.1986, 77.7066),
    "jayanagar": (12.9250, 77.5938),
    "lalbagh": (12.9507, 77.5848),
    "downtown": (12.9716, 77.5946),
    "business district": (12.9698, 77.6500),
    "marathahalli": (12.9591, 77.6974),
    "electronic city": (12.8452, 77.6602),
    "btm layout": (12.9166, 77.6101),
}


def _haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    from math import asin, cos, radians, sin, sqrt

    lat1, lon1 = a
    lat2, lon2 = b
    r = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    h = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * r * asin(sqrt(h))


def _stable_distance(source: str, destination: str) -> float:
    """Return a stable distance in km derived from a hash. Used when names
    are unknown so the demo behaves predictably."""
    seed = f"{source.strip().lower()}|{destination.strip().lower()}".encode("utf-8")
    digest = hashlib.sha256(seed).digest()
    # Map 16 bits to a distance in [2.5, 25] km.
    raw = int.from_bytes(digest[:2], "big")
    return round(2.5 + (raw / 0xFFFF) * 22.5, 1)


def estimate_distance_km(source: str, destination: str) -> float:
    s = source.strip().lower()
    d = destination.strip().lower()
    if s in _SAMPLE_LOCATIONS and d in _SAMPLE_LOCATIONS:
        return round(_haversine_km(_SAMPLE_LOCATIONS[s], _SAMPLE_LOCATIONS[d]), 1)
    return _stable_distance(s, d)


def known_locations() -> list[str]:
    return sorted(_SAMPLE_LOCATIONS.keys())
