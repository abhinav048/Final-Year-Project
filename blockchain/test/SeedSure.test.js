import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("SeedSure Smart Contract Ecosystem", function () {
  let admin, certifier, oracle, disputeResolver, seller1, seller2, farmer1;
  let sellerRegistry, seedRegistry, trustScoreRegistry, marketplace, feedbackRegistry;

  const sampleCertHash = ethers.keccak256(ethers.toUtf8Bytes("OFFICIAL LAB REPORT - ICAR WHEAT HD-2967"));
  const tamperedCertHash = ethers.keccak256(ethers.toUtf8Bytes("FORGED LAB REPORT - TAMPERED"));
  const featuresHash = ethers.keccak256(ethers.toUtf8Bytes("CANONICAL FEATURES VECTOR V1.4"));

  beforeEach(async function () {
    [admin, certifier, oracle, disputeResolver, seller1, seller2, farmer1] = await ethers.getSigners();

    // 1. Deploy SellerRegistry
    const SellerRegistry = await ethers.getContractFactory("SellerRegistry");
    sellerRegistry = await SellerRegistry.deploy(admin.address, certifier.address);
    await sellerRegistry.waitForDeployment();

    // 2. Deploy SeedRegistry
    const SeedRegistry = await ethers.getContractFactory("SeedRegistry");
    seedRegistry = await SeedRegistry.deploy(admin.address, certifier.address);
    await seedRegistry.waitForDeployment();

    // 3. Deploy TrustScoreRegistry
    const TrustScoreRegistry = await ethers.getContractFactory("TrustScoreRegistry");
    trustScoreRegistry = await TrustScoreRegistry.deploy(admin.address, oracle.address);
    await trustScoreRegistry.waitForDeployment();

    // 4. Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(
      admin.address,
      disputeResolver.address,
      sellerRegistry.target,
      seedRegistry.target,
      trustScoreRegistry.target
    );
    await marketplace.waitForDeployment();

    // 5. Deploy FeedbackRegistry
    const FeedbackRegistry = await ethers.getContractFactory("FeedbackRegistry");
    feedbackRegistry = await FeedbackRegistry.deploy(marketplace.target);
    await feedbackRegistry.waitForDeployment();

    // 6. Grant Marketplace Role in Registries
    const MARKETPLACE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MARKETPLACE_ROLE"));
    await sellerRegistry.connect(admin).grantRole(MARKETPLACE_ROLE, marketplace.target);
    await seedRegistry.connect(admin).grantRole(MARKETPLACE_ROLE, marketplace.target);
  });

  describe("1. Seller Registry & Accreditation", function () {
    it("should allow a breeder to register and be verified by certifier", async function () {
      await sellerRegistry.connect(seller1).registerSeller("bafybeimeta_agrigrow");
      const seller = await sellerRegistry.getSeller(seller1.address);
      expect(seller.isVerified).to.be.false;
      expect(seller.isSuspended).to.be.false;

      // Certifier verifies seller
      await sellerRegistry.connect(certifier).verifySeller(seller1.address);
      const verified = await sellerRegistry.getSeller(seller1.address);
      expect(verified.isVerified).to.be.true;
    });

    it("should prevent unauthorized actors from verifying sellers", async function () {
      await sellerRegistry.connect(seller1).registerSeller("bafybeimeta_agrigrow");
      await expect(
        sellerRegistry.connect(farmer1).verifySeller(seller1.address)
      ).to.be.reverted;
    });

    it("should allow admin to suspend and unsuspend a seller", async function () {
      await sellerRegistry.connect(seller1).registerSeller("bafybeimeta_agrigrow");
      await sellerRegistry.connect(admin).suspendSeller(seller1.address);
      expect(await sellerRegistry.isSellerActive(seller1.address)).to.be.false;

      await sellerRegistry.connect(admin).unsuspendSeller(seller1.address);
      expect(await sellerRegistry.isSellerActive(seller1.address)).to.be.true;
    });
  });

  describe("2. Seed Registry & Cryptographic Tamper Checking", function () {
    it("should register seed batch and verify cryptographic certificate hash", async function () {
      const pricePerKg = ethers.parseEther("0.001");
      const tx = await seedRegistry.connect(seller1).registerBatch(
        "Wheat HD-2967",
        "Cereals",
        "HD-2967 Foundation",
        "WHT-2026-9021",
        "IARI New Delhi",
        945, // 94.5%
        980, // 98.0%
        920,
        95,
        "Rust Resistant (Yr18/Sr2)",
        Math.floor(Date.now() / 1000) + 31536000,
        pricePerKg,
        1000, // 1000 kg
        "bafybeimeta_wheat",
        "bafybeicert_wheat",
        sampleCertHash
      );
      await tx.wait();

      const batch = await seedRegistry.getBatch(1);
      expect(batch.name).to.equal("Wheat HD-2967");
      expect(batch.status).to.equal(0); // Pending

      // Test Valid Hash: Must PASS
      const [isValid, isCertified] = await seedRegistry.verifyBatch(1, sampleCertHash);
      expect(isValid).to.be.true;
      expect(isCertified).to.be.false;

      // Test Tampered Hash: Must FAIL
      const [isTamperedValid] = await seedRegistry.verifyBatch(1, tamperedCertHash);
      expect(isTamperedValid).to.be.false;

      // Certify batch
      await seedRegistry.connect(certifier).certifyBatch(1);
      const [, isCertifiedNow] = await seedRegistry.verifyBatch(1, sampleCertHash);
      expect(isCertifiedNow).to.be.true;
    });
  });

  describe("3. ML Trust Score Registry & Gating", function () {
    it("should record dynamic score and enforce farmer protection gating", async function () {
      // Set high score for seller1
      await trustScoreRegistry.connect(oracle).updateTrustScore(
        seller1.address,
        92,
        "Excellent",
        "SeedSure-ML-v1.4",
        featuresHash
      );

      const [score, riskCat, , model] = await trustScoreRegistry.getTrustScore(seller1.address);
      expect(score).to.equal(92);
      expect(riskCat).to.equal("Excellent");
      expect(model).to.equal("SeedSure-ML-v1.4");
      expect(await trustScoreRegistry.meetsTrustThreshold(seller1.address, 40)).to.be.true;

      // Low score for seller2 (e.g. 35 < 40)
      await trustScoreRegistry.connect(oracle).updateTrustScore(
        seller2.address,
        35,
        "High Risk",
        "SeedSure-ML-v1.4",
        featuresHash
      );
      expect(await trustScoreRegistry.meetsTrustThreshold(seller2.address, 40)).to.be.false;
    });
  });

  describe("4. Non-Custodial Marketplace Escrow Lifecycle", function () {
    beforeEach(async function () {
      // Setup seller1 and seed
      await sellerRegistry.connect(seller1).registerSeller("bafybeimeta_agrigrow");
      await seedRegistry.connect(seller1).registerBatch(
        "Wheat HD-2967",
        "Cereals",
        "HD-2967",
        "WHT-2026-9021",
        "IARI",
        945, 980, 920, 95,
        "Rust Resistant",
        Math.floor(Date.now() / 1000) + 31536000,
        ethers.parseEther("0.01"), // 0.01 ETH/kg
        500, // 500 kg
        "metaCID", "certCID", sampleCertHash
      );
      await seedRegistry.connect(certifier).certifyBatch(1);
      await trustScoreRegistry.connect(oracle).updateTrustScore(
        seller1.address,
        85,
        "Trusted",
        "SeedSure-ML-v1.4",
        featuresHash
      );
    });

    it("should successfully lock funds in escrow, ship, and release payment upon delivery", async function () {
      const buyQty = 10;
      const totalPrice = ethers.parseEther("0.1"); // 10 * 0.01 ETH

      // Farmer places order with ETH
      const tx = await marketplace.connect(farmer1).createOrder(1, buyQty, { value: totalPrice });
      await tx.wait();

      const order = await marketplace.getOrder(1);
      expect(order.buyer).to.equal(farmer1.address);
      expect(order.seller).to.equal(seller1.address);
      expect(order.totalPrice).to.equal(totalPrice);
      expect(order.status).to.equal(0); // ESCROWED

      // Check contract holds escrow balance
      expect(await ethers.provider.getBalance(marketplace.target)).to.equal(totalPrice);

      // Inventory deducted in SeedRegistry
      const batch = await seedRegistry.getBatch(1);
      expect(batch.availableQuantity).to.equal(490);

      // Seller ships
      await marketplace.connect(seller1).shipOrder(1, "TRK-NATIONAL-AGRI-12345");
      const shippedOrder = await marketplace.getOrder(1);
      expect(shippedOrder.status).to.equal(1); // SHIPPED

      // Farmer confirms delivery -> seller receives payment
      const sellerBalanceBefore = await ethers.provider.getBalance(seller1.address);
      await marketplace.connect(farmer1).confirmDelivery(1);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller1.address);

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(totalPrice);
      expect(await ethers.provider.getBalance(marketplace.target)).to.equal(0n);

      const completedOrder = await marketplace.getOrder(1);
      expect(completedOrder.status).to.equal(2); // COMPLETED
    });

    it("should block purchase if seller trust score is below threshold", async function () {
      // Set seller1 score to 30 (below 40 threshold)
      await trustScoreRegistry.connect(oracle).updateTrustScore(
        seller1.address,
        30,
        "High Risk",
        "SeedSure-ML-v1.4",
        featuresHash
      );

      const totalPrice = ethers.parseEther("0.1");
      await expect(
        marketplace.connect(farmer1).createOrder(1, 10, { value: totalPrice })
      ).to.be.revertedWith("Seller trust score below safety threshold. Farmer escrow gate blocked purchase.");
    });

    it("should allow farmer to dispute and resolver to issue refund", async function () {
      const totalPrice = ethers.parseEther("0.1");
      await marketplace.connect(farmer1).createOrder(1, 10, { value: totalPrice });
      await marketplace.connect(seller1).shipOrder(1, "TRK-999");

      // Farmer disputes order
      await marketplace.connect(farmer1).disputeOrder(1, "bafybeidispute_failed_germination");
      const order = await marketplace.getOrder(1);
      expect(order.status).to.equal(3); // DISPUTED

      // Arbiter issues refund
      const farmerBalBefore = await ethers.provider.getBalance(farmer1.address);
      await marketplace.connect(disputeResolver).resolveDispute(1, 0); // 0 = REFUND
      const farmerBalAfter = await ethers.provider.getBalance(farmer1.address);

      expect(farmerBalAfter - farmerBalBefore).to.equal(totalPrice);
      const refundedOrder = await marketplace.getOrder(1);
      expect(refundedOrder.status).to.equal(4); // REFUNDED
    });
  });

  describe("5. Feedback & Reputation Registry", function () {
    it("should allow verified buyer to submit 1-5 star review on completed orders", async function () {
      // Setup and complete order
      await sellerRegistry.connect(seller1).registerSeller("bafybeimeta");
      await seedRegistry.connect(seller1).registerBatch(
        "Wheat", "Cereals", "HD", "LOT1", "IARI", 900, 950, 900, 90, "None",
        Math.floor(Date.now() / 1000) + 100000, ethers.parseEther("0.01"), 100, "m", "c", sampleCertHash
      );
      await trustScoreRegistry.connect(oracle).updateTrustScore(seller1.address, 80, "Trusted", "v1", featuresHash);
      await marketplace.connect(farmer1).createOrder(1, 1, { value: ethers.parseEther("0.01") });
      await marketplace.connect(seller1).shipOrder(1, "TRK-1");
      await marketplace.connect(farmer1).confirmDelivery(1);

      // Submit feedback
      await feedbackRegistry.connect(farmer1).submitFeedback(1, 5, "bafybeicomment_excellent");
      const fb = await feedbackRegistry.getFeedback(1);
      expect(fb.rating).to.equal(5);
      expect(fb.buyer).to.equal(farmer1.address);
      expect(fb.seller).to.equal(seller1.address);

      // Enforce only one review per order
      await expect(
        feedbackRegistry.connect(farmer1).submitFeedback(1, 4, "duplicate")
      ).to.be.revertedWith("Feedback already submitted for this order");
    });
  });
});
