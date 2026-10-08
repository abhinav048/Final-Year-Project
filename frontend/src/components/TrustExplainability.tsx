import React from "react";
import { TrustExplanation } from "../types";
import { TrustBadge } from "./TrustBadge";
import { Info, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, Hash } from "lucide-react";

interface TrustExplainabilityProps {
  explanation?: TrustExplanation;
}

export const TrustExplainability: React.FC<TrustExplainabilityProps> = ({ explanation }) => {
  if (!explanation) {
    return (
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0a1f11] text-xs text-slate-400">
        Trust explainability parameters loading...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#48A741]/20 bg-[#0a1f11] p-5 shadow-xl space-y-4 text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#48A741]/15">
        <div>
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            Why This Trust Score?
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#07130b] text-[#48A741] border border-[#48A741]/30 font-normal">
              {explanation.modelVersion}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time multi-factor explainability calculated from tamper-proof on-chain performance records.
          </p>
        </div>
        <TrustBadge score={explanation.trustScore} riskCategory={explanation.riskCategory} size="lg" />
      </div>

      {/* Feature Contributions Breakdown */}
      <div className="space-y-3">
        {explanation.breakdown.map((item, idx) => {
          const isPositive = item.impact === "positive";
          const isNegative = item.impact === "negative";

          return (
            <div key={idx} className="p-3.5 rounded-xl bg-[#07130b] border border-slate-800 hover:border-[#48A741]/40 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  {item.factor}
                  <span className="text-[10px] text-slate-400 font-normal">({item.weightPercent}% weight)</span>
                </span>
                <span className="font-mono font-bold text-[#48A741]">
                  +{item.scoreContribution} pts
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isPositive ? "bg-[#48A741]" : isNegative ? "bg-rose-500" : "bg-amber-500"
                    }`}
                  style={{ width: `${Math.min(100, (item.scoreContribution / (item.weightPercent * 0.25 || 1)) * 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">{item.explanation}</span>
                <span className="font-mono text-slate-400 text-[10px] bg-[#0a1f11] px-1.5 py-0.5 rounded border border-slate-800">
                  {item.rawMetric}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* On-Chain Verification Audit Footer */}
      <div className="pt-2 border-t border-[#48A741]/15 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-[#48A741]" />
          <span className="font-medium text-slate-300">Features Vector Hash:</span>
          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[160px] sm:max-w-[260px]">
            {explanation.featuresHash}
          </span>
        </div>
        <span className="text-[10px] text-[#48A741] font-semibold bg-[#48A741]/15 px-2.5 py-0.5 rounded-full border border-[#48A741]/30">
          Auditable on-chain
        </span>
      </div>
    </div>
  );
};
