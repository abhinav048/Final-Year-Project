# SeedSure: Smart Contract-Based Seed Quality & Dynamic Seller Trust Platform

[![IEEE Research Paper Prototype](https://img.shields.io/badge/Research%20Prototype-IEEE%20Target-059669.svg)](#)
[![Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20FastAPI%20%7C%20PyTorch%20%7C%20Node.js%20%7C%20Ethers.js-0284c7.svg)](#)
[![ViT Model](https://img.shields.io/badge/Model-ViT--B%2F16%20(224x224)-8b5cf6.svg)](#)
[![Solidity](https://img.shields.io/badge/Smart%20Contracts-Hardhat%20%7C%20OpenZeppelin-f59e0b.svg)](#)

> **Research Positioning**: Counterfeit seed distribution and forgeable paper lab certificates cause severe agricultural yield losses worldwide. Most blockchain agricultural solutions focus solely on post-harvest farm-to-fork tracking. **SeedSure acts before and during purchase** by combining:
> 1. **AI Visual Seed Quality Assessment** using a Vision Transformer (`ViT-B/16`) to classify physical seed defects (Intact, Broken, Immature, Skin-damaged, Spotted).
> 2. **Dynamic Seller Trust Score Engine** using historical quality scores, verified certifications, delivery rates, transaction completions, farmer ratings, and dispute records.
> 3. **Non-Custodial Smart Contract Escrow & Immutable On-Chain Audits** locking funds until farmer delivery confirmation.

---

## 🌾 Core System Architecture

```
                                      ┌─────────────────────────────────────────────────────┐
                                      │             SELLER SEED UPLOAD MODULE               │
                                      │  (Dashboard: Add Batch, Crop, Variety, Seed Images) │
                                      └──────────────────────────┬──────────────────────────┘
                                                                 │
                                                                 ▼
                                      ┌─────────────────────────────────────────────────────┐
                                      │        PYTHON ML SERVICE (FastAPI / PyTorch)        │
                                      │   ViT-B/16 (224x224 RGB, ImageNet Normalization)    │
                                      │   5 Classes: Intact, Broken, Immature, Skin-Damaged,│
                                      │              Spotted                                │
                                      └──────────────────────────┬──────────────────────────┘
                                                                 │
                                                                 ▼
                                      ┌─────────────────────────────────────────────────────┐
                                      │          AI VISUAL SEED QUALITY REPORT              │
                                      │   Visual Quality Score (0-100) & Category Breakdown │
                                      │   IPFS CID & SHA-256 Hash Anchoring                 │
                                      └──────────────────────────┬──────────────────────────┘
                                                                 │
                                                                 ▼
      ┌──────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┐
      ▼                                                                                                                     ▼
┌───────────────────────────────────────────────┐                                                     ┌───────────────────────────────────────────────┐
│           BLOCKCHAIN REGISTRIES               │                                                     │       DYNAMIC SELLER TRUST ENGINE             │
│  - SeedRegistry.sol (recordBatchQuality)      │                                                     │  - Historical Seed Quality (25%)              │
│  - TrustScoreRegistry.sol (updateWithReason)  │◄─────────────────── ORACLE SYNC ────────────────────┤  - Certification Verification (20%)           │
│  - Marketplace.sol (Escrow & Trust Gate)      │                                                     │  - Successful Delivery Rate (20%)             │
│  - FeedbackRegistry.sol (Verified Reviews)    │                                                     │  - Transaction Performance (15%)              │
└───────────────────────┬───────────────────────┘                                                     │  - Farmer Feedback (10%)                      │
                        │                                                                             │  - Complaint & Dispute Health (10%)           │
                        ▼                                                                             └───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│          FARMER & MARKETPLACE PORTAL          │
│  - Distinct AI Visual vs Seller Trust Scores  │
│  - Full Quality Report Modal & Predictions    │
│  - Smart Escrow Deposit & Delivery Confirm    │
└───────────────────────────────────────────────┘
```

---

## 🔬 ML Model & Scoring Formulations

### 1. Vision Transformer (ViT-B/16) Defect Classification
- **Notebook Implementation**: Extracted directly from `according_to_rsp_(1).ipynb`.
- **Classification Categories**: `Intact`, `Broken`, `Immature`, `Skin-damaged`, `Spotted`.
- **Input Spec**: 224×224 RGB image, normalized with ImageNet mean $[0.485, 0.456, 0.406]$ and std $[0.229, 0.224, 0.225]$.
- **Weights Location**: `ml_service/models/best_vit.pth`.
- **Prototype Scoring Formula**:
  $$\text{Visual Quality Score} = \frac{\text{Intact}\% \times 100 + \text{Immature}\% \times 55 + \text{Spotted}\% \times 40 + \text{Skin-damaged}\% \times 35 + \text{Broken}\% \times 10}{100}$$
- **Quality Categories**: Excellent (90–100), Good (75–89), Moderate (60–74), Poor (40–59), Very Poor (0–39).
- **Strict Crop Restriction**: ViT model is active strictly for **Soybean**. Unsupported crops display: *"AI visual assessment is currently available only for soybean seeds."*
- **Research Disclaimer**: AI Visual Seed Quality Score evaluates seed physical integrity and surface defects from optical photographs. It does **not** evaluate or guarantee physiological germination viability, emergence vigor, internal moisture content, or genetic purity.

### 2. Dynamic Seller Trust Score Engine
- **Evaluation Parameters**:
  - Historical AI Seed Quality (25%)
  - Certification Verification (20%)
  - Successful Delivery Rate (20%)
  - Transaction Performance (15%)
  - Farmer Feedback (10%)
  - Complaint & Dispute Health (10%)
- **Fairness Rules**:
  - Missing data is never treated as 100.
  - New sellers ($<3$ completed batches or $<2$ orders) receive status **"New Seller – Insufficient Data"**.
  - One poor batch cannot wipe out a seller's multi-year reputation.
  - Every update records an auditable timestamped reason on blockchain and database.

---

## 🛠️ Tech Stack & Directory Structure

```
Final Year Project/
├── blockchain/               # Hardhat + Solidity Smart Contracts
│   ├── contracts/
│   │   ├── SeedRegistry.sol          # Batch catalog & AI quality record oracle
│   │   ├── TrustScoreRegistry.sol    # Dynamic trust score & auditable update reason
│   │   ├── Marketplace.sol          # Non-custodial escrow & trust threshold gating
│   │   ├── FeedbackRegistry.sol     # Verified order reviews
│   │   └── SellerRegistry.sol       # Breeder accreditation & suspension
│   └── test/SeedSure.test.js        # Automated test suite (11/11 passing)
├── ml_service/               # Python ML Inference Service
│   ├── main.py                      # FastAPI server (POST /api/ml/seed/analyze)
│   ├── model.py                     # ViT-B/16 PyTorch architecture & loader
│   ├── scoring.py                   # 5-class distribution & visual quality formula
│   ├── inference_cli.py             # Subprocess CLI runner for Node.js fallback
│   ├── create_sample_weights.py     # Checkpoint weight generator
│   └── models/best_vit.pth          # Documented location for trained checkpoint
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── routes.ts                # REST endpoints for ML, Trust, Orders, Batches
│   │   ├── mlScorer.ts              # 6-factor dynamic trust calculation engine
│   │   ├── db.ts                    # SQLite database with safe migrations
│   │   ├── blockchain.ts            # EVM transaction recorder & hash checks
│   │   └── contracts.ts             # Smart contract ABIs and configs
├── frontend/                 # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── QualityReportModal.tsx         # Full 5-class distribution & predictions
│   │   │   ├── SeedQualityAssessmentModule.tsx # Seller drag & drop upload & analysis
│   │   │   ├── TrustScoreHistoryCard.tsx      # Circular score gauge & auditable log
│   │   │   └── TrustBadge.tsx                 # Dynamic category badge
│   │   └── pages/
│   │       ├── SellerDashboard.tsx  # 8 metric cards, upload module, audit history
│   │       ├── FarmerDashboard.tsx  # Escrow orders, AI quality score, report viewer
│   │       ├── SeedDetailPage.tsx   # ViT visual quality panel & IEEE disclaimer
│   │       └── MarketplacePage.tsx  # Filterable seed catalog with AI badges
└── docs/                     # Specifications and Guides
    ├── ML_SERVICE_INTEGRATION.md
    └── SMART_CONTRACT_INTEGRATION.md
```

---

## 🚀 Quick Start Guide

### Step 1: Smart Contracts (Hardhat)
```bash
# Run unit tests (11 automated tests)
npm --prefix blockchain test

# Compile contracts
npm --prefix blockchain run compile
```

### Step 2: Python ML Service
```bash
# Verify model checkpoint health
python ml_service/inference_cli.py --health-check

# (Optional) Run FastAPI standalone on port 8000
# Note: Node backend will automatically call Python CLI as fallback if FastAPI is not active!
uvicorn ml_service.main:app --port 8000 --reload
```

### Step 3: Backend REST API
```bash
cd backend
npm install
npm run build
npm start
```
*API runs at: `http://localhost:5001` (ML routes: `http://localhost:5001/api/ml/...`, Trust: `http://localhost:5001/api/trust/...`)*

### Step 4: Frontend Web Application
```bash
cd frontend
npm install
npm run build
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 🧪 Testing the Complete Workflow

1. **Seller Image Upload & ViT Analysis**:
   - Go to Seller Dashboard (`/seller`), select the **"AI Seed Quality Assessment"** tab.
   - Choose crop **Soybean**, variety **JS-335**, and drag & drop seed photographs.
   - Click **"Analyze Seed Quality"**. Watch the animated 4-step pipeline: validation $\to$ preprocessing $\to$ ViT inference $\to$ quality score calculation.
   - Inspect the interactive batch quality report with 5-class distribution stack bars and individual image predictions.
   - Click **"Confirm & Publish Batch"** to anchor the assessment on IPFS and the Ethereum smart contract.

2. **Dynamic Seller Trust Recalculation**:
   - Notice the Seller Hub displays the updated **Seller Trust Score** and an auditable entry in the **Trust Score Audit Trail** stating: `"New batch quality assessment (JS-335)"`.
   - View parameter-wise breakdown bars and actionable recommendations.

3. **Farmer Purchase & Quality Verification**:
   - Navigate to the **Marketplace** (`/marketplace`). See the **AI Visual Quality Badge** alongside the **Seller Trust Score**.
   - Open seed detail (`/seed/:id`). View the dedicated **AI Visual Seed Quality Assessment** panel, read the IEEE viability disclaimer, and click **"View Full Quality Report"**.
   - Deposit ETH in Escrow to lock payment.
   - In the Farmer Portal (`/farmer`), confirm delivery to release funds to the seller, and submit a 1–5 star review.
   - The seller's trust score automatically recalculates on the review event!

---

## ⚖️ Research Disclosure
*All agricultural crop data, breeder records, and laboratory reports used in this demonstration prototype are engineered to evaluate platform performance, cryptographic integrity, and trust scoring algorithms for an IEEE research submission.*
