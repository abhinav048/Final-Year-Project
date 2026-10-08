import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAnalytics } from "../api";
import { AnalyticsData } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ChevronDown,
  Boxes,
  Activity,
  Coins,
  Sprout,
  Building2
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<"farmer" | "seller">("farmer");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics().then(setStats).catch(() => { });
  }, []);

  const handlePortalQuickAccess = (role: "farmer" | "seller" | "admin", targetUrl: string) => {
    login(role);
    navigate(targetUrl);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") }
  ];

  return (
    <div className="min-h-screen bg-[#07130b] text-slate-100 relative selection:bg-[#48A741] selection:text-white overflow-hidden">

      {/* ======================================================== */}
      {/* 1. TOP DRAMATIC BACKDROP (Matching Theme & Responsive)    */}
      {/* ======================================================== */}
      <div className="relative pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Green Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-64 bg-[#48A741]/15 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          {/* Giant Background Typography: "SeedSure" (Fully Responsive with Seed in pure white & Sure in #48A741) */}
          <div className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[132px] tracking-tight leading-none text-white select-none opacity-95">
            Seed<span className="text-[#48A741]">Sure</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FLOATING CURVED CARD CONTAINER (Matching Theme & Off-White Surface) */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 md:-mt-14 relative z-20 pb-16">
        <div className="topography-pattern rounded-[28px] sm:rounded-[36px] md:rounded-[44px] shadow-2xl border border-slate-200/90 overflow-hidden relative">

          {/* Topography Organic Wave Accent Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="contourPattern" width="200" height="200" patternUnits="userSpaceOnUse">
                  <path d="M 0,100 C 50,70 150,130 200,100" stroke="#48A741" strokeWidth="0.6" fill="none" opacity="0.3" />
                  <path d="M 0,50 C 60,20 140,80 200,50" stroke="#48A741" strokeWidth="0.5" fill="none" opacity="0.2" />
                  <path d="M 0,150 C 60,120 140,180 200,150" stroke="#48A741" strokeWidth="0.5" fill="none" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#contourPattern)" />
            </svg>
          </div>

          {/* HERO CONTENT: COMPOSITION WITH LIVE TRANSLATIONS */}
          <div className="px-4 sm:px-10 lg:px-20 pt-10 sm:pt-16 md:pt-20 pb-12 sm:pb-20 text-center relative z-10">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-950 text-white text-[10px] sm:text-[11px] font-bold tracking-wide shadow-sm mb-5 sm:mb-8 max-w-full truncate">
              <span className="truncate">{t("heroPillBadge")}</span>
            </div>

            {/* Main Title & Artistic Leaf Line Illustration */}
            <div className="relative max-w-4xl mx-auto my-2">

              {/* Left Fine Leaf Outline Line (Visible on xl+ screens so mobile/tablet is never crowded) */}
              <div className="hidden xl:block absolute -left-16 top-2 w-44 h-44 pointer-events-none">
                <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-900">
                  <path
                    d="M 30 110 C 20 80, 25 40, 75 35 C 75 75, 45 110, 30 110 Z"
                    stroke="#1e293b"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 32 108 C 45 80, 60 55, 73 37"
                    stroke="#1e293b"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 30 110 C 35 125, 55 135, 95 135 L 160 135"
                    stroke="#1e293b"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Right Green Leaf Outline (Visible on xl+ screens) */}
              <div className="hidden xl:block absolute -right-12 bottom-0 w-32 h-32 pointer-events-none">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#48A741]">
                  <path
                    d="M 70 20 C 100 35, 110 75, 80 100 C 60 100, 45 70, 70 20 Z"
                    stroke="#48A741"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 71 22 C 72 50, 76 75, 80 98"
                    stroke="#48A741"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 79 100 C 70 110, 30 115, 0 115"
                    stroke="#48A741"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* High-Impact 3-Line Headline with Two-Tone Theme */}
              <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-[72px] tracking-tight leading-[1.12] select-none text-slate-950">
                <span className="block text-[#48A741]">
                  {t("heroLine1")}
                </span>
                <span className="block text-slate-950">
                  {t("heroLine2")}
                </span>
                <span className="block text-[#48A741]">
                  {t("heroLine3")}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-slate-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed mt-4 sm:mt-6 mb-6 sm:mb-10 px-2">
              {t("heroSubtitle")}
            </p>

            {/* Dual CTA Buttons (Responsive on Mobile and Desktop) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 rounded-full bg-[#48A741] hover:bg-[#3d9136] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#48A741]/25 hover:scale-[1.02] transition-all"
              >
                <span>{t("getServiceToday")}</span>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  →
                </div>
              </Link>

              <a
                href="#how-to-use"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold shadow-sm hover:scale-[1.02] transition-all"
              >
                <span>{t("exploreServices")}</span>
                <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-black">
                  →
                </div>
              </a>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 3. ETHEREUM BLOCKCHAIN LIVE METRICS BAR                   */}
          {/* ======================================================== */}
          <div className="border-t border-slate-200/90 bg-slate-50/70 px-4 sm:px-12 py-6 sm:py-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

              <div className="text-center sm:text-left p-2">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#48A741] font-bold text-xs uppercase tracking-wider">
                  <Coins className="w-4 h-4" />
                  <span>{t("metricEscrow")}</span>
                </div>
                <p className="font-display font-black text-xl sm:text-3xl text-slate-900 mt-1">
                  Ξ {stats?.activeEscrowEth || "4.85"} ETH
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500">{t("metricEscrowSub")}</p>
              </div>

              <div className="text-center sm:text-left p-2">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t("metricBatches")}</span>
                </div>
                <p className="font-display font-black text-xl sm:text-3xl text-slate-900 mt-1">
                  {stats?.certifiedBatches || 9} Lots
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500">{t("metricBatchesSub")}</p>
              </div>

              <div className="text-center sm:text-left p-2">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>{t("metricTrust")}</span>
                </div>
                <p className="font-display font-black text-xl sm:text-3xl text-slate-900 mt-1">
                  {stats?.avgTrustScore || 88}/100
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500">{t("metricTrustSub")}</p>
              </div>

              <div className="text-center sm:text-left p-2">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-purple-600 font-bold text-xs uppercase tracking-wider">
                  <Boxes className="w-4 h-4" />
                  <span>{t("metricNetwork")}</span>
                </div>
                <p className="font-display font-black text-xl sm:text-3xl text-slate-900 mt-1 font-mono">
                  Chain 31337
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-500">{t("metricNetworkSub")}</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. DEDICATED HOW TO USE SECTION: FARMER & SELLER GUIDE   */}
      {/* ======================================================== */}
      <section id="how-to-use" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-white">

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30">
            {t("howToUseBadge")}
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white mt-3">
            {t("howToUseHeading")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 px-2">
            {t("howToUseSub")}
          </p>

          {/* Interactive Role Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0a1f11]/90 border border-[#48A741]/25 shadow-xl mt-6 sm:mt-8 w-full sm:w-auto">
            <button
              onClick={() => setActiveGuideTab("farmer")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeGuideTab === "farmer"
                ? "bg-[#48A741] text-white shadow-lg shadow-[#48A741]/30"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <Sprout className="w-4 h-4 shrink-0" />
              <span>{t("tabFarmer")}</span>
            </button>
            <button
              onClick={() => setActiveGuideTab("seller")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeGuideTab === "seller"
                ? "bg-[#48A741] text-white shadow-lg shadow-[#48A741]/30"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>{t("tabSeller")}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Farmer Workflow */}
        {activeGuideTab === "farmer" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

              {/* Step 1 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-[#48A741]/20 text-[#48A741] flex items-center justify-center font-black text-xs">
                      01
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Discovery
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("fStep1Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("fStep1Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-[#48A741]">
                  AI Trust Engine &gt;= 40
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs">
                      02
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Smart Escrow
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("fStep2Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("fStep2Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-blue-400">
                  Marketplace.createOrder()
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                      03
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Inspection
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("fStep3Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("fStep3Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-amber-400">
                  SHA-256 Tamper Check
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                      04
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Settlement
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("fStep4Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("fStep4Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-emerald-400">
                  confirmDelivery() / dispute()
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
                      05
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Reputation
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("fStep5Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("fStep5Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-purple-400">
                  submitFeedback(1-5 ★)
                </div>
              </div>

            </div>

            {/* Quick Demo CTA Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0a2012] to-[#07130b] border border-[#48A741]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#48A741] text-white flex items-center justify-center font-bold shrink-0">
                  🌾
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t("farmerCtaTitle")}</h4>
                  <p className="text-xs text-slate-300">{t("farmerCtaDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => handlePortalQuickAccess("farmer", "/marketplace")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white text-xs font-bold shadow-md transition-all shrink-0"
              >
                <span>{t("farmerCtaBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Seller & Breeder Workflow */}
        {activeGuideTab === "seller" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

              {/* Step 1 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs">
                      01
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Onboarding
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("bStep1Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("bStep1Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-blue-400">
                  SellerRegistry.registerSeller()
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                      02
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Registration
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("bStep2Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("bStep2Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-emerald-400">
                  SeedRegistry.registerBatch()
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                      03
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Audit
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("bStep3Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("bStep3Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-amber-400">
                  certifyBatch(batchId)
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                      04
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Fulfillment
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("bStep4Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("bStep4Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-indigo-400">
                  shipOrder(orderId, tracking)
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-5 sm:p-6 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-2xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xs">
                      05
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Growth
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">
                    {t("bStep5Title")}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("bStep5Desc")}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#48A741]/20 text-[10px] font-mono text-teal-400">
                  TrustScoreUpdated (+Score)
                </div>
              </div>

            </div>

            {/* Quick Demo CTA Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0a2012] to-[#07130b] border border-[#48A741]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#48A741] text-white flex items-center justify-center font-bold shrink-0">
                  🏢
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t("breederCtaTitle")}</h4>
                  <p className="text-xs text-slate-300">{t("breederCtaDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => handlePortalQuickAccess("seller", "/seller")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white text-xs font-bold shadow-md transition-all shrink-0"
              >
                <span>{t("breederCtaBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </section>

      {/* ======================================================== */}
      {/* 5. HOW SEEDSURE WORKS: 3 ETHEREUM PROTECTION PILLARS     */}
      {/* ======================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10 text-white">

        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30">
            {t("archBadge")}
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white mt-3">
            {t("archHeading")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 px-2">
            {t("archSub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="p-6 sm:p-7 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-3xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#48A741]/20 text-[#48A741] flex items-center justify-center mb-5 font-black text-lg group-hover:scale-105 transition-transform">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              {t("pillar1Title")}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {t("pillar1Desc")}
            </p>
            <div className="text-[11px] font-mono text-[#48A741] bg-[#07160d] p-2.5 rounded-xl border border-[#48A741]/30">
              SHA256(Document) == OnChainHash
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-7 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-3xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 font-black text-lg group-hover:scale-105 transition-transform">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              {t("pillar2Title")}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {t("pillar2Desc")}
            </p>
            <div className="text-[11px] font-mono text-blue-400 bg-[#07160d] p-2.5 rounded-xl border border-blue-900/50">
              msg.value locked in smart contract
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-7 bg-[#0a1f11]/90 border border-[#48A741]/25 hover:border-[#48A741]/60 rounded-3xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 font-black text-lg group-hover:scale-105 transition-transform">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              {t("pillar3Title")}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {t("pillar3Desc")}
            </p>
            <div className="text-[11px] font-mono text-amber-400 bg-[#07160d] p-2.5 rounded-xl border border-amber-900/50">
              confirmDelivery() → transfer to seller
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* 6. ETHEREUM SMART CONTRACT SUITE DIRECTORY PREVIEW        */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 text-white">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0a1f11] to-[#07130b] border border-[#48A741]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#48A741] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#48A741]">
                {t("bannerBadge")}
              </span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-3xl text-white">
              {t("bannerTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t("bannerDesc")}
            </p>
          </div>

          <Link
            to="/blockchain"
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#48A741] hover:bg-[#3d9136] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#48A741]/25 hover:scale-105 transition-all"
          >
            <Boxes className="w-4 h-4" />
            <span>{t("openExplorerBtn")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION)                */}
      {/* ======================================================== */}
      <section id="faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-white">
        <div className="text-center mb-8 sm:mb-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0a1f11] text-[#48A741] border border-[#48A741]/30">
            {t("faqBadge")}
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white mt-3">
            {t("faqHeading")}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${openFaq === idx
                ? "bg-[#0a2213] border-[#48A741]/60 shadow-lg"
                : "bg-[#0a1f11]/90 border-[#48A741]/25 hover:border-[#48A741]/50"
                }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors"
              >
                <span className="font-display font-bold text-sm text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#48A741] shrink-0 transition-transform ${openFaq === idx ? "rotate-180" : ""
                    }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-200 leading-relaxed border-t border-[#48A741]/20 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
