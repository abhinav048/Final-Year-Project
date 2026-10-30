import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface TrustBadgeProps {
  score: number;
  riskCategory?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  score,
  riskCategory,
  size = "md",
  showLabel = true
}) => {
  let colorClass = "bg-[#EEF8F1] text-[#2E9E57] border-[#B8E4C7]";
  let label = riskCategory || "Trusted";
  let Icon = ShieldCheck;

  if (riskCategory === "New Seller – Insufficient Data" || riskCategory === "New Seller") {
    colorClass = "bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB]";
    label = "New Seller";
    Icon = AlertTriangle;
  } else if (score >= 90 || riskCategory === "Highly Trusted" || riskCategory === "Excellent") {
    colorClass = "bg-[#EEF8F1] text-[#2E9E57] border-[#B8E4C7]";
    label = riskCategory || "Highly Trusted";
    Icon = ShieldCheck;
  } else if (score >= 75 || riskCategory === "Trusted") {
    colorClass = "bg-[#EEF3E6] text-[#6AB547] border-[#C5E1A5]";
    label = riskCategory || "Trusted";
    Icon = ShieldCheck;
  } else if (score >= 60 || riskCategory === "Average" || riskCategory === "Moderate") {
    colorClass = "bg-[#FEF9EE] text-[#E9A93B] border-[#FADFA8]";
    label = riskCategory || "Average";
    Icon = AlertTriangle;
  } else if (score >= 40 || riskCategory === "Low Trust" || riskCategory === "Low") {
    colorClass = "bg-[#FFF7ED] text-[#EA580C] border-[#FDBA74]";
    label = riskCategory || "Low Trust";
    Icon = ShieldAlert;
  } else {
    colorClass = "bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]";
    label = riskCategory || "Poor Trust";
    Icon = ShieldAlert;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-bold"
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-semibold border shadow-sm transition-all ${colorClass} ${sizeClasses[size]}`}
      title={`AI Seller Trust Score: ${score}/100 (${label})`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      <span className="font-bold">{score}/100</span>
      {showLabel && (
        <>
          <span className="text-slate-400 font-normal">|</span>
          <span className="font-medium">{label}</span>
        </>
      )}
    </div>
  );
};
