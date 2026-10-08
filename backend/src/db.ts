import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { computeSha256 } from "./contracts.js";
import { calculateTrustScore, SellerFeatures } from "./mlScorer.js";

const DB_FILE = path.resolve(process.cwd(), "seedsure.db");
export const db = new Database(DB_FILE);

// Enable WAL mode for high performance
db.pragma("journal_mode = WAL");

// Initialize Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sellers (
      address TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      location TEXT,
      metadataCID TEXT,
      isVerified INTEGER DEFAULT 0,
      isSuspended INTEGER DEFAULT 0,
      trustScore INTEGER DEFAULT 50,
      riskCategory TEXT DEFAULT 'Moderate',
      totalOrders INTEGER DEFAULT 0,
      successfulOrders INTEGER DEFAULT 0,
      failedOrders INTEGER DEFAULT 0,
      deliveredOrders INTEGER DEFAULT 0,
      delayedOrders INTEGER DEFAULT 0,
      disputedOrders INTEGER DEFAULT 0,
      disputesLost INTEGER DEFAULT 0,
      certifiedBatchesCount INTEGER DEFAULT 0,
      totalBatchesCount INTEGER DEFAULT 0,
      avgFarmerRating REAL DEFAULT 4.0,
      ratingCount INTEGER DEFAULT 0,
      registeredAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sellerAddress TEXT NOT NULL,
      name TEXT NOT NULL,
      cropType TEXT NOT NULL,
      variety TEXT NOT NULL,
      batchNumber TEXT UNIQUE NOT NULL,
      manufacturer TEXT NOT NULL,
      germinationRate REAL NOT NULL,
      purity REAL NOT NULL,
      vigor REAL NOT NULL,
      moisture REAL NOT NULL,
      diseaseResistance TEXT NOT NULL,
      harvestDate TEXT NOT NULL,
      expiryDate TEXT NOT NULL,
      pricePerKg REAL NOT NULL,
      availableQuantityKg REAL NOT NULL,
      metadataCID TEXT NOT NULL,
      certificateCID TEXT NOT NULL,
      certificateHash TEXT NOT NULL,
      certificationStatus TEXT DEFAULT 'Certified', -- 'Certified', 'Pending', 'Revoked'
      certifiedBy TEXT,
      certifiedAt TEXT,
      isDemo INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (sellerAddress) REFERENCES sellers(address)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchId INTEGER NOT NULL,
      buyerAddress TEXT NOT NULL,
      sellerAddress TEXT NOT NULL,
      quantityKg REAL NOT NULL,
      totalPriceEth REAL NOT NULL,
      status TEXT NOT NULL, -- 'CREATED', 'ESCROWED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'REFUNDED'
      escrowLocked INTEGER DEFAULT 1,
      escrowReleased INTEGER DEFAULT 0,
      trackingNumber TEXT,
      carrierName TEXT,
      shippedAt TEXT,
      deliveredAt TEXT,
      completedAt TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (batchId) REFERENCES seeds(id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER UNIQUE NOT NULL,
      batchId INTEGER NOT NULL,
      sellerAddress TEXT NOT NULL,
      buyerAddress TEXT NOT NULL,
      rating INTEGER NOT NULL, -- 1 to 5
      comment TEXT,
      commentCID TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER UNIQUE NOT NULL,
      buyerAddress TEXT NOT NULL,
      sellerAddress TEXT NOT NULL,
      reason TEXT NOT NULL,
      evidenceCID TEXT,
      evidenceHash TEXT,
      status TEXT DEFAULT 'OPEN', -- 'OPEN', 'REFUNDED', 'RELEASED_TO_SELLER', 'SPLIT'
      resolutionNotes TEXT,
      resolvedAt TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    );

    CREATE TABLE IF NOT EXISTS trust_score_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sellerAddress TEXT NOT NULL,
      score INTEGER NOT NULL,
      riskCategory TEXT NOT NULL,
      modelVersion TEXT NOT NULL,
      featuresHash TEXT NOT NULL,
      featuresJson TEXT NOT NULL,
      triggerEvent TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  // Seed sample data if empty
  const countRow = db.prepare("SELECT count(*) as count FROM sellers").get() as { count: number };
  if (countRow.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  console.log("🌱 Seeding realistic synthetic demo agricultural dataset...");

  const sellersList = [
    {
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      name: "AgriGrow Certified Seeds Ltd.",
      description: "Premier breeder of certified drought-resistant cereals and pulses with ICAR accredited testing labs.",
      location: "Punjab, India",
      metadataCID: "QmAgriGrowMeta772183bda49f99c",
      isVerified: 1,
      isSuspended: 0,
      totalOrders: 42,
      successfulOrders: 41,
      failedOrders: 0,
      deliveredOrders: 41,
      delayedOrders: 1,
      disputedOrders: 0,
      disputesLost: 0,
      certifiedBatchesCount: 6,
      totalBatchesCount: 6,
      avgFarmerRating: 4.9,
      ratingCount: 38,
      registeredAt: "2024-03-15T08:00:00.000Z"
    },
    {
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      name: "GreenField Agro Genetics",
      description: "Specialized high-yield hybrid seed producer with strict genetic purity and vigor inspection.",
      location: "Haryana, India",
      metadataCID: "QmGreenFieldMeta99318ba82bc",
      isVerified: 1,
      isSuspended: 0,
      totalOrders: 35,
      successfulOrders: 33,
      failedOrders: 1,
      deliveredOrders: 33,
      delayedOrders: 2,
      disputedOrders: 1,
      disputesLost: 0,
      certifiedBatchesCount: 4,
      totalBatchesCount: 5,
      avgFarmerRating: 4.6,
      ratingCount: 29,
      registeredAt: "2024-05-10T11:30:00.000Z"
    },
    {
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      name: "HarvestPlus Seed Co.",
      description: "Regional seed distributor focused on oilseeds and coarse grains for semi-arid zones.",
      location: "Madhya Pradesh, India",
      metadataCID: "QmHarvestPlusMeta441029ba",
      isVerified: 1,
      isSuspended: 0,
      totalOrders: 22,
      successfulOrders: 19,
      failedOrders: 1,
      deliveredOrders: 19,
      delayedOrders: 4,
      disputedOrders: 1,
      disputesLost: 0,
      certifiedBatchesCount: 3,
      totalBatchesCount: 4,
      avgFarmerRating: 4.1,
      ratingCount: 18,
      registeredAt: "2024-07-01T09:15:00.000Z"
    },
    {
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      name: "Kisan Mitra BioTech",
      description: "Growing agricultural cooperative providing certified vegetable and legume cultivars.",
      location: "Maharashtra, India",
      metadataCID: "QmKisanMitraMeta123891af",
      isVerified: 1,
      isSuspended: 0,
      totalOrders: 14,
      successfulOrders: 11,
      failedOrders: 1,
      deliveredOrders: 11,
      delayedOrders: 3,
      disputedOrders: 1,
      disputesLost: 1,
      certifiedBatchesCount: 2,
      totalBatchesCount: 3,
      avgFarmerRating: 3.7,
      ratingCount: 10,
      registeredAt: "2024-09-12T14:20:00.000Z"
    },
    {
      address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
      name: "QuickSeeds Direct (Adversarial / Low Tier)",
      description: "Low-cost unvetted distributor with repeated germination claims and delayed dispatch records.",
      location: "Rajasthan, India",
      metadataCID: "QmQuickSeedsDirectMeta00129",
      isVerified: 0,
      isSuspended: 0,
      totalOrders: 18,
      successfulOrders: 9,
      failedOrders: 4,
      deliveredOrders: 9,
      delayedOrders: 7,
      disputedOrders: 5,
      disputesLost: 4,
      certifiedBatchesCount: 1,
      totalBatchesCount: 4,
      avgFarmerRating: 2.3,
      ratingCount: 12,
      registeredAt: "2024-11-05T10:00:00.000Z"
    }
  ];

  const insertSeller = db.prepare(`
    INSERT INTO sellers (
      address, name, description, location, metadataCID, isVerified, isSuspended,
      trustScore, riskCategory, totalOrders, successfulOrders, failedOrders, deliveredOrders,
      delayedOrders, disputedOrders, disputesLost, certifiedBatchesCount, totalBatchesCount,
      avgFarmerRating, ratingCount, registeredAt, updatedAt
    ) VALUES (
      @address, @name, @description, @location, @metadataCID, @isVerified, @isSuspended,
      @trustScore, @riskCategory, @totalOrders, @successfulOrders, @failedOrders, @deliveredOrders,
      @delayedOrders, @disputedOrders, @disputesLost, @certifiedBatchesCount, @totalBatchesCount,
      @avgFarmerRating, @ratingCount, @registeredAt, @updatedAt
    )
  `);

  const insertScoreHistory = db.prepare(`
    INSERT INTO trust_score_history (
      sellerAddress, score, riskCategory, modelVersion, featuresHash, featuresJson, triggerEvent, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of sellersList) {
    const features: SellerFeatures = {
      sellerAddress: s.address,
      totalOrders: s.totalOrders,
      successfulOrders: s.successfulOrders,
      failedOrders: s.failedOrders,
      deliveredOrders: s.deliveredOrders,
      delayedOrders: s.delayedOrders,
      disputedOrders: s.disputedOrders,
      disputesLost: s.disputesLost,
      certifiedBatchesCount: s.certifiedBatchesCount,
      totalBatchesCount: s.totalBatchesCount,
      avgFarmerRating: s.avgFarmerRating,
      ratingCount: s.ratingCount,
      accountAgeDays: 120,
      daysSinceLastActivity: 3
    };

    const scoreResult = calculateTrustScore(features);

    insertSeller.run({
      ...s,
      trustScore: scoreResult.trustScore,
      riskCategory: scoreResult.riskCategory,
      updatedAt: new Date().toISOString()
    });

    insertScoreHistory.run(
      s.address,
      scoreResult.trustScore,
      scoreResult.riskCategory,
      scoreResult.modelVersion,
      scoreResult.featuresHash,
      JSON.stringify(scoreResult.rawFeatures),
      "INITIAL_SYNC",
      new Date().toISOString()
    );
  }

  // Seed Realistic Seed Batches
  const seedsList = [
    {
      sellerAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      name: "Wheat HD-2967 (Certified Foundation)",
      cropType: "Cereals",
      variety: "HD-2967",
      batchNumber: "IN-PB-WHT-2025-081",
      manufacturer: "ICAR-Indian Agricultural Research Institute",
      germinationRate: 94.5,
      purity: 99.2,
      vigor: 92.0,
      moisture: 10.5,
      diseaseResistance: "Yellow Rust & Leaf Blight Resistant (Lr26)",
      harvestDate: "2025-04-10",
      expiryDate: "2026-04-10",
      pricePerKg: 0.00015, // ~0.00015 ETH / kg (~Rs. 45/kg)
      availableQuantityKg: 5000,
      metadataCID: "bafybeicg2ubwht2967wheatfoundationlab081",
      certificateCID: "bafybeihd2967certicarcentralseedtestinglab",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Wheat HD-2967. Batch IN-PB-WHT-2025-081. Germination 94.5%, Purity 99.2%. Issued by National Seed Research and Training Center.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-04-20T10:00:00Z"
    },
    {
      sellerAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      name: "Basmati Rice Pusa-1121 (Export Grade)",
      cropType: "Cereals",
      variety: "Pusa Basmati 1121",
      batchNumber: "IN-PB-RCE-2025-104",
      manufacturer: "AgriGrow Seed Breeders",
      germinationRate: 92.0,
      purity: 98.8,
      vigor: 90.5,
      moisture: 11.2,
      diseaseResistance: "Blast & Bacterial Leaf Blight Tolerant",
      harvestDate: "2025-05-15",
      expiryDate: "2026-05-15",
      pricePerKg: 0.00028,
      availableQuantityKg: 3500,
      metadataCID: "bafybeipusa1121basmatiricebatch104",
      certificateCID: "bafybeicertpusa1121govtlaboratorytest",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Basmati Rice Pusa 1121. Batch IN-PB-RCE-2025-104. Germination 92.0%, Purity 98.8%. Approved for export cultivation.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-05-25T11:00:00Z"
    },
    {
      sellerAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      name: "Hybrid Maize DKC-9108 (High Yield)",
      cropType: "Cereals",
      variety: "DKC-9108",
      batchNumber: "IN-HR-MAZ-2025-044",
      manufacturer: "GreenField Agro Genetics",
      germinationRate: 96.0,
      purity: 99.5,
      vigor: 95.0,
      moisture: 9.8,
      diseaseResistance: "Turcicum Leaf Blight & Downy Mildew Resistant",
      harvestDate: "2025-03-22",
      expiryDate: "2026-03-22",
      pricePerKg: 0.00035,
      availableQuantityKg: 2800,
      metadataCID: "bafybeidkc9108hybridmaizebatch044",
      certificateCID: "bafybeicertdkc9108geneticslabreport",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Hybrid Maize DKC-9108. Batch IN-HR-MAZ-2025-044. High vigor index: 95.0%. State Seed Testing Lab.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-04-02T09:30:00Z"
    },
    {
      sellerAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      name: "Bt Cotton Hybrid RCH-659",
      cropType: "Cash Crops",
      variety: "RCH-659 BG-II",
      batchNumber: "IN-HR-CTN-2025-019",
      manufacturer: "GreenField Agro Genetics",
      germinationRate: 89.0,
      purity: 98.0,
      vigor: 88.0,
      moisture: 8.5,
      diseaseResistance: "Bollworm & Whitefly Resistant (Cry1Ac+Cry2Ab)",
      harvestDate: "2025-02-18",
      expiryDate: "2026-02-18",
      pricePerKg: 0.00120,
      availableQuantityKg: 1200,
      metadataCID: "bafybeirch659btcottonbatch019",
      certificateCID: "bafybeicerthrycottonlabgenomicstest",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Bt Cotton RCH-659 BG-II. Cry protein bio-assay verified. Central Institute for Cotton Research.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-03-01T14:15:00Z"
    },
    {
      sellerAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      name: "Arka Rakshak F1 Hybrid Tomato",
      cropType: "Vegetables",
      variety: "Arka Rakshak",
      batchNumber: "IN-MP-TOM-2025-112",
      manufacturer: "HarvestPlus Seed Co.",
      germinationRate: 95.0,
      purity: 99.0,
      vigor: 94.0,
      moisture: 7.2,
      diseaseResistance: "Triple Disease Resistant: ToLCV, Bacterial Wilt & Early Blight",
      harvestDate: "2025-06-01",
      expiryDate: "2026-06-01",
      pricePerKg: 0.00450,
      availableQuantityKg: 400,
      metadataCID: "bafybeiarkarakshaktomatobatch112",
      certificateCID: "bafybeicertarkarakshakiihrlabreport",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Arka Rakshak F1 Hybrid. High lycopene 3.1mg/100g, firm fruit trait. IIHR Bengaluru certified.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-06-12T16:00:00Z"
    },
    {
      sellerAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      name: "Pusa Bold Mustard (High Oil Content)",
      cropType: "Oilseeds",
      variety: "Pusa Bold",
      batchNumber: "IN-MP-MST-2025-033",
      manufacturer: "HarvestPlus Seed Co.",
      germinationRate: 91.0,
      purity: 98.5,
      vigor: 89.0,
      moisture: 7.8,
      diseaseResistance: "Alternaria Blight & White Rust Tolerant",
      harvestDate: "2025-04-18",
      expiryDate: "2026-04-18",
      pricePerKg: 0.00022,
      availableQuantityKg: 4200,
      metadataCID: "bafybeipusaboldmustardbatch033",
      certificateCID: "bafybeicertpusaboldicarreport991",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Pusa Bold Mustard. Oil content 40.2%. Certified Breeder Seed Directorate.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-04-29T10:45:00Z"
    },
    {
      sellerAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      name: "Chickpea Pusa-362 (Kabuli Chana)",
      cropType: "Pulses",
      variety: "Pusa-362",
      batchNumber: "IN-MH-CHK-2025-072",
      manufacturer: "Kisan Mitra BioTech",
      germinationRate: 93.0,
      purity: 99.1,
      vigor: 91.0,
      moisture: 9.5,
      diseaseResistance: "Fusarium Wilt & Root Rot Tolerant",
      harvestDate: "2025-03-10",
      expiryDate: "2026-03-10",
      pricePerKg: 0.00030,
      availableQuantityKg: 2000,
      metadataCID: "bafybeipusa362chickpeabatch072",
      certificateCID: "bafybeicertpusa362pulsesresearchlab",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Chickpea Pusa-362. Protein content 21.8%. State Department of Agriculture.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-03-25T11:20:00Z"
    },
    {
      sellerAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      name: "Green Gram Pusa Vishal (Moong)",
      cropType: "Pulses",
      variety: "Pusa Vishal",
      batchNumber: "IN-MH-MNG-2025-091",
      manufacturer: "Kisan Mitra BioTech",
      germinationRate: 94.0,
      purity: 99.0,
      vigor: 93.0,
      moisture: 8.8,
      diseaseResistance: "Mungbean Yellow Mosaic Virus (MYMV) Resistant",
      harvestDate: "2025-05-02",
      expiryDate: "2026-05-02",
      pricePerKg: 0.00040,
      availableQuantityKg: 1800,
      metadataCID: "bafybeipusavishalmoongbatch091",
      certificateCID: "bafybeicertpusavishallabreport091",
      certificateText: "OFFICIAL SEED CERTIFICATION REPORT: Green Gram Pusa Vishal. 60-65 days extra early maturity. Lab Verified.",
      certificationStatus: "Certified",
      certifiedBy: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      certifiedAt: "2025-05-14T15:30:00Z"
    },
    {
      sellerAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
      name: "Uncertified Local Millet Grain (Risky)",
      cropType: "Cereals",
      variety: "Local Desi",
      batchNumber: "IN-RJ-MLT-2025-009",
      manufacturer: "QuickSeeds Direct",
      germinationRate: 64.0,
      purity: 82.0,
      vigor: 60.0,
      moisture: 14.5,
      diseaseResistance: "Susceptible to Smut and Ergot",
      harvestDate: "2024-11-20",
      expiryDate: "2025-11-20",
      pricePerKg: 0.00008,
      availableQuantityKg: 8000,
      metadataCID: "bafybeilocalmilletbatch009uncertified",
      certificateCID: "bafybeipendingcertlocalmillet009",
      certificateText: "UNVERIFIED INSPECTION DRAFT: High foreign matter detected (18%). Did not meet minimum certification standards.",
      certificationStatus: "Pending",
      certifiedBy: null,
      certifiedAt: null
    }
  ];

  const insertSeed = db.prepare(`
    INSERT INTO seeds (
      sellerAddress, name, cropType, variety, batchNumber, manufacturer,
      germinationRate, purity, vigor, moisture, diseaseResistance, harvestDate,
      expiryDate, pricePerKg, availableQuantityKg, metadataCID, certificateCID,
      certificateHash, certificationStatus, certifiedBy, certifiedAt, isDemo, createdAt
    ) VALUES (
      @sellerAddress, @name, @cropType, @variety, @batchNumber, @manufacturer,
      @germinationRate, @purity, @vigor, @moisture, @diseaseResistance, @harvestDate,
      @expiryDate, @pricePerKg, @availableQuantityKg, @metadataCID, @certificateCID,
      @certificateHash, @certificationStatus, @certifiedBy, @certifiedAt, @isDemo, @createdAt
    )
  `);

  for (const seed of seedsList) {
    const certHash = computeSha256(seed.certificateText);
    insertSeed.run({
      ...seed,
      certificateHash: certHash,
      isDemo: 1,
      createdAt: new Date().toISOString()
    });
  }

  // Seed sample orders & feedback
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      batchId, buyerAddress, sellerAddress, quantityKg, totalPriceEth,
      status, escrowLocked, escrowReleased, trackingNumber, carrierName,
      shippedAt, deliveredAt, completedAt, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFeedback = db.prepare(`
    INSERT INTO feedback (orderId, batchId, sellerAddress, buyerAddress, rating, comment, commentCID, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Order 1: Completed Wheat order
  insertOrder.run(
    1,
    "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    100,
    0.015,
    "COMPLETED",
    0,
    1,
    "TRK-AGRI-99824",
    "AgriExpress Logistics",
    "2025-05-01T10:00:00Z",
    "2025-05-04T14:30:00Z",
    "2025-05-04T16:00:00Z",
    "2025-04-30T09:00:00Z"
  );
  insertFeedback.run(
    1,
    1,
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    5,
    "Superb seed vigor! Germination exceeded 95% in field conditions. Lab certificate QR verified on arrival.",
    "QmFeedbackWheatFieldReview01",
    "2025-05-04T16:05:00Z"
  );

  // Order 2: Shipped Basmati Rice order (Active in Escrow)
  insertOrder.run(
    2,
    "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    50,
    0.014,
    "SHIPPED",
    1,
    0,
    "TRK-AGRI-10045",
    "Kisan Cargo Services",
    "2025-05-18T08:30:00Z",
    null,
    null,
    "2025-05-17T11:00:00Z"
  );

  // Order 3: Escrowed Tomato Seed order
  insertOrder.run(
    5,
    "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    5,
    0.0225,
    "ESCROWED",
    1,
    0,
    null,
    null,
    null,
    null,
    null,
    new Date().toISOString()
  );

  console.log("✅ SeedSure database initialized and synthetic demo data seeded successfully.");
}
