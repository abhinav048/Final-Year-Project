"""
SeedSure ViT Inference CLI Tool
Allows backend to run inference directly via Python subprocess or standalone CLI.
"""

import argparse
import datetime
import hashlib
import json
import sys
from pathlib import Path

from model import MODEL_VERSION, CLASSES, get_classifier
from scoring import QUALITY_WEIGHTS, RESEARCH_DISCLAIMER, calculate_visual_quality_score

def main():
    parser = argparse.ArgumentParser(description="SeedSure ViT CLI Inference")
    parser.add_argument("--batch-id", default=None, help="Seed batch ID or number")
    parser.add_argument("--crop-type", default=None, help="Crop category (e.g., Soybean)")
    parser.add_argument("--variety", default="Soybean", help="Variety name")
    parser.add_argument("--seller-address", default="0x0", help="Seller wallet address")
    parser.add_argument("--images", nargs="*", default=[], help="List of image file paths")
    parser.add_argument("--weights-path", default=None, help="Custom path to best_vit.pth")
    parser.add_argument("--health-check", action="store_true", help="Perform health check and exit")

    args = parser.parse_args()

    classifier = get_classifier(args.weights_path)

    if args.health_check:
        res = {
            "status": "healthy" if classifier.is_checkpoint_available() else "degraded",
            "modelVersion": MODEL_VERSION,
            "checkpointAvailable": classifier.is_checkpoint_available(),
            "weightsPath": str(classifier.weights_path),
            "classes": CLASSES,
            "qualityWeights": QUALITY_WEIGHTS,
            "supportedCrops": ["Soybean"],
            "disclaimer": RESEARCH_DISCLAIMER
        }
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if not args.batch_id or not args.crop_type or not args.images:
        res = {
            "success": False,
            "error": "Missing required arguments: --batch-id, --crop-type, and --images are required.",
            "code": "MISSING_ARGS"
        }
        print(json.dumps(res))
        sys.exit(1)

    # 1. Crop type validation
    if args.crop_type.strip().lower() not in ["soybean", "soybeans", "oilseeds - soybean"]:
        res = {
            "success": False,
            "error": "AI visual assessment is currently available only for soybean seeds.",
            "code": "UNSUPPORTED_CROP"
        }
        print(json.dumps(res))
        sys.exit(1)

    classifier = get_classifier(args.weights_path)
    if not classifier.is_checkpoint_available():
        res = {
            "success": False,
            "code": "CHECKPOINT_REQUIRED",
            "error": (
                f"Vision Transformer trained checkpoint 'best_vit.pth' is required. "
                f"Place weights in '{classifier.weights_path}'. "
                "Fake predictions are prohibited."
            ),
            "checkpointAvailable": False,
            "weightsPath": str(classifier.weights_path)
        }
        print(json.dumps(res))
        sys.exit(0)

    predictions = []
    class_counts = {c: 0 for c in CLASSES}
    seen_hashes = set()

    for idx, img_path in enumerate(args.images):
        p = Path(img_path)
        if not p.exists() or not p.is_file():
            continue

        with open(p, "rb") as f:
            content = f.read()

        img_hash = hashlib.sha256(content).hexdigest()
        if img_hash in seen_hashes:
            continue
        seen_hashes.add(img_hash)

        image_id = f"IMG_{args.batch_id}_{idx+1:03d}"
        try:
            pred = classifier.predict_image(content, image_id)
            pred["filename"] = p.name
            predictions.append(pred)
            class_counts[pred["predictedClass"]] += 1
        except Exception as e:
            res = {
                "success": False,
                "error": f"Error analyzing '{p.name}': {str(e)}",
                "code": "INFERENCE_ERROR"
            }
            print(json.dumps(res))
            sys.exit(1)

    if not predictions:
        res = {
            "success": False,
            "error": "No valid unique images found to analyze.",
            "code": "NO_VALID_IMAGES"
        }
        print(json.dumps(res))
        sys.exit(1)

    score, category, distribution = calculate_visual_quality_score(class_counts, len(predictions))
    assessed_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    report_data = {
        "batchId": args.batch_id,
        "cropType": "Soybean",
        "variety": args.variety,
        "sellerAddress": args.seller_address,
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

    report_json_str = json.dumps(report_data, sort_keys=True)
    report_hash = "0x" + hashlib.sha256(report_json_str.encode("utf-8")).hexdigest()
    report_cid = f"bafybeireport_{hashlib.sha256(report_json_str.encode('utf-8')).hexdigest()[:24]}"
    
    report_data["reportCID"] = report_cid
    report_data["reportHash"] = report_hash

    res = {
        "success": True,
        "data": report_data
    }
    print(json.dumps(res))

if __name__ == "__main__":
    main()
