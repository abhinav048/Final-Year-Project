# SeedSure Operations & Reliability Runbook (§15.5)

This runbook outlines operational procedures for running, managing, and troubleshooting SeedSure across local and testnet deployments.

---

## 1. How to Redeploy Smart Contracts

### Local Development (Chain 31337)
```bash
# 1. Start local Hardhat or Anvil node in terminal 1
npm run blockchain:node

# 2. Deploy contracts and seed initial fixtures in terminal 2
npm run blockchain:deploy
```
The deployment script automatically:
1. Deploys `SeedRegistry.sol`, `SellerRegistry.sol`, `TrustScoreRegistry.sol`, `Marketplace.sol`, and `FeedbackRegistry.sol`.
2. Sets the `minTrustScore` threshold to `40`.
3. Grants `CERTIFIER_ROLE` to the designated CA authority.
4. Generates `frontend/src/contracts/deployedContracts.json`.

### Ethereum Sepolia Testnet
```bash
# Ensure SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY are set in blockchain/.env
make deploy-sepolia

# Verify contract source code on Sepolia Etherscan
make verify-sepolia
```

---

## 2. Rotating the AI Trust Oracle Key

The ML Trust Engine submits updated reliability scores to `TrustScoreRegistry.sol` using an account authorized with `ORACLE_ROLE`.

### Rotation Steps:
1. Generate new ECDSA keypair:
   ```bash
   openssl rand -hex 32
   ```
2. Grant `ORACLE_ROLE` to the new address via Hardhat console:
   ```typescript
   const trustRegistry = await ethers.getContractAt("TrustScoreRegistry", trustAddress);
   await trustRegistry.grantRole(await trustRegistry.ORACLE_ROLE(), NEW_ORACLE_ADDRESS);
   ```
3. Update `ORACLE_PRIVATE_KEY` in `backend/.env` (or cloud dashboard in Render/Railway).
4. Revoke `ORACLE_ROLE` from the retired address.

---

## 3. Rebuilding the Database & Index Cache

SeedSure stores an event cache of certified lots and escrow transactions. If the database is emptied or corrupted:

```bash
# Run the idempotent chain indexer
node backend/scripts/rebuild-index.js
```
The indexer will:
1. Re-query all `BatchRegistered`, `BatchCertified`, `OrderCreated`, and `DeliveryConfirmed` events from the deployment block height.
2. Reconstruct the SQL state without duplicate entries.

---

## 4. Restoring the Production Database

In production (managed Postgres on Neon/Supabase):
1. **Periodic Dump**: Automated daily dumps stored in cloud storage.
2. **Point-in-Time Recovery**:
   ```bash
   psql $DATABASE_URL < backups/seedsure_backup_latest.sql
   ```
3. **Trigger Chain Sync**: Once restored, trigger the indexer to pull any blocks mined between the backup timestamp and current block.

---

## 5. What to Do If the Faucet or RPC Is Down

### RPC Endpoint Down
- **Fallback Read-Only Endpoints**: The frontend is pre-configured with fallback public RPCs:
  - Alchemy: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
  - Infura: `https://sepolia.infura.io/v3/${INFURA_KEY}`
  - Public fallback: `https://rpc.sepolia.org` / `https://rpc2.sepolia.org`
- Check network health at [Etherscan Sepolia](https://sepolia.etherscan.io).

### Sepolia Faucets Empty / Rate Limited
1. Use alternative faucets:
   - [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
   - [QuickNode Multi-Chain Faucet](https://faucet.quicknode.com/ethereum/sepolia)
   - [PoW Faucet](https://sepolia-faucet.pk910.de)
2. **Offline Fallback Demo**: In demo/presentation mode where testnet connectivity is lost, activate the seeded local offline fixtures or use local node (`make dev`).
