import crypto from "crypto";

// Default Anvil accounts for quick local testing and role mapping
export const DEFAULT_ACCOUNTS = {
  admin: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  certifier: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  oracle: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  disputeResolver: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  seller1: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  seller2: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
  farmer1: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
};

export const CONTRACT_ADDRESSES = {
  sellerRegistry: process.env.SELLER_REGISTRY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  seedRegistry: process.env.SEED_REGISTRY_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  trustScoreRegistry: process.env.TRUST_SCORE_REGISTRY_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  marketplace: process.env.MARKETPLACE_ADDRESS || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  escrow: process.env.ESCROW_ADDRESS || "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  feedbackRegistry: process.env.FEEDBACK_REGISTRY_ADDRESS || "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};

// Full ABI definitions for smart contract integration
export const CONTRACT_ABIS = {
  SellerRegistry: [
    "function registerSeller(string metadataCID) external",
    "function verifySeller(address seller) external",
    "function suspendSeller(address seller) external",
    "function unsuspendSeller(address seller) external",
    "function getSeller(address seller) external view returns (tuple(address sellerAddress, string metadataCID, bool isVerified, bool isSuspended, uint256 totalOrders, uint256 successfulOrders, uint256 failedOrders, uint256 deliveredOrders, uint256 delayedOrders, uint256 disputedOrders, uint256 disputesLost, uint256 registeredAt))",
    "event SellerRegistered(address indexed seller, string metadataCID)",
    "event SellerVerified(address indexed seller, address indexed certifier)",
    "event SellerSuspended(address indexed seller)",
    "event SellerUnsuspended(address indexed seller)"
  ],
  SeedRegistry: [
    "function registerBatch(string name, string cropType, string variety, string batchNumber, string manufacturer, uint16 germinationRate, uint16 purity, uint16 vigor, uint16 moisture, string diseaseResistance, uint256 expiryDate, uint256 pricePerKg, uint256 availableQuantity, string metadataCID, string certificateCID, bytes32 certificateHash) external returns (uint256)",
    "function certifyBatch(uint256 batchId) external",
    "function revokeBatch(uint256 batchId, string reason) external",
    "function verifyBatch(uint256 batchId, bytes32 testHash) external view returns (bool isValid, bool isCertified)",
    "function getBatch(uint256 batchId) external view returns (tuple(uint256 batchId, address seller, string name, string cropType, string variety, string batchNumber, uint16 germinationRate, uint16 purity, uint16 vigor, uint16 moisture, uint256 pricePerKg, uint256 availableQuantity, uint8 status, bytes32 certificateHash, string certificateCID))",
    "function recordBatchQualityAssessment(uint256 batchId, uint8 visualQualityScore, string qualityCategory, string reportCID, bytes32 reportHash, string modelVersion) external",
    "function getBatchQualityAssessment(uint256 batchId) external view returns (uint8 visualQualityScore, string qualityCategory, string reportCID, bytes32 reportHash, string modelVersion, uint256 assessedAt, bool isAssessed)",
    "event BatchRegistered(uint256 indexed batchId, address indexed seller, string batchNumber, bytes32 certificateHash)",
    "event BatchCertified(uint256 indexed batchId, address indexed certifier)",
    "event BatchRevoked(uint256 indexed batchId, address indexed certifier, string reason)",
    "event BatchQualityAssessed(uint256 indexed batchId, uint8 visualQualityScore, string qualityCategory, string reportCID, bytes32 reportHash, string modelVersion, uint256 assessedAt)"
  ],
  TrustScoreRegistry: [
    "function updateTrustScore(address seller, uint8 score, string riskCategory, string modelVersion, bytes32 featuresHash) external",
    "function updateTrustScoreWithReason(address seller, uint8 score, string riskCategory, string modelVersion, bytes32 featuresHash, string reason) external",
    "function getTrustScore(address seller) external view returns (uint8 score, string riskCategory, uint256 updatedAt, string modelVersion, bytes32 featuresHash)",
    "function getTrustScoreHistoryCount(address seller) external view returns (uint256)",
    "function getTrustScoreHistoryItem(address seller, uint256 index) external view returns (uint8 previousScore, uint8 newScore, string riskCategory, string modelVersion, bytes32 featuresHash, string reason, uint256 timestamp)",
    "event TrustScoreUpdated(address indexed seller, uint8 score, string riskCategory, string modelVersion, bytes32 featuresHash)",
    "event TrustScoreUpdatedWithReason(address indexed seller, uint8 previousScore, uint8 newScore, string riskCategory, string modelVersion, bytes32 featuresHash, string reason, uint256 timestamp)"
  ],
  Marketplace: [
    "function createOrder(uint256 batchId, uint256 quantity) external payable returns (uint256 orderId)",
    "function shipOrder(uint256 orderId, string trackingCID) external",
    "function confirmDelivery(uint256 orderId) external",
    "function disputeOrder(uint256 orderId, string evidenceCID) external",
    "function resolveDispute(uint256 orderId, uint8 outcome) external",
    "function setMinTrustScore(uint8 newMinScore) external",
    "event OrderCreated(uint256 indexed orderId, uint256 indexed batchId, address indexed buyer, address seller, uint256 quantity, uint256 totalPrice)",
    "event PaymentEscrowed(uint256 indexed orderId, uint256 amount)",
    "event OrderShipped(uint256 indexed orderId, string trackingCID)",
    "event DeliveryConfirmed(uint256 indexed orderId)",
    "event PaymentReleased(uint256 indexed orderId, address indexed seller, uint256 amount)",
    "event OrderDisputed(uint256 indexed orderId, address indexed buyer, string evidenceCID)",
    "event DisputeResolved(uint256 indexed orderId, uint8 outcome)"
  ],
  FeedbackRegistry: [
    "function submitFeedback(uint256 orderId, uint8 rating, string commentCID) external",
    "function getFeedback(uint256 orderId) external view returns (tuple(uint256 orderId, address buyer, address seller, uint8 rating, string commentCID, uint256 timestamp))",
    "event FeedbackSubmitted(uint256 indexed orderId, address indexed buyer, address indexed seller, uint8 rating, string commentCID)"
  ]
};

// Cryptographic utilities
export function computeSha256(data: Buffer | string): string {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return "0x" + hash.digest("hex");
}

export function computeKeccak256(str: string): string {
  // Pure Node.js keccak or sha256 hex fallback
  const hash = crypto.createHash("sha256");
  hash.update(Buffer.from(str, "utf8"));
  return "0x" + hash.digest("hex");
}
