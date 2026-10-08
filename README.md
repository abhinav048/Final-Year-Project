# SeedSure: Smart Contract-Based Seed Quality & Seller Trust Platform

[![IEEE Research Paper Prototype](https://img.shields.io/badge/Research%20Prototype-IEEE%20Target-059669.svg)](#)
[![Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Node.js%20%7C%20TypeScript%20%7C%20Ethers.js-0284c7.svg)](#)
[![Data Status](https://img.shields.io/badge/Dataset-Synthetic%20Demo%20Data-d97706.svg)](#)

> **Research Positioning**: Counterfeit seed distribution and forgeable paper lab certificates cause severe agricultural yield losses. Most blockchain agricultural solutions focus solely on post-harvest farm-to-fork tracking. **SeedSure acts before and during purchase** by combining immutable cryptographic batch records, dynamic ML-driven seller trust scoring, and non-custodial smart contract escrow.

---

## 🌾 System Components Implemented

### 1. Frontend Web Application (`/frontend`)
- **AgriTech-Web3 Design System**: Built with React, Vite, TypeScript, and modern styling (forest & emerald greens, warm earth amber, glassmorphism, responsive cards).
- **Certified Marketplace (`/marketplace`)**: Real-time search, category filters (Cereals, Pulses, Oilseeds, Vegetables, Cash Crops), trust score sliders, and safety gating.
- **Trust Gate Protection**: Sellers with trust scores below threshold (<40/100) are automatically blocked from escrow purchases.
- **Seed Detail & Lab Report (`/seed/:id`)**: Comprehensive quality parameters (germination %, genetic purity, vigor, moisture, disease resistance genes, harvest/expiry dates).
- **Interactive Cryptographic Tamper Check**: Re-hashes certificates with client-side SHA-256, compares against immutable on-chain record with an interactive *"Simulate Adversarial Tampering"* toggle demonstrating **`PASS`** vs **`FAIL / FORGERY DETECTED`**.
- **Dynamic Trust Explainability ("Why this score?")**: Decomposes the seller's score into real feature contributions (Certification ratio, on-time delivery, transaction success, ratings, disputes).
- **Physical Seed Bag QR Tag (`/verify/seed/:id`)**: Mobile-friendly QR code generation and direct verification scanner.
- **Role Dashboards**:
  - **Farmer Portal (`/farmer`)**: Active orders in escrow, one-click *"Confirm Delivery & Release Escrow"*, verified 1-5 star reviews, and escrow dispute raising.
  - **Seller Hub (`/seller`)**: Registered batch lots, inventory tracking, order dispatch with carrier tracking numbers, and *"Register New Seed Batch"* wizard.
  - **CA & Admin Console (`/admin`)**: Certification Authority queue to audit and certify/revoke seed batches on-chain, seller compliance vetting, and escrow dispute arbitration.

### 2. Blockchain Smart Contract Suite (`/blockchain`)
- **Hardhat + Solidity (^0.8.24) with OpenZeppelin v5**:
  - `SellerRegistry.sol`: Breeder accreditation, verification by Certifiers, suspension governance, and fulfillment metrics.
  - `SeedRegistry.sol`: Immutable seed lot catalog, quality testing parameters, and SHA-256 certificate hashes with CA certification & revocation.
  - `TrustScoreRegistry.sol`: Decentralized ML oracle recording dynamic trust scores and `featuresHash` audit vectors.
  - `Marketplace.sol`: Non-custodial ETH escrow locking funds during shipping, automated delivery release, arbitration, and farmer protection gating.
  - `FeedbackRegistry.sol`: Verifiable farmer review ledger tied to completed escrow orders, eliminating review inflation and Sybil attacks.
- **On-Chain Explorer (`/blockchain`)**: Real-time EVM block height, contract directory, interactive smart contract tamper verification testbench, and live transaction ledger.
- **Automated Hardhat Test Suite**: 9 comprehensive automated tests verifying all contracts, escrow flows, disputes, and cryptographic tamper checks.

### 3. Backend REST API & Rebuildable Cache (`/backend`)
- **Node.js + Express + TypeScript**: High-performance REST service.
- **SQLite Database (`better-sqlite3`)**: Rebuildable cache storing batches, sellers, escrow orders, feedback, and score history.
- **Blockchain Service**: Dual mode connectivity (live Hardhat/Anvil RPC or EVM simulated fallback), live transaction recording, and smart contract verification endpoints.
- **Pre-Seeded Synthetic Dataset**: 5 varied breeder personas and certified agricultural seed batches.
- **Dynamic Multi-Factor ML Scorer**: Implements the 5-factor mathematical weighting model with exponential recency decay and on-chain auditability verification.

---

## 🚀 Quick Start Guide

### Step 1: Run Smart Contract Tests & Deploy (Optional / Pre-Configured)
```bash
# Run contract test suite
npm run blockchain:test

# Compile contracts
npm run blockchain:compile

# Deploy to local network or in-memory
npm run blockchain:deploy
```

### Step 2: Start the Backend API
```bash
cd backend
npm install
npm run build
npm start
```
*Backend runs at: `http://localhost:5001` (API: `http://localhost:5001/api`)*

### Step 3: Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

*Alternatively, run both concurrently from root with `npm run dev`.*

---

## 🧪 Interactive Demo Walkthrough

1. Open `http://localhost:5173/` in your browser.
2. Click **Explore Certified Marketplace** (`/marketplace`).
3. Notice the trust score badges (e.g., `94/100 Excellent` for AgriGrow, `38/100 High Risk` for QuickSeeds).
4. Click **Buy Escrow** on an unvetted seller to see the **Farmer Protection Gate** block high-risk transactions.
5. Click on **Wheat HD-2967** to open its detail page (`/seed/1`).
6. Click **Test Cryptographic Tamper Check**:
   - Click *Run Authenticity Verification* -> Result: **`TAMPER CHECK: PASS`**.
   - Toggle *Simulate Adversarial Tampering* -> Result: **`TAMPER CHECK: FAIL (FORGERY DETECTED)`**.
7. Click **Generate Seed Bag QR Tag** to view the physical bag tag linking to `/verify/seed/1`.
8. Switch test personas using the top-right header dropdown to explore the **Farmer Portal**, **Seller Hub**, and **CA Certifier Console**.

---

## 📑 Integration Specifications for Blockchain & ML

- [Smart Contract Integration Specification](file:///c:/Users/abhin/OneDrive/Desktop/Final%20Year%20Project/docs/SMART_CONTRACT_INTEGRATION.md) — Contract ABIs, functions, events, and addresses.
- [ML Service Integration Specification](file:///c:/Users/abhin/OneDrive/Desktop/Final%20Year%20Project/docs/ML_SERVICE_INTEGRATION.md) — Feature vectors, mathematical formulas, and `featuresHash` audit verification.

---

## ⚖️ Research Disclosure
*All agricultural crop data, breeder records, and laboratory reports used in this demonstration prototype are synthetic representations engineered to evaluate platform performance, cryptographic integrity, and trust scoring algorithms for an IEEE research submission.*
