"""
SeedSure Vision Transformer (ViT-B/16) Inference Engine
Matches architecture and preprocessing from research notebook according_to_rsp_(1).ipynb:
- Model: torchvision.models.vit_b_16
- Custom classification head:
    nn.Dropout(0.5), nn.Linear(768, 256), nn.ReLU(),
    nn.Dropout(0.3), nn.Linear(256, 5)
- Image Resolution: 224 x 224
- Normalization:
    mean: [0.485, 0.456, 0.406]
    std:  [0.229, 0.224, 0.225]
- Classes:
    0: Broken
    1: Immature
    2: Intact
    3: Skin-damaged
    4: Spotted
"""

import io
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

MODEL_VERSION = "SeedSure-ViT-B16-v1.0"

# Exact alphabetized class ordering from PyTorch ImageFolder in research notebook:
# ['Broken soybeans', 'Immature soybeans', 'Intact soybeans', 'Skin-damaged soybeans', 'Spotted soybeans']
CLASSES: List[str] = ["Broken", "Immature", "Intact", "Skin-damaged", "Spotted"]

DEFAULT_WEIGHTS_PATH = Path(__file__).resolve().parent / "models" / "best_vit.pth"

# Exact preprocessing pipeline specified in research paper and notebook
INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


class CheckpointMissingError(Exception):
    """Raised when the trained ViT model weights (.pth) are unavailable."""
    pass


class SeedViTClassifier:
    def __init__(self, weights_path: Optional[str] = None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.weights_path = Path(weights_path) if weights_path else DEFAULT_WEIGHTS_PATH
        self.model: Optional[nn.Module] = None
        self.is_loaded = False
        self._init_model_architecture()
        self.try_load_weights()

    def _init_model_architecture(self):
        """Constructs the exact ViT-B/16 architecture from research notebook cell 7."""
        # Initialize ViT-B/16 without pre-trained weights so it works fully offline
        self.model = models.vit_b_16(weights=None)
        
        # Replace heads.head with exact research head architecture
        self.model.heads.head = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, len(CLASSES))
        )
        self.model.to(self.device)

    def try_load_weights(self) -> bool:
        """Attempts to load trained weights if present at designated path."""
        if self.weights_path.exists() and self.weights_path.is_file():
            try:
                state_dict = torch.load(self.weights_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                self.model.eval()
                self.is_loaded = True
                print(f"[ML Service] Successfully loaded ViT-B/16 checkpoint from: {self.weights_path}", file=sys.stderr)
                return True
            except Exception as e:
                print(f"[ML Service] Failed to load checkpoint {self.weights_path}: {e}", file=sys.stderr)
                self.is_loaded = False
                return False
                return False
        else:
            self.is_loaded = False
            return False

    def is_checkpoint_available(self) -> bool:
        return self.is_loaded

    def get_status(self) -> Dict[str, Any]:
        return {
            "model_version": MODEL_VERSION,
            "architecture": "Vision Transformer (ViT-B/16)",
            "checkpoint_available": self.is_loaded,
            "weights_path": str(self.weights_path),
            "device": str(self.device),
            "classes": CLASSES,
            "target_crop": "Soybean",
            "instructions": (
                f"Trained checkpoint '{self.weights_path.name}' is required for real inference. "
                f"Copy trained weights to: {self.weights_path}"
                if not self.is_loaded
                else "Ready for production inference."
            )
        }

    def predict_image(self, image_bytes: bytes, image_id: str) -> Dict[str, Any]:
        """
        Executes real PyTorch inference on a single seed photograph.
        Raises CheckpointMissingError if trained checkpoint is not available.
        """
        if not self.is_loaded:
            raise CheckpointMissingError(
                f"Vision Transformer checkpoint missing at '{self.weights_path}'. "
                "Real model inference cannot proceed without trained weights. "
                "Per IEEE research project rules, fake predictions are strictly prohibited."
            )

        # 1. Image validation & RGB conversion
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert("RGB")
        except Exception as e:
            raise ValueError(f"Invalid image format for '{image_id}': {e}")

        # 2. Preprocess: Resize 224x224, Normalize
        tensor = INFERENCE_TRANSFORM(image).unsqueeze(0).to(self.device)

        # 3. Model forward pass
        self.model.eval()
        with torch.no_grad():
            outputs = self.model(tensor)
            probs = torch.softmax(outputs, dim=1)[0]
            pred_idx = torch.argmax(probs).item()

        predicted_class = CLASSES[pred_idx]
        class_probabilities = {
            CLASSES[i]: round(float(probs[i].item()), 4)
            for i in range(len(CLASSES))
        }

        return {
            "imageId": image_id,
            "predictedClass": predicted_class,
            "classProbabilities": class_probabilities,
            "confidence": class_probabilities[predicted_class]
        }


# Singleton classifier instance
_classifier: Optional[SeedViTClassifier] = None

def get_classifier(weights_path: Optional[str] = None) -> SeedViTClassifier:
    global _classifier
    if _classifier is None:
        _classifier = SeedViTClassifier(weights_path)
    return _classifier
