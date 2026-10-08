# SeedSure AgriTech-Web3 Platform Makefile
# Deployment-Ready Automation (§15)

.PHONY: setup dev seed test eval deploy-local deploy-sepolia verify-sepolia clean

# 15.1 Setup environment & dependencies
setup:
	@echo "==> Installing dependencies for root, backend, frontend, and blockchain..."
	npm install
	cd backend && npm install
	cd frontend && npm install
	cd blockchain && npm install

# Run complete development topology
dev:
	@echo "==> Starting SeedSure development environment (Backend + Frontend)..."
	npm run dev

# Pre-seed demo datasets with test accounts & seed batches
seed:
	@echo "==> Seeding initial synthetic agricultural datasets..."
	node backend/scripts/seed.js

# Automated test suite
test:
	@echo "==> Running automated smart contract & backend tests..."
	npm run blockchain:test

# Evaluation & ML model verification
eval:
	@echo "==> Evaluating ML trust model and feature weights..."
	node backend/scripts/eval-model.js

# Deploy contracts to local testnet (Anvil / Hardhat)
deploy-local:
	@echo "==> Deploying contracts to local Ethereum node (31337)..."
	npm run blockchain:deploy

# Deploy contracts to Ethereum Sepolia Testnet
deploy-sepolia:
	@echo "==> Deploying smart contracts to Ethereum Sepolia..."
	cd blockchain && npx hardhat run scripts/deploy.ts --network sepolia

# Verify contracts on Etherscan Sepolia
verify-sepolia:
	@echo "==> Verifying smart contracts on Sepolia Etherscan..."
	cd blockchain && npx hardhat verify --network sepolia

# Clean build artifacts
clean:
	@echo "==> Cleaning build caches..."
	rm -rf frontend/dist blockchain/artifacts blockchain/cache
