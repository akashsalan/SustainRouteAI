"""GET /city-impact.

Returns city-level sustainability projections for the dashboard's vision/
scale section. Pure dataset projection, no AI.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.services.dataset_service import load_dataset
from backend.utils.schemas import CityImpactResponse

router = APIRouter(tags=["city-impact"])


@router.get("/city-impact", response_model=CityImpactResponse)
def city_impact_endpoint(
    city: str = Query("tier_1_metro"),
    scenario: str = Query("medium_adoption"),
) -> CityImpactResponse:
    data = load_dataset("city_simulation")
    cities = data["cities"]
    if city not in cities:
        raise HTTPException(status_code=400, detail=f"Unknown city: {city}")
    city_block = cities[city]
    scenarios = city_block["scenarios"]
    if scenario not in scenarios:
        raise HTTPException(status_code=400, detail=f"Unknown scenario: {scenario}")
    block = scenarios[scenario]

    # Build a 12-month trend using the seasonal multipliers.
    multipliers = data["monthly_trend_template"]["seasonal_multipliers"]
    base_month_co2 = block["monthly_projections"]["co2_reduction_tons"]
    base_month_packaging = block["monthly_projections"]["packaging_waste_reduction_kg"]
    base_month_fuel = block["monthly_projections"]["fuel_saved_liters"]
    monthly_trend = [
        {
            "month": month,
            "co2_reduction_tons": round(base_month_co2 * mult, 1),
            "packaging_waste_reduction_kg": round(base_month_packaging * mult, 0),
            "fuel_saved_liters": round(base_month_fuel * mult, 0),
        }
        for month, mult in multipliers.items()
    ]

    headline = (
        f"If adopted by {block['estimated_users']:,} people in {city_block['label']}, "
        f"projected yearly CO2 avoidance is "
        f"{block['yearly_projections']['co2_reduction_tons']:,} tons."
    )

    return CityImpactResponse(
        city=city,
        city_label=city_block["label"],
        scenario=scenario,
        estimated_users=block["estimated_users"],
        monthly_projections=block["monthly_projections"],
        yearly_projections=block["yearly_projections"],
        transport_shift=block["transport_shift"],
        monthly_trend=monthly_trend,
        kpi_targets=data["kpi_targets"],
        headline=headline,
    )
