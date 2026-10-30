"""
SeedSure AI Visual Seed Quality Scoring Engine
Formula and weights based on seed physical integrity evaluation:
- Intact: 100
- Immature: 55
- Spotted: 40
- Skin-damaged: 35
- Broken: 10
"""

from typing import Dict, Tuple, Any

# Proposed prototype weights for soybean visual defect classification
QUALITY_WEIGHTS: Dict[str, float] = {
    "Intact": 100.0,
    "Immature": 55.0,
    "Spotted": 40.0,
    "Skin-damaged": 35.0,
    "Broken": 10.0,
}

RESEARCH_DISCLAIMER: str = (
    "AI Visual Seed Quality Score evaluates seed physical integrity and surface defects "
    "from optical photographs using Vision Transformer (ViT-B/16). It does not evaluate "
    "or guarantee physiological germination viability, vigor, internal moisture content, "
    "or genetic purity."
)


def calculate_visual_quality_score(
    class_counts: Dict[str, int], total_images: int
) -> Tuple[float, str, Dict[str, float]]:
    """
    Computes percentage distribution and composite Visual Quality Score:
    Score = (Intact% * 100 + Immature% * 55 + Spotted% * 40 + Skin-damaged% * 35 + Broken% * 10) / 100
    """
    if total_images <= 0:
        return 0.0, "Very Poor", {k: 0.0 for k in QUALITY_WEIGHTS}

    distribution: Dict[str, float] = {}
    weighted_sum = 0.0

    for category, weight in QUALITY_WEIGHTS.items():
        count = class_counts.get(category, 0)
        percentage = round((count / total_images) * 100.0, 2)
        distribution[category] = percentage
        weighted_sum += percentage * weight

    score = round(weighted_sum / 100.0, 2)
    score = max(0.0, min(100.0, score))

    if score >= 90.0:
        quality_category = "Excellent"
    elif score >= 75.0:
        quality_category = "Good"
    elif score >= 60.0:
        quality_category = "Moderate"
    elif score >= 40.0:
        quality_category = "Poor"
    else:
        quality_category = "Very Poor"

    return score, quality_category, distribution
