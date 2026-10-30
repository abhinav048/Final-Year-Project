export interface ImagePrediction {
  imageId: string;
  predictedClass: "Intact" | "Broken" | "Immature" | "Skin-damaged" | "Spotted";
  classProbabilities: {
    Intact: number;
    Broken: number;
    Immature: number;
    "Skin-damaged": number;
    Spotted: number;
  };
  confidence: number;
  filename?: string;
  previewUrl?: string;
}

export interface ClassDistribution {
  Intact: number;
  Immature: number;
  Spotted: number;
  "Skin-damaged": number;
  Broken: number;
}

export interface AIQualityReport {
  id?: number;
  batchId: string | number;
  batchNumber?: string;
  cropType?: string;
  variety?: string;
  sellerAddress?: string;
  visualQualityScore: number;
  qualityCategory: "Excellent" | "Good" | "Moderate" | "Poor" | "Very Poor";
  totalImagesAnalyzed: number;
  totalImages?: number;
  classDistribution: ClassDistribution;
  classCounts?: Record<string, number>;
  qualityWeights?: Record<string, number>;
  predictions: ImagePrediction[];
  reportCID: string;
  reportHash: string;
  modelVersion: string;
  assessedAt: string;
  disclaimer: string;
}

export interface SeedBatch {
  id: number;
  sellerAddress: string;
  sellerName?: string;
  sellerTrustScore?: number;
  sellerRiskCategory?: string;
  sellerTrustCategory?: string;
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

  // AI Visual Seed Quality Assessment Fields (§3, §4, §5)
  aiVisualQualityScore?: number;
  aiQualityCategory?: "Excellent" | "Good" | "Moderate" | "Poor" | "Very Poor" | string;
  aiReportCID?: string;
  aiReportHash?: string;
  aiModelVersion?: string;
  aiAnalyzedAt?: string;
  aiClassDistribution?: ClassDistribution;
  aiClassDistributionJson?: string;
  images?: string[];
  imagesJson?: string;
  seedOrigin?: string;
  qualityReport?: AIQualityReport;
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
  trustCategory?: "Highly Trusted" | "Trusted" | "Average" | "Low Trust" | "Poor Trust" | "New Seller – Insufficient Data";
  confidenceLevel?: "High" | "Moderate" | "Low";
  dataCoveragePercent?: number;
  isNewSeller?: number | boolean;
  avgAiQualityScore?: number;
  recommendations?: string[];
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
  aiVisualQualityScore?: number;
  aiQualityCategory?: string;
  aiReportCID?: string;
  sellerTrustScore?: number;
  sellerRiskCategory?: string;
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
  trustCategory?: "Highly Trusted" | "Trusted" | "Average" | "Low Trust" | "Poor Trust" | "New Seller – Insufficient Data";
  confidence: number;
  confidenceLevel?: "High" | "Moderate" | "Low";
  dataCoveragePercent?: number;
  isNewSeller?: boolean;
  recommendations?: string[];
  modelVersion: string;
  featuresHash: string;
  breakdown: ScoreBreakdownItem[];
  computedAt: string;
}

export interface ScoreHistoryRecord {
  id: number;
  sellerAddress: string;
  previousScore?: number;
  score: number;
  riskCategory: string;
  modelVersion: string;
  featuresHash: string;
  triggerEvent: string;
  reason?: string;
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
