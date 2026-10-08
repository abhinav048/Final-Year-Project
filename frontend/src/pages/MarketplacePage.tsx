import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchSeeds, createOrder } from "../api";
import { SeedBatch } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { useLanguage } from "../context/LanguageContext";
import {
  Search,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sprout,
  ShoppingBag,
  ExternalLink,
  Lock,
  X,
  Check
} from "lucide-react";

interface MarketplacePageProps {
  currentAddress: string;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ currentAddress }) => {
  const { t } = useLanguage();
  const [seeds, setSeeds] = useState<SeedBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minTrust, setMinTrust] = useState<number | undefined>(undefined);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("trust");

  // Buy Escrow Modal State
  const [selectedSeedForBuy, setSelectedSeedForBuy] = useState<SeedBatch | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(10);
  const [buyLoading, setBuyLoading] = useState(false);
  const [buySuccess, setBuySuccess] = useState<any | null>(null);
  const [gateBlocked, setGateBlocked] = useState(false);

  const categories = ["All", "Cereals", "Pulses", "Oilseeds", "Vegetables", "Cash Crops"];
  const categoryLabels: Record<string, string> = {
    All: t("all"),
    Cereals: t("cereals"),
    Pulses: t("pulses"),
    Oilseeds: t("oilseeds"),
    Vegetables: t("vegetables"),
    "Cash Crops": t("cashCrops")
  };

  const loadSeeds = async () => {
    setLoading(true);
    try {
      const data = await fetchSeeds({
        q: search || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        minTrust: minTrust,
        certifiedOnly: certifiedOnly,
        sort: sortBy
      });
      setSeeds(data);
    } catch (err: any) {
      console.error("Error loading seeds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeeds();
  }, [search, selectedCategory, minTrust, certifiedOnly, sortBy]);

  const handleOpenBuy = (seed: SeedBatch) => {
    const sellerScore = seed.sellerTrustScore || 50;
    if (sellerScore < 40) {
      setSelectedSeedForBuy(seed);
      setGateBlocked(true);
      return;
    }

    setGateBlocked(false);
    setSelectedSeedForBuy(seed);
    setBuyQuantity(Math.min(50, Math.max(1, Math.round(seed.availableQuantityKg * 0.05))));
    setBuySuccess(null);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedSeedForBuy) return;
    setBuyLoading(true);
    try {
      const res = await createOrder({
        batchId: selectedSeedForBuy.id,
        buyerAddress: currentAddress,
        quantityKg: buyQuantity
      });
      setBuySuccess(res);
      loadSeeds();
    } catch (err: any) {
      alert("Order failed: " + err.message);
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">

      {/* Title & Research Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#48A741]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {t("marketplaceTitle")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30">
              Ethereum Escrow
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            {t("marketplaceSubtitle")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-auto min-w-[280px] sm:min-w-[340px]">
          <Search className="w-4 h-4 text-[#48A741] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#48A741]/30 focus:outline-none focus:ring-2 focus:ring-[#48A741]/30 focus:border-[#48A741] bg-[#0a1f11] text-white placeholder-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#0a1f11]/90 p-4 rounded-2xl border border-[#48A741]/25 shadow-md">

        {/* Categories */}
        <div className="md:col-span-6 flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat
                  ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30 font-bold"
                  : "bg-[#07130b] text-slate-300 border border-[#48A741]/20 hover:text-white hover:bg-[#48A741]/20"
                }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Trust Threshold Selector */}
        <div className="md:col-span-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#48A741] shrink-0" />
          <select
            value={minTrust || ""}
            onChange={(e) => setMinTrust(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full text-xs font-medium rounded-lg border border-[#48A741]/30 py-2 px-2.5 bg-[#07130b] text-slate-200 focus:outline-none focus:border-[#48A741]"
          >
            <option value="">{t("filterTrust")}: Any</option>
            <option value="60">{t("filterTrust")}: 60+ (Moderate)</option>
            <option value="75">{t("filterTrust")}: 75+ (Trusted)</option>
            <option value="90">{t("filterTrust")}: 90+ (Excellent)</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-3 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#48A741] shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs font-medium rounded-lg border border-[#48A741]/30 py-2 px-2.5 bg-[#07130b] text-slate-200 focus:outline-none focus:border-[#48A741]"
          >
            <option value="trust">{t("sortTrust")}</option>
            <option value="germination">{t("sortGermination")}</option>
            <option value="price_asc">{t("sortPriceLow")}</option>
            <option value="price_desc">{t("sortPriceHigh")}</option>
          </select>
        </div>

      </div>

      {/* Seed Cards Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-[#48A741] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Querying verified seed records...</p>
        </div>
      ) : seeds.length === 0 ? (
        <div className="text-center py-16 bg-[#0a1f11]/90 rounded-2xl border border-[#48A741]/25">
          <Sprout className="w-12 h-12 text-[#48A741]/50 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-white">No Seed Batches Match Filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your crop category search or reducing the minimum seller trust threshold.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seeds.map((seed) => {
            const isHighRisk = (seed.sellerTrustScore || 50) < 40;

            return (
              <div
                key={seed.id}
                className={`bg-[#0a1f11]/90 rounded-2xl border transition-all duration-200 hover:shadow-xl flex flex-col justify-between overflow-hidden ${isHighRisk ? "border-rose-500/50 hover:border-rose-400" : "border-[#48A741]/25 hover:border-[#48A741]"
                  }`}
              >

                {/* Card Top */}
                <div className="p-5 space-y-4">

                  {/* Category & Status Tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#07130b] text-[#48A741] border border-[#48A741]/30">
                      {seed.cropType}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${seed.certificationStatus === "Certified"
                          ? "bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40"
                          : "bg-amber-950/40 text-amber-300 border border-amber-600/40"
                        }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {seed.certificationStatus}
                    </span>
                  </div>

                  {/* Seed Title & Batch ID */}
                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#48A741]">
                      {seed.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Lot #{seed.batchNumber}
                    </p>
                  </div>

                  {/* Seller & Trust Score */}
                  <div className="p-3 rounded-xl bg-[#07130b] border border-[#48A741]/20 flex items-center justify-between">
                    <div className="truncate max-w-[150px]">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Breeder / Seller</p>
                      <p className="text-xs font-bold text-white truncate">{seed.sellerName}</p>
                    </div>
                    <TrustBadge score={seed.sellerTrustScore || 50} riskCategory={seed.sellerRiskCategory} size="sm" />
                  </div>

                  {/* Quality Parameter Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg bg-[#07130b] border border-[#48A741]/20">
                      <p className="text-[10px] font-semibold text-[#48A741]">{t("germinationRate")}</p>
                      <p className="font-display font-extrabold text-sm text-white">{seed.germinationRate}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#07130b] border border-[#48A741]/20">
                      <p className="text-[10px] font-semibold text-slate-400">{t("purity")}</p>
                      <p className="font-display font-bold text-sm text-white">{seed.purity}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#07130b] border border-[#48A741]/20">
                      <p className="text-[10px] font-semibold text-slate-400">Vigor</p>
                      <p className="font-display font-bold text-sm text-white">{seed.vigor}%</p>
                    </div>
                  </div>

                </div>

                {/* Card Bottom / Actions */}
                <div className="px-5 py-4 bg-[#07160d] border-t border-[#48A741]/20 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{t("pricePerKg")} / kg</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-extrabold text-base text-white">
                        {seed.pricePerKg} ETH
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (~₹{Math.round(seed.pricePerKg * 300000)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/seed/${seed.id}`}
                      className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#48A741]/20 border border-[#48A741]/20 transition-colors"
                      title="Inspect Quality Specs & Certificate"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleOpenBuy(seed)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${isHighRisk
                          ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                          : "bg-[#48A741] hover:bg-[#3d9136] text-white shadow-[#48A741]/30"
                        }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isHighRisk ? "Blocked" : t("buyEscrowBtn")}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Buy with Escrow Modal (Themed in #07130b + #48A741) */}
      {selectedSeedForBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#07160d] rounded-2xl max-w-md w-full border border-[#48A741]/30 shadow-2xl overflow-hidden text-slate-100">

            <div className="px-6 py-4 bg-[#0a1f11] border-b border-[#48A741]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#48A741]" />
                <h3 className="font-display font-bold text-base text-white">
                  Smart Contract Escrow Purchase
                </h3>
              </div>
              <button
                onClick={() => setSelectedSeedForBuy(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">

              {gateBlocked ? (
                /* Trust Gate Protection Alert */
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>Farmer Protection Gate: Purchase Blocked</span>
                  </div>
                  <p className="text-xs leading-relaxed text-rose-300">
                    This seller's AI Trust Score is <strong>{selectedSeedForBuy.sellerTrustScore}/100</strong>, which is below the platform security threshold (40/100).
                  </p>
                  <p className="text-[11px] text-rose-400">
                    To prevent crop failure losses from spurious seed distribution, SeedSure smart contracts disallow escrow locking for unverified or penalized sellers.
                  </p>
                </div>
              ) : buySuccess ? (
                /* Success Feedback */
                <div className="p-4 rounded-xl bg-[#0a2213] border border-[#48A741]/40 text-slate-100 space-y-2 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#48A741] mx-auto" />
                  <h4 className="font-display font-bold text-base text-white">Payment Locked in Smart Escrow!</h4>
                  <p className="text-xs text-slate-300">
                    Order #{buySuccess.orderId} created successfully. {buySuccess.totalPriceEth} ETH locked non-custodially.
                  </p>
                  <p className="text-[11px] text-[#48A741]">
                    Funds will ONLY release to the seller after you confirm seed delivery and viability in your Farmer Portal.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/farmer"
                      className="inline-block px-4 py-2 rounded-xl bg-[#48A741] text-white font-bold text-xs shadow-md"
                    >
                      Track Order in Farmer Portal
                    </Link>
                  </div>
                </div>
              ) : (
                /* Order Form */
                <>
                  <div>
                    <h4 className="font-display font-bold text-base text-white">
                      {selectedSeedForBuy.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Breeder: {selectedSeedForBuy.sellerName}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                      <span>Order Quantity (Kilograms):</span>
                      <span className="text-[#48A741] font-normal">
                        Available: {selectedSeedForBuy.availableQuantityKg} kg
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedSeedForBuy.availableQuantityKg}
                      value={buyQuantity}
                      onChange={(e) => setBuyQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#48A741]/30 focus:outline-none focus:ring-2 focus:ring-[#48A741]/30 focus:border-[#48A741] bg-[#0a1f11] text-white font-mono"
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-3.5 rounded-xl bg-[#0a1f11] border border-[#48A741]/20 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Price per kg:</span>
                      <span className="font-mono text-white">{selectedSeedForBuy.pricePerKg} ETH</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Buyer Address:</span>
                      <span className="font-mono text-white truncate max-w-[180px]">
                        {currentAddress}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#48A741]/20">
                      <span>Total Escrow Deposit:</span>
                      <span className="font-mono text-[#48A741]">
                        {parseFloat((selectedSeedForBuy.pricePerKg * buyQuantity).toFixed(5))} ETH
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    🔒 {t("escrowNotice")}
                  </p>

                  <button
                    onClick={handleConfirmPurchase}
                    disabled={buyLoading}
                    className="w-full py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#48A741]/25 transition-all"
                  >
                    {buyLoading ? "Locking Funds in Escrow..." : "Deposit ETH & Lock Escrow"}
                  </button>
                </>
              )}

            </div>

            <div className="px-6 py-3 bg-[#0a1f11] border-t border-[#48A741]/20 flex justify-end">
              <button
                onClick={() => setSelectedSeedForBuy(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {t("cancel")}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
