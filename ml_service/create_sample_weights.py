"""
Utility script to generate and save an initialized ViT-B/16 checkpoint
matching the exact head architecture for development and testing.
Saves to ml_service/models/best_vit.pth.
"""

from pathlib import Path
import torch
from model import get_classifier, DEFAULT_WEIGHTS_PATH

def main():
    models_dir = DEFAULT_WEIGHTS_PATH.parent
    models_dir.mkdir(parents=True, exist_ok=True)

    print(f"Initializing ViT-B/16 architecture for SeedSure...")
    classifier = get_classifier()
    
    # Save the initialized model state dict so live inference can be tested
    torch.save(classifier.model.state_dict(), DEFAULT_WEIGHTS_PATH)
    print(f"[SUCCESS] Exported initialized checkpoint to: {DEFAULT_WEIGHTS_PATH}")
    print("The ML Service will now load this checkpoint for real PyTorch tensor inference.")
    print("NOTE: For IEEE research demonstration, replace this file with the trained 'best_vit.pth' from Google Colab.")

if __name__ == "__main__":
    main()
