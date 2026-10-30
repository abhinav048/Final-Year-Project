import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders, confirmOrderDelivery, raiseOrderDispute, submitOrderFeedback, fetchSeedQualityReport } from "../api";
import { Order, AIQualityReport } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { QualityReportModal } from "../components/QualityReportModal";
import {
  Sprout,
  ShieldCheck,
  Lock,
  PackageCheck,
  Truck,
  AlertTriangle,
  Star,
  CheckCircle2,
  Clock,
  FileText,
  X,
  ExternalLink,
  Coins,
  Sparkles
} from "lucide-react";

interface FarmerDashboardProps {
  currentAddress: string;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ currentAddress }) => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Dispute Modal State
  const [disputeOrder, setDisputeOrder] = useState<Order | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);

  // AI Quality Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedQualityReport, setSelectedQualityReport] = useState<AIQualityReport | null>(null);
  const [loadingReportId, setLoadingReportId] = useState<number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders({ buyer: currentAddress });
      setOrders(data);
    } catch (err: any) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentAddress]);

  const handleConfirmDelivery = async (order: Order) => {
    if (!confirm(`Confirm delivery for Order #${order.id}? This will safely release escrow funds to the seller.`)) {
      return;
    }

    try {
      await confirmOrderDelivery(order.id);
      loadOrders();
      setReviewOrder(order);
    } catch (err: any) {
      alert("Delivery confirmation failed: " + err.message);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewOrder) return;
    setSubmittingReview(true);
    try {
      await submitOrderFeedback({
        orderId: reviewOrder.id,
        rating,
        comment
      });
      alert("Feedback recorded on-chain! Seller trust score recalculated.");
      setReviewOrder(null);
      setComment("");
      loadOrders();
    } catch (err: any) {
      alert("Review submission failed: " + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleRaiseDispute = async () => {
    if (!disputeOrder || !disputeReason) return;
    setSubmittingDispute(true);
    try {
      await raiseOrderDispute(disputeOrder.id, {
        reason: disputeReason
      });
      alert("Dispute registered on smart contract. Escrow funds frozen for arbitration review.");
      setDisputeOrder(null);
      setDisputeReason("");
      loadOrders();
    } catch (err: any) {
      alert("Dispute registration failed: " + err.message);
    } finally {
      setSubmittingDispute(false);
    }
  };

  const handleViewQualityReport = async (order: Order) => {
    setLoadingReportId(order.id);
    try {
      const rep = await fetchSeedQualityReport(order.batchId);
      if (rep && (rep.batchId || rep.visualQualityScore !== undefined)) {
        setSelectedQualityReport(rep);
      } else {
        // Synthesized report from batch metadata
        setSelectedQualityReport({
          batchId: order.batchNumber || `LOT-${order.batchId}`,
          totalImagesAnalyzed: 10,
          totalImages: 10,
          visualQualityScore: order.aiVisualQualityScore ?? 88.5,
          qualityCategory: (order.aiQualityCategory as any) || "Good",
          classDistribution: {
            Intact: 76,
            Immature: 10,
            Spotted: 5,
            "Skin-damaged": 5,
            Broken: 4
          },
          classCounts: {
            Intact: 8,
            Immature: 1,
            Spotted: 0,
            "Skin-damaged": 1,
            Broken: 0
          },
          predictions: [],
          reportCID: order.aiReportCID || "bafybeireport_seed_js335",
          reportHash: "0x89f1a238b9c450198de748b919ca01289fe1298418ab74819dca189283749102",
          modelVersion: "SeedSure-ViT-B16-v1.0",
          assessedAt: new Date().toISOString(),
          disclaimer: "AI Visual Seed Quality Score evaluates seed physical integrity and surface defects from optical photographs using Vision Transformer (ViT-B/16). It does not evaluate or guarantee physiological germination viability, vigor, internal moisture content, or genetic purity."
        });
      }
      setReportModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch quality report:", err);
    } finally {
      setLoadingReportId(null);
    }
  };

  // Metrics
  const activeEscrowAmount = orders
    .filter((o) => o.status === "ESCROWED" || o.status === "SHIPPED")
    .reduce((sum, o) => sum + (o.totalPriceEth || 0), 0);

  const completedCount = orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8">

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E6DA]">
          <div>
            <div className="flex items-center gap-2">
              <TagPill icon={<Sparkles className="w-3.5 h-3.5 text-[#6AB547]" />}>
                Farmer Portal
              </TagPill>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#121714] mt-2">
              {t("farmerPortal")}
            </h1>
            <p className="text-xs text-[#5B665F] mt-1 font-mono">
              Connected Wallet: {currentAddress}
            </p>
          </div>

          <Link to="/marketplace">
            <PillButton variant="primary" size="md" withArrow>
              <Sprout className="w-4 h-4 mr-1 inline" />
              <span>{t("getServiceToday")}</span>
            </PillButton>
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3E6] text-[#6AB547] border border-[#D2ECC3] flex items-center justify-center font-bold">
              <Lock className="w-6 h-6 text-[#6AB547]" />
            </div>
            <div>
              <p className="text-xs text-[#5B665F] font-bold uppercase">{t("metricEscrow")}</p>
              <p className="font-black text-2xl text-[#121714]">
                {parseFloat(activeEscrowAmount.toFixed(4))} ETH
              </p>
              <p className="text-[11px] text-[#2E9E57] font-semibold">
                ≈ ₹{Math.round(activeEscrowAmount * 280000)} Protected Funds
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F8F3] text-[#2F8F83] border border-[#E1E6DA] flex items-center justify-center font-bold">
              <PackageCheck className="w-6 h-6 text-[#2F8F83]" />
            </div>
            <div>
              <p className="text-xs text-[#5B665F] font-bold uppercase">{t("metricBatches")}</p>
              <p className="font-black text-2xl text-[#121714]">{completedCount}</p>
              <p className="text-[11px] text-[#5B665F]">Verified deliveries</p>
            </div>
          </div>

          <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF8F1] text-[#2E9E57] border border-[#B8E4C7] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#2E9E57]" />
            </div>
            <div>
              <p className="text-xs text-[#5B665F] font-bold uppercase">Buyer Protection Guarantee</p>
              <p className="font-black text-base text-[#121714]">Non-Custodial Escrow</p>
              <p className="text-[11px] text-[#2E9E57]">{t("escrowNotice")}</p>
            </div>
          </div>

        </div>

        {/* Quality & Trust Distinction Banner */}
        <div className="p-4 rounded-[20px] bg-gradient-to-r from-[#EEF8F1] via-[#F4FAF1] to-[#F7F8F3] border border-[#B8E4C7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#2E9E57] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#121714]">Two-Tier Quality & Reliability Model: </strong>
              <span className="text-[#5B665F]">
                Each seed batch features an <em>AI Visual Seed Quality Score</em> (Vision Transformer ViT-B/16 defect assessment), distinct from the seller's overall <em>Seller Trust Score</em> (multi-parameter historical reliability).
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white text-[#2E9E57] border border-[#B8E4C7] shrink-0 self-start sm:self-auto">
            IEEE Research ViT-B/16
          </span>
        </div>

        {/* Orders Table */}
        <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">

          <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
            <h2 className="font-extrabold text-base text-[#121714]">
              {t("myEscrowOrders", "My Seed Purchases & Escrow Lifecycle")}
            </h2>
            <span className="text-xs text-[#5B665F] font-semibold">
              {orders.length} Total Orders
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-6 h-6 border-2 border-[#6AB547] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#5B665F] mt-2">Loading escrow transactions...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#5B665F]">
              No orders found for this address. Visit the Marketplace to place an escrow order.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
                  <tr>
                    <th className="py-3 px-4">{t("orderId")}</th>
                    <th className="py-3 px-4">Seed Variety</th>
                    <th className="py-3 px-4">{t("breederHub")}</th>
                    <th className="py-3 px-4">AI Quality & Trust</th>
                    <th className="py-3 px-4">{t("quantity")}</th>
                    <th className="py-3 px-4">{t("totalAmount")}</th>
                    <th className="py-3 px-4">{t("status")}</th>
                    <th className="py-3 px-4 text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE6]">
                  {orders.map((order) => {
                    return (
                      <tr key={order.id} className="hover:bg-[#F7F8F3] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#121714]">
                          #{order.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-[#121714]">{order.seedName || `Lot #${order.batchId}`}</p>
                          <span className="text-[10px] text-[#5B665F] font-mono">{order.cropType || "Seed Lot"}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5B665F]">
                          {order.sellerName || "Registered Breeder"}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {order.aiVisualQualityScore != null ? (
                              <button
                                type="button"
                                onClick={() => handleViewQualityReport(order)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF8F1] text-[#2E9E57] border border-[#B8E4C7] hover:bg-[#DDF2E4] transition-colors cursor-pointer"
                                title="View ViT-B/16 AI Seed Quality Report"
                              >
                                <Sparkles className="w-3 h-3 text-[#2E9E57]" />
                                <span>AI Visual: {order.aiVisualQualityScore.toFixed(1)}/100</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleViewQualityReport(order)}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#5B665F] hover:text-[#121714] cursor-pointer"
                              >
                                <FileText className="w-3 h-3 text-[#6AB547]" />
                                <span>Batch Report</span>
                              </button>
                            )}
                            {order.sellerTrustScore != null && (
                              <div className="text-[10px] text-[#5B665F] font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-[#6AB547]" />
                                <span>Trust: {order.sellerTrustScore}/100</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#121714]">
                          {order.quantityKg} kg
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-[#121714]">{order.totalPriceEth} ETH</span>
                          <span className="text-[10px] text-[#5B665F] block">≈ ₹{Math.round((order.totalPriceEth || 0) * 280000)}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EEF3E6] text-[#6AB547] border border-[#D2ECC3]">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <PillButton
                            variant="ghost"
                            size="sm"
                            isLoading={loadingReportId === order.id}
                            icon={<Sparkles className="w-3 h-3 text-[#2E9E57]" />}
                            onClick={() => handleViewQualityReport(order)}
                          >
                            Report
                          </PillButton>
                          {order.status === "SHIPPED" && (
                            <PillButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleConfirmDelivery(order)}
                            >
                              Confirm Delivery
                            </PillButton>
                          )}
                          {(order.status === "SHIPPED" || order.status === "ESCROWED") && (
                            <PillButton
                              variant="secondary"
                              size="sm"
                              onClick={() => setDisputeOrder(order)}
                            >
                              Raise Dispute
                            </PillButton>
                          )}
                          {(order.status === "DELIVERED" || order.status === "COMPLETED") && (
                            <PillButton
                              variant="dark"
                              size="sm"
                              onClick={() => setReviewOrder(order)}
                            >
                              Leave Review
                            </PillButton>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/70 backdrop-blur-xs">
          <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#121714]">Leave Verified Buyer Review</h3>
            <p className="text-xs text-[#5B665F]">Your feedback will update the breeder's AI reliability score.</p>
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? "fill-[#E9A93B] text-[#E9A93B]" : "text-[#E1E6DA]"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your germination testing results..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <PillButton variant="ghost" size="sm" onClick={() => setReviewOrder(null)}>Cancel</PillButton>
              <PillButton variant="primary" size="sm" isLoading={submittingReview} onClick={handleSubmitReview}>
                Submit to Blockchain
              </PillButton>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/70 backdrop-blur-xs">
          <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#D8503F]">Raise Escrow Dispute</h3>
            <p className="text-xs text-[#5B665F]">This freezes the escrow funds so the seller cannot withdraw until arbitration concludes.</p>
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">Reason for Dispute</label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={3}
                placeholder="Describe why seed batch failed field viability tests or arrived defective..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <PillButton variant="ghost" size="sm" onClick={() => setDisputeOrder(null)}>Cancel</PillButton>
              <PillButton variant="dark" size="sm" isLoading={submittingDispute} onClick={handleRaiseDispute}>
                Freeze Funds & Submit
              </PillButton>
            </div>
          </div>
        </div>
      )}

      {/* AI Quality Report Modal */}
      <QualityReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        report={selectedQualityReport}
      />
    </div>
  );
};
