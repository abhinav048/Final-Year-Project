import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchSeeds, createOrder } from "../api";
import { SeedBatch } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { useLanguage } from "../context/LanguageContext";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { VerifiedBadge } from "../components/VerifiedBadge";
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
  Check,
  Sparkles,
  Coins
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
    setSelectedSeedForBuy(seed);
    setGateBlocked(false);
    setBuyQuantity(10);
    setBuySuccess(null);
  };

  const handleConfirmBuy = async () => {
    if (!selectedSeedForBuy) return;
    setBuyLoading(true);

    try {
      const res = await createOrder({
        batchId: selectedSeedForBuy.id,
        buyerAddress: currentAddress,
        quantityKg: buyQuantity
      });

      setBuySuccess(res);
    } catch (err: any) {
      alert("Order failed: " + err.message);
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8">

        {/* Title & Research Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E1E6DA]">
          <div>
            <div className="flex items-center gap-2">
              <TagPill icon={<Sparkles className="w-3.5 h-3.5 text-[#6AB547]" />}>
                {t("verifiedOnChainLots", "Verified On-Chain Lots")}
              </TagPill>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#121714] mt-2">
              {t("marketplaceTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B665F] mt-1">
              {t("marketplaceSubtitle")} • {t("safeEscrowNote", "Payments held safely in non-custodial smart escrow")}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-auto min-w-[280px] sm:min-w-[340px]">
            <Search className="w-4 h-4 text-[#6AB547] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full border border-[#E1E6DA] focus:outline-none focus:ring-2 focus:ring-[#6AB547]/30 focus:border-[#6AB547] bg-white text-[#121714] placeholder-[#5B665F] shadow-xs"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#EEF3E6] p-4 rounded-2xl border border-[#D2ECC3]">

          {/* Categories */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#6AB547] text-white shadow-xs font-bold"
                    : "bg-white text-[#5B665F] border border-[#E1E6DA] hover:text-[#121714] hover:bg-white"
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {/* Trust Threshold Selector */}
          <div className="md:col-span-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6AB547] shrink-0" />
            <select
              value={minTrust || ""}
              onChange={(e) => setMinTrust(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full text-xs font-semibold rounded-full border border-[#E1E6DA] py-2 px-3 bg-white text-[#121714] focus:outline-none focus:border-[#6AB547] shadow-xs cursor-pointer"
            >
              <option value="">{t("filterTrust")}: Any</option>
              <option value="60">{t("filterTrust")}: 60+ (Moderate)</option>
              <option value="75">{t("filterTrust")}: 75+ (Trusted)</option>
              <option value="90">{t("filterTrust")}: 90+ (Excellent)</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#6AB547] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-semibold rounded-full border border-[#E1E6DA] py-2 px-3 bg-white text-[#121714] focus:outline-none focus:border-[#6AB547] shadow-xs cursor-pointer"
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
            <div className="inline-block w-8 h-8 border-3 border-[#6AB547] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#5B665F] mt-3 font-semibold">
              {t("queryingSeeds", "Querying verified seed records on smart contract...")}
            </p>
          </div>
        ) : seeds.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[24px] border border-[#E1E6DA]">
            <Sprout className="w-12 h-12 text-[#6AB547] mx-auto mb-3" />
            <h3 className="font-extrabold text-base text-[#121714]">
              {t("noSeedsMatch", "No Seed Batches Match Filters")}
            </h3>
            <p className="text-xs text-[#5B665F] max-w-sm mx-auto mt-1">
              {t("noSeedsMatchSub", "Try adjusting your crop category search or reducing the minimum seller reliability threshold.")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seeds.map((seed) => {
              const isHighRisk = (seed.sellerTrustScore || 50) < 40;
              const ethPrice = Number(seed.pricePerKg);
              const inrPrice = Math.round(ethPrice * 280000);

              return (
                <div
                  key={seed.id}
                  className={`bg-white rounded-[20px] border transition-all duration-200 hover:shadow-card-hover flex flex-col justify-between overflow-hidden ${
                    isHighRisk
                      ? "border-[#F7B8B2] hover:border-[#D8503F]"
                      : "border-[#E1E6DA] hover:border-[#6AB547]"
                  }`}
                >
                  {/* Card Top */}
                  <div className="p-5 space-y-4">
                    {/* Category & Status Tags */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EEF3E6] text-[#6AB547]">
                        {seed.cropType}
                      </span>
                      <VerifiedBadge
                        isValid={seed.certificationStatus === "Certified"}
                        size="sm"
                      />
                    </div>

                    {/* Seed Title & Batch ID */}
                    <div>
                      <h3 className="font-extrabold text-lg text-[#121714] hover:text-[#6AB547] transition-colors">
                        {seed.name}
                      </h3>
                      <p className="text-xs font-mono text-[#5B665F] mt-0.5">
                        Lot #{seed.batchNumber}
                      </p>
                    </div>

                    {/* Seller & Trust Score */}
                    <div className="p-3 rounded-xl bg-[#F7F8F3] border border-[#E1E6DA] flex items-center justify-between">
                      <div className="truncate max-w-[150px]">
                        <p className="text-[10px] text-[#5B665F] uppercase font-bold tracking-wider">
                          {t("breederProducer", "Breeder / Producer")}
                        </p>
                        <p className="text-xs font-bold text-[#121714] truncate">
                          {seed.sellerName}
                        </p>
                      </div>
                      <TrustBadge
                        score={seed.sellerTrustScore || 50}
                        riskCategory={seed.sellerRiskCategory}
                        size="sm"
                      />
                    </div>

                    {/* Quality Parameter Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 rounded-xl bg-[#EEF3E6] border border-[#D2ECC3]">
                        <p className="text-[10px] font-bold text-[#6AB547]">
                          {t("germinationRate")}
                        </p>
                        <p className="font-extrabold text-sm text-[#121714]">
                          {seed.germinationRate}%
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F7F8F3] border border-[#E1E6DA]">
                        <p className="text-[10px] font-bold text-[#5B665F]">
                          {t("purity")}
                        </p>
                        <p className="font-bold text-sm text-[#121714]">
                          {seed.purity}%
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F7F8F3] border border-[#E1E6DA]">
                        <p className="text-[10px] font-bold text-[#5B665F]">
                          {t("vigor", "Vigor")}
                        </p>
                        <p className="font-bold text-sm text-[#121714]">
                          {seed.vigor}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Actions */}
                  <div className="px-5 py-4 bg-[#F7F8F3] border-t border-[#E1E6DA] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#5B665F] font-bold uppercase">
                        {t("pricePerKg")} / kg
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-base text-[#121714]">
                          {seed.pricePerKg} ETH
                        </span>
                        <span className="text-[11px] text-[#5B665F]">
                          (≈ ₹{inrPrice})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/seed/${seed.id}`}
                        className="p-2 rounded-full border border-[#E1E6DA] bg-white text-[#5B665F] hover:text-[#121714] hover:bg-[#EEF3E6] transition-colors"
                        title="View Full Quality Audit"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      {isHighRisk ? (
                        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#FDF1F0] text-[#D8503F] border border-[#F7B8B2]">
                          Gated
                        </span>
                      ) : (
                        <PillButton
                          variant="primary"
                          size="sm"
                          withArrow
                          onClick={() => handleOpenBuy(seed)}
                        >
                          {t("buyEscrowBtn", "Buy with Escrow")}
                        </PillButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* BUY WITH ESCROW MODAL (§11.4 Rule 1, 3, 4)           */}
      {/* ==================================================== */}
      {selectedSeedForBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setSelectedSeedForBuy(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#E1E6DA] text-[#5B665F] hover:text-[#121714] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {gateBlocked ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FDF1F0] border border-[#F7B8B2] text-[#D8503F] flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-[#D8503F]">
                  Smart Contract Escrow Gated
                </h3>
                <p className="text-xs text-[#5B665F] leading-relaxed max-w-sm mx-auto">
                  This seller's reliability score is below the 40/100 safety threshold. To protect farmers from spurious seed batches, the Ethereum smart contract blocks purchases from suspended breeders.
                </p>
                <div className="pt-2">
                  <PillButton variant="dark" size="sm" onClick={() => setSelectedSeedForBuy(null)}>
                    Understood
                  </PillButton>
                </div>
              </div>
            ) : buySuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#EEF8F1] border border-[#B8E4C7] text-[#2E9E57] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-black text-[#121714]">
                  Escrow Payment Locked Successfully!
                </h3>
                <p className="text-xs text-[#5B665F] leading-relaxed">
                  Your funds are now held safely in the smart escrow contract. The breeder has received notice to dispatch your seed package with its unique QR tag.
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#E1E6DA] text-xs font-mono text-left space-y-1">
                  <p><span className="text-[#5B665F]">Order ID:</span> #{buySuccess.order?.id || "ORD-1"}</p>
                  <p><span className="text-[#5B665F]">Quantity:</span> {buyQuantity} kg</p>
                  <p><span className="text-[#5B665F]">Escrow Locked:</span> {buySuccess.order?.totalEth} ETH</p>
                </div>
                <div className="pt-2 flex justify-center gap-2">
                  <Link to="/farmer">
                    <PillButton variant="primary" size="sm" withArrow>
                      View in Farmer Portal
                    </PillButton>
                  </Link>
                  <PillButton variant="secondary" size="sm" onClick={() => setSelectedSeedForBuy(null)}>
                    Close
                  </PillButton>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6AB547]">
                    Safe Escrow Checkout
                  </span>
                  <h3 className="text-xl font-black text-[#121714]">
                    {selectedSeedForBuy.name}
                  </h3>
                  <p className="text-xs text-[#5B665F]">
                    Producer: {selectedSeedForBuy.sellerName} • Lot #{selectedSeedForBuy.batchNumber}
                  </p>
                </div>

                {/* Pre-Wallet Transaction Plain-Language Explanation (§11.4 Rule 4) */}
                <div className="p-3.5 rounded-2xl bg-[#EEF3E6] border border-[#D2ECC3] text-xs space-y-1">
                  <p className="font-bold text-[#121714] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#6AB547]" />
                    <span>What will happen:</span>
                  </p>
                  <p className="text-[#5B665F] leading-relaxed">
                    Your payment will stay locked safely in the smart contract until you inspect the physical seed bag QR tag on delivery and confirm germination viability.
                  </p>
                </div>

                <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E1E6DA]">
                  <div>
                    <label className="text-xs font-bold text-[#121714] block mb-1">
                      Order Quantity (kg)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedSeedForBuy.availableQuantityKg}
                      value={buyQuantity}
                      onChange={(e) => setBuyQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full text-sm font-bold p-2.5 rounded-xl border border-[#E1E6DA] focus:border-[#6AB547] focus:outline-none"
                    />
                    <p className="text-[11px] text-[#5B665F] mt-1">
                      Available: {selectedSeedForBuy.availableQuantityKg} kg in certified lot
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F1EFE6] flex items-center justify-between text-xs">
                    <span className="text-[#5B665F]">Total Payment to Hold:</span>
                    <div className="text-right">
                      <span className="font-extrabold text-sm text-[#121714]">
                        {(Number(selectedSeedForBuy.pricePerKg) * buyQuantity).toFixed(4)} ETH
                      </span>
                      <span className="text-[11px] text-[#5B665F] block">
                        ≈ ₹{Math.round(Number(selectedSeedForBuy.pricePerKg) * buyQuantity * 280000)} INR
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <PillButton variant="ghost" size="sm" onClick={() => setSelectedSeedForBuy(null)}>
                    {t("cancel", "Cancel")}
                  </PillButton>
                  <PillButton
                    variant="primary"
                    size="sm"
                    withArrow
                    isLoading={buyLoading}
                    onClick={handleConfirmBuy}
                  >
                    {t("buyEscrowBtn", "Confirm & Lock Escrow")}
                  </PillButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
