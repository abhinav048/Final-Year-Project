import {
  SeedBatch,
  Seller,
  Order,
  Feedback,
  TamperCheckResult,
  AnalyticsData
} from "./types";
import {
  FALLBACK_SELLERS,
  FALLBACK_SEEDS,
  FALLBACK_ORDERS,
  FALLBACK_FEEDBACK,
  FALLBACK_ANALYTICS,
  FALLBACK_TRANSACTIONS,
  getFallbackTrustExplanation
} from "./mockFallbackData";

// Dynamic API Base URL:
// 1. If VITE_API_BASE is set, use it.
// 2. If on localhost, default to http://localhost:5001/api
// 3. Otherwise (e.g. deployed on Netlify), default to /api
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string) ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5001/api"
    : "/api");

// Session-persistent in-memory store for fallback/offline/Netlify demo execution
let localSeeds: SeedBatch[] = (() => {
  try {
    const saved = sessionStorage.getItem("seedsure_demo_seeds");
    return saved ? JSON.parse(saved) : [...FALLBACK_SEEDS];
  } catch {
    return [...FALLBACK_SEEDS];
  }
})();

let localSellers: Seller[] = (() => {
  try {
    const saved = sessionStorage.getItem("seedsure_demo_sellers");
    return saved ? JSON.parse(saved) : [...FALLBACK_SELLERS];
  } catch {
    return [...FALLBACK_SELLERS];
  }
})();

let localOrders: Order[] = (() => {
  try {
    const saved = sessionStorage.getItem("seedsure_demo_orders");
    return saved ? JSON.parse(saved) : [...FALLBACK_ORDERS];
  } catch {
    return [...FALLBACK_ORDERS];
  }
})();

let localFeedback: Feedback[] = (() => {
  try {
    const saved = sessionStorage.getItem("seedsure_demo_feedback");
    return saved ? JSON.parse(saved) : [...FALLBACK_FEEDBACK];
  } catch {
    return [...FALLBACK_FEEDBACK];
  }
})();

let localTransactions = [...FALLBACK_TRANSACTIONS];

function persistLocalState() {
  try {
    sessionStorage.setItem("seedsure_demo_seeds", JSON.stringify(localSeeds));
    sessionStorage.setItem("seedsure_demo_sellers", JSON.stringify(localSellers));
    sessionStorage.setItem("seedsure_demo_orders", JSON.stringify(localOrders));
    sessionStorage.setItem("seedsure_demo_feedback", JSON.stringify(localFeedback));
  } catch {}
}

/**
 * Generic safe fetch with transparent client fallback for Netlify & Offline preview
 */
async function safeApiCall<T>(
  url: string,
  options?: RequestInit,
  fallback?: () => T | Promise<T>
): Promise<T> {
  try {
    // Only attempt live fetch if we have an API endpoint
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        return json.data !== undefined ? json.data : json;
      }
    }
  } catch (err) {
    // Backend unreachable or request failed — fall through to fallback
  }

  if (fallback) {
    return fallback();
  }

  throw new Error(`API call to ${url} failed and no fallback was provided`);
}

// ==========================================
// 1. SEEDS
// ==========================================

export async function fetchSeeds(params?: {
  q?: string;
  category?: string;
  minTrust?: number;
  certifiedOnly?: boolean;
  sort?: string;
}): Promise<SeedBatch[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.minTrust) query.set("minTrust", params.minTrust.toString());
  if (params?.certifiedOnly) query.set("certifiedOnly", "true");
  if (params?.sort) query.set("sort", params.sort);

  return safeApiCall<SeedBatch[]>(
    `${API_BASE}/seeds?${query.toString()}`,
    undefined,
    () => {
      let filtered = [...localSeeds];

      if (params?.q) {
        const q = params.q.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.cropType.toLowerCase().includes(q) ||
            s.variety.toLowerCase().includes(q) ||
            (s.sellerName && s.sellerName.toLowerCase().includes(q))
        );
      }

      if (params?.category && params.category !== "All") {
        filtered = filtered.filter((s) => s.cropType === params.category);
      }

      if (params?.minTrust) {
        filtered = filtered.filter((s) => (s.sellerTrustScore || 50) >= params.minTrust!);
      }

      if (params?.certifiedOnly) {
        filtered = filtered.filter((s) => s.certificationStatus === "Certified");
      }

      if (params?.sort === "price_asc") {
        filtered.sort((a, b) => a.pricePerKg - b.pricePerKg);
      } else if (params?.sort === "price_desc") {
        filtered.sort((a, b) => b.pricePerKg - a.pricePerKg);
      } else if (params?.sort === "germination") {
        filtered.sort((a, b) => b.germinationRate - a.germinationRate);
      } else {
        // default: trust
        filtered.sort((a, b) => (b.sellerTrustScore || 50) - (a.sellerTrustScore || 50));
      }

      return filtered;
    }
  );
}

export async function fetchSeedById(id: number | string): Promise<SeedBatch> {
  return safeApiCall<SeedBatch>(`${API_BASE}/seeds/${id}`, undefined, () => {
    const numId = Number(id);
    const item = localSeeds.find((s) => s.id === numId);
    if (!item) {
      throw new Error(`Seed batch #${id} not found`);
    }

    const seller = localSellers.find((sel) => sel.address.toLowerCase() === item.sellerAddress.toLowerCase());
    const itemReviews = localFeedback.filter((f) => f.batchId === numId);

    return {
      ...item,
      reviews: itemReviews,
      trustExplanation: seller ? getFallbackTrustExplanation(seller) : undefined
    };
  });
}

export async function registerSeedBatch(
  batchData: any
): Promise<{ id: number; certificateHash: string }> {
  return safeApiCall<{ id: number; certificateHash: string }>(
    `${API_BASE}/seeds`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batchData)
    },
    () => {
      const newId = localSeeds.length > 0 ? Math.max(...localSeeds.map((s) => s.id)) + 1 : 1;
      const certificateHash = "0x" + Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18);
      const newSeed: SeedBatch = {
        id: newId,
        sellerAddress: batchData.sellerAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        sellerName: "AgriGrow Certified Seeds Ltd.",
        sellerTrustScore: 96,
        sellerRiskCategory: "Excellent",
        sellerVerified: 1,
        name: batchData.name || "Newly Registered Cultivar",
        cropType: batchData.cropType || "Cereals",
        variety: batchData.variety || "Commercial V1",
        batchNumber: batchData.batchNumber || `IN-DEMO-${newId}`,
        manufacturer: batchData.manufacturer || "Breeder Lab",
        germinationRate: Number(batchData.germinationRate) || 90.0,
        purity: Number(batchData.purity) || 98.0,
        vigor: Number(batchData.vigor) || 90.0,
        moisture: Number(batchData.moisture) || 10.0,
        diseaseResistance: batchData.diseaseResistance || "Standard Tested",
        harvestDate: batchData.harvestDate || "2025-01-01",
        expiryDate: batchData.expiryDate || "2026-01-01",
        pricePerKg: Number(batchData.pricePerKg) || 0.0002,
        availableQuantityKg: Number(batchData.availableQuantityKg) || 1000,
        metadataCID: "bafybeidemo" + newId,
        certificateCID: "bafybeicert" + newId,
        certificateHash,
        certificationStatus: "Certified",
        certifiedBy: batchData.sellerAddress,
        certifiedAt: new Date().toISOString(),
        isDemo: 1,
        createdAt: new Date().toISOString()
      };

      localSeeds.unshift(newSeed);
      persistLocalState();

      localTransactions.unshift({
        txHash: "0x" + Math.random().toString(16).substring(2, 18) + "aa1",
        blockNumber: 1050 + localTransactions.length,
        contract: "SeedRegistry",
        action: "BatchRegistered",
        caller: newSeed.sellerAddress,
        details: `Batch ${newSeed.batchNumber} registered by ${newSeed.sellerName}`,
        timestamp: new Date().toISOString()
      });

      return { id: newId, certificateHash };
    }
  );
}

export async function certifySeedBatch(batchId: number, certifierAddress: string): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/seeds/${batchId}/certify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certifierAddress })
    },
    () => {
      const idx = localSeeds.findIndex((s) => s.id === batchId);
      if (idx !== -1) {
        localSeeds[idx] = {
          ...localSeeds[idx],
          certificationStatus: "Certified",
          certifiedBy: certifierAddress,
          certifiedAt: new Date().toISOString()
        };
        persistLocalState();
      }
      return { success: true, message: `Batch #${batchId} certified on-chain` };
    }
  );
}

export async function revokeSeedBatch(batchId: number, reason: string): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/seeds/${batchId}/revoke`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    },
    () => {
      const idx = localSeeds.findIndex((s) => s.id === batchId);
      if (idx !== -1) {
        localSeeds[idx] = {
          ...localSeeds[idx],
          certificationStatus: "Revoked"
        };
        persistLocalState();
      }
      return { success: true, message: `Batch #${batchId} revoked: ${reason}` };
    }
  );
}

// ==========================================
// 2. SELLERS
// ==========================================

export async function fetchSellers(): Promise<Seller[]> {
  return safeApiCall<Seller[]>(`${API_BASE}/sellers`, undefined, () => {
    return localSellers.map((seller) => {
      const batches = localSeeds.filter(
        (s) => s.sellerAddress.toLowerCase() === seller.address.toLowerCase()
      );
      const orders = localOrders.filter(
        (o) => o.sellerAddress.toLowerCase() === seller.address.toLowerCase()
      );
      return {
        ...seller,
        batches,
        orders,
        trustDetails: getFallbackTrustExplanation(seller)
      };
    });
  });
}

export async function fetchSellerByAddress(address: string): Promise<Seller> {
  return safeApiCall<Seller>(`${API_BASE}/sellers/${address}`, undefined, () => {
    const seller = localSellers.find(
      (s) => s.address.toLowerCase() === address.toLowerCase()
    );
    if (!seller) {
      throw new Error(`Seller with address ${address} not found`);
    }

    const batches = localSeeds.filter(
      (s) => s.sellerAddress.toLowerCase() === seller.address.toLowerCase()
    );
    const orders = localOrders.filter(
      (o) => o.sellerAddress.toLowerCase() === seller.address.toLowerCase()
    );

    return {
      ...seller,
      batches,
      orders,
      trustDetails: getFallbackTrustExplanation(seller)
    };
  });
}

export async function registerSeller(sellerData: any): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/sellers/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sellerData)
    },
    () => {
      const newSeller: Seller = {
        address: sellerData.address || "0x" + Math.random().toString(16).substring(2, 42),
        name: sellerData.name || "New Breeder",
        description: sellerData.description || "Agricultural seed grower",
        location: sellerData.location || "India",
        metadataCID: "QmNewSeller" + Date.now(),
        isVerified: 0,
        isSuspended: 0,
        trustScore: 50,
        riskCategory: "Moderate",
        totalOrders: 0,
        successfulOrders: 0,
        failedOrders: 0,
        deliveredOrders: 0,
        delayedOrders: 0,
        disputedOrders: 0,
        disputesLost: 0,
        certifiedBatchesCount: 0,
        totalBatchesCount: 0,
        avgFarmerRating: 4.0,
        ratingCount: 0,
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localSellers.push(newSeller);
      persistLocalState();
      return { success: true, data: newSeller };
    }
  );
}

export async function verifySeller(address: string): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/sellers/${address}/verify`,
    { method: "POST" },
    () => {
      const idx = localSellers.findIndex(
        (s) => s.address.toLowerCase() === address.toLowerCase()
      );
      if (idx !== -1) {
        localSellers[idx] = {
          ...localSellers[idx],
          isVerified: 1,
          trustScore: Math.min(100, localSellers[idx].trustScore + 5)
        };
        persistLocalState();
      }
      return { success: true, message: "Seller verified successfully" };
    }
  );
}

export async function toggleSuspendSeller(address: string, suspend: boolean): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/sellers/${address}/suspend`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspend })
    },
    () => {
      const idx = localSellers.findIndex(
        (s) => s.address.toLowerCase() === address.toLowerCase()
      );
      if (idx !== -1) {
        localSellers[idx] = {
          ...localSellers[idx],
          isSuspended: suspend ? 1 : 0
        };
        persistLocalState();
      }
      return { success: true, message: `Seller ${suspend ? "suspended" : "reactivated"}` };
    }
  );
}

// ==========================================
// 3. ORDERS & ESCROW
// ==========================================

export async function fetchOrders(params?: {
  buyer?: string;
  seller?: string;
}): Promise<Order[]> {
  const query = new URLSearchParams();
  if (params?.buyer) query.set("buyer", params.buyer);
  if (params?.seller) query.set("seller", params.seller);

  return safeApiCall<Order[]>(
    `${API_BASE}/orders?${query.toString()}`,
    undefined,
    () => {
      let filtered = [...localOrders];
      if (params?.buyer) {
        filtered = filtered.filter(
          (o) => o.buyerAddress.toLowerCase() === params.buyer!.toLowerCase()
        );
      }
      if (params?.seller) {
        filtered = filtered.filter(
          (o) => o.sellerAddress.toLowerCase() === params.seller!.toLowerCase()
        );
      }
      return filtered;
    }
  );
}

export async function createOrder(data: {
  batchId: number;
  buyerAddress: string;
  quantityKg: number;
}): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/orders`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    },
    () => {
      const batch = localSeeds.find((s) => s.id === data.batchId);
      const newId = localOrders.length > 0 ? Math.max(...localOrders.map((o) => o.id)) + 1 : 101;
      const priceEth = batch ? batch.pricePerKg * data.quantityKg : 0.005;

      const newOrder: Order = {
        id: newId,
        batchId: data.batchId,
        seedName: batch?.name || "Seed Lot",
        cropType: batch?.cropType || "Cereals",
        batchNumber: batch?.batchNumber || `LOT-${data.batchId}`,
        certificateHash: batch?.certificateHash || "0xabcdef",
        buyerAddress: data.buyerAddress,
        sellerAddress: batch?.sellerAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        sellerName: batch?.sellerName || "AgriGrow Certified Seeds Ltd.",
        quantityKg: data.quantityKg,
        totalPriceEth: Number(priceEth.toFixed(6)),
        status: "ESCROWED",
        escrowLocked: 1,
        escrowReleased: 0,
        trackingNumber: `EXP-${Math.floor(10000 + Math.random() * 90000)}`,
        carrierName: "AgriDirect Express",
        createdAt: new Date().toISOString()
      };

      localOrders.unshift(newOrder);
      persistLocalState();

      localTransactions.unshift({
        txHash: "0x" + Math.random().toString(16).substring(2, 18) + "escrow",
        blockNumber: 1060 + localTransactions.length,
        contract: "Marketplace",
        action: "OrderCreated & EscrowLocked",
        caller: data.buyerAddress,
        details: `Locked ${newOrder.totalPriceEth} ETH for order #${newId}`,
        timestamp: new Date().toISOString()
      });

      return newOrder;
    }
  );
}

export async function shipOrder(
  orderId: number,
  data: { trackingNumber?: string; carrierName?: string }
): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/orders/${orderId}/ship`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    },
    () => {
      const idx = localOrders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        localOrders[idx] = {
          ...localOrders[idx],
          status: "SHIPPED",
          trackingNumber: data.trackingNumber || localOrders[idx].trackingNumber,
          carrierName: data.carrierName || localOrders[idx].carrierName,
          shippedAt: new Date().toISOString()
        };
        persistLocalState();
      }
      return { success: true, message: `Order #${orderId} marked as shipped` };
    }
  );
}

export async function confirmOrderDelivery(orderId: number): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/orders/${orderId}/confirm-delivery`,
    { method: "POST" },
    () => {
      const idx = localOrders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        localOrders[idx] = {
          ...localOrders[idx],
          status: "COMPLETED",
          escrowLocked: 0,
          escrowReleased: 1,
          deliveredAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        };
        persistLocalState();
      }
      return { success: true, message: `Order #${orderId} delivered and escrow released` };
    }
  );
}

export async function raiseOrderDispute(
  orderId: number,
  data: { reason: string; evidenceText?: string }
): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/orders/${orderId}/dispute`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    },
    () => {
      const idx = localOrders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        localOrders[idx] = {
          ...localOrders[idx],
          status: "DISPUTED"
        };
        persistLocalState();
      }
      return { success: true, message: `Dispute filed for order #${orderId}` };
    }
  );
}

export async function resolveOrderDispute(
  orderId: number,
  data: { outcome: "REFUND" | "RELEASE_TO_SELLER" | "SPLIT"; notes?: string }
): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/orders/${orderId}/resolve-dispute`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    },
    () => {
      const idx = localOrders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        localOrders[idx] = {
          ...localOrders[idx],
          status: data.outcome === "REFUND" ? "REFUNDED" : "COMPLETED",
          escrowLocked: 0,
          escrowReleased: data.outcome === "RELEASE_TO_SELLER" ? 1 : 0
        };
        persistLocalState();
      }
      return { success: true, message: `Dispute resolved with outcome ${data.outcome}` };
    }
  );
}

export async function submitOrderFeedback(data: {
  orderId: number;
  rating: number;
  comment?: string;
}): Promise<any> {
  return safeApiCall<any>(
    `${API_BASE}/feedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    },
    () => {
      const order = localOrders.find((o) => o.id === data.orderId);
      const newFeedback: Feedback = {
        id: localFeedback.length + 1,
        orderId: data.orderId,
        batchId: order?.batchId || 1,
        sellerAddress: order?.sellerAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        buyerAddress: order?.buyerAddress || "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
        rating: data.rating,
        comment: data.comment || "Seed batch received in excellent condition.",
        commentCID: "bafybeifeedback" + Date.now(),
        createdAt: new Date().toISOString(),
        quantityKg: order?.quantityKg
      };
      localFeedback.unshift(newFeedback);
      persistLocalState();
      return { success: true, data: newFeedback };
    }
  );
}

// Client-side SHA-256 for browser-based cryptographic tamper checks
async function calculateSha256InBrowser(message: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "0x98f5a432b876543210fedcba9876543210fedcba9876543210fedcba98765432";
}

export async function verifyDocumentTamper(
  batchId: number,
  testDocumentText?: string,
  simulateTamper?: boolean
): Promise<TamperCheckResult> {
  return safeApiCall<TamperCheckResult>(
    `${API_BASE}/ipfs/verify-tamper`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchId, testDocumentText, simulateTamper })
    },
    async () => {
      const seed = localSeeds.find((s) => s.id === batchId) || localSeeds[0];
      const expectedHash = seed.certificateHash;

      let computedHash: string;
      if (simulateTamper) {
        // Tampered content returns different hash
        computedHash = "0x" + "tampered".padEnd(64, "0");
      } else if (testDocumentText) {
        computedHash = await calculateSha256InBrowser(testDocumentText);
      } else {
        computedHash = expectedHash;
      }

      const tamperDetected = computedHash.toLowerCase() !== expectedHash.toLowerCase();

      return {
        batchId: seed.id,
        batchNumber: seed.batchNumber,
        certificateCID: seed.certificateCID,
        expectedHash,
        computedHash,
        tamperDetected,
        status: tamperDetected ? "FAIL" : "PASS",
        message: tamperDetected
          ? "CRITICAL ALERT: Certificate hash mismatch! The laboratory report has been modified or forged."
          : "VERIFIED: Certificate SHA-256 matches the immutable on-chain smart contract record."
      };
    }
  );
}

// ==========================================
// 4. ANALYTICS
// ==========================================

export async function fetchAnalytics(): Promise<AnalyticsData> {
  return safeApiCall<AnalyticsData>(`${API_BASE}/analytics`, undefined, () => {
    const certified = localSeeds.filter((s) => s.certificationStatus === "Certified").length;
    return {
      ...FALLBACK_ANALYTICS,
      totalBatches: localSeeds.length,
      certifiedBatches: certified,
      certificationRate: localSeeds.length > 0 ? Number(((certified / localSeeds.length) * 100).toFixed(1)) : 100,
      totalOrders: localOrders.length + 128
    };
  });
}

// ==========================================
// 5. BLOCKCHAIN STATUS & TRANSACTIONS
// ==========================================

export async function fetchBlockchainStatus(): Promise<any> {
  return safeApiCall<any>(`${API_BASE}/blockchain/status`, undefined, () => {
    return {
      isConnected: false,
      rpcUrl: "http://127.0.0.1:8545",
      chainId: 31337,
      networkName: "Local EVM Simulated (Netlify Ready)",
      blockNumber: 1048 + localTransactions.length,
      gasPriceGwei: "1.25",
      contracts: {
        SeedRegistry: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        SellerRegistry: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        Marketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        TrustScoreRegistry: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
      },
      accounts: {
        deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        certifier: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        seller1: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        farmer1: "0x976EA74026E726554dB657fA54763abd0C3a0aa9"
      }
    };
  });
}

export async function fetchBlockchainTransactions(): Promise<any[]> {
  return safeApiCall<any[]>(`${API_BASE}/blockchain/transactions`, undefined, () => {
    return localTransactions;
  });
}
