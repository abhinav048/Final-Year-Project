import React, { useEffect, useState } from "react";
import { Sprout, ShieldCheck, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 1000
}) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Initializing SeedSure Ledger...");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Verifying ICAR Lab Certificates & SHA-256 Hashes...");
    }, 300);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText("Loading Dynamic ML Trust Scores & Escrow State...");
    }, 650);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Decentralized Seed Network Ready!");
      setFadeOut(true);
    }, minDurationMs);

    const timer4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, minDurationMs + 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [minDurationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md transition-opacity duration-300 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center space-y-6">

        {/* Glowing Pulsing Concentric Rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping"></div>
          <div className="absolute w-24 h-24 rounded-full bg-emerald-500/30 animate-pulse-glow"></div>

          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-forest-800 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 animate-float">
            <Sprout className="w-10 h-10 text-emerald-100" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: "6s" }} />
          </div>
        </div>

        {/* Brand & Loading Status */}
        <div className="space-y-2">
          <h2 className="font-display font-black text-2xl text-white tracking-tight flex items-center justify-center gap-2">
            Seed<span className="text-emerald-400">Sure</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Web3 AgriTech
            </span>
          </h2>
          <p className="text-xs text-slate-300 font-medium h-4 transition-all">
            {statusText}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-64 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700 relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-300 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 animate-shimmer"></div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Smart Contract Quality & Trust Verification</span>
        </div>

      </div>
    </div>
  );
};
