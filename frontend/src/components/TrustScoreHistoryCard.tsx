import React from "react";
import { ScoreHistoryRecord, ScoreBreakdownItem } from "../types";
import {
  TrendingUp,
  ShieldCheck,
  Clock,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Hash,
  Activity,
  ArrowRight
} from "lucide-react";

interface TrustScoreHistoryCardProps {
  score: number;
  trustCategory?: string;
  confidenceLevel?: string;
  dataCoveragePercent?: number;
  recommendations?: string[];
  history?: ScoreHistoryRecord[];
  breakdown?: ScoreBreakdownItem[];
  onRecalculate?: () => void;
  isRecalculating?: boolean;
}

export const TrustScoreHistoryCard: React.FC<TrustScoreHistoryCardProps> = ({
  score,
  trustCategory = "Trusted",
  confidenceLevel = "Moderate",
  dataCoveragePercent = 85,
  recommendations = [],
  history = [],
  breakdown = [],
  onRecalculate,
  isRecalculating = false
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner: Trust Score Circular Indicator + Data Coverage */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Circular Score Gauge */}
          <div className="relative w-28 h-28 rounded-full border-4 border-[#6AB547]/30 bg-[#EEF8F1] flex flex-col items-center justify-center shrink-0 shadow-inner">
            <span className="font-black text-4xl text-[#2E9E57] leading-none">{score}</span>
            <span className="text-[10px] font-bold text-[#5B665F] uppercase mt-1">Trust Score</span>
            <span className="text-[9px] text-[#2E9E57] font-semibold">/ 100</span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF3E6] text-[#6AB547] border border-[#C5E1A5]">
                {trustCategory}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F7F8F3] text-[#5B665F] border border-[#E1E6DA]">
                Confidence: {confidenceLevel}
              </span>
            </div>

            <h3 className="font-extrabold text-xl text-[#121714]">
              Dynamic Seller Trust Engine
            </h3>
            <p className="text-xs text-[#5B665F] max-w-lg">
              Evaluated continuously across 6 verified dimensions including historical AI visual seed quality, laboratory certifications, delivery performance, transactions, feedback, and complaint history.
            </p>
          </div>
        </div>

        {/* Coverage Meter & Recalculate */}
        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3 shrink-0">
          <div className="text-left md:text-right space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#121714]">
              <Activity className="w-3.5 h-3.5 text-[#6AB547]" />
              <span>Data Coverage: {dataCoveragePercent}%</span>
            </div>
            <div className="w-36 h-2 rounded-full bg-[#EEF3E6] overflow-hidden">
              <div
                style={{ width: `${dataCoveragePercent}%` }}
                className="h-full rounded-full bg-[#6AB547] transition-all duration-500"
              />
            </div>
            <span className="text-[10px] text-[#5B665F]">6 of 6 metrics audited</span>
          </div>

          {onRecalculate && (
            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="text-xs font-bold px-4 py-2 rounded-full bg-[#F7F8F3] hover:bg-[#EEF3E6] border border-[#E1E6DA] text-[#121714] cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className={`w-3.5 h-3.5 text-[#6AB547] ${isRecalculating ? "animate-spin" : ""}`} />
              <span>{isRecalculating ? "Recalculating..." : "Recalculate Trust"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Parameter-Wise Breakdown (6 Parameters §6) */}
      {breakdown && breakdown.length > 0 && (
        <div className="p-6 rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs space-y-4">
          <h4 className="font-extrabold text-sm text-[#121714] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6AB547]" />
            Six-Parameter Verified Scoring Breakdown
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {breakdown.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#F7F8F3] border border-[#E1E6DA] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#121714]">
                    {item.factor}
                    <span className="text-[11px] text-[#5B665F] font-normal ml-1">({item.weightPercent}%)</span>
                  </span>
                  <span className="font-mono font-black text-[#6AB547]">
                    +{item.scoreContribution} pts
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#E1E6DA] overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (item.scoreContribution / (item.weightPercent * 0.25 || 1)) * 100)}%` }}
                    className={`h-full rounded-full ${
                      item.impact === "positive" ? "bg-[#2E9E57]" : item.impact === "negative" ? "bg-[#D32F2F]" : "bg-[#E9A93B]"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#5B665F]">
                  <span className="truncate pr-2">{item.explanation}</span>
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#E1E6DA] shrink-0">
                    {item.rawMetric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Recommendations Based on Weak Parameters (§8) */}
      {recommendations && recommendations.length > 0 && (
        <div className="p-6 rounded-[24px] bg-[#FEF9EE] border border-[#FADFA8] shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-sm text-[#7A5A18]">
            <Lightbulb className="w-4 h-4 text-[#E9A93B]" />
            <span>Actionable Trust Improvement Recommendations</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/80 border border-[#FADFA8] text-xs text-[#7A5A18] flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#E9A93B] shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust Score History Table (§7: Date, Previous Score, New Score, Reason) */}
      <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1EFE6] flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-[#121714] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6AB547]" />
            Auditable Trust Score Recalculation History
          </h4>
          <span className="text-xs text-[#5B665F] font-semibold">
            {history.length} On-Chain Stamped Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F3] text-[#5B665F] font-bold border-b border-[#E1E6DA]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-center">Score Transition</th>
                <th className="py-3 px-4">Recalculation Trigger & Reason</th>
                <th className="py-3 px-4 text-right">Cryptographic Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE6]">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#5B665F]">
                    No historical score recalculations logged yet.
                  </td>
                </tr>
              ) : (
                history.map((h, i) => (
                  <tr key={h.id || i} className="hover:bg-[#F7F8F3] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#5B665F]">
                      {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-[#5B665F]">
                        {h.previousScore ?? 50}
                      </span>
                      <span className="mx-1.5 text-[#6AB547] font-bold">→</span>
                      <span className="font-mono font-extrabold text-[#121714] bg-[#EEF3E6] px-2 py-0.5 rounded-full text-xs">
                        {h.score}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#121714] block">
                        {h.reason || h.triggerEvent}
                      </span>
                      <span className="text-[10px] text-[#5B665F] uppercase font-mono">
                        Event: {h.triggerEvent}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono text-[10px] text-[#5B665F] bg-[#F7F8F3] px-2 py-1 rounded border border-[#E1E6DA]">
                        {h.featuresHash ? `${h.featuresHash.slice(0, 10)}...` : "Audited"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
