import React, { useEffect, useState } from "react";
import {
  fetchSeeds,
  certifySeedBatch,
  revokeSeedBatch,
  fetchSellers,
  verifySeller,
  toggleSuspendSeller,
  fetchOrders,
  resolveOrderDispute,
  fetchAnalytics
} from "../api";
import { SeedBatch, Seller, Order, AnalyticsData } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Sliders,
  Award,
  Layers,
  Lock,
  ExternalLink
} from "lucide-react";

interface AdminDashboardProps {
  currentAddress: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentAddress }) => {
  const [activeTab, setActiveTab] = useState<"certify" | "sellers" | "disputes" | "security">("certify");
  const [seeds, setSeeds] = useState<SeedBatch[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Platform Security Config
  const [minTrustThreshold, setMinTrustThreshold] = useState(40);
  const [updatingThreshold, setUpdatingThreshold] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [seedsData, sellersData, ordersData, analyticsData] = await Promise.all([
        fetchSeeds(),
        fetchSellers(),
        fetchOrders(),
        fetchAnalytics()
      ]);
      setSeeds(seedsData);
      setSellers(sellersData);
      setOrders(ordersData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCertifyBatch = async (batchId: number) => {
    try {
      await certifySeedBatch(batchId, currentAddress);
      alert(`Batch #${batchId} certified on-chain by Certification Authority!`);
      loadData();
    } catch (err: any) {
      alert("Certification failed: " + err.message);
    }
  };

  const handleRevokeBatch = async (batchId: number) => {
    const reason = prompt("Enter reason for revoking certification:");
    if (!reason) return;
    try {
      await revokeSeedBatch(batchId, reason);
      alert(`Batch #${batchId} revoked: ${reason}`);
      loadData();
    } catch (err: any) {
      alert("Revocation failed: " + err.message);
    }
  };

  const handleVerifySeller = async (sellerAddress: string) => {
    try {
      await verifySeller(sellerAddress);
      alert("Seller verified on-chain!");
      loadData();
    } catch (err: any) {
      alert("Verification failed: " + err.message);
    }
  };

  const handleToggleSuspend = async (sellerAddress: string, currentSuspended: number) => {
    try {
      await toggleSuspendSeller(sellerAddress, currentSuspended === 0);
      alert(`Seller suspension state toggled.`);
      loadData();
    } catch (err: any) {
      alert("Suspension toggle failed: " + err.message);
    }
  };

  const handleResolveDispute = async (orderId: number, outcome: "REFUND" | "RELEASE_TO_SELLER" | "SPLIT") => {
    const notes = prompt(`Confirm arbitration outcome (${outcome}). Enter notes:`);
    if (notes === null) return;
    try {
      await resolveOrderDispute(orderId, { outcome, notes });
      alert(`Dispute for Order #${orderId} resolved with outcome: ${outcome}`);
      loadData();
    } catch (err: any) {
      alert("Arbitration failed: " + err.message);
    }
  };

  const disputedOrders = orders.filter((o) => o.status === "DISPUTED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#48A741]/20">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              CA & Platform Admin Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40">
              CA Authority Role
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Certifier Authority: {currentAddress}
          </p>
        </div>

        {/* Navigation Tabs (Wrap smoothly on mobile) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a1f11] p-1.5 rounded-2xl border border-[#48A741]/25">
          <button
            onClick={() => setActiveTab("certify")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === "certify" ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Seed Certifications</span>
          </button>
          <button
            onClick={() => setActiveTab("sellers")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === "sellers" ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seller Vetting</span>
          </button>
          <button
            onClick={() => setActiveTab("disputes")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === "disputes" ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Disputes ({disputedOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === "security" ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Security Rules</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Seed Batch Certifications */}
      {activeTab === "certify" && (
        <div className="rounded-2xl bg-[#0a1f11] border border-[#48A741]/20 shadow-xl overflow-hidden space-y-4">
          <div className="px-4 sm:px-6 py-4 border-b border-[#48A741]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Official Seed Certification Agency (CA) Queue
              </h2>
              <p className="text-xs text-slate-400">
                Audit laboratory test parameters and authorize or revoke immutable status on SeedRegistry contract.
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-bold text-[#48A741] bg-[#48A741]/15 px-3 py-1 rounded-full border border-[#48A741]/30">
              {analytics?.certifiedBatches || 0} / {analytics?.totalBatches || 0} Certified ({analytics?.certificationRate || 0}%)
            </span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-[#07130b] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Lot #</th>
                  <th className="py-3 px-4">Seed Name</th>
                  <th className="py-3 px-4">Breeder</th>
                  <th className="py-3 px-4">Germination</th>
                  <th className="py-3 px-4">Purity</th>
                  <th className="py-3 px-4">Vigor</th>
                  <th className="py-3 px-4">Moisture</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">CA Authority Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {seeds.map((seed) => (
                  <tr key={seed.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#48A741]">{seed.batchNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{seed.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{seed.sellerName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#48A741]">{seed.germinationRate}%</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{seed.purity}%</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{seed.vigor}%</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{seed.moisture}%</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${seed.certificationStatus === "Certified"
                            ? "bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40"
                            : seed.certificationStatus === "Revoked"
                              ? "bg-rose-950 text-rose-300 border border-rose-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                          }`}
                      >
                        {seed.certificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {seed.certificationStatus !== "Certified" && (
                          <button
                            onClick={() => handleCertifyBatch(seed.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Certify</span>
                          </button>
                        )}
                        {seed.certificationStatus !== "Revoked" && (
                          <button
                            onClick={() => handleRevokeBatch(seed.id)}
                            className="px-2.5 py-1 rounded-lg border border-rose-600/50 text-rose-400 hover:bg-rose-950/40 font-bold text-[11px]"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Seller Verifications */}
      {activeTab === "sellers" && (
        <div className="rounded-2xl bg-[#0a1f11] border border-[#48A741]/20 shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-[#48A741]/15 flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-white">
              Registered Breeders & Compliance Vetting
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {sellers.length} Total Sellers
            </span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-[#07130b] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Breeder Company</th>
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">AI Trust Score</th>
                  <th className="py-3 px-4">Orders (Delivered)</th>
                  <th className="py-3 px-4">Disputes Lost</th>
                  <th className="py-3 px-4">CA Status</th>
                  <th className="py-3 px-4 text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sellers.map((s) => (
                  <tr key={s.address} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {s.address.substring(0, 6)}...{s.address.substring(s.address.length - 4)}
                    </td>
                    <td className="py-3.5 px-4">
                      <TrustBadge score={s.trustScore} riskCategory={s.riskCategory} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {s.deliveredOrders} / {s.totalOrders}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-400 font-bold">
                      {s.disputesLost}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.isSuspended ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold text-[10px]">
                          Suspended
                        </span>
                      ) : s.isVerified ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40 font-bold text-[10px]">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold text-[10px]">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!s.isVerified && (
                          <button
                            onClick={() => handleVerifySeller(s.address)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleSuspend(s.address, s.isSuspended)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${s.isSuspended
                              ? "border-[#48A741]/50 text-[#48A741] hover:bg-[#48A741]/10"
                              : "border-rose-600/50 text-rose-400 hover:bg-rose-950/40"
                            }`}
                        >
                          {s.isSuspended ? "Unsuspend" : "Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Disputes Arbitration Panel */}
      {activeTab === "disputes" && (
        <div className="rounded-2xl bg-[#0a1f11] border border-[#48A741]/20 shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-[#48A741]/15 flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-white">
              Escrow Arbitration & Dispute Resolution Panel
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {disputedOrders.length} Cases Requiring Adjudication
            </span>
          </div>

          {disputedOrders.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Zero active farmer disputes. Smart escrow release state is healthy.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {disputedOrders.map((ord) => (
                <div key={ord.id} className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-white">Order #{ord.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold text-xs">
                        DISPUTED
                      </span>
                    </div>
                    <span className="font-mono text-[#48A741] font-bold text-sm">
                      {ord.totalPriceEth} ETH in Escrow
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#07130b] p-4 rounded-xl border border-slate-800">
                    <div>
                      <p className="text-slate-400 font-semibold">Seed Variety & Batch:</p>
                      <p className="font-bold text-white">{ord.seedName} (Lot #{ord.batchNumber})</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Buyer Wallet (Farmer):</p>
                      <p className="font-mono text-slate-300">{ord.buyerAddress}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Seller Wallet (Breeder):</p>
                      <p className="font-mono text-slate-300">{ord.sellerAddress}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Quantity Disputed:</p>
                      <p className="font-mono text-[#48A741] font-bold">{ord.quantityKg} kg</p>
                    </div>
                  </div>

                  {/* Arbitration Actions */}
                  <div className="flex flex-wrap items-center gap-2 justify-end pt-2">
                    <button
                      onClick={() => handleResolveDispute(ord.id, "REFUND")}
                      className="px-4 py-2 rounded-xl bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-xs shadow-md shadow-[#48A741]/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Refund Farmer (100%)</span>
                    </button>
                    <button
                      onClick={() => handleResolveDispute(ord.id, "RELEASE_TO_SELLER")}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                    >
                      Release Escrow to Seller
                    </button>
                    <button
                      onClick={() => handleResolveDispute(ord.id, "SPLIT")}
                      className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-white/5 font-bold text-xs"
                    >
                      Split Funds (50/50)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Platform Security & Governance */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">

          {/* Minimum Trust Score Sales Gating */}
          <div className="rounded-2xl bg-[#0a1f11] border border-[#48A741]/20 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-display font-bold text-base">
              <Sliders className="w-5 h-5 text-[#48A741]" />
              <span>Smart Contract Trust Gating Threshold</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sellers whose dynamic ML Trust Score drops below this threshold are automatically barred from creating listings or receiving escrow payments in the Marketplace contract.
            </p>

            <div className="p-4 rounded-xl bg-[#07130b] border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Minimum Trust Score:</span>
                <span className="font-mono font-bold text-lg text-[#48A741]">{minTrustThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={minTrustThreshold}
                onChange={(e) => setMinTrustThreshold(Number(e.target.value))}
                className="w-full accent-[#48A741] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>20 (Permissive)</span>
                <span>40 (Default)</span>
                <span>60 (Strict)</span>
                <span>80 (High Barrier)</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Marketplace minimum seller trust score updated to ${minTrustThreshold}/100.`);
              }}
              className="w-full py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-xs shadow-md shadow-[#48A741]/25 transition-all"
            >
              Update Marketplace Parameter
            </button>
          </div>

          {/* Model Weights Information Card */}
          <div className="rounded-2xl bg-[#0a1f11] border border-[#48A741]/20 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-display font-bold text-base">
              <Award className="w-5 h-5 text-teal-400" />
              <span>IEEE Benchmark ML Feature Configuration</span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-factor mathematical weights deployed in the dynamic trust scoring engine:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-[#07130b] border border-slate-800">
                <span className="text-slate-300 font-medium">Lab Certification Ratio:</span>
                <span className="font-mono font-bold text-white">25%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#07130b] border border-slate-800">
                <span className="text-slate-300 font-medium">On-Time Delivery Performance:</span>
                <span className="font-mono font-bold text-white">25%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#07130b] border border-slate-800">
                <span className="text-slate-300 font-medium">Transaction Success Rate:</span>
                <span className="font-mono font-bold text-white">20%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#07130b] border border-slate-800">
                <span className="text-slate-300 font-medium">Farmer Community Rating:</span>
                <span className="font-mono font-bold text-white">15%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#07130b] border border-slate-800">
                <span className="text-slate-300 font-medium">Dispute Loss Penalty:</span>
                <span className="font-mono font-bold text-white">15%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#07130b] border border-[#48A741]/30 text-emerald-300">
                <span className="font-semibold">Recency Decay Half-Life:</span>
                <span className="font-mono font-bold">90 Days</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
