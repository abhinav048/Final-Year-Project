import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSeedById, createOrder } from "../api";
import { SeedBatch } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { TrustExplainability } from "../components/TrustExplainability";
import { TamperCheckModal } from "../components/TamperCheckModal";
import { QRCodeModal } from "../components/QRCodeModal";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  FileCheck2,
  ExternalLink,
  Star,
  Sprout,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";

interface SeedDetailPageProps {
  currentAddress: string;
}

export const SeedDetailPage: React.FC<SeedDetailPageProps> = ({ currentAddress }) => {
  const { id } = useParams<{ id: string }>();
  const [seed, setSeed] = useState<SeedBatch | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [tamperModalOpen, setTamperModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Purchase State
  const [quantity, setQuantity] = useState(25);
  const [buyLoading, setBuyLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchSeedById(id)
        .then(setSeed)
        .catch((err) => console.error("Error loading seed:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBuy = async () => {
    if (!seed) return;
    setBuyLoading(true);
    try {
      const res = await createOrder({
        batchId: seed.id,
        buyerAddress: currentAddress,
        quantityKg: quantity
      });
      setOrderComplete(res);
      // Reload seed details
      fetchSeedById(seed.id).then(setSeed);
    } catch (err: any) {
      alert("Order failed: " + err.message);
    } finally {
      setBuyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-100">
        <div className="inline-block w-8 h-8 border-4 border-[#48A741] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-3 font-medium">Verifying cryptographic seed records...</p>
      </div>
    );
  }

  if (!seed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-100">
        <h2 className="text-xl font-bold text-white">Seed Batch Not Found</h2>
        <Link to="/marketplace" className="text-[#48A741] hover:underline text-sm font-semibold mt-2 inline-block">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isHighRisk = (seed.sellerTrustScore || 50) < 40;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100 animate-in fade-in duration-300">

      {/* Back Link */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#48A741]" />
        <span>Back to Marketplace</span>
      </Link>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1f11] border border-[#48A741]/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Seed Info */}
        <div className="lg:col-span-8 space-y-4">

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#07130b] text-[#48A741] border border-[#48A741]/30">
              {seed.cropType}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${seed.certificationStatus === "Certified"
                  ? "bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40"
                  : "bg-amber-950 text-amber-300 border border-amber-800"
                }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {seed.certificationStatus}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#48A741]/10 text-[#48A741] border border-[#48A741]/20">
              Verified Lot
            </span>
          </div>

          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              {seed.name}
            </h1>
            <p className="text-sm font-mono text-[#48A741] mt-1">
              Batch Lot #{seed.batchNumber} | Variety: {seed.variety}
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Produced by <strong className="text-slate-200">{seed.manufacturer}</strong> • Harvested: {seed.harvestDate} • Expiry: {seed.expiryDate}
          </p>

          {/* Quick Quality Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-[#07130b] border border-[#48A741]/25 text-center">
              <span className="text-[11px] font-semibold text-[#48A741]">Germination</span>
              <p className="font-display font-black text-xl text-white">{seed.germinationRate}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#07130b] border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Genetic Purity</span>
              <p className="font-display font-black text-xl text-white">{seed.purity}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#07130b] border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Seed Vigor</span>
              <p className="font-display font-black text-xl text-white">{seed.vigor}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#07130b] border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400">Moisture Content</span>
              <p className="font-display font-black text-xl text-white">{seed.moisture}%</p>
            </div>
          </div>

          {/* Disease Resistance Genes */}
          <div className="p-3.5 rounded-xl bg-[#07130b] border border-slate-800 text-xs">
            <span className="font-bold text-slate-300">Genetic Resistance Trait: </span>
            <span className="text-slate-400">{seed.diseaseResistance}</span>
          </div>

          {/* Cryptographic Verification Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setTamperModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#48A741]/25 transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-white" />
              <span>Test Cryptographic Tamper Check</span>
            </button>
            <button
              onClick={() => setQrModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#07130b] hover:bg-white/5 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-2 shadow-sm transition-all"
            >
              <QrCode className="w-4 h-4 text-[#48A741]" />
              <span>Generate Seed Bag QR Tag</span>
            </button>
          </div>

        </div>

        {/* Right Column: Escrow Purchase Box */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#07130b] border border-[#48A741]/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Escrow Pricing</span>
            <span className="font-mono text-[#48A741] font-bold text-xs bg-[#48A741]/10 px-2 py-0.5 rounded border border-[#48A741]/30">
              In Stock: {seed.availableQuantityKg} kg
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-white">{seed.pricePerKg} ETH</span>
              <span className="text-xs text-slate-400">/ kilogram</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              (~₹{Math.round(seed.pricePerKg * 300000)} per kg)
            </p>
          </div>

          {orderComplete ? (
            <div className="p-4 rounded-xl bg-[#0a1f11] border border-[#48A741]/50 text-emerald-300 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#48A741] mx-auto" />
              <p className="text-xs font-bold">Order Locked in Smart Escrow!</p>
              <p className="text-[11px] text-slate-300">
                Order ID #{orderComplete.orderId}. Track fulfillment in your Farmer Portal.
              </p>
              <Link
                to="/farmer"
                className="inline-block mt-1 px-3 py-1.5 rounded-lg bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-xs"
              >
                Go to Farmer Portal
              </Link>
            </div>
          ) : isHighRisk ? (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/50 text-rose-300 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Purchase Blocked by Trust Gate
              </p>
              <p className="text-[11px] text-rose-300/80">
                This seller has a trust rating of {seed.sellerTrustScore}/100. SeedSure smart contracts disallow escrow locking for unvetted sellers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Order Quantity (kg):
                </label>
                <input
                  type="number"
                  min="1"
                  max={seed.availableQuantityKg}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-700 bg-[#0a1f11] text-white font-mono focus:outline-none focus:border-[#48A741]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0a1f11] border border-[#48A741]/20 text-xs flex justify-between items-center">
                <span className="font-medium text-slate-400">Total Escrow Deposit:</span>
                <span className="font-mono font-bold text-sm text-[#48A741]">
                  {parseFloat((seed.pricePerKg * quantity).toFixed(5))} ETH
                </span>
              </div>

              <button
                onClick={handleBuy}
                disabled={buyLoading}
                className="w-full py-3 rounded-xl bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#48A741]/30 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>{buyLoading ? "Securing in Escrow..." : "Deposit ETH & Lock in Escrow"}</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Non-custodial smart escrow: funds are held in the contract until you inspect seeds and confirm delivery.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Grid: Trust Explainability & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: ML Trust Explainability ("Why this score?") */}
        <div className="lg:col-span-7 space-y-6">
          <TrustExplainability explanation={seed.trustExplanation} />
        </div>

        {/* Right: Verified Buyer Reviews */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0a1f11] border border-[#48A741]/20 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#48A741]/15">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                Verified Buyer Reviews
                <span className="text-xs font-normal text-slate-400">
                  ({seed.reviews?.length || 0})
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Only farmers who confirmed escrow delivery can submit on-chain reviews.
              </p>
            </div>
          </div>

          {seed.reviews && seed.reviews.length > 0 ? (
            <div className="space-y-3">
              {seed.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-[#07130b] border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rev.buyerAddress.substring(0, 6)}...{rev.buyerAddress.substring(rev.buyerAddress.length - 4)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <div className="text-[10px] text-[#48A741] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Order ({rev.quantityKg} kg)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No buyer reviews recorded for this specific lot yet.
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <TamperCheckModal
        batchId={seed.id}
        batchNumber={seed.batchNumber}
        seedName={seed.name}
        certificateCID={seed.certificateCID}
        certificateHash={seed.certificateHash}
        isOpen={tamperModalOpen}
        onClose={() => setTamperModalOpen(false)}
      />

      <QRCodeModal
        batchId={seed.id}
        batchNumber={seed.batchNumber}
        seedName={seed.name}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />

    </div>
  );
};
