import { computeSha256 } from "./contracts.js";

export interface SellerFeatures {
  sellerAddress: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  deliveredOrders: number;
  delayedOrders: number;
  disputedOrders: number;
  disputesLost: number;
  certifiedBatchesCount: number;
  totalBatchesCount: number;
  avgFarmerRating: number;      // 1.0 to 5.0
  ratingCount: number;
  accountAgeDays: number;
  daysSinceLastActivity: number;
}

export interface ScoreBreakdownItem {
  factor: string;
  weightPercent: number;
  scoreContribution: number;
  rawMetric: string;
  impact: "positive" | "negative" | "neutral";
  explanation: string;
}

export interface TrustScoreResult {
  trustScore: number;           // 0 to 100
  riskCategory: "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk";
  confidence: number;           // 0.0 to 1.0
  modelVersion: string;
  featuresHash: string;
  breakdown: ScoreBreakdownItem[];
  rawFeatures: SellerFeatures;
  computedAt: string;
}

/**
 * SeedSure Dynamic Multi-Factor Trust Scoring Engine
 * Implements exponential time recency decay and multi-objective performance evaluation
 * Baseline aligned with IEEE Research Paper specifications:
 * - Certification validity & ratio: 25%
 * - On-time delivery rate: 25%
 * - Transaction success rate: 20%
 * - Farmer rating & feedback: 15%
 * - Complaint & dispute rate: 15%
 */
export function calculateTrustScore(features: SellerFeatures): TrustScoreResult {
  const modelVersion = "SeedSure-ML-v1.4";

  // 1. Certified Batch Ratio (Weight: 25%)
  const certRatio = features.totalBatchesCount > 0 
    ? features.certifiedBatchesCount / features.totalBatchesCount 
    : 0.5;
  const certScore = Math.min(100, Math.max(0, certRatio * 100));

  // 2. On-Time Delivery Rate (Weight: 25%)
  const deliveryRatio = features.totalOrders > 0
    ? (features.deliveredOrders - features.delayedOrders * 0.5) / features.totalOrders
    : 0.8;
  const deliveryScore = Math.min(100, Math.max(0, Math.max(0, deliveryRatio) * 100));

  // 3. Transaction Success Rate (Weight: 20%)
  const successRatio = features.totalOrders > 0
    ? features.successfulOrders / features.totalOrders
    : 0.85;
  const successScore = Math.min(100, Math.max(0, successRatio * 100));

  // 4. Farmer Rating (Weight: 15%)
  // Normalized 1-5 stars to 0-100 scale, with Bayesian prior adjustment for low sample size
  const priorRating = 3.5;
  const priorWeight = 3;
  const bayesianRating = (features.avgFarmerRating * features.ratingCount + priorRating * priorWeight) / (features.ratingCount + priorWeight);
  const ratingScore = Math.min(100, Math.max(0, ((bayesianRating - 1) / 4) * 100));

  // 5. Dispute & Complaint Penalty (Weight: 15%)
  const disputePenaltyRate = features.totalOrders > 0
    ? (features.disputesLost * 2.0 + features.disputedOrders * 0.5) / features.totalOrders
    : 0;
  const disputeScore = Math.min(100, Math.max(0, 100 - disputePenaltyRate * 100));

  // 6. Recency Decay Factor: Active sellers retain credibility; inactive decay slightly
  const halfLifeDays = 90;
  const recencyMultiplier = Math.exp(-0.693 * (features.daysSinceLastActivity / halfLifeDays));
  // Bound recency effect between 0.90 and 1.00 so historical score is preserved reasonably
  const recencyWeight = 0.90 + 0.10 * Math.max(0, Math.min(1, recencyMultiplier));

  // Composite Weighted Sum
  const rawWeightedScore = (
    certScore * 0.25 +
    deliveryScore * 0.25 +
    successScore * 0.20 +
    ratingScore * 0.15 +
    disputeScore * 0.15
  ) * recencyWeight;

  const trustScore = Math.round(Math.min(100, Math.max(0, rawWeightedScore)));

  // Risk Classification
  let riskCategory: "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk" = "Moderate";
  if (trustScore >= 90) riskCategory = "Excellent";
  else if (trustScore >= 75) riskCategory = "Trusted";
  else if (trustScore >= 60) riskCategory = "Moderate";
  else if (trustScore >= 40) riskCategory = "Low";
  else riskCategory = "High Risk";

  // Confidence based on sample volume
  const totalEvidence = features.totalOrders + features.totalBatchesCount + features.ratingCount;
  const confidence = Math.min(0.99, parseFloat((0.40 + Math.min(0.58, totalEvidence * 0.04)).toFixed(2)));

  // Canonical features JSON for tamper-proof on-chain hashing
  const canonicalJson = JSON.stringify({
    seller: features.sellerAddress.toLowerCase(),
    orders: features.totalOrders,
    success: features.successfulOrders,
    delivered: features.deliveredOrders,
    disputesLost: features.disputesLost,
    certBatches: features.certifiedBatchesCount,
    totalBatches: features.totalBatchesCount,
    rating: parseFloat(features.avgFarmerRating.toFixed(2)),
    score: trustScore,
    model: modelVersion
  });
  const featuresHash = computeSha256(canonicalJson);

  // Explainability breakdown ("Why this score?")
  const breakdown: ScoreBreakdownItem[] = [
    {
      factor: "Lab Certification Ratio",
      weightPercent: 25,
      scoreContribution: Math.round(certScore * 0.25),
      rawMetric: `${features.certifiedBatchesCount} / ${features.totalBatchesCount} batches certified (${Math.round(certRatio * 100)}%)`,
      impact: certScore >= 80 ? "positive" : certScore >= 50 ? "neutral" : "negative",
      explanation: certScore >= 80 
        ? "Consistently certifies seed lots with authorized Agricultural Testing Laboratories."
        : "Uncertified or pending batches reduce compliance weighting."
    },
    {
      factor: "On-Time Delivery Performance",
      weightPercent: 25,
      scoreContribution: Math.round(deliveryScore * 0.25),
      rawMetric: `${features.deliveredOrders} delivered (${features.delayedOrders} delayed)`,
      impact: deliveryScore >= 80 ? "positive" : deliveryScore >= 50 ? "neutral" : "negative",
      explanation: deliveryScore >= 80 
        ? "High fulfillment reliability ensures farmers receive seeds in planting season."
        : "Recorded shipment delays reduce operational fulfillment score."
    },
    {
      factor: "Transaction Success Rate",
      weightPercent: 20,
      scoreContribution: Math.round(successScore * 0.20),
      rawMetric: `${features.successfulOrders} successful / ${features.totalOrders} total orders`,
      impact: successScore >= 85 ? "positive" : "negative",
      explanation: "Measures seamless order completions without cancellation or default."
    },
    {
      factor: "Farmer Community Rating",
      weightPercent: 15,
      scoreContribution: Math.round(ratingScore * 0.15),
      rawMetric: `${features.avgFarmerRating.toFixed(1)} / 5.0 stars (${features.ratingCount} reviews)`,
      impact: features.avgFarmerRating >= 4.0 ? "positive" : features.avgFarmerRating >= 3.0 ? "neutral" : "negative",
      explanation: "Post-delivery reviews cryptographically anchored by verified seed buyers."
    },
    {
      factor: "Dispute & Claim History",
      weightPercent: 15,
      scoreContribution: Math.round(disputeScore * 0.15),
      rawMetric: `${features.disputesLost} lost of ${features.disputedOrders} disputes raised`,
      impact: features.disputesLost === 0 ? "positive" : "negative",
      explanation: features.disputesLost === 0
        ? "No buyer escrow disputes lost; zero recorded counterfeit allegations."
        : "Disputes lost due to poor germination or specification mismatch severely penalize score."
    }
  ];

  return {
    trustScore,
    riskCategory,
    confidence,
    modelVersion,
    featuresHash,
    breakdown,
    rawFeatures: features,
    computedAt: new Date().toISOString()
  };
}
