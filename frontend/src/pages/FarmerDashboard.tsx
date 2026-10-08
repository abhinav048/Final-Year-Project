import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders, confirmOrderDelivery, raiseOrderDispute, submitOrderFeedback } from "../api";
import { Order } from "../types";
import { useLanguage } from "../context/LanguageContext";
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
  ExternalLink
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
    if (!confirm(`Confirm delivery for Order #${order.id}? This will cryptographically release escrow funds to the seller.`)) {
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
      await raiseOrderDispute(disputeOrder.id, { reason: disputeReason });
      alert("Dispute opened! Escrow funds locked pending arbitration.");
      setDisputeOrder(null);
      setDisputeReason("");
      loadOrders();
    } catch (err: any) {
      alert("Dispute failed: " + err.message);
    } finally {
      setSubmittingDispute(false);
    }
  };

  // Metrics
  const activeEscrowAmount = orders
    .filter((o) => o.escrowLocked === 1)
    .reduce((sum, o) => sum + o.totalPriceEth, 0);

  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#48A741]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {t("farmerPortal")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30">
              Demo Persona
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Wallet: {currentAddress}
          </p>
        </div>

        <Link
          to="/marketplace"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#48A741]/25 transition-all"
        >
          <Sprout className="w-4 h-4" />
          <span>{t("getServiceToday")}</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="p-5 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#07130b] text-[#48A741] border border-[#48A741]/30 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6 text-[#48A741]" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">{t("metricEscrow")}</p>
            <p className="font-display font-extrabold text-2xl text-white">
              {parseFloat(activeEscrowAmount.toFixed(4))} ETH
            </p>
            <p className="text-[11px] text-[#48A741] font-medium">100% Protected Funds</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#07130b] text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <PackageCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">{t("metricBatches")}</p>
            <p className="font-display font-extrabold text-2xl text-white">{completedCount}</p>
            <p className="text-[11px] text-slate-400">Verified deliveries</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#07130b] text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Buyer Protection Guarantee</p>
            <p className="font-display font-extrabold text-lg text-white">Non-Custodial</p>
            <p className="text-[11px] text-[#48A741]">{t("escrowNotice")}</p>
          </div>
        </div>

      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-md overflow-hidden">

        <div className="px-6 py-4 border-b border-[#48A741]/20 flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-white">
            {t("myEscrowOrders", "My Seed Purchases & Escrow Lifecycle")}
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {orders.length} Total Orders
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-[#48A741] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 mt-2">Loading escrow transactions...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No orders found for this address. Visit the Marketplace to place an escrow order.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#07130b] text-slate-300 font-semibold border-b border-[#48A741]/20">
                <tr>
                  <th className="py-3 px-4">{t("orderId")}</th>
                  <th className="py-3 px-4">Seed Variety</th>
                  <th className="py-3 px-4">{t("breederHub")}</th>
                  <th className="py-3 px-4">{t("quantity")}</th>
                  <th className="py-3 px-4">{t("totalAmount")}</th>
                  <th className="py-3 px-4">{t("status")}</th>
                  <th className="py-3 px-4 text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#48A741]/10">
                {orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-[#07160d] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#48A741]">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white">{order.seedName}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Lot #{order.batchNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {order.sellerName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-200">
                        {order.quantityKg} kg
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#48A741]">
                        {order.totalPriceEth} ETH
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${order.status === "COMPLETED"
                              ? "bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30"
                              : order.status === "SHIPPED"
                                ? "bg-blue-950/40 text-blue-300 border border-blue-500/30"
                                : order.status === "ESCROWED"
                                  ? "bg-amber-950/40 text-amber-300 border border-amber-500/30"
                                  : order.status === "DISPUTED"
                                    ? "bg-rose-950/40 text-rose-300 border border-rose-500/30"
                                    : "bg-slate-800 text-slate-300"
                            }`}
                        >
                          {order.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                          {order.status === "SHIPPED" && <Truck className="w-3 h-3" />}
                          {order.status === "ESCROWED" && <Lock className="w-3 h-3" />}
                          {order.status === "DISPUTED" && <AlertTriangle className="w-3 h-3" />}
                          {order.status}
                        </span>
                        {order.trackingNumber && (
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                            {order.carrierName}: {order.trackingNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">

                          {/* Confirm Delivery button if SHIPPED */}
                          {order.status === "SHIPPED" && (
                            <button
                              onClick={() => handleConfirmDelivery(order)}
                              className="px-2.5 py-1 rounded-lg bg-[#48A741] hover:bg-[#3d9136] text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                              title="Releases escrow to seller upon physical seed arrival"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>{t("confirmDeliveryBtn")}</span>
                            </button>
                          )}

                          {/* Raise Dispute button if active */}
                          {(order.status === "ESCROWED" || order.status === "SHIPPED") && (
                            <button
                              onClick={() => setDisputeOrder(order)}
                              className="px-2 py-1 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 text-[11px] font-semibold"
                            >
                              {t("raiseDisputeBtn")}
                            </button>
                          )}

                          {/* Leave Feedback button if COMPLETED */}
                          {order.status === "COMPLETED" && (
                            <button
                              onClick={() => setReviewOrder(order)}
                              className="px-2 py-1 rounded-lg bg-[#48A741]/20 hover:bg-[#48A741]/30 border border-[#48A741]/40 text-[#48A741] text-[11px] font-bold flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" />
                              <span>{t("rateSellerBtn")}</span>
                            </button>
                          )}

                          <Link
                            to={`/verify/seed/${order.batchId}`}
                            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Verify Seed Bag On-Chain"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Review Feedback Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#07160d] rounded-2xl max-w-md w-full border border-[#48A741]/30 shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 bg-[#0a1f11] border-b border-[#48A741]/20 flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">Rate Breeder Quality & Delivery</h3>
              <button onClick={() => setReviewOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300">
                Your feedback is recorded on <code className="text-[#48A741]">FeedbackRegistry.sol</code> and directly factors into the breeder's dynamic AI Trust Score.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-300">Star Rating (1 to 5):</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl text-lg ${rating >= star ? "text-amber-400 bg-amber-950/40" : "text-slate-600 bg-[#0a1f11]"
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300">Viability Review Notes:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Excellent germination, bags arrived with valid sealed QR tags..."
                  rows={3}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl border border-[#48A741]/30 bg-[#0a1f11] text-white focus:outline-none focus:border-[#48A741]"
                />
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="w-full py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white font-bold text-xs"
              >
                {submittingReview ? "Recording On-Chain..." : "Submit Verified Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Dispute Modal */}
      {disputeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#07160d] rounded-2xl max-w-md w-full border border-rose-500/40 shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between text-rose-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-display font-bold text-base text-white">Raise Escrow Dispute</h3>
              </div>
              <button onClick={() => setDisputeOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-rose-300 leading-relaxed">
                Raising a dispute will immediately <strong>freeze the {disputeOrder.totalPriceEth} ETH</strong> escrow locked in <code className="text-white">Marketplace.sol</code> and prevent the breeder from withdrawing until arbitration is resolved.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-300">Reason for Dispute:</label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g. Bag tamper seal was broken, lab QR verification failed, low seed germination..."
                  rows={4}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl border border-rose-500/30 bg-[#0a1f11] text-white focus:outline-none focus:border-rose-400"
                />
              </div>
              <button
                onClick={handleRaiseDispute}
                disabled={submittingDispute}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                {submittingDispute ? "Freezing Funds..." : "Freeze Escrow & Open Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
