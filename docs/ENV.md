# Environment Variables Specification (§15.3)

This document details every environment variable used across the SeedSure frontend, backend, smart contract deployment, and ML services.

---

## 1. Frontend (`frontend/.env`)

| Variable | Scope | Set In | Purpose | Fallback / If Missing |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Frontend | Local / Vercel | Base URL for Node.js backend REST API | Defaults to `http://localhost:5001` |
| `VITE_SEPOLIA_RPC` | Frontend | Local / Vercel | Read-only RPC provider for Sepolia contract queries | Falls back to public `https://rpc.sepolia.org` |
| `VITE_EXPLORER_URL`| Frontend | Local / Vercel | Block explorer base URL | Defaults to `https://sepolia.etherscan.io` |
| `VITE_DEMO_INR_RATE`| Frontend | Local / Vercel | Simulated Indian Rupee conversion rate per ETH | Defaults to `280000` |

---

## 2. Backend (`backend/.env`)

| Variable | Scope | Set In | Purpose | Failure Mode If Missing |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Backend | Local / Render | HTTP port for Express server | Defaults to `5001` |
| `NODE_ENV` | Backend | Local / Render | Node runtime environment | Defaults to `development` |
| `DATABASE_URL` | Backend | Render / Supabase | Postgres connection URI in production | In local dev, falls back to SQLite |
| `RPC_URL` | Backend | Local / Render | Ethereum RPC provider connection | Backend cannot query block state or index events |
| `ORACLE_PRIVATE_KEY`| Backend | Render Secrets | Private key with `ORACLE_ROLE` for updating trust scores | Trust score updates will fail on-chain |
| `PINATA_JWT` | Backend | Render Secrets | Pinata API token for IPFS certificate pin requests | Falls back to simulated local IPFS CID generation |
| `PINATA_GATEWAY` | Backend | Render Secrets | Public or dedicated IPFS gateway domain | Defaults to `https://gateway.pinata.cloud/ipfs/` |
| `CORS_ORIGIN` | Backend | Local / Render | Allowed frontend origins (comma-separated) | Defaults to `http://localhost:5173` |
| `ML_SERVICE_URL` | Backend | Local / Render | FastAPI ML service base URL | Defaults to `http://127.0.0.1:8000` (CLI fallback) |
| `ML_WEIGHTS_PATH` | Backend / ML | Local / Render | Path to `best_vit.pth` weights | Defaults to `ml_service/models/best_vit.pth` |

---

## 2.1 Python ML Service (`ml_service/.env`)

| Variable | Scope | Set In | Purpose | Fallback / If Missing |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | ML Service | Local / Cloud | FastAPI HTTP server port | Defaults to `8000` |
| `MODEL_WEIGHTS_PATH` | ML Service | Local / Cloud | Absolute/relative path to ViT checkpoint | `ml_service/models/best_vit.pth` |
| `DEVICE` | ML Service | Local / Cloud | PyTorch compute device (`cuda` or `cpu`) | Automatically selects CUDA if available, else CPU |

## 3. Blockchain (`blockchain/.env`)

| Variable | Scope | Set In | Purpose | Failure Mode If Missing |
| :--- | :--- | :--- | :--- | :--- |
| `SEPOLIA_RPC_URL` | Deployer | Local / CI | Alchemy / Infura Sepolia RPC URL | Cannot deploy to Sepolia testnet |
| `DEPLOYER_KEY` | Deployer | Local Secrets | Private key of contract deployer wallet | Hardhat cannot sign deployment transactions |
| `ETHERSCAN_API_KEY`| Verifier | Local Secrets | Etherscan API key for automated source code verification | `npx hardhat verify` will fail |

---

## 4. Startup Validation

The backend includes startup assertions that check for critical configuration:
- In `production`, missing `DATABASE_URL` halts execution immediately with code `1`.
- In `production`, missing `RPC_URL` logs a critical alert and locks on-chain transaction indexing.
