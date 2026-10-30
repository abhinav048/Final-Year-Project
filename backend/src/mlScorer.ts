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
  avgAiQualityScore?: number;    // 0 to 100 historical AI visual quality score
  aiAssessedBatchesCount?: number; // count of completed batches with AI assessment
  isCaVerified?: boolean | number;
}

export interface ScoreBreakdownItem {
  factor: string;
  weightPercent: number;
  scoreContribution: number;
  rawMetric: string;
  impact: "positive" | "negative" | "neutral";
  explanation: string;
}

export type TrustCategory = "Highly Trusted" | "Trusted" | "Average" | "Low Trust" | "Poor Trust" | "New Seller – Insufficient Data";

export interface TrustScoreResult {
  trustScore: number;           // 0 to 100
  trustCategory: TrustCategory;
  riskCategory: "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk"; // Backwards compatibility
  confidence: number;           // 0.0 to 1.0
  confidenceLevel: "High" | "Moderate" | "Low";
  dataCoveragePercent: number;  // 0 to 100
  isNewSeller: boolean;
  recommendations: string[];
  modelVersion: string;
  featuresHash: string;
  breakdown: ScoreBreakdownItem[];
  rawFeatures: SellerFeatures;
  computedAt: string;
}

/**
 * SeedSure Dynamic Multi-Factor Trust Scoring Engine (§6)
 * 
 * Proposed 6-Factor Model:
 * 1. Historical AI Seed Quality:   25%
 * 2. Certification Verification:   20%
 * 3. Successful Delivery Rate:     20%
 * 4. Transaction Performance:      15%
 * 5. Farmer Feedback:              10%
 * 6. Complaint & Dispute Health:   10%
 * Total:                          100%
 * 
 * Includes Fairness Rules:
 * - New sellers receive "New Seller – Insufficient Data" status.
 * - Missing data is never treated as 100.
 * - Minimum evidence requirement for confidence level.
 * - Single poor batch does not destroy overall seller reputation.
 * - Generates actionable recommendations based on actual weak parameters.
 */
export function calculateTrustScore(features: SellerFeatures): TrustScoreResult {
  const modelVersion = "SeedSure-Trust-v2.0";

  // Check if seller qualifies as "New Seller – Insufficient Data"
  const totalEvidence = features.totalOrders + features.totalBatchesCount + features.ratingCount;
  const isNewSeller = (features.totalOrders === 0 && features.totalBatchesCount <= 1);

  // 1. Historical AI Seed Quality (Weight: 25%)
  // Measures average AI Visual Seed Quality Score across batches
  let qualityScore = 70.0; // neutral default baseline
  let hasQualityData = false;
  if (features.avgAiQualityScore !== undefined && features.avgAiQualityScore > 0) {
    qualityScore = Math.min(100, Math.max(0, features.avgAiQualityScore));
    hasQualityData = true;
  } else if (features.totalBatchesCount > 0) {
    // If breeder has batches but no AI scores yet, assign standard initial baseline
    qualityScore = 75.0;
  }
  const qualityContribution = Math.round(qualityScore * 0.25);

  // 2. Certification Verification (Weight: 20%)
  // Combines CA accreditation and ratio of verified batches
  let certRatio = 0.5;
  if (features.totalBatchesCount > 0) {
    certRatio = features.certifiedBatchesCount / features.totalBatchesCount;
  }
  const isAccredited = Boolean(features.isCaVerified);
  let certScore = certRatio * 85 + (isAccredited ? 15 : 0);
  certScore = Math.min(100, Math.max(0, certScore));
  const certContribution = Math.round(certScore * 0.20);

  // 3. Successful Delivery Rate (Weight: 20%)
  // Ratio of on-time deliveries penalized by delayed orders
  let deliveryScore = 80.0;
  let hasDeliveryData = false;
  if (features.totalOrders > 0) {
    hasDeliveryData = true;
    const deliveryRatio = (features.deliveredOrders - features.delayedOrders * 0.5) / features.totalOrders;
    deliveryScore = Math.min(100, Math.max(0, Math.max(0, deliveryRatio) * 100));
  }
  const deliveryContribution = Math.round(deliveryScore * 0.20);

  // 4. Transaction Performance (Weight: 15%)
  // Ratio of successful orders out of total orders
  let transactionScore = 85.0;
  let hasTxData = false;
  if (features.totalOrders > 0) {
    hasTxData = true;
    const successRatio = features.successfulOrders / features.totalOrders;
    transactionScore = Math.min(100, Math.max(0, successRatio * 100));
  }
  const transactionContribution = Math.round(transactionScore * 0.15);

  // 5. Farmer Feedback (Weight: 10%)
  // 1-5 star ratings normalized with Bayesian prior adjustment for low sample size
  const priorRating = 3.5;
  const priorWeight = 2;
  const bayesianRating = (features.avgFarmerRating * features.ratingCount + priorRating * priorWeight) /
    (features.ratingCount + priorWeight);
  const feedbackScore = Math.min(100, Math.max(0, ((bayesianRating - 1) / 4) * 100));
  const feedbackContribution = Math.round(feedbackScore * 0.10);

  // 6. Complaint & Dispute Health (Weight: 10%)
  // Evaluates disputes raised and disputes lost
  let disputeScore = 90.0;
  if (features.totalOrders > 0) {
    const disputePenaltyRate = (features.disputesLost * 2.0 + features.disputedOrders * 0.5) / features.totalOrders;
    disputeScore = Math.min(100, Math.max(0, 100 - disputePenaltyRate * 100));
  }
  const disputeContribution = Math.round(disputeScore * 0.10);

  // Composite Weighted Sum
  const rawWeightedScore = (
    qualityScore * 0.25 +
    certScore * 0.20 +
    deliveryScore * 0.20 +
    transactionScore * 0.15 +
    feedbackScore * 0.10 +
    disputeScore * 0.10
  );

  let trustScore = Math.round(Math.min(100, Math.max(0, rawWeightedScore)));

  // If new seller with insufficient data, clamp score to neutral and flag status
  let trustCategory: TrustCategory = "Average";
  let riskCategory: "Excellent" | "Trusted" | "Moderate" | "Low" | "High Risk" = "Moderate";

  if (isNewSeller) {
    trustCategory = "New Seller – Insufficient Data";
    riskCategory = "Moderate";
    trustScore = Math.min(65, trustScore); // Cap unproven new sellers
  } else if (trustScore >= 90) {
    trustCategory = "Highly Trusted";
    riskCategory = "Excellent";
  } else if (trustScore >= 75) {
    trustCategory = "Trusted";
    riskCategory = "Trusted";
  } else if (trustScore >= 60) {
    trustCategory = "Average";
    riskCategory = "Moderate";
  } else if (trustScore >= 40) {
    trustCategory = "Low Trust";
    riskCategory = "Low";
  } else {
    trustCategory = "Poor Trust";
    riskCategory = "High Risk";
  }

  // Data Coverage calculation: How many verified parameters have real activity
  let coveredFactors = 0;
  if (hasQualityData) coveredFactors++;
  if (features.certifiedBatchesCount > 0 || isAccredited) coveredFactors++;
  if (hasDeliveryData) coveredFactors++;
  if (hasTxData) coveredFactors++;
  if (features.ratingCount > 0) coveredFactors++;
  if (features.totalOrders > 0) coveredFactors++; // Complaint history
  const dataCoveragePercent = Math.round((coveredFactors / 6) * 100);

  // Confidence level
  let confidenceLevel: "High" | "Moderate" | "Low" = "Moderate";
  if (totalEvidence >= 15 && dataCoveragePercent >= 80) {
    confidenceLevel = "High";
  } else if (totalEvidence < 4 || isNewSeller) {
    confidenceLevel = "Low";
  }

  const confidence = Math.min(0.99, parseFloat((0.35 + Math.min(0.64, totalEvidence * 0.05)).toFixed(2)));

  // Canonical features JSON for tamper-proof on-chain hashing
  const canonicalJson = JSON.stringify({
    seller: features.sellerAddress.toLowerCase(),
    orders: features.totalOrders,
    success: features.successfulOrders,
    delivered: features.deliveredOrders,
    disputesLost: features.disputesLost,
    certBatches: features.certifiedBatchesCount,
    totalBatches: features.totalBatchesCount,
    avgQuality: Math.round(qualityScore),
    rating: parseFloat(features.avgFarmerRating.toFixed(2)),
    score: trustScore,
    model: modelVersion
  });
  const featuresHash = computeSha256(canonicalJson);

  // Actionable recommendations based on actual weak parameters (§8)
  const recommendations: string[] = [];
  if (qualityScore < 75) {
    recommendations.push("Improve seed physical sorting and batch consistency to reduce broken/spotted seed defect ratios.");
  }
  if (certScore < 80) {
    recommendations.push("Submit pending seed lots for Certification Authority laboratory verification.");
  }
  if (deliveryScore < 80) {
    recommendations.push("Ensure seed packages are dispatched promptly with active tracking to eliminate shipping delays.");
  }
  if (disputeScore < 85) {
    recommendations.push("Expedite resolution of pending buyer escrow disputes to restore compliance standing.");
  }
  if (transactionScore < 85) {
    recommendations.push("Maintain accurate real-time inventory to prevent order cancellations and defaults.");
  }
  if (feedbackScore < 75 && features.ratingCount > 0) {
    recommendations.push("Engage with farmer buyers post-delivery to address feedback and improve community satisfaction.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain high visual seed consistency and on-time fulfillment across upcoming harvest batches.");
  }

  // Explainability breakdown ("Why this score?")
  const breakdown: ScoreBreakdownItem[] = [
    {
      factor: "Historical AI Seed Quality",
      weightPercent: 25,
      scoreContribution: qualityContribution,
      rawMetric: hasQualityData
        ? `Avg Visual Score: ${Math.round(qualityScore)}/100 (${features.aiAssessedBatchesCount || 1} batches analyzed)`
        : "Standard Baseline (No AI batches yet)",
      impact: qualityScore >= 80 ? "positive" : qualityScore >= 60 ? "neutral" : "negative",
      explanation: "Evaluates physical seed lot integrity and defect rates across historical Vision Transformer assessments."
    },
    {
      factor: "Certification Verification",
      weightPercent: 20,
      scoreContribution: certContribution,
      rawMetric: `${features.certifiedBatchesCount}/${features.totalBatchesCount} batches CA-certified ${isAccredited ? "(Accredited)" : ""}`,
      impact: certScore >= 80 ? "positive" : certScore >= 50 ? "neutral" : "negative",
      explanation: "Official laboratory compliance certificates stamped by authorized agricultural testing certifiers."
    },
    {
      factor: "Successful Delivery Rate",
      weightPercent: 20,
      scoreContribution: deliveryContribution,
      rawMetric: `${features.deliveredOrders} delivered (${features.delayedOrders} delayed of ${features.totalOrders} orders)`,
      impact: deliveryScore >= 80 ? "positive" : deliveryScore >= 50 ? "neutral" : "negative",
      explanation: "Timely delivery performance ensures farmers receive seed bags prior to planting deadlines."
    },
    {
      factor: "Transaction Performance",
      weightPercent: 15,
      scoreContribution: transactionContribution,
      rawMetric: `${features.successfulOrders} successful / ${features.totalOrders} total orders`,
      impact: transactionScore >= 85 ? "positive" : "negative",
      explanation: "Order completion reliability without seller-side cancellation, supply shortage, or default."
    },
    {
      factor: "Farmer Feedback",
      weightPercent: 10,
      scoreContribution: feedbackContribution,
      rawMetric: `${features.avgFarmerRating.toFixed(1)} / 5.0 stars (${features.ratingCount} reviews)`,
      impact: features.avgFarmerRating >= 4.0 ? "positive" : features.avgFarmerRating >= 3.0 ? "neutral" : "negative",
      explanation: "Verified buyer ratings submitted upon receipt of seed batches."
    },
    {
      factor: "Complaint & Dispute Health",
      weightPercent: 10,
      scoreContribution: disputeContribution,
      rawMetric: `${features.disputesLost} lost of ${features.disputedOrders} disputes raised`,
      impact: features.disputesLost === 0 ? "positive" : "negative",
      explanation: "Penalizes adverse arbitration rulings resulting from counterfeit claims or broken specifications."
    }
  ];

  return {
    trustScore,
    trustCategory,
    riskCategory,
    confidence,
    confidenceLevel,
    dataCoveragePercent,
    isNewSeller,
    recommendations,
    modelVersion,
    featuresHash,
    breakdown,
    rawFeatures: features,
    computedAt: new Date().toISOString()
  };
}
