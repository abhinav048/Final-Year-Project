import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { ethers } = hre;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("==================================================");
  console.log("🌱 Deploying SeedSure Smart Contracts to Network:", hre.network.name);
  console.log("==================================================");

  const [admin, certifier, oracle, disputeResolver, seller1, seller2, farmer1] = await ethers.getSigners();
  console.log(`Admin (Deployer):     ${admin.address}`);
  console.log(`Certification Agency: ${certifier.address}`);
  console.log(`ML Oracle:            ${oracle.address}`);
  console.log(`Dispute Arbiter:      ${disputeResolver.address}`);
  console.log(`Breeder Persona 1:    ${seller1.address}`);
  console.log(`Breeder Persona 2:    ${seller2.address}`);
  console.log(`Farmer Persona:       ${farmer1.address}`);
  console.log("--------------------------------------------------");

  // 1. Deploy SellerRegistry
  console.log("1. Deploying SellerRegistry...");
  const SellerRegistry = await ethers.getContractFactory("SellerRegistry");
  const sellerRegistry = await SellerRegistry.deploy(admin.address, certifier.address);
  await sellerRegistry.waitForDeployment();
  const sellerRegistryAddress = await sellerRegistry.getAddress();
  console.log(`   -> SellerRegistry deployed at: ${sellerRegistryAddress}`);

  // 2. Deploy SeedRegistry
  console.log("2. Deploying SeedRegistry...");
  const SeedRegistry = await ethers.getContractFactory("SeedRegistry");
  const seedRegistry = await SeedRegistry.deploy(admin.address, certifier.address);
  await seedRegistry.waitForDeployment();
  const seedRegistryAddress = await seedRegistry.getAddress();
  console.log(`   -> SeedRegistry deployed at: ${seedRegistryAddress}`);

  // 3. Deploy TrustScoreRegistry
  console.log("3. Deploying TrustScoreRegistry...");
  const TrustScoreRegistry = await ethers.getContractFactory("TrustScoreRegistry");
  const trustScoreRegistry = await TrustScoreRegistry.deploy(admin.address, oracle.address);
  await trustScoreRegistry.waitForDeployment();
  const trustScoreRegistryAddress = await trustScoreRegistry.getAddress();
  console.log(`   -> TrustScoreRegistry deployed at: ${trustScoreRegistryAddress}`);

  // 4. Deploy Marketplace & Escrow
  console.log("4. Deploying Marketplace & Escrow...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    admin.address,
    disputeResolver.address,
    sellerRegistryAddress,
    seedRegistryAddress,
    trustScoreRegistryAddress
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log(`   -> Marketplace deployed at: ${marketplaceAddress}`);

  // 5. Deploy FeedbackRegistry
  console.log("5. Deploying FeedbackRegistry...");
  const FeedbackRegistry = await ethers.getContractFactory("FeedbackRegistry");
  const feedbackRegistry = await FeedbackRegistry.deploy(marketplaceAddress);
  await feedbackRegistry.waitForDeployment();
  const feedbackRegistryAddress = await feedbackRegistry.getAddress();
  console.log(`   -> FeedbackRegistry deployed at: ${feedbackRegistryAddress}`);

  // 6. Role Configuration
  console.log("--------------------------------------------------");
  console.log("6. Granting Inter-Contract Roles...");
  const MARKETPLACE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MARKETPLACE_ROLE"));
  await (await sellerRegistry.grantRole(MARKETPLACE_ROLE, marketplaceAddress)).wait();
  await (await seedRegistry.grantRole(MARKETPLACE_ROLE, marketplaceAddress)).wait();
  console.log("   -> MARKETPLACE_ROLE granted in SellerRegistry and SeedRegistry");

  // 7. Seed Initial On-Chain State
  console.log("--------------------------------------------------");
  console.log("7. Initializing On-Chain Research Batches & Breeder Credibility...");

  // Seller 1 Registration & Verification
  await (await sellerRegistry.connect(seller1).registerSeller("bafybeimeta_agrigrow_breeder")).wait();
  await (await sellerRegistry.connect(certifier).verifySeller(seller1.address)).wait();
  console.log(`   -> Registered & Verified Seller: ${seller1.address}`);

  // Oracle Trust Score Update
  const canonicalFeaturesHash = ethers.keccak256(
    ethers.toUtf8Bytes(JSON.stringify({ seller: seller1.address, certRatio: 1.0, onTime: 0.96 }))
  );
  await (
    await trustScoreRegistry.connect(oracle).updateTrustScore(
      seller1.address,
      94,
      "Excellent",
      "SeedSure-ML-v1.4",
      canonicalFeaturesHash
    )
  ).wait();
  console.log(`   -> Trust Score Oracle: 94/100 (Excellent) registered for ${seller1.address}`);

  // Register Seed Batch 1: Wheat HD-2967
  const wheatCertHash = ethers.keccak256(
    ethers.toUtf8Bytes("ICAR-IARI OFFICIAL LAB CERTIFICATE: WHEAT HD-2967 - PURITY 98.2% - GERMINATION 94.5%")
  );
  await (
    await seedRegistry.connect(seller1).registerBatch(
      "Wheat HD-2967",
      "Cereals",
      "HD-2967 Certified Foundation",
      "WHT-2026-9021",
      "Indian Agricultural Research Institute (IARI)",
      945, // 94.5%
      982, // 98.2%
      920, // 92.0%
      95,  // 9.5%
      "Rust Resistance (Yr18/Sr2/Lr34)",
      Math.floor(Date.now() / 1000) + 31536000,
      ethers.parseEther("0.005"), // 0.005 ETH / kg (~$15/kg)
      5000, // 5000 kg available
      "bafybeimeta_wheat_hd2967",
      "bafybeicert_wheat_hd2967",
      wheatCertHash
    )
  ).wait();
  await (await seedRegistry.connect(certifier).certifyBatch(1)).wait();
  console.log("   -> Batch #1 (Wheat HD-2967) registered and certified on-chain");

  // Register Seed Batch 2: Basmati Rice Pusa 1121
  const riceCertHash = ethers.keccak256(
    ethers.toUtf8Bytes("ICAR OFFICIAL LAB CERTIFICATE: BASMATI PUSA 1121 - PURITY 99.0% - GERMINATION 92.0%")
  );
  await (
    await seedRegistry.connect(seller1).registerBatch(
      "Basmati Rice Pusa 1121",
      "Cereals",
      "Pusa Basmati 1121 Foundation",
      "RCE-2026-1121",
      "National Seeds Corporation",
      920,
      990,
      890,
      115,
      "Bacterial Blight Tolerant (xa13/Xa21)",
      Math.floor(Date.now() / 1000) + 31536000,
      ethers.parseEther("0.008"),
      3500,
      "bafybeimeta_basmati",
      "bafybeicert_basmati",
      riceCertHash
    )
  ).wait();
  await (await seedRegistry.connect(certifier).certifyBatch(2)).wait();
  console.log("   -> Batch #2 (Basmati Rice Pusa 1121) registered and certified on-chain");

  const deployedData = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
    contracts: {
      SellerRegistry: sellerRegistryAddress,
      SeedRegistry: seedRegistryAddress,
      TrustScoreRegistry: trustScoreRegistryAddress,
      Marketplace: marketplaceAddress,
      FeedbackRegistry: feedbackRegistryAddress,
    },
    accounts: {
      admin: admin.address,
      certifier: certifier.address,
      oracle: oracle.address,
      disputeResolver: disputeResolver.address,
      seller1: seller1.address,
      seller2: seller2.address,
      farmer1: farmer1.address,
    },
  };

  // Save to blockchain folder
  const blockchainOut = path.resolve(__dirname, "../deployed-contracts.json");
  fs.writeFileSync(blockchainOut, JSON.stringify(deployedData, null, 2));

  // Save to frontend contracts folder
  const frontendDir = path.resolve(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  fs.writeFileSync(path.join(frontendDir, "deployedContracts.json"), JSON.stringify(deployedData, null, 2));

  // Save to backend
  const backendDir = path.resolve(__dirname, "../../backend/src");
  fs.writeFileSync(path.join(backendDir, "deployedContracts.json"), JSON.stringify(deployedData, null, 2));

  console.log("--------------------------------------------------");
  console.log("✅ Smart Contracts successfully deployed and configured!");
  console.log(`Addresses saved to:\n - ${blockchainOut}\n - ${path.join(frontendDir, "deployedContracts.json")}\n - ${path.join(backendDir, "deployedContracts.json")}`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
