import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import { db } from "./db.js";
import { computeSha256, CONTRACT_ADDRESSES, CONTRACT_ABIS, DEFAULT_ACCOUNTS } from "./contracts.js";
import { calculateTrustScore, SellerFeatures } from "./mlScorer.js";
import {
  getBlockchainStatus,
  getSessionTransactions,
  recordSessionTransaction,
  verifyCertificateHashOnChain
} from "./blockchain.js";

const execFileAsync = promisify(execFile);

export const router = Router();

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Helper to recompute seller features and score with auditable reason
export function syncSellerScore(sellerAddress: string, triggerEvent: string, reason?: string) {
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(sellerAddress) as any;
  if (!seller) return null;

  // 1. Fetch historical average AI Visual Seed Quality Score from verified batches
  const qualityQuery = db.prepare(`
    SELECT AVG(aiVisualQualityScore) as avgQuality, COUNT(*) as assessedCount 
    FROM seeds 
    WHERE sellerAddress = ? AND aiVisualQualityScore IS NOT NULL AND aiVisualQualityScore > 0
  `).get(sellerAddress) as { avgQuality: number | null; assessedCount: number };

  const avgAiQuality = qualityQuery?.avgQuality != null 
    ? parseFloat(qualityQuery.avgQuality.toFixed(2)) 
    : (seller.avgAiQualityScore || 75.0);
  const aiAssessedCount = qualityQuery?.assessedCount || 0;

  const features: SellerFeatures = {
    sellerAddress: seller.address,
    totalOrders: seller.totalOrders,
    successfulOrders: seller.successfulOrders,
    failedOrders: seller.failedOrders,
    deliveredOrders: seller.deliveredOrders,
    delayedOrders: seller.delayedOrders,
    disputedOrders: seller.disputedOrders,
    disputesLost: seller.disputesLost,
    certifiedBatchesCount: seller.certifiedBatchesCount,
    totalBatchesCount: seller.totalBatchesCount,
    avgFarmerRating: seller.avgFarmerRating,
    ratingCount: seller.ratingCount,
    accountAgeDays: Math.max(1, Math.round((Date.now() - new Date(seller.registeredAt).getTime()) / (1000 * 3600 * 24))),
    daysSinceLastActivity: 1,
    avgAiQualityScore: avgAiQuality,
    aiAssessedBatchesCount: aiAssessedCount,
    isCaVerified: seller.isVerified
  };

  const scoreResult = calculateTrustScore(features);
  const previousScore = seller.trustScore || 50;
  const auditReason = reason || `Dynamic trust score recalculated (${triggerEvent || "METRIC_UPDATE"})`;

  // Update seller record with comprehensive metrics
  db.prepare(`
    UPDATE sellers 
    SET trustScore = ?, 
        riskCategory = ?, 
        trustCategory = ?,
        confidenceLevel = ?,
        dataCoveragePercent = ?,
        isNewSeller = ?,
        avgAiQualityScore = ?,
        updatedAt = ?
    WHERE address = ?
  `).run(
    scoreResult.trustScore,
    scoreResult.riskCategory,
    scoreResult.trustCategory,
    scoreResult.confidenceLevel,
    scoreResult.dataCoveragePercent,
    scoreResult.isNewSeller ? 1 : 0,
    avgAiQuality,
    new Date().toISOString(),
    sellerAddress
  );

  // Record immutable history log with previous score and explicit human-auditable reason
  db.prepare(`
    INSERT INTO trust_score_history (
      sellerAddress, previousScore, score, riskCategory, modelVersion, featuresHash, featuresJson, triggerEvent, reason, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sellerAddress,
    previousScore,
    scoreResult.trustScore,
    scoreResult.riskCategory,
    scoreResult.modelVersion,
    scoreResult.featuresHash,
    JSON.stringify(scoreResult.rawFeatures),
    triggerEvent || "SCORE_UPDATE",
    auditReason,
    new Date().toISOString()
  );

  recordSessionTransaction(
    "TrustScoreRegistry",
    "TrustScoreUpdatedWithReason",
    DEFAULT_ACCOUNTS.oracle,
    `Dynamic Oracle updated trust score: ${previousScore} → ${scoreResult.trustScore}/100 (${scoreResult.trustCategory}) for ${sellerAddress}. Reason: ${auditReason} [featuresHash: ${scoreResult.featuresHash.slice(0, 10)}...]`
  );

  return scoreResult;
}

// ==========================================
// 1. SEEDS / BATCHES ENDPOINTS
// ==========================================

// GET /api/seeds
router.get("/seeds", (req: Request, res: Response) => {
  const { q, category, minTrust, certifiedOnly, sort } = req.query;

  let query = `
    SELECT s.*, sel.name as sellerName, sel.trustScore as sellerTrustScore, 
           sel.riskCategory as sellerRiskCategory, sel.isVerified as sellerVerified
    FROM seeds s
    JOIN sellers sel ON s.sellerAddress = sel.address
    WHERE 1=1
  `;
  const params: any[] = [];

  if (q) {
    query += ` AND (s.name LIKE ? OR s.cropType LIKE ? OR s.variety LIKE ? OR sel.name LIKE ?)`;
    const searchPattern = `%${q}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  if (category && category !== "All") {
    query += ` AND s.cropType = ?`;
    params.push(category);
  }

  if (minTrust) {
    query += ` AND sel.trustScore >= ?`;
    params.push(Number(minTrust));
  }

  if (certifiedOnly === "true") {
    query += ` AND s.certificationStatus = 'Certified'`;
  }

  // Sorting
  switch (sort) {
    case "price_asc":
      query += ` ORDER BY s.pricePerKg ASC`;
      break;
    case "price_desc":
      query += ` ORDER BY s.pricePerKg DESC`;
      break;
    case "germination":
      query += ` ORDER BY s.germinationRate DESC`;
      break;
    case "newest":
      query += ` ORDER BY s.id DESC`;
      break;
    case "trust":
    default:
      query += ` ORDER BY sel.trustScore DESC, s.germinationRate DESC`;
      break;
  }

  const rows = db.prepare(query).all(...params);
  res.json({ success: true, count: rows.length, data: rows });
});

// GET /api/seeds/:id
router.get("/seeds/:id", (req: Request, res: Response) => {
  const seed = db.prepare(`
    SELECT s.*, sel.name as sellerName, sel.description as sellerDescription,
           sel.trustScore as sellerTrustScore, sel.riskCategory as sellerRiskCategory, 
           sel.isVerified as sellerVerified, sel.avgFarmerRating as sellerRating,
           sel.totalOrders as sellerTotalOrders, sel.deliveredOrders as sellerDeliveredOrders
    FROM seeds s
    JOIN sellers sel ON s.sellerAddress = sel.address
    WHERE s.id = ?
  `).get(req.params.id) as any;

  if (!seed) {
    return res.status(404).json({ success: false, error: "Seed batch not found" });
  }

  const reviews = db.prepare(`
    SELECT f.*, o.quantityKg
    FROM feedback f
    JOIN orders o ON f.orderId = o.id
    WHERE f.batchId = ?
    ORDER BY f.id DESC
  `).all(req.params.id);

  // Compute seller explainability breakdown
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(seed.sellerAddress) as any;
  const features: SellerFeatures = {
    sellerAddress: seller.address,
    totalOrders: seller.totalOrders,
    successfulOrders: seller.successfulOrders,
    failedOrders: seller.failedOrders,
    deliveredOrders: seller.deliveredOrders,
    delayedOrders: seller.delayedOrders,
    disputedOrders: seller.disputedOrders,
    disputesLost: seller.disputesLost,
    certifiedBatchesCount: seller.certifiedBatchesCount,
    totalBatchesCount: seller.totalBatchesCount,
    avgFarmerRating: seller.avgFarmerRating,
    ratingCount: seller.ratingCount,
    accountAgeDays: 120,
    daysSinceLastActivity: 2
  };
  const trustData = calculateTrustScore(features);

  res.json({
    success: true,
    data: {
      ...seed,
      reviews,
      trustExplanation: trustData
    }
  });
});

// POST /api/seeds (Register New Seed Batch)
router.post("/seeds", (req: Request, res: Response) => {
  const {
    sellerAddress, name, cropType, variety, batchNumber, manufacturer,
    germinationRate, purity, vigor, moisture, diseaseResistance,
    harvestDate, expiryDate, pricePerKg, availableQuantityKg,
    metadataCID, certificateCID, certificateText,
    aiVisualQualityScore, aiQualityCategory, aiReportCID, aiReportHash,
    aiModelVersion, aiAnalyzedAt, aiClassDistributionJson, imagesJson, seedOrigin
  } = req.body;

  if (!sellerAddress || !name || !batchNumber || !pricePerKg) {
    return res.status(400).json({ success: false, error: "Missing required seed batch fields" });
  }

  // Check seller trust score gating
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(sellerAddress) as any;
  if (!seller) {
    return res.status(404).json({ success: false, error: "Seller not found" });
  }
  if (seller.isSuspended) {
    return res.status(403).json({ success: false, error: "Suspended sellers cannot register new batches" });
  }

  const certHash = computeSha256(certificateText || `${name}-${batchNumber}-${Date.now()}`);

  try {
    const info = db.prepare(`
      INSERT INTO seeds (
        sellerAddress, name, cropType, variety, batchNumber, manufacturer,
        germinationRate, purity, vigor, moisture, diseaseResistance, harvestDate,
        expiryDate, pricePerKg, availableQuantityKg, metadataCID, certificateCID,
        certificateHash, certificationStatus, isDemo, createdAt,
        aiVisualQualityScore, aiQualityCategory, aiReportCID, aiReportHash,
        aiModelVersion, aiAnalyzedAt, aiClassDistributionJson, imagesJson, seedOrigin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sellerAddress, name, cropType, variety, batchNumber, manufacturer,
      germinationRate, purity, vigor, moisture, diseaseResistance, harvestDate,
      expiryDate, pricePerKg, availableQuantityKg, metadataCID || "bafybeimeta" + Date.now(),
      certificateCID || "bafybeicert" + Date.now(), certHash, new Date().toISOString(),
      aiVisualQualityScore != null ? Number(aiVisualQualityScore) : null,
      aiQualityCategory || null,
      aiReportCID || null,
      aiReportHash || null,
      aiModelVersion || null,
      aiAnalyzedAt || null,
      aiClassDistributionJson ? (typeof aiClassDistributionJson === "string" ? aiClassDistributionJson : JSON.stringify(aiClassDistributionJson)) : null,
      imagesJson ? (typeof imagesJson === "string" ? imagesJson : JSON.stringify(imagesJson)) : "[]",
      seedOrigin || null
    );

    // Increment seller totalBatchesCount
    db.prepare("UPDATE sellers SET totalBatchesCount = totalBatchesCount + 1 WHERE address = ?").run(sellerAddress);
    
    const reason = aiVisualQualityScore != null
      ? `New seed batch registered with AI visual quality assessment (Batch #${batchNumber}, Score: ${aiVisualQualityScore}/100)`
      : `New seed batch registered (Batch #${batchNumber})`;
    syncSellerScore(sellerAddress, "BATCH_REGISTERED", reason);

    const onChainTx = recordSessionTransaction(
      "SeedRegistry",
      "BatchRegistered",
      sellerAddress,
      `Registered seed lot #${info.lastInsertRowid}: ${name} (${batchNumber}) [certHash: ${certHash.slice(0, 10)}...]`
    );

    if (aiVisualQualityScore != null && aiReportCID) {
      recordSessionTransaction(
        "SeedRegistry",
        "BatchQualityAssessed",
        DEFAULT_ACCOUNTS.oracle,
        `Oracle stamped AI Visual Seed Quality Score: ${aiVisualQualityScore}/100 for Lot #${info.lastInsertRowid} (${batchNumber}) [reportCID: ${aiReportCID}]`
      );
    }

    res.json({
      success: true,
      data: {
        id: info.lastInsertRowid,
        certificateHash: certHash,
        status: "Pending",
        aiVisualQualityScore: aiVisualQualityScore != null ? Number(aiVisualQualityScore) : null,
        transactionHash: onChainTx.txHash
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/seeds/:id/certify (CA Action)
router.post("/seeds/:id/certify", (req: Request, res: Response) => {
  const { certifierAddress } = req.body;
  const seed = db.prepare("SELECT * FROM seeds WHERE id = ?").get(req.params.id) as any;
  if (!seed) return res.status(404).json({ success: false, error: "Seed not found" });

  db.prepare(`
    UPDATE seeds 
    SET certificationStatus = 'Certified', certifiedBy = ?, certifiedAt = ?
    WHERE id = ?
  `).run(certifierAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", new Date().toISOString(), req.params.id);

  // Update seller certifiedBatchesCount
  db.prepare("UPDATE sellers SET certifiedBatchesCount = certifiedBatchesCount + 1 WHERE address = ?").run(seed.sellerAddress);
  const updatedScore = syncSellerScore(seed.sellerAddress, "BATCH_CERTIFIED");

  const certTx = recordSessionTransaction(
    "SeedRegistry",
    "BatchCertified",
    certifierAddress || DEFAULT_ACCOUNTS.certifier,
    `Certification Authority certified lot #${req.params.id} (${seed.name}) on-chain`
  );

  res.json({ success: true, message: "Batch certified by Authority", trustScore: updatedScore, transactionHash: certTx.txHash });
});

// POST /api/seeds/:id/revoke (CA Action)
router.post("/seeds/:id/revoke", (req: Request, res: Response) => {
  const { reason, certifierAddress } = req.body;
  const seed = db.prepare("SELECT * FROM seeds WHERE id = ?").get(req.params.id) as any;
  if (!seed) return res.status(404).json({ success: false, error: "Seed not found" });

  db.prepare(`
    UPDATE seeds 
    SET certificationStatus = 'Revoked', certifiedBy = ?, certifiedAt = ?
    WHERE id = ?
  `).run(certifierAddress || DEFAULT_ACCOUNTS.certifier, new Date().toISOString(), req.params.id);

  if (seed.certificationStatus === "Certified") {
    db.prepare("UPDATE sellers SET certifiedBatchesCount = MAX(0, certifiedBatchesCount - 1) WHERE address = ?").run(seed.sellerAddress);
  }
  const updatedScore = syncSellerScore(seed.sellerAddress, "BATCH_REVOKED");

  const revokeTx = recordSessionTransaction(
    "SeedRegistry",
    "BatchRevoked",
    certifierAddress || DEFAULT_ACCOUNTS.certifier,
    `Certification revoked for lot #${req.params.id}: ${reason || "Audit Failure"}`
  );

  res.json({ success: true, message: `Batch revoked: ${reason || "Failed quality audit"}`, trustScore: updatedScore, transactionHash: revokeTx.txHash });
});

// ==========================================
// 2. SELLERS ENDPOINTS
// ==========================================

// GET /api/sellers
router.get("/sellers", (_req: Request, res: Response) => {
  const sellers = db.prepare("SELECT * FROM sellers ORDER BY trustScore DESC").all();
  res.json({ success: true, data: sellers });
});

// GET /api/sellers/:address
router.get("/sellers/:address", (req: Request, res: Response) => {
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(req.params.address) as any;
  if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

  const batches = db.prepare("SELECT * FROM seeds WHERE sellerAddress = ? ORDER BY id DESC").all(req.params.address);
  const orders = db.prepare("SELECT * FROM orders WHERE sellerAddress = ? ORDER BY id DESC").all(req.params.address);
  const scoreHistory = db.prepare("SELECT * FROM trust_score_history WHERE sellerAddress = ? ORDER BY id DESC LIMIT 15").all(req.params.address);

  const features: SellerFeatures = {
    sellerAddress: seller.address,
    totalOrders: seller.totalOrders,
    successfulOrders: seller.successfulOrders,
    failedOrders: seller.failedOrders,
    deliveredOrders: seller.deliveredOrders,
    delayedOrders: seller.delayedOrders,
    disputedOrders: seller.disputedOrders,
    disputesLost: seller.disputesLost,
    certifiedBatchesCount: seller.certifiedBatchesCount,
    totalBatchesCount: seller.totalBatchesCount,
    avgFarmerRating: seller.avgFarmerRating,
    ratingCount: seller.ratingCount,
    accountAgeDays: 120,
    daysSinceLastActivity: 1
  };
  const trustData = calculateTrustScore(features);

  res.json({
    success: true,
    data: {
      ...seller,
      batches,
      orders,
      scoreHistory,
      trustDetails: trustData
    }
  });
});

// POST /api/sellers/register
router.post("/sellers/register", (req: Request, res: Response) => {
  const { address, name, description, location, metadataCID } = req.body;
  if (!address || !name) return res.status(400).json({ success: false, error: "Address and name required" });

  const existing = db.prepare("SELECT address FROM sellers WHERE address = ?").get(address);
  if (existing) return res.status(400).json({ success: false, error: "Seller already registered" });

  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO sellers (
      address, name, description, location, metadataCID, isVerified, isSuspended,
      trustScore, riskCategory, totalOrders, successfulOrders, failedOrders, deliveredOrders,
      delayedOrders, disputedOrders, disputesLost, certifiedBatchesCount, totalBatchesCount,
      avgFarmerRating, ratingCount, registeredAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, 0, 0, 50, 'Moderate', 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.0, 0, ?, ?)
  `).run(address, name, description || "", location || "", metadataCID || "QmMeta" + Date.now(), now, now);

  syncSellerScore(address, "SELLER_REGISTERED");
  res.json({ success: true, message: "Seller registered successfully" });
});

// POST /api/sellers/:address/verify (CA / Admin Action)
router.post("/sellers/:address/verify", (req: Request, res: Response) => {
  const address = String(req.params.address);
  db.prepare("UPDATE sellers SET isVerified = 1, updatedAt = ? WHERE address = ?").run(new Date().toISOString(), address);
  const updatedScore = syncSellerScore(address, "SELLER_VERIFIED");
  res.json({ success: true, message: "Seller verified", trustScore: updatedScore });
});

// POST /api/sellers/:address/suspend
router.post("/sellers/:address/suspend", (req: Request, res: Response) => {
  const address = String(req.params.address);
  const { suspend } = req.body;
  const isSuspended = suspend === false ? 0 : 1;
  db.prepare("UPDATE sellers SET isSuspended = ?, updatedAt = ? WHERE address = ?").run(isSuspended, new Date().toISOString(), address);
  res.json({ success: true, message: `Seller suspension state updated to ${isSuspended}` });
});

// ==========================================
// 3. ORDERS & ESCROW ENDPOINTS
// ==========================================

// GET /api/orders
router.get("/orders", (req: Request, res: Response) => {
  const { buyer, seller } = req.query;
  let query = `
    SELECT o.*, s.name as seedName, s.cropType, s.batchNumber, s.certificateHash,
           s.aiVisualQualityScore, s.aiQualityCategory, s.aiReportCID,
           sel.name as sellerName, sel.trustScore as sellerTrustScore, sel.riskCategory as sellerRiskCategory
    FROM orders o
    JOIN seeds s ON o.batchId = s.id
    JOIN sellers sel ON o.sellerAddress = sel.address
    WHERE 1=1
  `;
  const params: any[] = [];
  if (buyer) {
    query += ` AND o.buyerAddress = ?`;
    params.push(buyer);
  }
  if (seller) {
    query += ` AND o.sellerAddress = ?`;
    params.push(seller);
  }
  query += ` ORDER BY o.id DESC`;

  const rows = db.prepare(query).all(...params);
  res.json({ success: true, data: rows });
});

// POST /api/orders (Create Escrow Order)
router.post("/orders", (req: Request, res: Response) => {
  const { batchId, buyerAddress, quantityKg } = req.body;
  if (!batchId || !buyerAddress || !quantityKg) {
    return res.status(400).json({ success: false, error: "Missing required order parameters" });
  }

  const seed = db.prepare("SELECT * FROM seeds WHERE id = ?").get(batchId) as any;
  if (!seed) return res.status(404).json({ success: false, error: "Seed batch not found" });

  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(seed.sellerAddress) as any;
  if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

  // Enforce trust threshold gate (Configurable threshold: e.g. 40 or 50)
  const MIN_ALLOWED_TRUST_SCORE = 40;
  if (seller.trustScore < MIN_ALLOWED_TRUST_SCORE) {
    return res.status(403).json({
      success: false,
      error: `Order rejected: Seller trust score (${seller.trustScore}/100) is below safety threshold (${MIN_ALLOWED_TRUST_SCORE}/100). Farmer escrow protection active.`
    });
  }

  if (seed.availableQuantityKg < quantityKg) {
    return res.status(400).json({ success: false, error: "Insufficient available batch inventory" });
  }

  const totalPriceEth = parseFloat((seed.pricePerKg * quantityKg).toFixed(5));

  // Lock Escrow & Decrement Inventory
  db.prepare("UPDATE seeds SET availableQuantityKg = availableQuantityKg - ? WHERE id = ?").run(quantityKg, batchId);
  db.prepare("UPDATE sellers SET totalOrders = totalOrders + 1 WHERE address = ?").run(seed.sellerAddress);

  const info = db.prepare(`
    INSERT INTO orders (
      batchId, buyerAddress, sellerAddress, quantityKg, totalPriceEth,
      status, escrowLocked, escrowReleased, createdAt
    ) VALUES (?, ?, ?, ?, ?, 'ESCROWED', 1, 0, ?)
  `).run(batchId, buyerAddress, seed.sellerAddress, quantityKg, totalPriceEth, new Date().toISOString());

  const escrowTx = recordSessionTransaction(
    "Marketplace",
    "PaymentEscrowed",
    buyerAddress,
    `Farmer locked ${totalPriceEth} ETH in Smart Escrow for Batch #${batchId} (${quantityKg} kg)`
  );

  res.json({
    success: true,
    data: {
      orderId: info.lastInsertRowid,
      totalPriceEth,
      status: "ESCROWED",
      escrowLocked: true,
      transactionHash: escrowTx.txHash
    }
  });
});

// POST /api/orders/:id/ship (Seller Ships)
router.post("/orders/:id/ship", (req: Request, res: Response) => {
  const { trackingNumber, carrierName } = req.body;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  if (order.status !== "ESCROWED") {
    return res.status(400).json({ success: false, error: `Cannot ship order in status ${order.status}` });
  }

  db.prepare(`
    UPDATE orders 
    SET status = 'SHIPPED', trackingNumber = ?, carrierName = ?, shippedAt = ?
    WHERE id = ?
  `).run(trackingNumber || "TRK-" + Math.floor(100000 + Math.random() * 900000), carrierName || "National AgriExpress", new Date().toISOString(), req.params.id);

  res.json({ success: true, message: "Order marked as SHIPPED. Delivery confirmation awaited." });
});

// POST /api/orders/:id/confirm-delivery (Farmer Confirms Delivery -> Releases Escrow)
router.post("/orders/:id/confirm-delivery", (req: Request, res: Response) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  if (order.status !== "SHIPPED") {
    return res.status(400).json({ success: false, error: "Order must be in SHIPPED status to confirm delivery" });
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE orders 
    SET status = 'COMPLETED', escrowLocked = 0, escrowReleased = 1, deliveredAt = ?, completedAt = ?
    WHERE id = ?
  `).run(now, now, req.params.id);

  // Update seller performance counters
  db.prepare(`
    UPDATE sellers 
    SET deliveredOrders = deliveredOrders + 1, successfulOrders = successfulOrders + 1 
    WHERE address = ?
  `).run(order.sellerAddress);

  // Trigger Oracle score update
  const updatedScore = syncSellerScore(order.sellerAddress, "DELIVERY_CONFIRMED");

  const releaseTx = recordSessionTransaction(
    "Marketplace",
    "PaymentReleased",
    order.buyerAddress,
    `Farmer confirmed delivery for Order #${order.id}. Released ${order.totalPriceEth} ETH escrow to breeder ${order.sellerAddress.slice(0, 8)}...`
  );

  res.json({
    success: true,
    message: "Delivery confirmed. Escrow payment released to seller.",
    escrowReleased: true,
    sellerUpdatedTrustScore: updatedScore,
    transactionHash: releaseTx.txHash
  });
});

// POST /api/orders/:id/dispute (Farmer Raises Dispute)
router.post("/orders/:id/dispute", (req: Request, res: Response) => {
  const { reason, evidenceText } = req.body;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  if (order.status !== "SHIPPED" && order.status !== "ESCROWED") {
    return res.status(400).json({ success: false, error: "Disputes can only be raised on active orders" });
  }

  const evidenceHash = computeSha256(evidenceText || reason || "Dispute evidence");

  db.prepare("UPDATE orders SET status = 'DISPUTED' WHERE id = ?").run(req.params.id);
  db.prepare("UPDATE sellers SET disputedOrders = disputedOrders + 1 WHERE address = ?").run(order.sellerAddress);

  db.prepare(`
    INSERT INTO disputes (orderId, buyerAddress, sellerAddress, reason, evidenceHash, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.params.id, order.buyerAddress, order.sellerAddress, reason, evidenceHash, new Date().toISOString());

  const updatedScore = syncSellerScore(order.sellerAddress, "ORDER_DISPUTED");

  res.json({
    success: true,
    message: "Dispute opened. Escrow funds locked pending resolution.",
    disputeHash: evidenceHash,
    sellerUpdatedTrustScore: updatedScore
  });
});

// POST /api/orders/:id/resolve-dispute (Admin / Dispute Resolver Action)
router.post("/orders/:id/resolve-dispute", (req: Request, res: Response) => {
  const { outcome, notes } = req.body; // 'REFUND' | 'RELEASE_TO_SELLER' | 'SPLIT'
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  let newStatus = "COMPLETED";
  if (outcome === "REFUND") {
    newStatus = "REFUNDED";
    db.prepare("UPDATE sellers SET disputesLost = disputesLost + 1 WHERE address = ?").run(order.sellerAddress);
  } else {
    db.prepare("UPDATE sellers SET successfulOrders = successfulOrders + 1 WHERE address = ?").run(order.sellerAddress);
  }

  db.prepare(`
    UPDATE orders 
    SET status = ?, escrowLocked = 0, escrowReleased = ?
    WHERE id = ?
  `).run(newStatus, outcome === "RELEASE_TO_SELLER" ? 1 : 0, req.params.id);

  db.prepare(`
    UPDATE disputes 
    SET status = ?, resolutionNotes = ?, resolvedAt = ?
    WHERE orderId = ?
  `).run(outcome, notes || "Resolved by platform arbiter", new Date().toISOString(), req.params.id);

  const updatedScore = syncSellerScore(order.sellerAddress, "DISPUTE_RESOLVED");

  res.json({
    success: true,
    message: `Dispute resolved with outcome: ${outcome}`,
    sellerUpdatedTrustScore: updatedScore
  });
});

// ==========================================
// 4. FEEDBACK & REPUTATION ENDPOINTS
// ==========================================

// POST /api/feedback
router.post("/feedback", (req: Request, res: Response) => {
  const { orderId, rating, comment } = req.body;
  if (!orderId || !rating) return res.status(400).json({ success: false, error: "Order ID and rating required" });

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as any;
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  if (order.status !== "COMPLETED") {
    return res.status(400).json({ success: false, error: "Feedback can only be submitted for COMPLETED orders" });
  }

  const existing = db.prepare("SELECT id FROM feedback WHERE orderId = ?").get(orderId);
  if (existing) {
    return res.status(400).json({ success: false, error: "Feedback already submitted for this order (one review per order enforced)" });
  }

  db.prepare(`
    INSERT INTO feedback (orderId, batchId, sellerAddress, buyerAddress, rating, comment, commentCID, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(orderId, order.batchId, order.sellerAddress, order.buyerAddress, rating, comment || "", "QmComment" + Date.now(), new Date().toISOString());

  // Update seller average rating
  const avgData = db.prepare(`
    SELECT AVG(rating) as avgRating, COUNT(id) as count FROM feedback WHERE sellerAddress = ?
  `).get(order.sellerAddress) as any;

  db.prepare(`
    UPDATE sellers 
    SET avgFarmerRating = ?, ratingCount = ?
    WHERE address = ?
  `).run(parseFloat(avgData.avgRating.toFixed(2)), avgData.count, order.sellerAddress);

  const updatedScore = syncSellerScore(order.sellerAddress, "FEEDBACK_SUBMITTED");

  res.json({
    success: true,
    message: "Feedback submitted and recorded. Trust score recalculated.",
    updatedTrustScore: updatedScore
  });
});

// ==========================================
// 5. IPFS & CRYPTOGRAPHIC TAMPER CHECK ENDPOINTS
// ==========================================

// POST /api/ipfs/upload (Single File or Text)
router.post("/ipfs/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file provided" });
  }

  const fileBuffer = fs.readFileSync(req.file.path);
  const sha256Hash = computeSha256(fileBuffer);
  // Deterministic mock CID based on hash for IPFS compatibility
  const cid = "bafybei" + sha256Hash.substring(2, 42);

  res.json({
    success: true,
    data: {
      cid,
      sha256Hash,
      fileName: req.file.originalname,
      sizeBytes: req.file.size,
      gatewayUrl: `/uploads/${req.file.filename}`
    }
  });
});

// POST /api/ipfs/verify-tamper (Critical Tamper Check Demo)
router.post("/ipfs/verify-tamper", (req: Request, res: Response) => {
  const { batchId, testDocumentText, simulateTamper } = req.body;

  const seed = db.prepare("SELECT * FROM seeds WHERE id = ?").get(batchId) as any;
  if (!seed) return res.status(404).json({ success: false, error: "Seed batch not found" });

  let textToHash = testDocumentText || seed.name + " " + seed.batchNumber;
  if (simulateTamper) {
    // Inject subtle tampering string to demonstrate detection
    textToHash += " [MODIFIED GERMINATION RATE: 99.9% - TAMPERED]";
  }

  const computedHash = computeSha256(textToHash);
  const expectedHash = seed.certificateHash;
  const isPass = computedHash.toLowerCase() === expectedHash.toLowerCase();

  res.json({
    success: true,
    data: {
      batchId: seed.id,
      batchNumber: seed.batchNumber,
      certificateCID: seed.certificateCID,
      expectedHash,
      computedHash,
      tamperDetected: !isPass,
      status: isPass ? "PASS" : "FAIL",
      message: isPass 
        ? "Cryptographic Integrity Verified: Certificate SHA-256 matches immutable on-chain record exactly."
        : "TAMPER DETECTED: Document hash does not match registered on-chain certificate. Possible forged lab report!"
    }
  });
});

// ==========================================
// 6. ML TRUST ORACLE & AUDITABILITY ENDPOINTS
// ==========================================

// GET /api/ml/score/:seller
router.get("/ml/score/:seller", (req: Request, res: Response) => {
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(req.params.seller) as any;
  if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

  const features: SellerFeatures = {
    sellerAddress: seller.address,
    totalOrders: seller.totalOrders,
    successfulOrders: seller.successfulOrders,
    failedOrders: seller.failedOrders,
    deliveredOrders: seller.deliveredOrders,
    delayedOrders: seller.delayedOrders,
    disputedOrders: seller.disputedOrders,
    disputesLost: seller.disputesLost,
    certifiedBatchesCount: seller.certifiedBatchesCount,
    totalBatchesCount: seller.totalBatchesCount,
    avgFarmerRating: seller.avgFarmerRating,
    ratingCount: seller.ratingCount,
    accountAgeDays: 120,
    daysSinceLastActivity: 1
  };

  const scoreResult = calculateTrustScore(features);
  res.json({ success: true, data: scoreResult });
});

// Helper to execute ViT model inference via FastAPI or Python CLI
async function runViTInference(
  batchId: string,
  cropType: string,
  variety: string,
  sellerAddress: string,
  filePaths: string[]
): Promise<any> {
  // 1. Try FastAPI ML service if running
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const healthRes = await fetch("http://127.0.0.1:8000/api/ml/seed/health", { signal: controller.signal });
    clearTimeout(timeout);
    if (healthRes.ok) {
      // Create FormData payload
      const form = new (globalThis as any).FormData();
      form.append("batchId", batchId);
      form.append("cropType", cropType);
      form.append("variety", variety || "Soybean");
      form.append("sellerAddress", sellerAddress || "0x0");
      for (const fp of filePaths) {
        const fileBuffer = fs.readFileSync(fp);
        const blob = new Blob([fileBuffer], { type: "image/jpeg" });
        form.append("images", blob, path.basename(fp));
      }
      const analyzeRes = await fetch("http://127.0.0.1:8000/api/ml/seed/analyze", {
        method: "POST",
        body: form
      });
      return await analyzeRes.json();
    }
  } catch {}

  // 2. Direct Python CLI execution fallback
  const possiblePaths = [
    path.resolve(process.cwd(), "ml_service", "inference_cli.py"),
    path.resolve(process.cwd(), "..", "ml_service", "inference_cli.py")
  ];
  const scriptPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];

  const args = [
    scriptPath,
    "--batch-id", String(batchId),
    "--crop-type", cropType,
    "--variety", variety || "Soybean",
    "--seller-address", sellerAddress || "0x0",
    "--images", ...filePaths
  ];

  try {
    const { stdout } = await execFileAsync("python", args, { maxBuffer: 10 * 1024 * 1024 });
    const trimmed = stdout.trim();
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid output from ML inference engine.");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (err: any) {
    if (err.stdout) {
      const match = err.stdout.trim().match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    }
    throw err;
  }
}

// ==========================================
// 6. AI SEED QUALITY ASSESSMENT (ViT-B/16) ENDPOINTS
// ==========================================

// POST /api/ml/seed/analyze
router.post("/ml/seed/analyze", upload.array("images", 25), async (req: Request, res: Response) => {
  const { batchId, cropType, variety, sellerAddress } = req.body;
  const files = req.files as Express.Multer.File[];

  // 1. Crop type validation (§4: ViT assessment only enabled for soybean seeds)
  const normalizedCrop = String(cropType || "").trim().toLowerCase();
  if (!normalizedCrop.includes("soybean")) {
    // Clean up temporary uploads
    if (files) {
      files.forEach(f => { try { fs.unlinkSync(f.path); } catch {} });
    }
    return res.status(400).json({
      success: false,
      code: "UNSUPPORTED_CROP",
      error: "AI visual assessment is currently available only for soybean seeds."
    });
  }

  // 2. File volume validation
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      code: "NO_IMAGES",
      error: "At least one seed photograph is required for AI visual quality assessment."
    });
  }

  const filePaths = files.map(f => f.path);

  try {
    const mlResult = await runViTInference(
      batchId || `BATCH-${Date.now()}`,
      cropType,
      variety || "Soybean",
      sellerAddress || DEFAULT_ACCOUNTS.seller1,
      filePaths
    );

    // If checkpoint is missing, return graceful status without faking predictions
    if (!mlResult.success && mlResult.code === "CHECKPOINT_REQUIRED") {
      return res.status(503).json(mlResult);
    }

    if (!mlResult.success) {
      return res.status(422).json(mlResult);
    }

    const report = mlResult.data;

    // 3. Store quality report in seed_quality_reports table
    const insertReport = db.prepare(`
      INSERT INTO seed_quality_reports (
        batchId, batchNumber, sellerAddress, cropType, variety,
        visualQualityScore, qualityCategory, totalImages, distributionJson,
        predictionsJson, reportCID, reportHash, modelVersion, disclaimer, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const reportRow = insertReport.run(
      isNaN(Number(batchId)) ? null : Number(batchId),
      String(batchId),
      sellerAddress || DEFAULT_ACCOUNTS.seller1,
      report.cropType,
      report.variety,
      report.visualQualityScore,
      report.qualityCategory,
      report.totalImagesAnalyzed,
      JSON.stringify(report.classDistribution),
      JSON.stringify(report.predictions),
      report.reportCID,
      report.reportHash,
      report.modelVersion,
      report.disclaimer,
      report.assessedAt
    );

    // 4. If batch already exists in seeds table, update it
    const existingSeed = db.prepare("SELECT * FROM seeds WHERE id = ? OR batchNumber = ?").get(batchId, batchId) as any;
    if (existingSeed) {
      const storedImageRefs = files.map(f => `/uploads/${path.basename(f.path)}`);
      db.prepare(`
        UPDATE seeds 
        SET aiVisualQualityScore = ?,
            aiQualityCategory = ?,
            aiReportCID = ?,
            aiReportHash = ?,
            aiModelVersion = ?,
            aiAnalyzedAt = ?,
            aiClassDistributionJson = ?,
            imagesJson = ?
        WHERE id = ?
      `).run(
        report.visualQualityScore,
        report.qualityCategory,
        report.reportCID,
        report.reportHash,
        report.modelVersion,
        report.assessedAt,
        JSON.stringify(report.classDistribution),
        JSON.stringify(storedImageRefs),
        existingSeed.id
      );

      // 5. Automatically recalculate dynamic Seller Trust Score (§7)
      const auditReason = `New batch quality assessment (Batch #${existingSeed.batchNumber}, Score: ${report.visualQualityScore}/100)`;
      syncSellerScore(existingSeed.sellerAddress, "AI_QUALITY_ASSESSMENT", auditReason);

      recordSessionTransaction(
        "SeedRegistry",
        "BatchQualityAssessed",
        DEFAULT_ACCOUNTS.oracle,
        `Oracle stamped AI Visual Seed Quality Score: ${report.visualQualityScore}/100 (${report.qualityCategory}) for Batch #${existingSeed.batchNumber} [reportCID: ${report.reportCID}]`
      );
    } else if (sellerAddress) {
      // Update seller trust score for new assessment
      const auditReason = `New batch visual quality assessment completed (Score: ${report.visualQualityScore}/100)`;
      syncSellerScore(sellerAddress, "AI_QUALITY_ASSESSMENT", auditReason);
    }

    res.json({
      success: true,
      data: {
        ...report,
        reportId: reportRow.lastInsertRowid
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      code: "INFERENCE_FAILURE",
      error: "Error processing seed photographs: " + err.message
    });
  }
});

// GET /api/ml/seed/result/:batchId
router.get("/ml/seed/result/:batchId", (req: Request, res: Response) => {
  const param = req.params.batchId;
  const report = db.prepare(`
    SELECT * FROM seed_quality_reports 
    WHERE batchNumber = ? OR batchId = ?
    ORDER BY id DESC LIMIT 1
  `).get(param, isNaN(Number(param)) ? -1 : Number(param)) as any;

  if (!report) {
    return res.status(404).json({
      success: false,
      error: `No AI quality report found for batch '${param}'.`
    });
  }

  res.json({
    success: true,
    data: {
      ...report,
      classDistribution: JSON.parse(report.distributionJson || "{}"),
      predictions: JSON.parse(report.predictionsJson || "[]")
    }
  });
});

// GET /api/ml/seed/health
router.get("/ml/seed/health", async (_req: Request, res: Response) => {
  try {
    // Check if FastAPI service is up
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const healthRes = await fetch("http://127.0.0.1:8000/api/ml/seed/health", { signal: controller.signal });
    clearTimeout(timeout);
    if (healthRes.ok) {
      const data = await healthRes.json();
      return res.json({ success: true, mode: "fastapi_daemon", ...data });
    }
  } catch {}

  // Check via Python directly
  try {
    const { stdout } = await execFileAsync("python", [
      "-c",
      "from ml_service.model import get_classifier; import json; print(json.dumps(get_classifier().get_status()))"
    ]);
    const parsed = JSON.parse(stdout.trim());
    return res.json({ success: true, mode: "python_embedded", ...parsed });
  } catch (err: any) {
    return res.json({
      success: false,
      mode: "offline",
      checkpoint_available: false,
      error: "ML service environment not reachable: " + err.message
    });
  }
});

// ==========================================
// 7. DYNAMIC SELLER TRUST SCORE ENGINE ENDPOINTS (§6 & §12)
// ==========================================

// POST /api/trust/recalculate/:sellerId
router.post("/trust/recalculate/:sellerId", (req: Request, res: Response) => {
  const seller = String(req.params.sellerId);
  const reason = req.body?.reason || "Dynamic score recalculated on demand";
  const result = syncSellerScore(seller, "MANUAL_RECALCULATION", reason);
  if (!result) return res.status(404).json({ success: false, error: "Seller not found" });
  res.json({ success: true, data: result });
});

// GET /api/trust/:sellerId
router.get("/trust/:sellerId", (req: Request, res: Response) => {
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(req.params.sellerId) as any;
  if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

  const avgQualityRow = db.prepare(`
    SELECT AVG(aiVisualQualityScore) as avgQuality, COUNT(*) as count 
    FROM seeds 
    WHERE sellerAddress = ? AND aiVisualQualityScore IS NOT NULL AND aiVisualQualityScore > 0
  `).get(seller.address) as { avgQuality: number | null; count: number };

  const avgAiQuality = avgQualityRow?.avgQuality != null 
    ? parseFloat(avgQualityRow.avgQuality.toFixed(2)) 
    : (seller.avgAiQualityScore || 75.0);

  const features: SellerFeatures = {
    sellerAddress: seller.address,
    totalOrders: seller.totalOrders,
    successfulOrders: seller.successfulOrders,
    failedOrders: seller.failedOrders,
    deliveredOrders: seller.deliveredOrders,
    delayedOrders: seller.delayedOrders,
    disputedOrders: seller.disputedOrders,
    disputesLost: seller.disputesLost,
    certifiedBatchesCount: seller.certifiedBatchesCount,
    totalBatchesCount: seller.totalBatchesCount,
    avgFarmerRating: seller.avgFarmerRating,
    ratingCount: seller.ratingCount,
    accountAgeDays: Math.max(1, Math.round((Date.now() - new Date(seller.registeredAt).getTime()) / (1000 * 3600 * 24))),
    daysSinceLastActivity: 1,
    avgAiQualityScore: avgAiQuality,
    aiAssessedBatchesCount: avgQualityRow?.count || 0,
    isCaVerified: seller.isVerified
  };

  const scoreResult = calculateTrustScore(features);
  res.json({ success: true, data: scoreResult });
});

// GET /api/trust/:sellerId/history
router.get("/trust/:sellerId/history", (req: Request, res: Response) => {
  const history = db.prepare(`
    SELECT id, sellerAddress, previousScore, score, riskCategory, modelVersion, 
           featuresHash, triggerEvent, reason, createdAt 
    FROM trust_score_history 
    WHERE sellerAddress = ?
    ORDER BY id DESC
  `).all(req.params.sellerId);

  res.json({ success: true, count: history.length, data: history });
});

// GET /api/trust/:sellerId/breakdown
router.get("/trust/:sellerId/breakdown", (req: Request, res: Response) => {
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(req.params.sellerId) as any;
  if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

  const avgQualityRow = db.prepare(`
    SELECT AVG(aiVisualQualityScore) as avgQuality, COUNT(*) as count 
    FROM seeds 
    WHERE sellerAddress = ? AND aiVisualQualityScore IS NOT NULL AND aiVisualQualityScore > 0
  `).get(seller.address) as { avgQuality: number | null; count: number };

  const avgAiQuality = avgQualityRow?.avgQuality != null 
    ? parseFloat(avgQualityRow.avgQuality.toFixed(2)) 
    : (seller.avgAiQualityScore || 75.0);

  const features: SellerFeatures = {
    sellerAddress: seller.address,
    totalOrders: seller.totalOrders,
    successfulOrders: seller.successfulOrders,
    failedOrders: seller.failedOrders,
    deliveredOrders: seller.deliveredOrders,
    delayedOrders: seller.delayedOrders,
    disputedOrders: seller.disputedOrders,
    disputesLost: seller.disputesLost,
    certifiedBatchesCount: seller.certifiedBatchesCount,
    totalBatchesCount: seller.totalBatchesCount,
    avgFarmerRating: seller.avgFarmerRating,
    ratingCount: seller.ratingCount,
    accountAgeDays: Math.max(1, Math.round((Date.now() - new Date(seller.registeredAt).getTime()) / (1000 * 3600 * 24))),
    daysSinceLastActivity: 1,
    avgAiQualityScore: avgAiQuality,
    aiAssessedBatchesCount: avgQualityRow?.count || 0,
    isCaVerified: seller.isVerified
  };

  const scoreResult = calculateTrustScore(features);

  res.json({
    success: true,
    data: {
      trustScore: scoreResult.trustScore,
      trustCategory: scoreResult.trustCategory,
      confidenceLevel: scoreResult.confidenceLevel,
      dataCoveragePercent: scoreResult.dataCoveragePercent,
      isNewSeller: scoreResult.isNewSeller,
      recommendations: scoreResult.recommendations,
      breakdown: scoreResult.breakdown,
      rawFeatures: scoreResult.rawFeatures,
      modelVersion: scoreResult.modelVersion,
      featuresHash: scoreResult.featuresHash,
      computedAt: scoreResult.computedAt
    }
  });
});

// GET /api/ml/score/:seller (Backwards compatibility)
router.get("/ml/score/:seller", (req: Request, res: Response) => {
  const seller = db.prepare("SELECT * FROM sellers WHERE address = ?").get(req.params.seller) as any;
  if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

  const avgQualityRow = db.prepare(`
    SELECT AVG(aiVisualQualityScore) as avgQuality, COUNT(*) as count 
    FROM seeds 
    WHERE sellerAddress = ? AND aiVisualQualityScore IS NOT NULL AND aiVisualQualityScore > 0
  `).get(seller.address) as { avgQuality: number | null; count: number };

  const features: SellerFeatures = {
    sellerAddress: seller.address,
    totalOrders: seller.totalOrders,
    successfulOrders: seller.successfulOrders,
    failedOrders: seller.failedOrders,
    deliveredOrders: seller.deliveredOrders,
    delayedOrders: seller.delayedOrders,
    disputedOrders: seller.disputedOrders,
    disputesLost: seller.disputesLost,
    certifiedBatchesCount: seller.certifiedBatchesCount,
    totalBatchesCount: seller.totalBatchesCount,
    avgFarmerRating: seller.avgFarmerRating,
    ratingCount: seller.ratingCount,
    accountAgeDays: 120,
    daysSinceLastActivity: 1,
    avgAiQualityScore: avgQualityRow?.avgQuality != null ? avgQualityRow.avgQuality : (seller.avgAiQualityScore || 75),
    aiAssessedBatchesCount: avgQualityRow?.count || 0,
    isCaVerified: seller.isVerified
  };

  const scoreResult = calculateTrustScore(features);
  res.json({ success: true, data: scoreResult });
});

// ==========================================
// 7. PLATFORM ANALYTICS ENDPOINT (Optimized & In-Memory Cached)
// ==========================================

let analyticsCache: { data: any; expiresAt: number } | null = null;

export function invalidateAnalyticsCache() {
  analyticsCache = null;
}

router.get("/analytics", (_req: Request, res: Response) => {
  const now = Date.now();
  if (analyticsCache && analyticsCache.expiresAt > now) {
    return res.json({
      success: true,
      data: analyticsCache.data,
      cached: true
    });
  }

  // Single-pass subquery aggregation for ultra-fast response
  const counts = db.prepare(`
    SELECT 
      (SELECT count(*) FROM seeds) as totalBatches,
      (SELECT count(*) FROM seeds WHERE certificationStatus = 'Certified') as certifiedBatches,
      (SELECT count(*) FROM sellers) as totalSellers,
      (SELECT count(*) FROM orders) as totalOrders,
      (SELECT coalesce(sum(totalPriceEth), 0) FROM orders WHERE escrowLocked = 1) as activeEscrowEth,
      (SELECT avg(trustScore) FROM sellers) as avgTrustScore
  `).get() as any;

  const cropDistribution = db.prepare("SELECT cropType, count(*) as count FROM seeds GROUP BY cropType").all();
  const riskDistribution = db.prepare("SELECT riskCategory, count(*) as count FROM sellers GROUP BY riskCategory").all();

  const data = {
    totalBatches: counts.totalBatches,
    certifiedBatches: counts.certifiedBatches,
    certificationRate: counts.totalBatches > 0 ? Math.round((counts.certifiedBatches / counts.totalBatches) * 100) : 0,
    totalSellers: counts.totalSellers,
    totalOrders: counts.totalOrders,
    activeEscrowEth: parseFloat(Number(counts.activeEscrowEth).toFixed(4)),
    avgTrustScore: Math.round(counts.avgTrustScore || 0),
    cropDistribution,
    riskDistribution,
    contractAddresses: CONTRACT_ADDRESSES
  };

  analyticsCache = {
    data,
    expiresAt: now + 5000 // 5 seconds TTL cache
  };

  res.json({
    success: true,
    data
  });
});

// ==========================================
// 8. BLOCKCHAIN & SMART CONTRACTS ENDPOINTS
// ==========================================

// GET /api/blockchain/status
router.get("/blockchain/status", async (_req: Request, res: Response) => {
  try {
    const status = await getBlockchainStatus();
    res.json({ success: true, data: status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/blockchain/transactions
router.get("/blockchain/transactions", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: getSessionTransactions()
  });
});

// GET /api/blockchain/contracts
router.get("/blockchain/contracts", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      addresses: CONTRACT_ADDRESSES,
      abis: CONTRACT_ABIS,
      network: "Local Hardhat / Anvil (Chain ID 31337)"
    }
  });
});

// POST /api/blockchain/verify-batch
router.post("/blockchain/verify-batch", async (req: Request, res: Response) => {
  const { batchId, testHash } = req.body;
  if (!batchId || !testHash) {
    return res.status(400).json({ success: false, error: "batchId and testHash required" });
  }
  const result = await verifyCertificateHashOnChain(Number(batchId), testHash);
  res.json({ success: true, data: result });
});

