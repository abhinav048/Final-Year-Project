# SeedSure — AI Seed Quality & Dynamic Seller Trust Architecture Specification

This specification documents the complete machine learning and trust architecture for **SeedSure: Smart Contract-Based Seed Quality and Dynamic Seller Trust Platform**.

The platform incorporates two interconnected but distinct ML-driven assessment systems:
1. **AI-Based Visual Seed Quality Assessment**: Vision Transformer (ViT-B/16) optical defect classification for soybean seed lots.
2. **Dynamic Seller Trust Score Engine**: Transparent, auditable multi-parameter reliability calculation with automated event-driven updates.

---

## 1. System Overview & Core Distinctions

| Dimension | AI Visual Seed Quality Score | Dynamic Seller Trust Score |
| :--- | :--- | :--- |
| **Target Entity** | Specific physical seed batch / lot | Breeder / Seller identity & history |
| **Model Architecture** | Vision Transformer (`ViT-B/16`, 85.8M params) | 6-Factor Dynamic Normalization & Weighting Engine |
| **Input Data** | High-resolution RGB macro photographs (224×224) | On-chain transactions, certifications, deliveries, ratings |
| **Output Metric** | Visual Quality Score ($0 - 100$) | Dynamic Seller Trust Score ($0 - 100$) |
| **Classification Classes** | Intact, Immature, Spotted, Skin-damaged, Broken | Highly Trusted, Trusted, Average, Low Trust, Poor Trust |
| **Update Cadence** | Per batch upload & analysis | Real-time on verified lifecycle events |
| **On-Chain Anchor** | `SeedRegistry.recordBatchQualityAssessment` | `TrustScoreRegistry.updateTrustScoreWithReason` |
| **Research Disclaimer** | Does NOT verify germination viability or vigor | Does NOT guarantee specific future batch germination |

---

## 2. Vision Transformer (ViT-B/16) Seed Quality Assessment

### 2.1 Research Model Specifications (`according_to_rsp_(1).ipynb`)
- **Base Architecture**: `torchvision.models.vit_b_16(weights=ViT_B_16_Weights.DEFAULT)`
- **Classification Head**:
  ```python
  nn.Sequential(
      nn.Dropout(p=0.5),
      nn.Linear(768, 256),
      nn.ReLU(),
      nn.Dropout(p=0.3),
      nn.Linear(256, 5)
  )
  ```
- **Input Image Dimensions**: $224 \times 224$ pixels, RGB channels.
- **Normalization (ImageNet Standards)**:
  - Mean: $[0.485, 0.456, 0.406]$
  - Standard Deviation: $[0.229, 0.224, 0.225]$
- **Model Checkpoint Path**: `ml_service/models/best_vit.pth`
- **Reported Benchmark Accuracy**: 95.52% on 5,513 image research dataset (*academic evaluation metric; not presented as production guarantee*).

### 2.2 Five-Class Defect Categorization
The 5 seed defect classes are indexed based on standard alphabetical order:
1. **`Intact`**: Physically undamaged seed coat, mature morphology, uniform color.
2. **`Immature`**: Undeveloped, shriveled seed with reduced cotyledon mass.
3. **`Spotted`**: Seed coat displaying fungal/microbial discoloration or dark lesions.
4. **`Skin-damaged`**: Ruptured, cracked, or peeled seed coat (testa injury).
5. **`Broken`**: Fragmented seed or split cotyledon.

### 2.3 Visual Seed Quality Scoring Formula
After processing all uploaded seed photographs for a batch, the system calculates class percentage distributions and evaluates the prototype score:

$$\text{Visual Quality Score} = \frac{P_{\text{Intact}} \times 100 + P_{\text{Immature}} \times 55 + P_{\text{Spotted}} \times 40 + P_{\text{Skin-damaged}} \times 35 + P_{\text{Broken}} \times 10}{100}$$

#### Quality Categories
| Score Range | Category | Market Status |
| :---: | :--- | :--- |
| **90 – 100** | **Excellent** | Prime certified grade |
| **75 – 89** | **Good** | Standard commercial grade |
| **60 – 74** | **Moderate** | Acceptable with warning |
| **40 – 59** | **Poor** | Substandard / high defect ratio |
| **0 – 39** | **Very Poor** | Unacceptable / high breakage |

### 2.4 Crop Restriction Rule
The Vision Transformer model is calibrated and validated strictly for **Soybean** seeds (`Glycine max`).
- Attempts to process unsupported crop types (Wheat, Rice, Maize, Mustard) are blocked by the ML service and API with code `UNSUPPORTED_CROP`.
- Unsupported crops display the message: *"AI visual assessment is currently available only for soybean seeds."*

---

## 3. Dynamic Seller Trust Score Engine

Every breeder is evaluated on a continuously updating Trust Score ($0 - 100$) reflecting long-term accountability.

### 3.1 Six-Factor Weighting Formula

$$\text{Seller Trust Score} = 0.25 \cdot S_{\text{quality}} + 0.20 \cdot S_{\text{cert}} + 0.20 \cdot S_{\text{delivery}} + 0.15 \cdot S_{\text{tx}} + 0.10 \cdot S_{\text{feedback}} + 0.10 \cdot S_{\text{complaints}}$$

Each parameter is normalized to a value between 0 and 100:

| Parameter | Weight | Measurement Definition |
| :--- | :---: | :--- |
| **Historical AI Quality ($S_{\text{quality}}$)** | **25%** | Mean AI Visual Quality Score across all completed, verified batches. |
| **Certification Verification ($S_{\text{cert}}$)** | **20%** | Ratio of certified batches to total registered lots ($\frac{\text{certBatches}}{\text{totalBatches}} \times 100$). |
| **Successful Delivery Rate ($S_{\text{delivery}}$)** | **20%** | On-time delivery rate penalizing delays ($\frac{\text{delivered} - 0.5 \times \text{delayed}}{\text{totalOrders}} \times 100$). |
| **Transaction Performance ($S_{\text{tx}}$)** | **15%** | Completion rate of escrow orders without failure ($\frac{\text{successOrders}}{\text{totalOrders}} \times 100$). |
| **Farmer Feedback ($S_{\text{feedback}}$)** | **10%** | Bayesian-adjusted average rating from confirmed escrow deliveries ($\mu = 3.5, k = 3$). |
| **Complaint & Dispute Health ($S_{\text{complaints}}$)** | **10%** | Dispute avoidance index ($\max(0, 100 - \frac{2 \times \text{lost} + 0.5 \times \text{disputes}}{\text{totalOrders}} \times 100)$). |

### 3.2 Fairness & Reputation Safeguards
1. **Missing Data Handling**: Missing data is NEVER treated as a default score of 100.
2. **New Seller Status**: Sellers with $< 3$ completed batches or $< 2$ completed orders receive the status **"New Seller – Insufficient Data"** and confidence level **Low**.
3. **Resilience to Outliers**: A single defective batch cannot wipe out a seller's entire multi-year reputation.
4. **Verified Actions Only**: Unverified reviews or pending orders cannot alter trust scores.
5. **Auditable Reasons**: Every score update must record a clear, human-readable reason and on-chain reference.

---

## 4. Blockchain & IPFS Architecture

### 4.1 Smart Contracts

#### `SeedRegistry.sol`
```solidity
struct AIQualityRecord {
    uint256 batchId;
    uint256 visualQualityScore; // 0 - 100
    string qualityCategory;     // Excellent, Good, Moderate, Poor, Very Poor
    string reportCID;           // IPFS CID of full JSON assessment report
    bytes32 reportHash;         // SHA-256 integrity hash of report
    string modelVersion;        // "SeedSure-ViT-B16-v1.0"
    uint256 timestamp;
    address assessedBy;
}

function recordBatchQualityAssessment(
    uint256 _batchId,
    uint256 _visualQualityScore,
    string calldata _qualityCategory,
    string calldata _reportCID,
    bytes32 _reportHash,
    string calldata _modelVersion
) external onlyRole(ORACLE_ROLE);
```

#### `TrustScoreRegistry.sol`
```solidity
struct TrustUpdateAudit {
    uint256 previousScore;
    uint256 newScore;
    bytes32 featuresHash;
    string reason;
    uint256 timestamp;
    address updatedBy;
}

function updateTrustScoreWithReason(
    address _seller,
    uint256 _score,
    bytes32 _featuresHash,
    string calldata _reason
) external onlyRole(ORACLE_ROLE);
```

### 4.2 IPFS Decentralized Storage
- **Seed Photographs**: Uploaded to Pinata/IPFS, producing image CIDs.
- **Batch Quality Reports**: Detailed JSON reports anchored on IPFS with SHA-256 hash checking.
- **Laboratory Certificates**: PDF lab reports hashed and stored on IPFS.

---

## 5. API Endpoints

### 5.1 Machine Learning Service Endpoints

#### `POST /api/ml/seed/analyze`
Accepts `multipart/form-data`:
- `batchId`: String or number
- `cropType`: Crop type (must be Soybean)
- `variety`: Variety name
- `sellerAddress`: Seller wallet
- `images`: Array of image files (JPEG, PNG, WebP)

Returns:
```json
{
  "success": true,
  "data": {
    "batchId": "JS-335-2026-01",
    "cropType": "Soybean",
    "variety": "JS-335",
    "visualQualityScore": 88.5,
    "qualityCategory": "Good",
    "totalImagesAnalyzed": 10,
    "classDistribution": {
      "Intact": 75.0,
      "Immature": 10.0,
      "Spotted": 5.0,
      "Skin-damaged": 6.0,
      "Broken": 4.0
    },
    "predictions": [
      {
        "imageId": "IMG_001",
        "predictedClass": "Intact",
        "classProbabilities": {
          "Intact": 0.92,
          "Immature": 0.03,
          "Spotted": 0.02,
          "Skin-damaged": 0.02,
          "Broken": 0.01
        },
        "confidence": 0.92
      }
    ],
    "reportCID": "bafybeireport_9f81a7d2b4",
    "reportHash": "0x9f81a7d2b4539820f4c1...",
    "modelVersion": "SeedSure-ViT-B16-v1.0",
    "assessedAt": "2026-10-30T16:00:00.000Z",
    "disclaimer": "AI Visual Seed Quality Score evaluates seed physical integrity..."
  }
}
```

#### `GET /api/ml/seed/result/:batchId`
Retrieves stored assessment report for a batch.

#### `GET /api/ml/seed/health`
Returns ML service operational status, model version, and checkpoint availability.

### 5.2 Dynamic Seller Trust Endpoints

#### `POST /api/trust/recalculate/:sellerId`
Triggers verified recalculation with optional `reason` in request body.

#### `GET /api/trust/:sellerId`
Returns current trust score, trust category, data coverage percentage, and confidence level.

#### `GET /api/trust/:sellerId/history`
Returns chronological audit history of all trust score updates with reasons and blockchain references.

#### `GET /api/trust/:sellerId/breakdown`
Returns parameter-wise breakdown of the 6 score components and actionable improvement recommendations.

---

## 6. How to Run & Verify

### 1. Running the ML Service
```bash
# Option A: Run FastAPI Server (Port 8000)
cd ml_service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Option B: Automatic CLI Subprocess Fallback
# The Node.js backend automatically runs python ml_service/inference_cli.py
# if the FastAPI HTTP server is not actively listening.
```

### 2. Verify Checkpoint Health
```bash
python ml_service/inference_cli.py --health-check
```

### 3. Run Backend API
```bash
cd backend
npm install
npm run build
npm start
```

### 4. Run Smart Contract Tests
```bash
cd blockchain
npm test
```
