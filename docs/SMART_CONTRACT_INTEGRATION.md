# SeedSure — Smart Contract Integration Guide

This guide describes how to connect your Solidity smart contracts (`SellerRegistry.sol`, `SeedRegistry.sol`, `TrustScoreRegistry.sol`, `Marketplace.sol`, `Escrow.sol`, `FeedbackRegistry.sol`) to the SeedSure Frontend and Backend.

---

## 1. Contract Addresses & Configuration

The backend and frontend read contract addresses from `backend/src/contracts.ts` and environment variables. Update your `.env` in `backend/` or set:

```env
SELLER_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
SEED_REGISTRY_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
TRUST_SCORE_REGISTRY_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
MARKETPLACE_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
ESCROW_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
FEEDBACK_REGISTRY_ADDRESS=0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
```

---

## 2. Expected Contract Interfaces & Events

### A. SellerRegistry
```solidity
function registerSeller(string calldata metadataCID) external;
function verifySeller(address seller) external; // AccessControl: CERTIFIER_ROLE
function suspendSeller(address seller) external; // AccessControl: DEFAULT_ADMIN_ROLE
function unsuspendSeller(address seller) external;

event SellerRegistered(address indexed seller, string metadataCID);
event SellerVerified(address indexed seller, address indexed certifier);
event SellerSuspended(address indexed seller);
```

### B. SeedRegistry
```solidity
function registerBatch(
    string calldata name,
    string calldata cropType,
    string calldata variety,
    string calldata batchNumber,
    string calldata manufacturer,
    uint16 germinationRate, // e.g. 945 = 94.5%
    uint16 purity,
    uint16 vigor,
    uint16 moisture,
    string calldata diseaseResistance,
    uint256 expiryDate,
    uint256 pricePerKg,
    uint256 availableQuantity,
    string calldata metadataCID,
    string calldata certificateCID,
    bytes32 certificateHash // SHA-256 hash of lab report
) external returns (uint256 batchId);

function certifyBatch(uint256 batchId) external; // CERTIFIER_ROLE
function revokeBatch(uint256 batchId, string calldata reason) external;

event BatchRegistered(uint256 indexed batchId, address indexed seller, string batchNumber, bytes32 certificateHash);
event BatchCertified(uint256 indexed batchId, address indexed certifier);
event BatchRevoked(uint256 indexed batchId, address indexed certifier, string reason);
```

### C. TrustScoreRegistry
```solidity
function updateTrustScore(
    address seller,
    uint8 score, // 0 to 100
    string calldata riskCategory, // "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk"
    string calldata modelVersion, // e.g. "SeedSure-ML-v1.4"
    bytes32 featuresHash // keccak256 or sha256 of canonical feature vector
) external; // ORACLE_ROLE

event TrustScoreUpdated(address indexed seller, uint8 score, string riskCategory, string modelVersion, bytes32 featuresHash);
```

### D. Marketplace & Escrow
```solidity
function createOrder(uint256 batchId, uint256 quantity) external payable returns (uint256 orderId);
function shipOrder(uint256 orderId, string calldata trackingCID) external;
function confirmDelivery(uint256 orderId) external; // Releases escrow to seller
function disputeOrder(uint256 orderId, string calldata evidenceCID) external;
function resolveDispute(uint256 orderId, uint8 outcome) external; // DISPUTE_RESOLVER_ROLE
function setMinTrustScore(uint8 newMinScore) external; // DEFAULT_ADMIN_ROLE

event OrderCreated(uint256 indexed orderId, uint256 indexed batchId, address indexed buyer, address seller, uint256 quantity, uint256 totalPrice);
event PaymentEscrowed(uint256 indexed orderId, uint256 amount);
event OrderShipped(uint256 indexed orderId, string trackingCID);
event DeliveryConfirmed(uint256 indexed orderId);
event PaymentReleased(uint256 indexed orderId, address indexed seller, uint256 amount);
event OrderDisputed(uint256 indexed orderId, address indexed buyer, string evidenceCID);
```

### E. FeedbackRegistry
```solidity
function submitFeedback(uint256 orderId, uint8 rating, string calldata commentCID) external;
event FeedbackSubmitted(uint256 indexed orderId, address indexed buyer, address indexed seller, uint8 rating, string commentCID);
```

---

## 3. Cryptographic Tamper Checking
When registering batches, `certificateHash` is computed as:
$$\text{certificateHash} = \text{SHA256}(\text{document bytes})$$
The client-side `TamperCheckModal` downloads the document from the IPFS gateway, recomputes the SHA-256 hash in JavaScript/Node, and validates whether it matches `certificateHash` stored on-chain.
