# Vision Transformer (ViT-B/16) Model Checkpoints

This folder is the designated repository path for trained Vision Transformer weights used by the SeedSure ML service.

## Checkpoint File
- **Required Filename**: `best_vit.pth`
- **Location**: `ml_service/models/best_vit.pth`
- **Architecture**: `torchvision.models.vit_b_16` with 5-class custom head:
  ```python
  nn.Sequential(
      nn.Dropout(p=0.5),
      nn.Linear(768, 256),
      nn.ReLU(),
      nn.Dropout(p=0.3),
      nn.Linear(256, 5)
  )
  ```
- **Classes**: `["Broken", "Immature", "Intact", "Skin-damaged", "Spotted"]`

## How to Generate or Place Weights
1. **Place Trained Research Checkpoint**:
   Copy the trained `.pth` file from your training environment:
   ```bash
   cp /path/to/trained_vit.pth ml_service/models/best_vit.pth
   ```

2. **Generate Baseline / Test Weights Locally**:
   If training weights are not yet downloaded, run the weight initialization script:
   ```bash
   python ml_service/create_sample_weights.py
   ```
   This creates a valid PyTorch state dict corresponding to the exact custom head architecture so inference runs immediately.

3. **Verify Checkpoint**:
   Run the CLI health check:
   ```bash
   python ml_service/inference_cli.py --health-check
   ```

*Note: Due to GitHub's 100MB per-file upload limit, raw binary `.pth` checkpoint files are excluded from git pushes via `.gitignore`.*
