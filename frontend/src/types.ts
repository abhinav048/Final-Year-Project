export interface SeedBatch {
  id: number;
  sellerAddress: string;
  sellerName?: string;
  sellerTrustScore?: number;
  sellerRiskCategory?: string;
  sellerVerified?: number;
  name: string;
  cropType: string;
  variety: string;
  batchNumber: string;
  manufacturer: string;
  germinationRate: number;
  purity: number;
  vigor: number;
  moisture: number;
  diseaseResistance: string;
  harvestDate: string;
  expiryDate: string;
  pricePerKg: number;
  availableQuantityKg: number;
  metadataCID: string;
  certificateCID: string;
  certificateHash: string;
  certificationStatus: "Certified" | "Pending" | "Revoked";
  certifiedBy?: string;
  certifiedAt?: string;
  isDemo: number;
  createdAt: string;
  reviews?: Feedback[];
  trustExplanation?: TrustExplanation;
}

export interface Seller {
  address: string;
  name: string;
  description: string;
  location: string;
  metadataCID: string;
  isVerified: number;
  isSuspended: number;
  trustScore: number;
  riskCategory: "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk";
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  deliveredOrders: number;
  delayedOrders: number;
  disputedOrders: number;
  disputesLost: number;
  certifiedBatchesCount: number;
  totalBatchesCount: number;
  avgFarmerRating: number;
  ratingCount: number;
  registeredAt: string;
  updatedAt: string;
  batches?: SeedBatch[];
  orders?: Order[];
  scoreHistory?: ScoreHistoryRecord[];
  trustDetails?: TrustExplanation;
}

export interface Order {
  id: number;
  batchId: number;
  seedName?: string;
  cropType?: string;
  batchNumber?: string;
  certificateHash?: string;
  buyerAddress: string;
  sellerAddress: string;
  sellerName?: string;
  quantityKg: number;
  totalPriceEth: number;
  status: "CREATED" | "ESCROWED" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "DISPUTED" | "REFUNDED";
  escrowLocked: number;
  escrowReleased: number;
  trackingNumber?: string;
  carrierName?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Feedback {
  id: number;
  orderId: number;
  batchId: number;
  sellerAddress: string;
  buyerAddress: string;
  rating: number;
  comment: string;
  commentCID: string;
  createdAt: string;
  quantityKg?: number;
}

export interface ScoreBreakdownItem {
  factor: string;
  weightPercent: number;
  scoreContribution: number;
  rawMetric: string;
  impact: "positive" | "negative" | "neutral";
  explanation: string;
}

export interface TrustExplanation {
  trustScore: number;
  riskCategory: "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk";
  confidence: number;
  modelVersion: string;
  featuresHash: string;
  breakdown: ScoreBreakdownItem[];
  computedAt: string;
}

export interface ScoreHistoryRecord {
  id: number;
  sellerAddress: string;
  score: number;
  riskCategory: string;
  modelVersion: string;
  featuresHash: string;
  triggerEvent: string;
  createdAt: string;
}

export interface TamperCheckResult {
  batchId: number;
  batchNumber: string;
  certificateCID: string;
  expectedHash: string;
  computedHash: string;
  tamperDetected: boolean;
  status: "PASS" | "FAIL";
  message: string;
}

export interface AnalyticsData {
  totalBatches: number;
  certifiedBatches: number;
  certificationRate: number;
  totalSellers: number;
  totalOrders: number;
  activeEscrowEth: number;
  avgTrustScore: number;
  cropDistribution: { cropType: string; count: number }[];
  riskDistribution: { riskCategory: string; count: number }[];
  contractAddresses: Record<string, string>;
}
