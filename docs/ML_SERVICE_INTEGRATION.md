# SeedSure — ML Trust Service Integration Guide

This document describes the schema, feature vectors, and mathematical formulations for the Machine Learning Seller Trust Scoring Service.

---

## 1. Feature Vector Extraction

The trust scoring engine reads on-chain events and extracts the following feature vector for each seller:

```json
{
  "sellerAddress": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "totalOrders": 42,
  "successfulOrders": 41,
  "failedOrders": 0,
  "deliveredOrders": 41,
  "delayedOrders": 1,
  "disputedOrders": 0,
  "disputesLost": 0,
  "certifiedBatchesCount": 6,
  "totalBatchesCount": 6,
  "avgFarmerRating": 4.9,
  "ratingCount": 38,
  "accountAgeDays": 120,
  "daysSinceLastActivity": 3
}
```

---

## 2. Multi-Factor Mathematical Formulation

The baseline trust model calculates a composite score $S \in [0, 100]$ using five core performance dimensions with exponential recency decay:

$$S = \left( 0.25 \cdot S_{\text{cert}} + 0.25 \cdot S_{\text{delivery}} + 0.20 \cdot S_{\text{success}} + 0.15 \cdot S_{\text{rating}} + 0.15 \cdot S_{\text{dispute}} \right) \times W_{\text{recency}}$$

### Factor Details:
1. **Lab Certification Ratio ($S_{\text{cert}}$):**
   $$S_{\text{cert}} = \frac{\text{certifiedBatches}}{\text{totalBatches}} \times 100$$
2. **On-Time Delivery Performance ($S_{\text{delivery}}$):**
   $$S_{\text{delivery}} = \max\left(0, \frac{\text{deliveredOrders} - 0.5 \times \text{delayedOrders}}{\text{totalOrders}}\right) \times 100$$
3. **Transaction Success Rate ($S_{\text{success}}$):**
   $$S_{\text{success}} = \frac{\text{successfulOrders}}{\text{totalOrders}} \times 100$$
4. **Bayesian Farmer Rating ($S_{\text{rating}}$):**
   Adjusted with prior rating $\mu = 3.5, k = 3$:
   $$R_{\text{Bayes}} = \frac{R_{\text{avg}} \times n + 3.5 \times 3}{n + 3}$$
   $$S_{\text{rating}} = \frac{R_{\text{Bayes}} - 1}{4} \times 100$$
5. **Dispute Penalty ($S_{\text{dispute}}$):**
   $$S_{\text{dispute}} = \max\left(0, 100 - \frac{2.0 \times \text{disputesLost} + 0.5 \times \text{disputedOrders}}{\text{totalOrders}} \times 100\right)$$
6. **Exponential Recency Decay ($W_{\text{recency}}$):**
   Half-life $\lambda = 90$ days:
   $$W_{\text{recency}} = 0.90 + 0.10 \times \exp\left( -\frac{\ln 2}{90} \times \Delta t_{\text{days}} \right)$$

---

## 3. Cryptographic Features Hash & On-Chain Auditability

To prevent off-chain oracle manipulation (Section 7 of research brief), each score update computes a canonical JSON hash:

```typescript
const canonicalJson = JSON.stringify({
  seller: features.sellerAddress.toLowerCase(),
  orders: features.totalOrders,
  success: features.successfulOrders,
  delivered: features.deliveredOrders,
  disputesLost: features.disputesLost,
  certBatches: features.certifiedBatchesCount,
  totalBatches: features.totalBatchesCount,
  rating: features.avgFarmerRating,
  score: trustScore,
  model: "SeedSure-ML-v1.4"
});

const featuresHash = sha256(canonicalJson);
```

The oracle writes `featuresHash` directly to the `TrustScoreRegistry` smart contract.

### Auditability Endpoint
Any third party can audit that the score was strictly computed from transaction features by calling:
`GET /api/ml/verify/:seller/:updateId`
Returns:
```json
{
  "updateId": 1,
  "sellerAddress": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "recordedScore": 98,
  "recordedFeaturesHash": "0x98a12f...",
  "recomputedFeaturesHash": "0x98a12f...",
  "auditMatch": true,
  "status": "AUDIT_VERIFIED"
}
```
