import React, { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, Activity, Dna, CheckCircle2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 2200
}) => {
  const [progress, setProgress] = useState(12);
  const [stageIndex, setStageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const stages = [
    {
      title: "Calibrating Optical Seed Spectroscopy...",
      code: "SPEC_SCAN // SHA-256 GENOME MATRIX",
      metric: "VIABILITY: 98.8%"
    },
    {
      title: "Inspecting Embryo Moisture & Seedling Vigor...",
      code: "ICAR_STD // HYDRO_INDEX: OPTIMAL",
      metric: "GERMINATION: 99.2%"
    },
    {
      title: "Verifying ICAR Cryptographic Laboratory Hashes...",
      code: "ORACLE_VERIFY // ZERO_TAMPER_CERT",
      metric: "CERT: VERIFIED"
    },
    {
      title: "Synchronizing Sepolia Agri-Ledger & Escrow Gate...",
      code: "SMART_ESCROW // CONTRACT_LOCKED",
      metric: "LEDGER: SYNCED"
    },
    {
      title: "SeedSure AgriTech Ecosystem Ready • Welcome!",
      code: "STATUS: HARVEST_PROTECTED",
      metric: "SYSTEM: ONLINE"
    }
  ];

  useEffect(() => {
    const stepDuration = minDurationMs / 4;

    const t1 = setTimeout(() => {
      setProgress(38);
      setStageIndex(1);
    }, stepDuration * 0.9);

    const t2 = setTimeout(() => {
      setProgress(68);
      setStageIndex(2);
    }, stepDuration * 1.8);

    const t3 = setTimeout(() => {
      setProgress(92);
      setStageIndex(3);
    }, stepDuration * 2.7);

    const t4 = setTimeout(() => {
      setProgress(100);
      setStageIndex(4);
      setFadeOut(true);
    }, minDurationMs);

    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, minDurationMs + 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [minDurationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07130C] text-white transition-opacity duration-500 overflow-hidden select-none ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      {/* Background High-Tech Agricultural Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,_rgba(106,181,71,0.18)_0%,_transparent_65%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#6AB547 1px, transparent 1px), linear-gradient(90deg, #6AB547 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center space-y-7">

        {/* Holographic Germination Scanner Centerpiece */}
        <div className="relative flex items-center justify-center w-52 h-52">

          {/* Outer Rotating HUD Telemetry Ring */}
          <div
            className="absolute inset-0 rounded-full border border-emerald-500/20 border-dashed animate-spin"
            style={{ animationDuration: "24s" }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 border-r-transparent animate-spin"
            style={{ animationDuration: "10s", animationDirection: "reverse" }}
          />

          {/* Glowing Ambient Ring */}
          <div className="absolute inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

          {/* Central Glassmorphic Bio-Chamber */}
          <div className="relative w-36 h-36 rounded-full bg-[#0D2418]/90 border border-emerald-500/40 shadow-[0_0_40px_rgba(106,181,71,0.25)] flex items-center justify-center overflow-hidden">

            {/* Vertical Spectroscopy Scanning Laser Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_12px_#6AB547] animate-[scannerBeam_2.4s_ease-in-out_infinite]" />

            {/* SVG Germinating Botanical Seed with Roots & Cotyledon Leaves */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 drop-shadow-[0_4px_10px_rgba(46,111,64,0.4)]"
            >
              <defs>
                <linearGradient id="seedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E9C46A" />
                  <stop offset="100%" stopColor="#C4883A" />
                </linearGradient>
                <linearGradient id="sproutGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#437E36" />
                  <stop offset="50%" stopColor="#6AB547" />
                  <stop offset="100%" stopColor="#A3E635" />
                </linearGradient>
              </defs>

              {/* Fertile Soil Bed Base */}
              <ellipse cx="50" cy="74" rx="28" ry="6" fill="#1A3A25" fillOpacity="0.8" />
              <path d="M 30 74 Q 50 71 70 74" stroke="#4A8C40" strokeWidth="1" strokeDasharray="2 2" />

              {/* Root Filaments branching down into digital soil */}
              <path
                d="M 50 68 C 50 76, 44 82, 38 88"
                stroke="#A3E635"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="opacity-75"
              />
              <path
                d="M 50 68 C 50 78, 54 84, 58 90"
                stroke="#A3E635"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="opacity-75"
              />
              <path
                d="M 50 72 C 48 78, 50 82, 49 89"
                stroke="#86EFAC"
                strokeWidth="1"
                strokeLinecap="round"
                className="opacity-60"
              />

              {/* Seed Coat with Cryptographic Node Dot */}
              <path
                d="M 50 68 C 43 68, 38 60, 44 52 C 50 45, 56 52, 62 60 C 64 66, 57 68, 50 68 Z"
                fill="url(#seedGrad)"
                stroke="#F4A261"
                strokeWidth="1.2"
              />
              <circle cx="50" cy="58" r="2" fill="#FFFFFF" fillOpacity="0.8" />

              {/* Rising Vibrant Stem */}
              <path
                d="M 50 52 C 50 38, 49 28, 50 18"
                stroke="url(#sproutGrad)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Left Unfurling Cotyledon Leaf */}
              <g className="origin-[50px_28px] animate-[swayLeafLeft_3s_ease-in-out_infinite]">
                <path
                  d="M 50 28 C 36 22, 22 28, 26 40 C 38 46, 48 38, 50 28 Z"
                  fill="url(#sproutGrad)"
                  stroke="#2E6F40"
                  strokeWidth="1.2"
                />
                <path d="M 50 28 C 38 34, 30 38, 26 40" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.6" />
              </g>

              {/* Right Unfurling Cotyledon Leaf */}
              <g className="origin-[50px_22px] animate-[swayLeafRight_3s_ease-in-out_infinite]">
                <path
                  d="M 50 22 C 64 16, 78 22, 74 34 C 62 40, 52 32, 50 22 Z"
                  fill="url(#sproutGrad)"
                  stroke="#2E6F40"
                  strokeWidth="1.2"
                />
                <path d="M 50 22 C 62 28, 70 32, 74 34" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.6" />
              </g>

              {/* Tender Baby Shoot Tip */}
              <circle cx="50" cy="17" r="2" fill="#A3E635" className="animate-ping" style={{ animationDuration: "2s" }} />
            </svg>

            {/* Corner Crop Marks (AgriTech HUD) */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-emerald-400/80" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-emerald-400/80" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-emerald-400/80" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-emerald-400/80" />
          </div>

          {/* Micro Telemetry Tags positioned around the circle */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#0D2418] border border-emerald-500/40 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            <span>BIO_TELEMETRY: ACTIVE</span>
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0D2418] border border-emerald-500/40 text-[9px] font-mono text-emerald-300 flex items-center gap-1 shadow-sm">
            <Dna className="w-2.5 h-2.5 text-emerald-400" />
            <span>{stages[stageIndex].metric}</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Smart Seed Quality & Blockchain Escrow</span>
          </div>
          <h2 className="font-extrabold text-2xl text-white tracking-tight">
            Seed<span className="text-[#6AB547]">Sure</span>
            <span className="text-xs font-mono font-normal text-emerald-300 ml-2 px-1.5 py-0.5 rounded bg-emerald-900/50 border border-emerald-800/60">
              v1.0.4 [SEPOLIA]
            </span>
          </h2>
        </div>

        {/* Active Stage Diagnostic Text */}
        <div className="space-y-1.5 min-h-[52px]">
          <p className="text-sm font-semibold text-emerald-100 transition-all duration-200">
            {stages[stageIndex].title}
          </p>
          <p className="text-[11px] font-mono text-emerald-500/80 tracking-wider">
            {stages[stageIndex].code}
          </p>
        </div>

        {/* High-Tech Progress Bar with Glowing Head & Percentage */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400/90 px-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>DIAGNOSTIC PROTOCOL</span>
            </span>
            <span className="font-bold text-emerald-300">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#0E291C] overflow-hidden border border-emerald-500/30 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-[#6AB547] to-lime-400 transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Light Bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>

        {/* Bottom Blockchain & Quality Assurance Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-emerald-400/70 pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ICAR Lab Hash Verified</span>
          </div>
          <span className="text-emerald-800">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart Escrow Protection</span>
          </div>
        </div>

      </div>

      {/* Embedded CSS Keyframes for High-Performance Animation */}
      <style>{`
        @keyframes scannerBeam {
          0%, 100% { top: 4px; opacity: 0.2; }
          50% { top: 92%; opacity: 0.9; }
        }
        @keyframes swayLeafLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
        @keyframes swayLeafRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};
