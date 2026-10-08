import { SeedBatch, Seller, Order, Feedback, TamperCheckResult, AnalyticsData, TrustExplanation } from "./types";

const API_BASE = "http://localhost:5001/api";

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

  const res = await fetch(`${API_BASE}/seeds?${query.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch seeds");
  return json.data;
}

export async function fetchSeedById(id: number | string): Promise<SeedBatch> {
  const res = await fetch(`${API_BASE}/seeds/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch seed details");
  return json.data;
}

export async function registerSeedBatch(batchData: any): Promise<{ id: number; certificateHash: string }> {
  const res = await fetch(`${API_BASE}/seeds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batchData)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to register seed batch");
  return json.data;
}

export async function certifySeedBatch(batchId: number, certifierAddress: string): Promise<any> {
  const res = await fetch(`${API_BASE}/seeds/${batchId}/certify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ certifierAddress })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to certify batch");
  return json;
}

export async function revokeSeedBatch(batchId: number, reason: string): Promise<any> {
  const res = await fetch(`${API_BASE}/seeds/${batchId}/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to revoke batch");
  return json;
}

export async function fetchSellers(): Promise<Seller[]> {
  const res = await fetch(`${API_BASE}/sellers`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch sellers");
  return json.data;
}

export async function fetchSellerByAddress(address: string): Promise<Seller> {
  const res = await fetch(`${API_BASE}/sellers/${address}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch seller profile");
  return json.data;
}

export async function registerSeller(sellerData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/sellers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sellerData)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to register seller");
  return json;
}

export async function verifySeller(address: string): Promise<any> {
  const res = await fetch(`${API_BASE}/sellers/${address}/verify`, { method: "POST" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to verify seller");
  return json;
}

export async function toggleSuspendSeller(address: string, suspend: boolean): Promise<any> {
  const res = await fetch(`${API_BASE}/sellers/${address}/suspend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ suspend })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to update seller suspension");
  return json;
}

export async function fetchOrders(params?: { buyer?: string; seller?: string }): Promise<Order[]> {
  const query = new URLSearchParams();
  if (params?.buyer) query.set("buyer", params.buyer);
  if (params?.seller) query.set("seller", params.seller);

  const res = await fetch(`${API_BASE}/orders?${query.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch orders");
  return json.data;
}

export async function createOrder(data: { batchId: number; buyerAddress: string; quantityKg: number }): Promise<any> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to create order");
  return json.data;
}

export async function shipOrder(orderId: number, data: { trackingNumber?: string; carrierName?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/ship`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to ship order");
  return json;
}

export async function confirmOrderDelivery(orderId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/confirm-delivery`, { method: "POST" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to confirm delivery");
  return json;
}

export async function raiseOrderDispute(orderId: number, data: { reason: string; evidenceText?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/dispute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to raise dispute");
  return json;
}

export async function resolveOrderDispute(orderId: number, data: { outcome: "REFUND" | "RELEASE_TO_SELLER" | "SPLIT"; notes?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/resolve-dispute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to resolve dispute");
  return json;
}

export async function submitOrderFeedback(data: { orderId: number; rating: number; comment?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to submit feedback");
  return json;
}

export async function verifyDocumentTamper(batchId: number, testDocumentText?: string, simulateTamper?: boolean): Promise<TamperCheckResult> {
  const res = await fetch(`${API_BASE}/ipfs/verify-tamper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ batchId, testDocumentText, simulateTamper })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Tamper check failed");
  return json.data;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch analytics");
  return json.data;
}
