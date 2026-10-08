import React, { useState } from "react";
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  Info,
  CheckCircle2,
  FileCheck2,
  Truck,
  RotateCcw,
  Star
} from "lucide-react";

export interface TrustScoreCardProps {
  score: number;
  sellerName?: string;
  isVerified?: boolean;
  totalOrders?: number;
  metrics?: {
    labCertificationRatio?: number; // e.g. 0.95
    fulfillmentRate?: number;       // e.g. 0.98
    completionRate?: number;        // e.g. 0.96
    farmerRating?: number;          // e.g. 4.8 / 5
    disputeLossRate?: number;       // e.g. 0.01
  };
  className?: string;
}

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({
  score = 88,
  sellerName = "National Seed Research Center",
  isVerified = true,
  totalOrders = 340,
  metrics = {
    labCertificationRatio: 0.96,
    fulfillmentRate: 0.98,
    completionRate: 0.95,
    farmerRating: 4.8,
    disputeLossRate: 0.02
  },
  className = ""
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Trust tier evaluation
  const getTrustTier = (val: number) => {
    if (val >= 80) {
      return {
        label: "Excellent Reliability",
        sublabel: "Top-tier verified breeder",
        color: "#2E9E57",
        bgColor: "#EEF8F1",
        borderColor: "#B8E4C7",
        icon: Award
      };
    }
    if (val >= 70) {
      return {
        label: "Trusted Breeder",
        sublabel: "Strong track record of quality",
        color: "#6AB547",
        bgColor: "#F1F8ED",
        borderColor: "#D2ECC3",
        icon: ShieldCheck
      };
    }
    if (val >= 55) {
      return {
        label: "Moderate Reliability",
        sublabel: "Meets baseline criteria",
        color: "#E9A93B",
        bgColor: "#FEF9EE",
        borderColor: "#FADFA8",
        icon: Info
      };
    }
    if (val >= 40) {
      return {
        label: "Low Reliability",
        sublabel: "Requires closer inspection",
        color: "#E27B3C",
        bgColor: "#FDF4EE",
        borderColor: "#F6C8A8",
        icon: AlertTriangle
      };
    }
    return {
      label: "High Risk — Gated",
      sublabel: "Blocked by smart contract",
      color: "#D8503F",
      bgColor: "#FDF1F0",
      borderColor: "#F7B8B2",
      icon: AlertTriangle
    };
  };

  const tier = getTrustTier(score);
  const TierIcon = tier.icon;

  // Ring gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const tooltipExplanations: Record<string, string> = {
    lab: "Percentage of seed lots backed by certified government or accredited lab testing documents.",
    logistics: "Percentage of seed orders dispatched and delivered strictly within agreed timeframes.",
    completion: "Percentage of escrow transactions concluded successfully with farmer satisfaction.",
    rating: "Average rating from verified buyer farmers on the decentralized feedback registry.",
    dispute: "Percentage of orders where disputes were resolved against the seller due to viability defects."
  };

  return (
    <div
      className={`bg-white rounded-[20px] border border-[#E1E6DA] p-6 shadow-[0_4px_20px_rgba(15,42,29,0.05)] ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E1E6DA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B665F]">
              Seller Reliability Score
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveTooltip(activeTooltip === "score" ? null : "score")
                }
                className="text-[#5B665F] hover:text-[#121714] cursor-pointer"
                title="What is this?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeTooltip === "score" && (
                <div className="absolute left-0 mt-1 w-64 p-2.5 bg-[#121714] text-white text-[11px] rounded-xl shadow-xl z-20">
                  <p className="font-medium">
                    This score is computed continuously by an AI Multi-Factor Trust Engine using verified blockchain records. It cannot be bought or manipulated.
                  </p>
                </div>
              )}
            </div>
          </div>
          <h4 className="text-base font-extrabold text-[#121714] mt-0.5 truncate">
            {sellerName}
          </h4>
        </div>

        {/* Category Badge */}
        <div
          style={{
            backgroundColor: tier.bgColor,
            borderColor: tier.borderColor,
            color: tier.color
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0"
        >
          <TierIcon className="w-3.5 h-3.5" />
          <span>{tier.label}</span>
        </div>
      </div>

      {/* Main Gauge + Overview */}
      <div className="py-5 flex items-center justify-between gap-6">
        {/* Ring Gauge */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#EEF3E6"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={tier.color}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-extrabold text-2xl text-[#121714] leading-none">
              {score}
            </span>
            <span className="text-[10px] text-[#5B665F] font-semibold mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Stat Highlights */}
        <div className="space-y-1.5 flex-1 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#F1EFE6]">
            <span className="text-[#5B665F]">Accreditation:</span>
            <span className="font-bold text-[#121714]">
              {isVerified ? "CA Certified Lab" : "Standard Registered"}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#F1EFE6]">
            <span className="text-[#5B665F]">Completed Orders:</span>
            <span className="font-bold text-[#121714]">
              {totalOrders} Escrow Orders
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#5B665F]">Smart Contract Gate:</span>
            <span
              className={`font-bold ${
                score >= 40 ? "text-[#2E9E57]" : "text-[#D8503F]"
              }`}
            >
              {score >= 40 ? "Allowed to Sell" : "Suspended (<40)"}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable "Why this score?" Breakdown */}
      <div className="pt-2 border-t border-[#E1E6DA]">
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-[#121714] hover:text-[#6AB547] cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <span>Why this score?</span>
            <span className="text-[11px] font-normal text-[#5B665F]">
              (5 mathematical factors)
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#5B665F] transition-transform ${
              showBreakdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {showBreakdown && (
          <div className="mt-3 pt-3 border-t border-[#F1EFE6] space-y-3 text-xs animate-in fade-in duration-200">
            {/* Factor 1: Lab Certification */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#5B665F] flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#6AB547]" />
                  <span>Lab Testing Verification (25%)</span>
                </span>
                <span className="font-bold text-[#121714]">
                  {Math.round((metrics.labCertificationRatio || 0.96) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#EEF3E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6AB547] rounded-full"
                  style={{
                    width: `${Math.round(
                      (metrics.labCertificationRatio || 0.96) * 100
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Factor 2: Fulfillment */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#5B665F] flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#2F8F83]" />
                  <span>On-Time Delivery (25%)</span>
                </span>
                <span className="font-bold text-[#121714]">
                  {Math.round((metrics.fulfillmentRate || 0.98) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#EEF3E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2F8F83] rounded-full"
                  style={{
                    width: `${Math.round(
                      (metrics.fulfillmentRate || 0.98) * 100
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Factor 3: Completion */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#5B665F] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9E57]" />
                  <span>Transaction Success (20%)</span>
                </span>
                <span className="font-bold text-[#121714]">
                  {Math.round((metrics.completionRate || 0.95) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#EEF3E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2E9E57] rounded-full"
                  style={{
                    width: `${Math.round(
                      (metrics.completionRate || 0.95) * 100
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Factor 4: Farmer Reviews */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#5B665F] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#E9A93B]" />
                  <span>Farmer Satisfaction (15%)</span>
                </span>
                <span className="font-bold text-[#121714]">
                  {(metrics.farmerRating || 4.8).toFixed(1)} / 5.0
                </span>
              </div>
              <div className="w-full h-2 bg-[#EEF3E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E9A93B] rounded-full"
                  style={{
                    width: `${((metrics.farmerRating || 4.8) / 5) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Factor 5: Dispute History */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#5B665F] flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#5B665F]" />
                  <span>Zero Dispute Record (15%)</span>
                </span>
                <span className="font-bold text-[#121714]">
                  {100 - Math.round((metrics.disputeLossRate || 0.02) * 100)}% Clean
                </span>
              </div>
              <div className="w-full h-2 bg-[#EEF3E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6AB547] rounded-full"
                  style={{
                    width: `${
                      100 - Math.round((metrics.disputeLossRate || 0.02) * 100)
                    }%`
                  }}
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#EEF3E6] text-[11px] text-[#5B665F] leading-relaxed">
              <span className="font-bold text-[#121714]">Plain explanation: </span>
              Breeders earn high scores by shipping high-germination seed lots verified by laboratory certificates and maintaining low dispute counts.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
