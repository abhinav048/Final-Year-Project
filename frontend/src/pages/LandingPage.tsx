import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAnalytics } from "../api";
import { AnalyticsData } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { LeafDecor } from "../components/LeafDecor";
import { TrustScoreCard } from "../components/TrustScoreCard";
import { StatusStepper } from "../components/StatusStepper";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { ExecutionStepsModal } from "../components/ExecutionStepsModal";
import {
  Sprout,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertTriangle,
  QrCode,
  FileCheck2,
  Sparkles,
  Building2,
  Check,
  PackageCheck,
  Truck,
  ChevronDown,
  Coins,
  Cpu,
  Search,
  Award
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<"farmer" | "seller">("farmer");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [executionModalOpen, setExecutionModalOpen] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics().then(setStats).catch(() => {});

    // Scroll-triggered animations for elements as user scrolls down
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-scale");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeGuideTab]);

  const handlePortalQuickAccess = (role: "farmer" | "seller" | "admin", targetUrl: string) => {
    login(role);
    navigate(targetUrl);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What happens if the seeds fail to germinate or arrive damaged?",
      a: "Your money is 100% safe. When you purchase certified seeds on SeedSure, your payment is held securely in an automated smart escrow contract. The breeder cannot withdraw the money. If the seed lot is defective or germination fails field tests, you click 'Raise Dispute' in your Farmer Portal, freezing the funds until our Platform Arbiter reviews the lab findings and issues a complete refund."
    },
    {
      q: "How does the QR tag on physical seed bags prove authenticity?",
      a: "Every seed bag has an immutable cryptographic QR tag. When you scan it with any smartphone camera, it fetches the original seed lot certification issued by the accredited testing laboratory. SeedSure computes the SHA-256 digital fingerprint of the document in real time and checks it against the tamper-proof blockchain registry. If even a single word or parameter was altered, the check immediately flags 'DOCUMENT CHANGED — DO NOT TRUST'."
    },
    {
      q: "How can honest seed breeders improve their Reliability Score?",
      a: "The SeedSure AI Trust Engine evaluates breeders across 5 objective dimensions: Lab Certification Ratio (25%), On-Time Delivery Fulfillment (25%), Transaction Completion Rate (20%), Verified Farmer Reviews (15%), and Dispute Loss History (15%). Breeders who consistently deliver high-germination seed lots on time earn scores up to 90–100 ('Excellent'), boosting their ranking at the top of the marketplace."
    },
    {
      q: "Do farmers need cryptocurrency or technical Web3 knowledge to use SeedSure?",
      a: "Not at all! SeedSure is built mobile-first with friendly Indian agricultural terminology. Farmers can log in with their phone number or Kisan ID, view prices with rupee references (1 ETH ≈ ₹2,80,000 INR demo rate), and test seed bags with standard phone cameras. All underlying smart escrow mechanisms run automatically behind the scenes."
    },
    {
      q: "How are fraudulent sellers prevented from selling fake seeds?",
      a: "SeedSure enforces an automatic Smart Contract Trust Gate: sellers whose AI trust score drops below the safety threshold (40/100) are instantly blocked by the smart contract from listing new seed batches or accepting escrow payments. Suspended breeders cannot bypass the system by creating new accounts, as each breeder identity requires verified credentials."
    }
  ];

  return (
    <div className="space-y-0 pb-16">
      {/* ======================================================== */}
      {/* 1. TOP DRAMATIC BACKDROP (§11.5)                        */}
      {/* Deep-green backdrop with tagline & oversized wordmark     */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        {/* Subtle Ambient Green Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-[#6AB547]/15 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Small Top Tagline */}
          <p className="text-xs sm:text-sm text-[#A2B1A8] font-semibold tracking-wide mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6AB547] animate-pulse" />
            <span>Plant genuine seeds, secure honest harvest • Verified on Sepolia Testnet</span>
          </p>

          {/* Giant Bold Display Wordmark: "SeedSure" peeking above the sheet */}
          <div className="font-extrabold text-7xl sm:text-9xl md:text-[130px] lg:text-[160px] tracking-tight leading-none select-none opacity-95">
            <span className="text-white">Seed</span>
            <span className="text-[#6AB547]">Sure</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE FLOATING SHEET CARD (§11.1, §11.2, §11.5)        */}
      {/* Rounded 28px off-white #F7F8F3 card with wave pattern    */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="sheet-surface wave-pattern border border-[#E1E6DA] overflow-hidden relative">

          {/* ==================================================== */}
          {/* HERO SECTION WITH BOTANICAL ARTWORK & HIGHER-IMPACT TYPOGRAPHY */}
          {/* ==================================================== */}
          <div className="px-4 sm:px-10 lg:px-16 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center relative overflow-hidden">
            
            {/* Subtle Radiant Botanical Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#6AB547]/8 blur-[100px] rounded-full pointer-events-none" />

            {/* Botanical Leaf Art - Elegantly Aligned alongside the Headline with Interactive Sway */}
            <div className="hidden lg:block absolute left-3 xl:left-8 top-12 xl:top-14 w-28 h-48 xl:w-36 xl:h-60 pointer-events-auto opacity-90 animate-float-left leaf-interactive">
              <LeafDecor variant="branch" />
            </div>
            <div className="hidden lg:block absolute right-3 xl:right-8 top-12 xl:top-14 w-28 h-48 xl:w-36 xl:h-60 pointer-events-auto opacity-90 animate-float-right leaf-interactive">
              <LeafDecor variant="fern" />
            </div>

            {/* TagPill */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D2ECC3] shadow-[0_2px_10px_rgba(106,181,71,0.08)] text-xs font-bold text-[#1E4D2B] backdrop-blur-md hover:border-[#6AB547] transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6AB547] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6AB547]"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#6AB547]" />
                <span>Verified seeds • Cryptographically protected payments</span>
              </div>
            </div>

            {/* High-Impact Headline with Botanical Emphasis */}
            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-black leading-[1.1] tracking-tight max-w-4xl mx-auto text-[#121714]">
              Buy genuine seeds{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="bg-gradient-to-r from-[#2A6638] via-[#52A332] to-[#258540] bg-clip-text text-transparent">
                  with proof,
                </span>
                {/* Organic Botanical Curved Accent Underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#6AB547]/60 overflow-visible"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 2 8 C 45 2, 110 12, 198 4"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              not promises.
            </h1>

            {/* Subtitle */}
            <p className="mt-7 text-base sm:text-lg text-[#556359] max-w-2xl mx-auto leading-relaxed font-normal">
              Every seed lot is authenticated with a tamper-proof laboratory certificate on Ethereum. Your payment stays securely locked in escrow until you confirm healthy seedling viability.
            </p>

            {/* Dual CTAs with Trailing Arrow Chip */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <Link to="/marketplace">
                <PillButton
                  variant="primary"
                  size="lg"
                  withArrow
                  className="shadow-[0_8px_24px_rgba(106,181,71,0.28)] hover:shadow-[0_12px_32px_rgba(106,181,71,0.38)] hover:scale-[1.02] transition-all"
                >
                  Browse certified seeds
                </PillButton>
              </Link>
              <Link to="/verify/seed/1">
                <PillButton
                  variant="secondary"
                  size="lg"
                  withArrow
                  className="shadow-xs hover:shadow-md hover:border-[#6AB547] hover:bg-white hover:scale-[1.02] transition-all"
                >
                  Verify a seed batch
                </PillButton>
              </Link>
            </div>

            {/* Trust Assurance Micro-Notes */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-[#48554D]">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#E1E6DA] shadow-xs backdrop-blur-xs">
                <span className="w-4 h-4 rounded-full bg-[#EEF8F1] flex items-center justify-center text-[#2E9E57]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Zero advance risk for farmers</span>
              </span>
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#E1E6DA] shadow-xs backdrop-blur-xs">
                <span className="w-4 h-4 rounded-full bg-[#EEF8F1] flex items-center justify-center text-[#2E9E57]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>SHA-256 cryptographic QR tags</span>
              </span>
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#E1E6DA] shadow-xs backdrop-blur-xs">
                <span className="w-4 h-4 rounded-full bg-[#EEF8F1] flex items-center justify-center text-[#2E9E57]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>AI seller reliability gate</span>
              </span>
            </div>
          </div>

          {/* ==================================================== */}
          {/* TRUST-STAT STRIP (§11.5)                             */}
          {/* ==================================================== */}
          <div className="tint-sage border-y border-[#E1E6DA] px-4 sm:px-10 py-8 relative overflow-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
              <div className="p-3 scroll-reveal stagger-1 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6AB547]">
                  <Coins className="w-4 h-4" />
                  <span>Payment Protected</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#121714] mt-1">
                  Ξ {stats?.activeEscrowEth || "4.85"} ETH
                </p>
                <p className="text-[11px] text-[#5B665F]">
                  ≈ ₹13,58,000 INR held safely in escrow
                </p>
              </div>

              <div className="p-3 scroll-reveal stagger-2 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2F8F83]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lab Certified Lots</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#121714] mt-1">
                  {stats?.certifiedBatches || 9} Batches
                </p>
                <p className="text-[11px] text-[#5B665F]">
                  100% tamper-verified on blockchain
                </p>
              </div>

              <div className="p-3 scroll-reveal stagger-3 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E9A93B]">
                  <Building2 className="w-4 h-4" />
                  <span>Accredited Breeders</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#121714] mt-1">
                  {stats?.totalSellers || 3} Institutes
                </p>
                <p className="text-[11px] text-[#5B665F]">
                  Audited by Certification Authority
                </p>
              </div>

              <div className="p-3 scroll-reveal stagger-4 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E9E57]">
                  <Award className="w-4 h-4" />
                  <span>Farmer Satisfaction</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#121714] mt-1">
                  98.4%
                </p>
                <p className="text-[11px] text-[#5B665F]">
                  Zero dispute loss on certified seeds
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* THE PROBLEM: 3 CARDS (§11.5)                         */}
          {/* ==================================================== */}
          <div className="px-4 sm:px-10 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
            {/* Subtle botanical sprout accent on left margin */}
            <div className="hidden xl:block absolute left-2 top-8 w-20 h-36 opacity-35 -rotate-12 pointer-events-auto animate-float-left leaf-interactive">
              <LeafDecor variant="sprout" />
            </div>

            <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D8503F]">
                The Agricultural Crisis
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121714] mt-1">
                Why Millions of Farmers Suffer Crop Loss Every Season
              </h2>
              <p className="text-xs sm:text-sm text-[#5B665F] mt-2">
                Traditional seed supply chains leave farmers completely unprotected against counterfeits and delayed deliveries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-7 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs hover-subtle-lift space-y-3 scroll-reveal-scale stagger-1">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF1F0] border border-[#F7B8B2] flex items-center justify-center text-[#D8503F]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#121714]">
                  30%+ Spurious & Fake Seeds
                </h3>
                <p className="text-xs text-[#5B665F] leading-relaxed">
                  Unscrupulous traders pack grain leftovers into branded bags. By the time crops fail to germinate, the seller has disappeared with the money.
                </p>
              </div>

              <div className="p-7 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs hover-subtle-lift space-y-3 scroll-reveal-scale stagger-2">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF9EE] border border-[#FADFA8] flex items-center justify-center text-[#E9A93B]">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#121714]">
                  100% Advance Payment Scams
                </h3>
                <p className="text-xs text-[#5B665F] leading-relaxed">
                  Farmers are forced to pay before seeing the seed bags. When batches arrive damaged or with low germination, sellers refuse refunds.
                </p>
              </div>

              <div className="p-7 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs hover-subtle-lift space-y-3 scroll-reveal-scale stagger-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF3E6] border border-[#D2ECC3] flex items-center justify-center text-[#6AB547]">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#121714]">
                  Photocopied Lab Certificates
                </h3>
                <p className="text-xs text-[#5B665F] leading-relaxed">
                  Paper tags and test certificates are easily forged using basic printers. Farmers have no quick way to verify test numbers in real time.
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* HOW IT WORKS: 4-STEP ILLUSTRATED FLOW (§11.5)         */}
          {/* ==================================================== */}
          <div id="how-it-works" className="tint-sand border-y border-[#E1E6DA] px-4 sm:px-10 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
            {/* Subtle botanical spray accent on right margin */}
            <div className="hidden xl:block absolute right-3 top-8 w-24 h-40 opacity-40 rotate-12 pointer-events-auto animate-float-right leaf-interactive">
              <LeafDecor variant="spray" />
            </div>

            <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6AB547]">
                Simplified 4-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121714] mt-1">
                How SeedSure Guarantees Quality & Fair Payouts
              </h2>
              <p className="text-xs sm:text-sm text-[#5B665F] mt-2">
                Automated smart contracts replace blind trust with cryptographic certainty.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Certified Breeder Lists Lot",
                  desc: "Government-accredited laboratories inspect germination %, purity, and vigor. The cryptographic document hash is locked on Ethereum.",
                  icon: FileCheck2
                },
                {
                  step: "02",
                  title: "Payment Held Safely",
                  desc: "Farmer orders seed quantity. Funds are locked non-custodially in the smart escrow contract. The breeder cannot withdraw prematurely.",
                  icon: Lock
                },
                {
                  step: "03",
                  title: "Scan QR Bag Tag",
                  desc: "When the seed bag arrives, the farmer scans the physical QR tag. SeedSure re-hashes the lab file with SHA-256 to prove authenticity.",
                  icon: QrCode
                },
                {
                  step: "04",
                  title: "Confirm & Release",
                  desc: "Farmer verifies healthy seedling sprouting and clicks 'Confirm Delivery'. The escrow transfers payment and boosts the breeder's score.",
                  icon: Sprout
                }
              ].map((item, index) => {
                const ItemIcon = item.icon;
                const staggerClasses = ["stagger-1", "stagger-2", "stagger-3", "stagger-4"][index];
                return (
                  <div
                    key={item.step}
                    className={`p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs relative hover-subtle-lift scroll-reveal-scale ${staggerClasses}`}
                  >
                    <span className="text-2xl font-black text-[#E1E6DA] font-mono">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF3E6] text-[#6AB547] flex items-center justify-center my-3 shadow-2xs">
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-extrabold text-[#121714]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#5B665F] mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================================================== */}
          {/* TRUST SCORE EXPLAINER WITH LIVE CARD (§11.5)         */}
          {/* ==================================================== */}
          <div id="trust-score" className="px-4 sm:px-10 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-4 scroll-reveal">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6AB547]">
                  AI Multi-Factor Trust Engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#121714] leading-tight">
                  Seller Reliability Calculated from Real Facts, Not Advertisements
                </h2>
                <p className="text-sm text-[#5B665F] leading-relaxed">
                  Unlike traditional e-commerce reviews which can be bought or faked with bots, SeedSure calculates seller scores mathematically across 5 verified vectors:
                </p>

                <div className="space-y-2.5 text-xs text-[#121714]">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EEF3E6]">
                    <Check className="w-4 h-4 text-[#6AB547] shrink-0" />
                    <span><strong>Lab Certification Ratio (25%):</strong> Validated laboratory testing reports</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EEF3E6]">
                    <Check className="w-4 h-4 text-[#6AB547] shrink-0" />
                    <span><strong>On-Time Logistics (25%):</strong> Proven delivery within promised dates</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EEF3E6]">
                    <Check className="w-4 h-4 text-[#6AB547] shrink-0" />
                    <span><strong>Smart Escrow Gate (&lt;40):</strong> Sellers below 40 are automatically blocked</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/marketplace">
                    <PillButton variant="primary" size="md" withArrow>
                      View Top Rated Breeders
                    </PillButton>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 scroll-reveal-scale stagger-2">
                <TrustScoreCard
                  score={92}
                  sellerName="Punjab Agricultural Research Council (PARC)"
                  isVerified={true}
                  totalOrders={520}
                  metrics={{
                    labCertificationRatio: 0.98,
                    fulfillmentRate: 0.99,
                    completionRate: 0.97,
                    farmerRating: 4.9,
                    disputeLossRate: 0.01
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* ESCROW PROTECTION EXPLAINER WITH STEPPER (§11.5)     */}
          {/* ==================================================== */}
          <div className="tint-sage border-y border-[#E1E6DA] px-4 sm:px-10 lg:px-16 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto text-center mb-10 scroll-reveal">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6AB547]">
                Non-Custodial Smart Escrow
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121714] mt-1">
                Zero Advance Risk for Seed Buyers
              </h2>
              <p className="text-xs sm:text-sm text-[#5B665F] mt-2">
                Click any milestone in the order timeline below to see how the smart contract protects your harvest payment at each step.
              </p>
            </div>

            <div className="scroll-reveal-scale stagger-1">
              <StatusStepper currentStep="escrowed" />
            </div>
          </div>

          {/* ==================================================== */}
          {/* SEED VERIFICATION / QR TAG SECTION (§11.5)           */}
          {/* ==================================================== */}
          <div className="px-4 sm:px-10 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
            {/* Ambient Botanical Foliage */}
            <LeafDecor
              variant="fern"
              className="absolute -bottom-8 -right-8 w-44 h-44 opacity-15 pointer-events-none rotate-12 text-[#6AB547]"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-6 scroll-reveal-scale">
                <div className="p-8 rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs space-y-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5B665F] uppercase">
                      Physical Bag Security Tag
                    </span>
                    <VerifiedBadge isValid={true} showDetails={true} />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F7F8F3] border border-[#E1E6DA] flex items-center gap-4 hover:border-[#6AB547]/50 transition-colors">
                    <div className="w-20 h-20 bg-white p-2 rounded-xl border border-[#E1E6DA] flex items-center justify-center shrink-0 shadow-inner">
                      <QrCode className="w-16 h-16 text-[#121714]" />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-extrabold text-[#121714]">
                        Wheat HD-2967 (Foundation Seed)
                      </p>
                      <p className="text-[#5B665F]">Lot #PB-2026-0819</p>
                      <p className="font-mono text-[10px] text-[#6AB547]">
                        SHA-256: 0x9f4a...d7b2 (Verified)
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#5B665F] leading-relaxed">
                    Test the verification tool with your device camera or upload a test certificate to witness real-time cryptographic hash confirmation.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <PillButton
                      variant="dark"
                      size="sm"
                      withArrow
                      onClick={() => setExecutionModalOpen(true)}
                    >
                      Launch Real-Time Tamper Scanner
                    </PillButton>
                    <Link
                      to="/verify/seed/1"
                      className="text-xs font-semibold text-[#5B665F] hover:text-[#121714] underline underline-offset-2 transition-colors"
                    >
                      Open Public Portal
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4 scroll-reveal stagger-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6AB547]">
                  Instant Cryptographic Check
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#121714] leading-tight">
                  One Scan with Any Smartphone Detects Counterfeits Instantly
                </h2>
                <p className="text-sm text-[#5B665F] leading-relaxed">
                  Seed bags labeled with SeedSure QR codes cannot be forged. Even if a counterfeiter changes a single number (e.g. changing germination rate from 70% to 95%), the computed SHA-256 fingerprint changes entirely and fails the blockchain verification.
                </p>

                <div className="p-4 rounded-2xl bg-[#EEF3E6] border border-[#D2ECC3] text-xs text-[#121714] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2E9E57]" />
                    <span>No Special Scanner App Needed</span>
                  </p>
                  <p className="text-[#5B665F]">
                    Works with standard iPhone or Android camera apps, opening the public verification portal directly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* FOR FARMERS / FOR SELLERS TABS (§11.5)               */}
          {/* ==================================================== */}
          <div className="tint-sand border-y border-[#E1E6DA] px-4 sm:px-10 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
            {/* Ambient Leaf Accents */}
            <LeafDecor
              variant="sprout"
              className="absolute -top-6 -left-6 w-32 h-32 opacity-15 pointer-events-none -rotate-12"
            />
            <LeafDecor
              variant="spray"
              className="absolute -bottom-8 -right-8 w-36 h-36 opacity-15 pointer-events-none rotate-45"
            />

            <div className="text-center max-w-xl mx-auto mb-10 scroll-reveal relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B665F]">
                Tailored Experiences
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121714] mt-1">
                Built for Both Seed Buyers & Honest Producers
              </h2>
              
              <div className="inline-flex p-1.5 rounded-full bg-white border border-[#E1E6DA] mt-6 shadow-xs scroll-reveal stagger-1">
                <button
                  onClick={() => setActiveGuideTab("farmer")}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeGuideTab === "farmer"
                      ? "bg-[#6AB547] text-white shadow-xs"
                      : "text-[#5B665F] hover:text-[#121714]"
                  }`}
                >
                  For Farmers (Seed Buyers)
                </button>
                <button
                  onClick={() => setActiveGuideTab("seller")}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeGuideTab === "seller"
                      ? "bg-[#121714] text-white shadow-xs"
                      : "text-[#5B665F] hover:text-[#121714]"
                  }`}
                >
                  For Breeders & Sellers (Producers)
                </button>
              </div>
            </div>

            {activeGuideTab === "farmer" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
                <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs space-y-2 scroll-reveal stagger-1 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#6AB547] uppercase">Step 1</div>
                  <h4 className="font-extrabold text-[#121714]">Browse Certified Seed Varieties</h4>
                  <p className="text-xs text-[#5B665F]">Inspect laboratory germination %, genetic purity, and seller reliability score before purchasing.</p>
                </div>
                <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs space-y-2 scroll-reveal stagger-2 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#6AB547] uppercase">Step 2</div>
                  <h4 className="font-extrabold text-[#121714]">Safe Escrow Protection</h4>
                  <p className="text-xs text-[#5B665F]">Payment is safely locked in smart contract until you receive the seed bags and test seedling viability.</p>
                </div>
                <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs space-y-2 scroll-reveal stagger-3 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#6AB547] uppercase">Step 3</div>
                  <h4 className="font-extrabold text-[#121714]">Raise Dispute if Defective</h4>
                  <p className="text-xs text-[#5B665F]">Click 'Raise Dispute' anytime if germination fails to freeze funds for an arbitration refund.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
                <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs space-y-2 scroll-reveal stagger-1 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#121714] uppercase">Step 1</div>
                  <h4 className="font-extrabold text-[#121714]">Institutional Accreditation</h4>
                  <p className="text-xs text-[#5B665F]">Submit research credentials and obtain Certification Authority verification on-chain.</p>
                </div>
                <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs space-y-2 scroll-reveal stagger-2 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#121714] uppercase">Step 2</div>
                  <h4 className="font-extrabold text-[#121714]">Upload Lab Test Certificates</h4>
                  <p className="text-xs text-[#5B665F]">Smart contracts generate cryptographic QR tags to label your physical seed packages.</p>
                </div>
                <div className="p-6 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs space-y-2 scroll-reveal stagger-3 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#121714] uppercase">Step 3</div>
                  <h4 className="font-extrabold text-[#121714]">Instant Payout & Score Boost</h4>
                  <p className="text-xs text-[#5B665F]">When delivery is confirmed, smart escrow unlocks payment automatically and boosts your trust score.</p>
                </div>
              </div>
            )}

            <div className="text-center mt-8 scroll-reveal stagger-2 relative z-10">
              <PillButton
                variant={activeGuideTab === "farmer" ? "primary" : "dark"}
                size="md"
                withArrow
                onClick={() =>
                  handlePortalQuickAccess(
                    activeGuideTab === "farmer" ? "farmer" : "seller",
                    activeGuideTab === "farmer" ? "/farmer" : "/seller"
                  )
                }
              >
                {activeGuideTab === "farmer" ? "Launch Farmer Portal" : "Launch Breeder Hub"}
              </PillButton>
            </div>
          </div>

          {/* ==================================================== */}
          {/* FAQ ACCORDION (§11.5)                                */}
          {/* ==================================================== */}
          <div id="faq" className="px-4 sm:px-10 lg:px-16 py-16 sm:py-20 relative overflow-hidden">
            <LeafDecor
              variant="fern"
              className="absolute top-1/3 -left-10 w-44 h-44 opacity-15 pointer-events-none -rotate-45"
            />

            <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B665F]">
                Clear Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121714] mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3 relative z-10">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className={`p-5 rounded-[20px] bg-white border border-[#E1E6DA] shadow-xs transition-all scroll-reveal stagger-${(index % 4) + 1} hover:border-[#6AB547]/50`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-sm font-extrabold text-[#121714]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#5B665F] shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-[#6AB547]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-3 pt-3 border-t border-[#F1EFE6] text-xs text-[#5B665F] leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================================================== */}
          {/* CTA BAND IN DEEP GREEN (§11.5)                      */}
          {/* ==================================================== */}
          <div className="bg-[#163A24] text-white px-6 sm:px-12 py-16 sm:py-20 text-center relative overflow-hidden">
            {/* Ambient Foliage Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#6AB547]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2E9E57]/10 blur-[100px] rounded-full pointer-events-none" />

            <LeafDecor
              variant="monstera"
              className="absolute -top-12 -right-12 w-52 h-52 opacity-20 pointer-events-none text-emerald-400 rotate-12"
            />
            <LeafDecor
              variant="spray"
              className="absolute -bottom-10 -left-10 w-44 h-44 opacity-20 pointer-events-none text-lime-400 -rotate-45"
            />

            <div className="max-w-3xl mx-auto relative z-10 space-y-5 scroll-reveal-scale">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#6AB547] text-xs font-bold border border-white/10 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join the Honest Agricultural Network</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Start Purchasing Certified Seeds with Zero Upfront Risk Today
              </h2>
              <p className="text-xs sm:text-sm text-[#A2B1A8] max-w-xl mx-auto leading-relaxed">
                Connect with accredited breeders across India and protect every rupee of your hard-earned harvest investment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link to="/marketplace">
                  <PillButton variant="primary" size="lg" withArrow>
                    Explore Seed Marketplace
                  </PillButton>
                </Link>
                <Link to="/login">
                  <PillButton variant="secondary" size="lg">
                    Login with Kisan ID
                  </PillButton>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DEEP GREEN FOOTER (§11.5)                            */}
      {/* ======================================================== */}
      <footer className="bg-[#163A24] text-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-12 border-t border-[#2A4D35]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#2A4D35]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6AB547] text-white flex items-center justify-center font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Seed<span className="text-[#6AB547]">Sure</span>
                </span>
                <p className="text-[11px] text-[#A2B1A8]">
                  Smart Seed Quality & Seller Trust Platform in AgriTech
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#E1E6DA]">
              <Award className="w-4 h-4 text-[#6AB547]" />
              <span>Target IEEE Research Prototype • Ethereum Sepolia Testnet</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A2B1A8]">
            <p>
              Built for Farmer Protection & Seed Viability • Solidity + Ethers v6 + ML Multi-Factor Trust
            </p>
            <div className="flex items-center gap-5">
              <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
              <Link to="/farmer" className="hover:text-white transition-colors">Farmer Portal</Link>
              <Link to="/seller" className="hover:text-white transition-colors">Breeder Hub</Link>
              <Link to="/admin" className="hover:text-white transition-colors">CA Console</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Execution Protocol & Sprout Button Modal (§11.5) */}
      <ExecutionStepsModal
        isOpen={executionModalOpen}
        onClose={() => setExecutionModalOpen(false)}
        title="Live Tamper Scanner & Cryptographic Verification"
        batchNumber="Wheat HD-2967 // PB-2026-0819"
      />
    </div>
  );
};
