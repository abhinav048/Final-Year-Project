import React, { useEffect, useState } from "react";
import {
  fetchSellerByAddress,
  registerSeedBatch,
  shipOrder,
  fetchOrders,
  recalculateTrustScore,
  fetchTrustHistory,
  fetchTrustBreakdown
} from "../api";
import { Seller, SeedBatch, Order, ScoreHistoryRecord, AIQualityReport } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { TrustExplainability } from "../components/TrustExplainability";
import { TamperCheckModal } from "../components/TamperCheckModal";
import { QRCodeModal } from "../components/QRCodeModal";
import { QualityReportModal } from "../components/QualityReportModal";
import { TrustScoreHistoryCard } from "../components/TrustScoreHistoryCard";
import { SeedQualityAssessmentModule } from "../components/SeedQualityAssessmentModule";
import { useLanguage } from "../context/LanguageContext";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { VerifiedBadge } from "../components/VerifiedBadge";
import {
  UserCheck,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  QrCode,
  FileCheck2,
  PackageCheck,
  AlertCircle,
  TrendingUp,
  X,
  Lock,
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
  Star,
  Activity
} from "lucide-react";

interface SellerDashboardProps {
  currentAddress: string;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ currentAddress }) => {
  const { t } = useLanguage();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<ScoreHistoryRecord[]>([]);
  const [breakdownData, setBreakdownData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quality" | "trust" | "batches" | "orders">("quality");

  // Shipping Modal State
  const [shippingOrder, setShippingOrder] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState("Kisan AgriLogistics Speed Post");
  const [trackingNo, setTrackingNo] = useState("");
  const [submittingShip, setSubmittingShip] = useState(false);

  // Modals
  const [activeInspectSeed, setActiveInspectSeed] = useState<SeedBatch | null>(null);
  const [inspectModalType, setInspectModalType] = useState<"tamper" | "qr" | "report" | null>(null);
  const [modalReport, setModalReport] = useState<AIQualityReport | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sellerData, ordersData, historyData, breakdown] = await Promise.all([
        fetchSellerByAddress(currentAddress),
        fetchOrders({ seller: currentAddress }),
        fetchTrustHistory(currentAddress).catch(() => []),
        fetchTrustBreakdown(currentAddress).catch(() => null)
      ]);
      setSeller(sellerData);
      setOrders(ordersData);
      setHistory(historyData);
      setBreakdownData(breakdown);
    } catch (err: any) {
      console.error("Error loading seller portal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentAddress]);

  const handleManualRecalculate = async () => {
    setRecalculating(true);
    try {
      await recalculateTrustScore(currentAddress, "Seller requested on-demand trust audit");
      await loadData();
      alert("Seller Trust Score recalculated dynamically across verified parameters!");
    } catch (err: any) {
      alert("Recalculation failed: " + err.message);
    } finally {
      setRecalculating(false);
    }
  };

  const handleShipOrder = async () => {
    if (!shippingOrder) return;
    setSubmittingShip(true);
    try {
      await shipOrder(shippingOrder.id, {
        carrierName: carrier,
        trackingNumber: trackingNo || `TRK-AGRI-${Math.floor(100000 + Math.random() * 900000)}`
      });
      alert(`Order #${shippingOrder.id} marked as SHIPPED! Delivery confirmation awaited from farmer.`);
      setShippingOrder(null);
      loadData();
    } catch (err: any) {
      alert("Shipping action failed: " + err.message);
    } finally {
      setSubmittingShip(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-3 border-[#6AB547] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#5B665F] mt-3 font-semibold">
          Loading breeder credentials, AI quality records & trust score...
        </p>
      </div>
    );
  }

  // Calculate 8 Dashboard Metrics (§8)
  const trustScore = seller?.trustScore ?? 50;
  const trustCategory = seller?.trustCategory || (trustScore >= 90 ? "Highly Trusted" : trustScore >= 75 ? "Trusted" : trustScore >= 60 ? "Average" : trustScore >= 40 ? "Low Trust" : "Poor Trust");
  const totalBatches = seller?.totalBatchesCount || seller?.batches?.length || 0;
  const avgVisualQuality = seller?.avgAiQualityScore ? Math.round(seller.avgAiQualityScore) : 89;
  const successfulTx = seller?.successfulOrders || 0;
  const pendingOrders = orders.filter(o => o.status === "ESCROWED" || o.status === "CREATED").length;
  const verifiedCerts = seller?.certifiedBatchesCount || 0;
  const farmerRating = seller?.avgFarmerRating ? seller.avgFarmerRating.toFixed(1) : "4.8";

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8">

        {/* Top Banner: Breeder Profile & Trust Metrics */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF3E6] text-[#6AB547]">
                Registered Breeder
              </span>
              {seller?.isVerified ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF8F1] text-[#2E9E57] border border-[#B8E4C7] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CA Accredited
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF9EE] text-[#E9A93B] border border-[#FADFA8]">
                  Pending Verification
                </span>
              )}
            </div>

            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#121714]">
              {seller?.name || "Breeder Dashboard"}
            </h1>
            <p className="text-xs font-mono text-[#5B665F]">
              {currentAddress} • {seller?.location}
            </p>
            <p className="text-xs text-[#5B665F] max-w-xl">
              {seller?.description}
            </p>
          </div>

          {/* Trust Gauge & Actions */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <TrustBadge score={trustScore} riskCategory={trustCategory} size="lg" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("quality")}
                className="text-xs font-bold px-4 py-2 rounded-full bg-[#6AB547] text-white hover:bg-[#5b9e3d] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Quality Assessment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 8: Main Dashboard Cards (8 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Overall Seller Trust Score */}
          <div className="p-4 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#5B665F] uppercase">Trust Score</p>
            <p className="font-black text-2xl text-[#2E9E57]">{trustScore}</p>
            <span className="text-[10px] text-[#5B665F]">/ 100 max</span>
          </div>

          {/* 2. Trust Category */}
          <div className="p-4 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#5B665F] uppercase">Status</p>
            <p className="font-extrabold text-xs text-[#121714] truncate mt-2">{trustCategory}</p>
            <span className="text-[10px] text-[#6AB547] font-semibold">Dynamic ML</span>
          </div>

          {/* 3. Total Seed Batches */}
          <div className="p-4 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#5B665F] uppercase">Total Batches</p>
            <p className="font-black text-2xl text-[#121714]">{totalBatches}</p>
            <span className="text-[10px] text-[#5B665F]">Catalog Lots</span>
          </div>

          {/* 4. Average AI Visual Quality Score */}
          <div className="p-4 rounded-[20px] bg-[#EEF8F1] border border-[#B8E4C7] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#2E9E57] uppercase">Avg AI Quality</p>
            <p className="font-black text-2xl text-[#2E9E57]">{avgVisualQuality}</p>
            <span className="text-[10px] text-[#2E9E57] font-semibold">ViT-B/16 Score</span>
          </div>

          {/* 5. Successful Transactions */}
          <div className="p-4 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#5B665F] uppercase">Success Tx</p>
            <p className="font-black text-2xl text-[#121714]">{successfulTx}</p>
            <span className="text-[10px] text-[#2E9E57] font-semibold">Completed</span>
          </div>

          {/* 6. Pending Orders */}
          <div className="p-4 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#5B665F] uppercase">Pending Orders</p>
            <p className="font-black text-2xl text-[#E9A93B]">{pendingOrders}</p>
            <span className="text-[10px] text-[#5B665F]">Escrow Locked</span>
          </div>

          {/* 7. Verified Certifications */}
          <div className="p-4 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#5B665F] uppercase">Certifications</p>
            <p className="font-black text-2xl text-[#6AB547]">{verifiedCerts}</p>
            <span className="text-[10px] text-[#5B665F]">CA Verified</span>
          </div>

          {/* 8. Farmer Feedback */}
          <div className="p-4 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs text-center space-y-1">
            <p className="text-[10px] font-bold text-[#5B665F] uppercase">Farmer Rating</p>
            <p className="font-black text-2xl text-[#E9A93B]">{farmerRating} ★</p>
            <span className="text-[10px] text-[#5B665F]">{seller?.ratingCount || 0} reviews</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E1E6DA] pb-2">
          <button
            onClick={() => setActiveTab("quality")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "quality"
                ? "bg-[#6AB547] text-white shadow-xs"
                : "text-[#5B665F] hover:bg-[#F7F8F3] hover:text-[#121714]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Seed Quality Assessment</span>
          </button>

          <button
            onClick={() => setActiveTab("trust")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "trust"
                ? "bg-[#6AB547] text-white shadow-xs"
                : "text-[#5B665F] hover:bg-[#F7F8F3] hover:text-[#121714]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Seller Trust & Auditable History</span>
          </button>

          <button
            onClick={() => setActiveTab("batches")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "batches"
                ? "bg-[#6AB547] text-white shadow-xs"
                : "text-[#5B665F] hover:bg-[#F7F8F3] hover:text-[#121714]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Registered Seed Lots ({seller?.batches?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-[#6AB547] text-white shadow-xs"
                : "text-[#5B665F] hover:bg-[#F7F8F3] hover:text-[#121714]"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Escrow Orders & Shipping ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: AI Seed Quality Assessment Module (§4) */}
        {activeTab === "quality" && (
          <SeedQualityAssessmentModule
            currentAddress={currentAddress}
            sellerName={seller?.name}
            recentBatches={seller?.batches}
            onBatchRegistered={loadData}
          />
        )}

        {/* Tab 2: Trust Score & Audit History (§6, §7, §8) */}
        {activeTab === "trust" && (
          <TrustScoreHistoryCard
            score={trustScore}
            trustCategory={trustCategory}
            confidenceLevel={seller?.confidenceLevel || "Moderate"}
            dataCoveragePercent={seller?.dataCoveragePercent || 85}
            recommendations={breakdownData?.recommendations || seller?.recommendations || [
              "Improve seed sorting consistency to maintain low defect ratios across upcoming lots.",
              "Partner with cold-chain transport to maintain high on-time delivery percentages."
            ]}
            history={history}
            breakdown={breakdownData?.breakdown}
            onRecalculate={handleManualRecalculate}
            isRecalculating={recalculating}
          />
        )}

        {/* Tab 3: Registered Seed Lots */}
        {activeTab === "batches" && (
          <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden space-y-4">
            <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
              <h2 className="font-extrabold text-base text-[#121714]">
                My Registered Seed Lots on Smart Contract
              </h2>
              <PillButton
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("quality")}
              >
                + Analyze & Add New Seed Lot
              </PillButton>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                  <tr>
                    <th className="py-3 px-4">Lot #</th>
                    <th className="py-3 px-4">Variety Name</th>
                    <th className="py-3 px-4">Crop</th>
                    <th className="py-3 px-4 text-center">AI Visual Score</th>
                    <th className="py-3 px-4">Germination</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE6]">
                  {seller?.batches?.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F7F8F3] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">#{b.batchNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-[#121714]">{b.name}</td>
                      <td className="py-3.5 px-4 text-[#5B665F]">{b.cropType}</td>
                      <td className="py-3.5 px-4 text-center">
                        {b.aiVisualQualityScore != null ? (
                          <span className="font-mono font-bold text-xs bg-[#EEF8F1] text-[#2E9E57] px-2 py-0.5 rounded-full border border-[#B8E4C7]">
                            {Math.round(b.aiVisualQualityScore)}/100
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#5B665F]">Unassessed</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#6AB547]">{b.germinationRate}%</td>
                      <td className="py-3.5 px-4">{b.availableQuantityKg} kg</td>
                      <td className="py-3.5 px-4">
                        <VerifiedBadge isValid={b.certificationStatus === "Certified"} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {b.aiVisualQualityScore != null && (
                          <button
                            onClick={() => {
                              setModalReport({
                                batchId: b.id,
                                batchNumber: b.batchNumber,
                                cropType: b.cropType,
                                variety: b.variety,
                                visualQualityScore: b.aiVisualQualityScore || 90,
                                qualityCategory: (b.aiQualityCategory as any) || "Good",
                                totalImagesAnalyzed: 10,
                                classDistribution: b.aiClassDistribution || { Intact: 85, Immature: 5, Spotted: 5, "Skin-damaged": 3, Broken: 2 },
                                predictions: [],
                                reportCID: b.aiReportCID || "bafybeireport",
                                reportHash: b.aiReportHash || "0x3f98a",
                                modelVersion: b.aiModelVersion || "SeedSure-ViT-B16-v1.0",
                                assessedAt: b.aiAnalyzedAt || b.createdAt,
                                disclaimer: "AI Visual Seed Quality Score evaluates seed physical integrity and surface defects from optical photographs using Vision Transformer (ViT-B/16)."
                              });
                            }}
                            className="p-1.5 rounded-full border border-[#C5E1A5] bg-[#EEF8F1] hover:bg-[#EEF3E6] text-[#2E9E57] cursor-pointer"
                            title="View AI Quality Report"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveInspectSeed(b);
                            setInspectModalType("qr");
                          }}
                          className="p-1.5 rounded-full border border-[#E1E6DA] hover:bg-[#EEF3E6] text-[#6AB547] cursor-pointer"
                          title="Seed Bag QR Tag"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveInspectSeed(b);
                            setInspectModalType("tamper");
                          }}
                          className="p-1.5 rounded-full border border-[#E1E6DA] hover:bg-[#EEF3E6] text-[#121714] cursor-pointer"
                          title="Test Hash Verification"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Escrow Orders Requiring Shipping */}
        {activeTab === "orders" && (
          <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
              <h2 className="font-extrabold text-base text-[#121714]">
                Escrow Orders Awaiting Dispatch & QR Tagging
              </h2>
              <span className="text-xs text-[#5B665F] font-semibold">
                {orders.filter((o) => o.status === "ESCROWED").length} Orders Locked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Seed Batch</th>
                    <th className="py-3 px-4">Buyer Address</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Locked Escrow</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE6]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F7F8F3] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">#{o.id}</td>
                      <td className="py-3.5 px-4 font-bold text-[#121714]">{o.seedName || `Lot #${o.batchId}`}</td>
                      <td className="py-3.5 px-4 font-mono text-[#5B665F]">
                        {o.buyerAddress.slice(0, 6)}...{o.buyerAddress.slice(-4)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#121714]">{o.quantityKg} kg</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#121714]">{o.totalPriceEth} ETH</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EEF3E6] text-[#6AB547]">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {o.status === "ESCROWED" && (
                          <PillButton
                            variant="primary"
                            size="sm"
                            withArrow
                            onClick={() => setShippingOrder(o)}
                          >
                            Ship Order
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
      </div>

      {/* Shipping Modal */}
      {shippingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/70 backdrop-blur-xs">
          <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#121714]">Ship Order #{shippingOrder.id}</h3>
            <p className="text-xs text-[#5B665F]">
              Confirm that seed bags have been labeled with the official QR security tag and handed to courier.
            </p>
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">Logistics Carrier</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. TRK-AGRI-883921"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <PillButton variant="ghost" size="sm" onClick={() => setShippingOrder(null)}>Cancel</PillButton>
              <PillButton variant="primary" size="sm" withArrow isLoading={submittingShip} onClick={handleShipOrder}>
                Confirm Shipped
              </PillButton>
            </div>
          </div>
        </div>
      )}

      {/* QR & Tamper & Report Modals */}
      {activeInspectSeed && inspectModalType === "qr" && (
        <QRCodeModal
          batchId={activeInspectSeed.id}
          batchNumber={activeInspectSeed.batchNumber}
          seedName={activeInspectSeed.name}
          isOpen={true}
          onClose={() => {
            setActiveInspectSeed(null);
            setInspectModalType(null);
          }}
        />
      )}

      {activeInspectSeed && inspectModalType === "tamper" && (
        <TamperCheckModal
          batchId={activeInspectSeed.id}
          batchNumber={activeInspectSeed.batchNumber}
          seedName={activeInspectSeed.name}
          certificateCID={activeInspectSeed.certificateCID}
          certificateHash={activeInspectSeed.certificateHash}
          isOpen={true}
          onClose={() => {
            setActiveInspectSeed(null);
            setInspectModalType(null);
          }}
        />
      )}

      {modalReport && (
        <QualityReportModal
          isOpen={true}
          onClose={() => setModalReport(null)}
          report={modalReport}
        />
      )}
    </div>
  );
};
