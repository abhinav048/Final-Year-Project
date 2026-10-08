export const CONTRACT_ABIS = {
  SellerRegistry: [
    "function registerSeller(string metadataCID) external",
    "function verifySeller(address seller) external",
    "function suspendSeller(address seller) external",
    "function unsuspendSeller(address seller) external",
    "function getSeller(address seller) external view returns (tuple(address sellerAddress, string metadataCID, bool isVerified, bool isSuspended, uint256 totalOrders, uint256 successfulOrders, uint256 failedOrders, uint256 deliveredOrders, uint256 delayedOrders, uint256 disputedOrders, uint256 disputesLost, uint256 registeredAt))",
    "function isSellerActive(address seller) external view returns (bool)",
    "function getSellerCount() external view returns (uint256)",
    "event SellerRegistered(address indexed seller, string metadataCID)",
    "event SellerVerified(address indexed seller, address indexed certifier)",
    "event SellerSuspended(address indexed seller)",
    "event SellerUnsuspended(address indexed seller)",
    "event SellerMetricsUpdated(address indexed seller, uint256 totalOrders, uint256 successfulOrders)"
  ],
  SeedRegistry: [
    "function registerBatch(string name, string cropType, string variety, string batchNumber, string manufacturer, uint16 germinationRate, uint16 purity, uint16 vigor, uint16 moisture, string diseaseResistance, uint256 expiryDate, uint256 pricePerKg, uint256 availableQuantity, string metadataCID, string certificateCID, bytes32 certificateHash) external returns (uint256)",
    "function certifyBatch(uint256 batchId) external",
    "function revokeBatch(uint256 batchId, string reason) external",
    "function verifyBatch(uint256 batchId, bytes32 testHash) external view returns (bool isValid, bool isCertified)",
    "function getBatch(uint256 batchId) external view returns (tuple(uint256 batchId, address seller, string name, string cropType, string variety, string batchNumber, uint16 germinationRate, uint16 purity, uint16 vigor, uint16 moisture, uint256 pricePerKg, uint256 availableQuantity, uint8 status, bytes32 certificateHash, string certificateCID))",
    "function totalBatches() external view returns (uint256)",
    "event BatchRegistered(uint256 indexed batchId, address indexed seller, string batchNumber, bytes32 certificateHash)",
    "event BatchCertified(uint256 indexed batchId, address indexed certifier)",
    "event BatchRevoked(uint256 indexed batchId, address indexed certifier, string reason)",
    "event BatchQuantityUpdated(uint256 indexed batchId, uint256 remainingQuantity)"
  ],
  TrustScoreRegistry: [
    "function updateTrustScore(address seller, uint8 score, string riskCategory, string modelVersion, bytes32 featuresHash) external",
    "function getTrustScore(address seller) external view returns (uint8 score, string riskCategory, uint256 updatedAt, string modelVersion, bytes32 featuresHash)",
    "function meetsTrustThreshold(address seller, uint8 minScore) external view returns (bool)",
    "event TrustScoreUpdated(address indexed seller, uint8 score, string riskCategory, string modelVersion, bytes32 featuresHash)"
  ],
  Marketplace: [
    "function createOrder(uint256 batchId, uint256 quantity) external payable returns (uint256 orderId)",
    "function shipOrder(uint256 orderId, string trackingCID) external",
    "function confirmDelivery(uint256 orderId) external",
    "function disputeOrder(uint256 orderId, string evidenceCID) external",
    "function resolveDispute(uint256 orderId, uint8 outcome) external",
    "function setMinTrustScore(uint8 newMinScore) external",
    "function getOrder(uint256 orderId) external view returns (tuple(uint256 orderId, uint256 batchId, address buyer, address seller, uint256 quantity, uint256 totalPrice, uint8 status, string trackingCID, string disputeEvidenceCID, uint256 createdAt, uint256 shippedAt, uint256 completedAt))",
    "function totalOrders() external view returns (uint256)",
    "function minTrustScore() external view returns (uint8)",
    "event OrderCreated(uint256 indexed orderId, uint256 indexed batchId, address indexed buyer, address seller, uint256 quantity, uint256 totalPrice)",
    "event PaymentEscrowed(uint256 indexed orderId, uint256 amount)",
    "event OrderShipped(uint256 indexed orderId, string trackingCID)",
    "event DeliveryConfirmed(uint256 indexed orderId)",
    "event PaymentReleased(uint256 indexed orderId, address indexed seller, uint256 amount)",
    "event OrderDisputed(uint256 indexed orderId, address indexed buyer, string evidenceCID)",
    "event DisputeResolved(uint256 indexed orderId, uint8 outcome)",
    "event MinTrustScoreUpdated(uint8 oldScore, uint8 newScore)"
  ],
  FeedbackRegistry: [
    "function submitFeedback(uint256 orderId, uint8 rating, string commentCID) external",
    "function getFeedback(uint256 orderId) external view returns (tuple(uint256 orderId, address buyer, address seller, uint8 rating, string commentCID, uint256 timestamp))",
    "function hasFeedback(uint256 orderId) external view returns (bool)",
    "event FeedbackSubmitted(uint256 indexed orderId, address indexed buyer, address indexed seller, uint8 rating, string commentCID)"
  ]
};
