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
  let colorClass = "bg-[#48A741]/20 text-[#48A741] border-[#48A741]/30";
  let label = riskCategory || "Trusted";
  let Icon = ShieldCheck;

  if (score >= 90) {
    colorClass = "bg-[#48A741]/20 text-[#48A741] border-[#48A741]/40";
    label = riskCategory || "Excellent";
    Icon = ShieldCheck;
  } else if (score >= 75) {
    colorClass = "bg-teal-950/60 text-teal-300 border-teal-700/50";
    label = riskCategory || "Trusted";
    Icon = ShieldCheck;
  } else if (score >= 60) {
    colorClass = "bg-amber-950/60 text-amber-300 border-amber-700/50";
    label = riskCategory || "Moderate";
    Icon = AlertTriangle;
  } else if (score >= 40) {
    colorClass = "bg-orange-950/60 text-orange-300 border-orange-700/50";
    label = riskCategory || "Low Trust";
    Icon = ShieldAlert;
  } else {
    colorClass = "bg-rose-950/60 text-rose-300 border-rose-700/50";
    label = riskCategory || "High Risk";
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
