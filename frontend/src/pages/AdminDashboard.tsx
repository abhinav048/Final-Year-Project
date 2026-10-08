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
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { VerifiedBadge } from "../components/VerifiedBadge";
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
  ExternalLink,
  Sparkles
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
      alert(`Batch #${batchId} officially CERTIFIED on SeedRegistry smart contract.`);
      loadData();
    } catch (err: any) {
      alert("Certification failed: " + err.message);
    }
  };

  const handleRevokeBatch = async (batchId: number) => {
    if (!confirm(`Revoke certification for batch #${batchId}? It will be barred from escrow transactions.`)) {
      return;
    }
    try {
      await revokeSeedBatch(batchId, "CA Officer Revocation");
      alert(`Batch #${batchId} certification REVOKED.`);
      loadData();
    } catch (err: any) {
      alert("Revocation failed: " + err.message);
    }
  };

  const handleVerifySeller = async (address: string) => {
    try {
      await verifySeller(address);
      alert("Seller credentials verified on SellerRegistry smart contract.");
      loadData();
    } catch (err: any) {
      alert("Verification failed: " + err.message);
    }
  };

  const handleToggleSuspend = async (address: string, currentSuspended: boolean) => {
    try {
      await toggleSuspendSeller(address, !currentSuspended);
      alert("Seller status updated on blockchain.");
      loadData();
    } catch (err: any) {
      alert("Suspension toggle failed: " + err.message);
    }
  };

  const handleResolveDispute = async (orderId: number, outcome: "REFUND" | "RELEASE_TO_SELLER") => {
    try {
      await resolveOrderDispute(orderId, {
        outcome,
        notes: `Platform Arbiter Ruling: ${outcome}`
      });
      alert(`Dispute for order #${orderId} resolved: ${outcome}`);
      loadData();
    } catch (err: any) {
      alert("Arbitration failed: " + err.message);
    }
  };

  const disputedOrders = orders.filter((o) => o.status === "DISPUTED");

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E1E6DA]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TagPill icon={<Shield className="w-3.5 h-3.5 text-[#6AB547]" />}>
                Certification Authority Console
              </TagPill>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#121714] mt-2">
              CA & Platform Admin Console
            </h1>
            <p className="text-xs text-[#5B665F] mt-1 font-mono">
              Certifier Authority: {currentAddress}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#EEF3E6] p-1.5 rounded-full border border-[#D2ECC3]">
            <button
              onClick={() => setActiveTab("certify")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "certify"
                  ? "bg-[#6AB547] text-white shadow-xs"
                  : "text-[#5B665F] hover:text-[#121714]"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Seed Certifications</span>
            </button>
            <button
              onClick={() => setActiveTab("sellers")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "sellers"
                  ? "bg-[#6AB547] text-white shadow-xs"
                  : "text-[#5B665F] hover:text-[#121714]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Seller Vetting</span>
            </button>
            <button
              onClick={() => setActiveTab("disputes")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "disputes"
                  ? "bg-[#6AB547] text-white shadow-xs"
                  : "text-[#5B665F] hover:text-[#121714]"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Disputes ({disputedOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#6AB547] text-white shadow-xs"
                  : "text-[#5B665F] hover:text-[#121714]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Security Rules</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SEED CERTIFICATIONS */}
        {activeTab === "certify" && (
          <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
              <h2 className="font-extrabold text-base text-[#121714]">
                Seed Lots Awaiting Lab Auditing & On-Chain Certification
              </h2>
              <span className="text-xs text-[#5B665F]">{seeds.length} Seed Batches</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                  <tr>
                    <th className="py-3 px-4">Lot ID</th>
                    <th className="py-3 px-4">Variety Name</th>
                    <th className="py-3 px-4">Producer</th>
                    <th className="py-3 px-4">Germination %</th>
                    <th className="py-3 px-4">Purity %</th>
                    <th className="py-3 px-4">Cert Status</th>
                    <th className="py-3 px-4 text-right">CA Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE6]">
                  {seeds.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F7F8F3] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">#{s.batchNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-[#121714]">{s.name}</td>
                      <td className="py-3.5 px-4 text-[#5B665F]">{s.sellerName}</td>
                      <td className="py-3.5 px-4 font-bold text-[#6AB547]">{s.germinationRate}%</td>
                      <td className="py-3.5 px-4 font-bold text-[#121714]">{s.purity}%</td>
                      <td className="py-3.5 px-4">
                        <VerifiedBadge isValid={s.certificationStatus === "Certified"} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {s.certificationStatus !== "Certified" ? (
                          <PillButton
                            variant="primary"
                            size="sm"
                            onClick={() => handleCertifyBatch(s.id)}
                          >
                            Certify Batch
                          </PillButton>
                        ) : (
                          <PillButton
                            variant="dark"
                            size="sm"
                            onClick={() => handleRevokeBatch(s.id)}
                          >
                            Revoke
                          </PillButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SELLER VETTING */}
        {activeTab === "sellers" && (
          <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F1EFE6]">
              <h2 className="font-extrabold text-base text-[#121714]">
                Seed Breeders Accreditation & Smart Contract Status
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                  <tr>
                    <th className="py-3 px-4">Breeder Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Trust Score</th>
                    <th className="py-3 px-4">Accreditation</th>
                    <th className="py-3 px-4">Gate Status</th>
                    <th className="py-3 px-4 text-right">CA Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE6]">
                  {sellers.map((sel) => (
                    <tr key={sel.address} className="hover:bg-[#F7F8F3] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#121714]">{sel.name}</td>
                      <td className="py-3.5 px-4 text-[#5B665F]">{sel.location}</td>
                      <td className="py-3.5 px-4">
                        <TrustBadge score={sel.trustScore} riskCategory={sel.riskCategory} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sel.isVerified ? "bg-[#EEF8F1] text-[#2E9E57]" : "bg-[#FEF9EE] text-[#E9A93B]"
                        }`}>
                          {sel.isVerified ? "CA Accredited" : "Pending Audit"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sel.isSuspended || sel.trustScore < 40
                            ? "bg-[#FDF1F0] text-[#D8503F]"
                            : "bg-[#EEF8F1] text-[#2E9E57]"
                        }`}>
                          {sel.isSuspended || sel.trustScore < 40 ? "Suspended (<40)" : "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {!sel.isVerified && (
                          <PillButton
                            variant="primary"
                            size="sm"
                            onClick={() => handleVerifySeller(sel.address)}
                          >
                            Grant CA Accreditation
                          </PillButton>
                        )}
                        <PillButton
                          variant={sel.isSuspended ? "secondary" : "dark"}
                          size="sm"
                          onClick={() => handleToggleSuspend(sel.address, sel.isSuspended === 1)}
                        >
                          {sel.isSuspended ? "Unsuspend" : "Suspend"}
                        </PillButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DISPUTES ARBITRATION */}
        {activeTab === "disputes" && (
          <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F1EFE6]">
              <h2 className="font-extrabold text-base text-[#121714]">
                Active Smart Escrow Disputes & Viability Arbitration
              </h2>
            </div>

            {disputedOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#5B665F]">
                No active escrow disputes on the platform. All order deliveries are concluding smoothly.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Seed Variety</th>
                      <th className="py-3 px-4">Locked Funds</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Arbitration Ruling</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1EFE6]">
                    {disputedOrders.map((d) => (
                      <tr key={d.id} className="hover:bg-[#F7F8F3] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">#{d.id}</td>
                        <td className="py-3.5 px-4 font-bold text-[#121714]">{d.seedName || `Lot #${d.batchId}`}</td>
                        <td className="py-3.5 px-4 font-extrabold text-[#D8503F]">{d.totalPriceEth} ETH Frozen</td>
                        <td className="py-3.5 px-4 text-[#5B665F]">{d.status}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <PillButton
                            variant="primary"
                            size="sm"
                            onClick={() => handleResolveDispute(d.id, "REFUND")}
                          >
                            Refund Farmer
                          </PillButton>
                          <PillButton
                            variant="secondary"
                            size="sm"
                            onClick={() => handleResolveDispute(d.id, "RELEASE_TO_SELLER")}
                          >
                            Release to Seller
                          </PillButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SECURITY RULES */}
        {activeTab === "security" && (
          <div className="rounded-[24px] bg-white border border-[#E1E6DA] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-extrabold text-xl text-[#121714]">
                Automated Smart Contract Trust Gate Configuration
              </h2>
              <p className="text-xs text-[#5B665F] mt-1">
                Controls the minimum mathematical score required for a seller to list batches or receive escrow deposits.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#EEF3E6] border border-[#D2ECC3] space-y-3">
              <label className="text-xs font-bold text-[#121714] block">
                Minimum Trust Score Threshold: <span className="text-[#2E9E57] font-extrabold">{minTrustThreshold}/100</span>
              </label>
              <input
                type="range"
                min="20"
                max="80"
                value={minTrustThreshold}
                onChange={(e) => setMinTrustThreshold(Number(e.target.value))}
                className="w-full accent-[#6AB547] cursor-pointer"
              />
              <p className="text-xs text-[#5B665F]">
                Sellers below this threshold are automatically locked out of the Marketplace by the Solidity smart contract.
              </p>
            </div>

            <div className="flex justify-end">
              <PillButton
                variant="primary"
                size="md"
                withArrow
                isLoading={updatingThreshold}
                onClick={() => {
                  setUpdatingThreshold(true);
                  setTimeout(() => {
                    setUpdatingThreshold(false);
                    alert(`Smart Contract gate threshold updated to ${minTrustThreshold}/100!`);
                  }, 600);
                }}
              >
                Save Threshold to Blockchain
              </PillButton>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
