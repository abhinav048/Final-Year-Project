import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export interface VerifiedBadgeProps {
  isValid?: boolean;
  tamperDetected?: boolean;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  isValid = true,
  tamperDetected = false,
  size = "md",
  showDetails = false,
  className = ""
}) => {
  const isOk = isValid && !tamperDetected;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-3.5 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm"
  }[size];

  if (isOk) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full bg-[#EEF8F1] border border-[#B8E4C7] text-[#2E9E57] font-bold ${sizeClasses} ${className}`}
        title="SHA-256 digital fingerprint verified against on-chain smart contract"
      >
        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E9E57]" />
        <span>Certificate matches blockchain record</span>
        {showDetails && (
          <span className="text-[10px] text-[#5B665F] font-normal ml-1">
            (Tamper-Proof)
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#FDF1F0] border border-[#F7B8B2] text-[#D8503F] font-extrabold animate-pulse ${sizeClasses} ${className}`}
      title="Fingerprint mismatch: Document was altered after lab certification"
    >
      <AlertTriangle className="w-4 h-4 shrink-0 text-[#D8503F]" />
      <span>Document changed — do not trust</span>
      {showDetails && (
        <span className="text-[10px] text-[#D8503F] font-bold ml-1">
          (Tamper Flagged)
        </span>
      )}
    </div>
  );
};
