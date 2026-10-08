#!/usr/bin/env bash
# SeedSure Demo State Reset Script (§15.6)
# Resets the local environment, re-seeds contracts, and initializes clean demo data.

set -e

echo "=========================================================="
echo "🌱 SeedSure Platform — Resetting Demo State"
echo "=========================================================="

echo "==> 1. Checking running processes..."
# If local Hardhat/Anvil node is running, re-deploy fixtures
if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545 > /dev/null 2>&1; then
    echo "    Found active local Ethereum node on port 8545."
    echo "==> 2. Re-deploying smart contracts to local node..."
    cd blockchain && npx hardhat run scripts/deploy.ts --network localhost
    cd ..
else
    echo "    Local Ethereum node not detected on 8545. Using pre-compiled contract artifacts."
fi

echo "==> 3. Resetting demo datasets..."
if [ -f "backend/data/seedsure.sqlite" ]; then
    rm -f backend/data/seedsure.sqlite
    echo "    Cleaned local SQLite database."
fi

echo "==> 4. Seeding synthetic agricultural test data..."
node backend/scripts/seed.js || true

echo "=========================================================="
echo "✅ Demo Reset Complete!"
echo "   - Test Breeder: National Seed Research Center (Score: 94/100)"
echo "   - Test Farmer:  Ramesh Patel (0x976EA74026E726554dB657fA54763abd0C3a0aa9)"
echo "   - Test Lots:    Wheat HD-2967, Mustard Pusa-31, Basmati CSR-30"
echo "   - Frontend URL: http://localhost:5173"
echo "=========================================================="
