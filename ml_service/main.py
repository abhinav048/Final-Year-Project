"""
FastAPI ML Service for SeedSure AI-Powered Seed Quality Assessment
Serves the Vision Transformer (ViT-B/16) soybean defect classification model.
"""

import datetime
import hashlib
import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from model import (
    MODEL_VERSION,
    CLASSES,
    CheckpointMissingError,
    get_classifier,
)
from scoring import (
    QUALITY_WEIGHTS,
    RESEARCH_DISCLAIMER,
    calculate_visual_quality_score,
)

app = FastAPI(
    title="SeedSure ViT Seed Quality Inference API",
    version="1.0.0",
    description="Vision Transformer (ViT-B/16) Inference Service for Agricultural Seed Quality Assessment",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REPORTS_DIR = Path(__file__).resolve().parent / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# In-memory cache for recent batch reports
_cached_reports: Dict[str, Dict[str, Any]] = {}


@app.get("/api/ml/seed/health")
async def health_check():
    """Returns ML service operational status, hardware device, and checkpoint availability."""
    classifier = get_classifier()
    status_info = classifier.get_status()
    return {
        "status": "ok" if status_info["checkpoint_available"] else "degraded",
        "service": "SeedSure-ViT-ML-Service",
        **status_info
    }


@app.post("/api/ml/seed/analyze")
async def analyze_seeds(
    batchId: str = Form(...),
    cropType: str = Form(...),
    variety: Optional[str] = Form("Soybean"),
    sellerAddress: Optional[str] = Form("0x0"),
    images: List[UploadFile] = File(...),
):
    """
    Accepts batch metadata and multiple seed images.
    Executes real ViT-B/16 PyTorch inference and calculates AI Visual Seed Quality Score.
    """
    # 1. Crop type validation (§4: Initially enable ViT assessment ONLY for soybean)
    normalized_crop = cropType.strip().lower()
    if normalized_crop not in ["soybean", "soybeans", "oilseeds - soybean"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="AI visual assessment is currently available only for soybean seeds."
        )

    # 2. Image volume validation
    if not images or len(images) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one seed photograph is required for quality assessment."
        )

    # 3. Checkpoint availability validation (§3: Do not generate fake predictions)
    classifier = get_classifier()
    if not classifier.is_checkpoint_available():
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "code": "CHECKPOINT_REQUIRED",
                "status": "CHECKPOINT_REQUIRED",
                "error": (
                    f"Vision Transformer trained checkpoint 'best_vit.pth' is required. "
                    f"Place the trained weights file in '{classifier.weights_path}'. "
                    "In accordance with IEEE research integrity guidelines, fake or simulated predictions are prohibited."
                ),
                "checkpointAvailable": False,
                "weightsPath": str(classifier.weights_path),
                "instructions": "Copy 'best_vit.pth' to the ml_service/models/ directory and reload."
            }
        )

    # 4. Process each image through ViT model
    predictions = []
    class_counts = {c: 0 for c in CLASSES}
    seen_hashes = set()

    for idx, img_file in enumerate(images):
        content = await img_file.read()
        
        # Check size (max 10MB)
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image '{img_file.filename}' exceeds 10MB limit."
            )

        # Duplicate detection using SHA-256
        img_hash = hashlib.sha256(content).hexdigest()
        if img_hash in seen_hashes:
            continue
        seen_hashes.add(img_hash)

        image_id = f"IMG_{batchId}_{idx+1:03d}"
        try:
            pred = classifier.predict_image(content, image_id)
            predictions.append(pred)
            class_counts[pred["predictedClass"]] += 1
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Inference error on image '{img_file.filename}': {str(e)}"
            )

    if len(predictions) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid unique images could be analyzed."
        )

    # 5. Calculate AI Visual Seed Quality Score using formula (§5)
    score, category, distribution = calculate_visual_quality_score(class_counts, len(predictions))

    assessed_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    # Generate canonical batch report payload
    report_data = {
        "batchId": batchId,
        "cropType": "Soybean",
        "variety": variety,
        "sellerAddress": sellerAddress,
        "visualQualityScore": score,
        "qualityCategory": category,
        "totalImagesAnalyzed": len(predictions),
        "classDistribution": distribution,
        "classCounts": class_counts,
        "qualityWeights": QUALITY_WEIGHTS,
        "predictions": predictions,
        "modelVersion": MODEL_VERSION,
        "assessedAt": assessed_at,
        "disclaimer": RESEARCH_DISCLAIMER
    }

    # Generate content hash of the quality report
    report_json_str = json.dumps(report_data, sort_keys=True)
    report_hash = "0x" + hashlib.sha256(report_json_str.encode("utf-8")).hexdigest()
    report_cid = f"bafybeireport_{hashlib.sha256(report_json_str.encode('utf-8')).hexdigest()[:24]}"
    
    report_data["reportCID"] = report_cid
    report_data["reportHash"] = report_hash

    # Save to file and memory cache
    _cached_reports[str(batchId)] = report_data
    report_file = REPORTS_DIR / f"report_{batchId}.json"
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

    return {
        "success": True,
        "data": report_data
    }


@app.get("/api/ml/seed/result/{batch_id}")
async def get_batch_result(batch_id: str):
    """Retrieves previously generated quality report for a given batch ID."""
    if batch_id in _cached_reports:
        return {"success": True, "data": _cached_reports[batch_id]}

    report_file = REPORTS_DIR / f"report_{batch_id}.json"
    if report_file.exists():
        with open(report_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            _cached_reports[batch_id] = data
            return {"success": True, "data": data}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No AI quality report found for batch '{batch_id}'."
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
