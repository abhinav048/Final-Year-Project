import React, { useEffect, useState } from "react";
import { LeafDecor } from "./LeafDecor";

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 7000
}) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [pct, setPct] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Synchronize React state counters for browsers where @property CSS Houdini is unsupported
    const startTime = Date.now();
    const duration = minDurationMs;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(1, elapsed / duration);
      
      // Update percentage: 0 to 100%
      setPct(Math.floor(progressRatio * 100));

      // Update AI Score: begins around 26% and hits 94 by 48%
      if (progressRatio < 0.26) {
        setScore(0);
      } else if (progressRatio >= 0.26 && progressRatio <= 0.48) {
        const scoreRatio = (progressRatio - 0.26) / (0.48 - 0.26);
        setScore(Math.floor(scoreRatio * 94));
      } else {
        setScore(94);
      }

      if (progressRatio >= 1) {
        clearInterval(interval);
      }
    }, 50);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, minDurationMs);

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, minDurationMs + 500);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [minDurationMs, onComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 350);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0B2417] text-[#121714] transition-opacity duration-500 overflow-hidden select-none ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(180deg, #0B2417 0%, #163A24 55%, #1E4D2B 100%)",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      {/* Outer Scaled Container to guarantee exact 1280x800 presentation on any screen */}
      <div className="relative w-full h-full flex items-center justify-center overflow-auto p-2 sm:p-4">
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: "1280px",
            height: "800px",
            maxWidth: "100vw",
            maxHeight: "100vh",
            transform: "scale(min(calc(100vw / 1280), calc(100vh / 800)))",
            transformOrigin: "center center"
          }}
        >
          {/* Top Header Labels */}
          <div
            style={{
              position: "absolute",
              top: "22px",
              left: "44px",
              fontSize: "13px",
              color: "#BFD8B4",
              fontWeight: 500
            }}
          >
            Verified seeds. Protected payments.
          </div>

          <div
            style={{
              position: "absolute",
              top: "22px",
              right: "44px",
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#BFD8B4",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: ".1em"
              }}
            >
              SEPOLIA TESTNET
            </div>
            <button
              onClick={handleSkip}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#D9E2CC] hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
            >
              Skip →
            </button>
          </div>

          {/* Main Stage White/Sage Sheet */}
          <div
            style={{
              position: "absolute",
              left: "40px",
              right: "40px",
              top: "68px",
              bottom: "36px",
              borderRadius: "32px",
              overflow: "hidden",
              background:
                "radial-gradient(circle at 50% 38%, #FFFFFF 0%, rgba(247,248,243,0) 62%), linear-gradient(rgba(22,58,36,.05) 1px, transparent 1px) 0 0/48px 48px, linear-gradient(90deg, rgba(22,58,36,.05) 1px, transparent 1px) 0 0/48px 48px, #F4F6EE",
              boxShadow: "0 20px 60px rgba(5,20,12,.35)"
            }}
          >
            {/* Authentic Botanical Decorative Leaves (as shown in reference image) on left and right */}
            <div
              className="sway"
              style={{
                position: "absolute",
                left: "18px",
                top: "140px",
                width: "90px",
                height: "210px",
                pointerEvents: "none",
                opacity: 0.65
              }}
            >
              <LeafDecor variant="branch" />
            </div>

            <div
              className="sway"
              style={{
                position: "absolute",
                right: "18px",
                top: "140px",
                width: "90px",
                height: "210px",
                pointerEvents: "none",
                opacity: 0.65
              }}
            >
              <LeafDecor variant="fern" />
            </div>

            {/* Corner Status Badges */}
            <div
              style={{
                position: "absolute",
                top: "22px",
                left: "30px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: ".12em",
                color: "#7A8A7C"
              }}
            >
              SEEDSURE // BOOT
            </div>

            <div
              style={{
                position: "absolute",
                top: "22px",
                right: "30px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: ".12em",
                color: "#7A8A7C"
              }}
            >
              DEMO DATA · NO REAL FUNDS
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "22px",
                left: "30px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: ".12em",
                color: "#7A8A7C"
              }}
            >
              ML MODEL TRAINED ON SYNTHETIC DATA
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "22px",
                right: "30px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: ".12em",
                color: "#7A8A7C"
              }}
            >
              v1.0.4
            </div>

            {/* Centered Flow Content */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px"
              }}
            >
              {/* Badge Pill */}
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: "99px",
                  background: "#121714",
                  color: "#F7F8F3",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: ".02em"
                }}
              >
                Seed quality graded by AI · Recorded on the blockchain
              </div>

              {/* The Complete 960x262 Animated Flow Diagram */}
              <div style={{ position: "relative", width: "960px", height: "262px" }}>
                <svg
                  viewBox="0 0 960 262"
                  width="960"
                  height="262"
                  role="img"
                  aria-label="Seller uploads a seed lab certificate, AI grades germination, purity and vigor, the batch is stored on the blockchain and the buyer sees it verified"
                >
                  <defs>
                    <linearGradient id="bm" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#9BD67A" stopOpacity="0" />
                      <stop offset=".5" stopColor="#C8F0A8" />
                      <stop offset="1" stopColor="#9BD67A" stopOpacity="0" />
                    </linearGradient>

                    {/* Shared Sprout Icon Symbol */}
                    <g id="sp">
                      <path d="M0 122 V104" fill="none" strokeWidth="2" strokeLinecap="round" />
                      <path d="M0 114 C-8 114 -10 107 -9 101 C-3 101 0 107 0 114 Z" stroke="none" />
                      <path d="M0 108 C0 101 4 97 11 97 C11 104 7 108 0 108 Z" stroke="none" />
                    </g>
                  </defs>

                  {/* Flow connecting dashed path */}
                  <path
                    className="flow"
                    d="M136 110 H824"
                    fill="none"
                    stroke="#B9C9A8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* 1. SEED SELLER NODE */}
                  <circle className="fb xr" cx="90" cy="110" r="46" fill="none" stroke="#6AB547" strokeWidth="2" />
                  <circle cx="90" cy="110" r="46" fill="#EEF3E6" stroke="#6AB547" strokeWidth="2" />
                  <rect x="76" y="90" width="28" height="38" rx="5" fill="#163A24" />
                  <path
                    d="M76 98 L80 94 L84 98 L88 94 L92 98 L96 94 L100 98 L104 94"
                    fill="none"
                    stroke="#6AB547"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path d="M90 122 C83 122 82 114 83 108 C90 108 96 113 90 122 Z" fill="#A8D98A" />
                  <ellipse cx="60" cy="132" rx="3.5" ry="5" fill="#E9A93B" />
                  <ellipse cx="119" cy="134" rx="3.5" ry="5" fill="#E9A93B" />
                  <text
                    x="90"
                    y="184"
                    textAnchor="middle"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontSize="14"
                    fontWeight="800"
                    fill="#121714"
                  >
                    SEED SELLER
                  </text>
                  <text
                    x="90"
                    y="202"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="11"
                    letterSpacing="1"
                    fill="#7A8A7C"
                  >
                    0x3a…91B2
                  </text>

                  {/* 2. AI SEED GRADER NODE */}
                  <rect x="325" y="30" width="150" height="160" rx="28" fill="#163A24" />
                  <rect
                    className="mlg"
                    x="322"
                    y="27"
                    width="156"
                    height="166"
                    rx="31"
                    fill="none"
                    stroke="#6AB547"
                    strokeWidth="5"
                    strokeOpacity=".6"
                  />
                  <circle
                    className="ret"
                    cx="400"
                    cy="60"
                    r="25"
                    fill="none"
                    stroke="#9BD67A"
                    strokeWidth="1.5"
                    strokeDasharray="5 6"
                    strokeLinecap="round"
                  />
                  <ellipse cx="400" cy="60" rx="11" ry="15" fill="#E9A93B" />
                  <path d="M400 50 C396 56 396 64 400 70" fill="none" stroke="#B87A1E" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="396" cy="55" r="2" fill="#FFFFFF" fillOpacity=".8" />
                  <rect className="beam" x="340" y="40" width="120" height="2" fill="url(#bm)" />

                  <g className="sgrp" style={{ opacity: 0 }} fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing=".6" fill="#9BD67A">
                    <text x="338" y="141">GERM</text>
                    <text x="338" y="155">PURE</text>
                    <text x="338" y="169">VIGOR</text>
                    <rect x="376" y="136" width="84" height="5" rx="2.5" fill="#2D6B45" />
                    <rect x="376" y="150" width="84" height="5" rx="2.5" fill="#2D6B45" />
                    <rect x="376" y="164" width="84" height="5" rx="2.5" fill="#2D6B45" />
                    <rect className="bar b1" x="376" y="136" width="84" height="5" rx="2.5" fill="#9BD67A" />
                    <rect className="bar b2" x="376" y="150" width="84" height="5" rx="2.5" fill="#9BD67A" />
                    <rect className="bar b3" x="376" y="164" width="84" height="5" rx="2.5" fill="#9BD67A" />
                  </g>

                  <text
                    x="400"
                    y="16"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="11"
                    letterSpacing="1.5"
                    fill="#5C8A5F"
                  >
                    AI SEED GRADER
                  </text>
                  <text
                    x="400"
                    y="212"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="10"
                    letterSpacing="1"
                    fill="#7A8A7C"
                  >
                    READS THE LAB CERTIFICATE
                  </text>

                  {/* 3. SEED BATCH LEDGER (BLOCKCHAIN) */}
                  <g stroke="#163A24" strokeWidth="2">
                    <path d="M562 110 H582 M626 110 H646 M690 110 H710" />
                  </g>
                  <g fill="#FFFFFF" stroke="#163A24" strokeWidth="2">
                    <rect x="518" y="88" width="44" height="44" rx="10" />
                    <rect x="582" y="88" width="44" height="44" rx="10" />
                    <rect x="646" y="88" width="44" height="44" rx="10" />
                  </g>
                  <use href="#sp" transform="translate(540 0)" fill="#163A24" stroke="#163A24" />
                  <use href="#sp" transform="translate(604 0)" fill="#163A24" stroke="#163A24" />
                  <use href="#sp" transform="translate(668 0)" fill="#163A24" stroke="#163A24" />

                  {/* Minting New Block */}
                  <g className="fb blk">
                    <rect x="710" y="88" width="44" height="44" rx="10" fill="#6AB547" stroke="#163A24" strokeWidth="2" />
                    <use href="#sp" transform="translate(732 0)" fill="#163A24" stroke="#163A24" />
                  </g>
                  <text className="hash" x="732" y="156" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#163A24">
                    batch 0x9F3A…C21
                  </text>
                  <text
                    x="636"
                    y="16"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="11"
                    letterSpacing="1.5"
                    fill="#5C8A5F"
                  >
                    SEED BATCH LEDGER
                  </text>
                  <text
                    x="636"
                    y="212"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="10"
                    letterSpacing="1"
                    fill="#7A8A7C"
                  >
                    STORES EVERY BATCH &amp; PAYMENT
                  </text>

                  {/* 4. SEED BUYER NODE */}
                  <circle className="fb buy" cx="870" cy="110" r="46" fill="none" stroke="#6AB547" strokeWidth="4" />
                  <circle cx="870" cy="110" r="46" fill="#EEF3E6" stroke="#6AB547" strokeWidth="2" />
                  <path d="M858 106 C858 92 882 92 882 106" fill="none" stroke="#163A24" strokeWidth="3" strokeLinecap="round" />
                  <rect x="844" y="106" width="52" height="8" rx="4" fill="#163A24" />
                  <path d="M849 114 L853 136 H887 L891 114 Z" fill="#163A24" />
                  <path d="M870 131 C864 131 862 125 864 121 C869 121 872 125 870 131 Z" fill="#6AB547" />
                  <text
                    x="870"
                    y="184"
                    textAnchor="middle"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontSize="14"
                    fontWeight="800"
                    fill="#121714"
                  >
                    SEED BUYER
                  </text>
                  <text
                    x="870"
                    y="202"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="11"
                    letterSpacing="1"
                    fill="#7A8A7C"
                  >
                    0x7c…E4D0
                  </text>

                  {/* Verified Escrow Badge on Buyer */}
                  <g className="fb bdg">
                    <circle cx="904" cy="76" r="15" fill="#4E9A33" stroke="#F7F8F3" strokeWidth="2" />
                    <path d="M897 76 L902 81 L911 71" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </g>

                  {/* Animated Seed Package Traveling (.pack) */}
                  <g className="fb pack">
                    <rect x="173" y="75" width="60" height="78" rx="8" fill="#E8D9B5" stroke="#CDB98A" transform="translate(3 4)" fillOpacity=".35" strokeOpacity="0" />
                    <rect x="170" y="70" width="60" height="80" rx="8" fill="#E8D9B5" stroke="#CDB98A" />
                    <path
                      d="M170 82 L176 76 L182 82 L188 76 L194 82 L200 76 L206 82 L212 76 L218 82 L224 76 L230 82"
                      fill="none"
                      stroke="#B89F6A"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <rect x="178" y="92" width="44" height="42" rx="6" fill="#FFFFFF" />
                    <path d="M200 126 V106" fill="none" stroke="#4E9A33" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M200 116 C192 116 190 108 191 103 C198 103 203 108 200 116 Z" fill="#6AB547" />
                    <path d="M200 110 C200 103 204 99 211 99 C211 106 207 110 200 110 Z" fill="#A8D98A" />
                    <circle cx="226" cy="74" r="10" fill="#6AB547" stroke="#F7F8F3" strokeWidth="2" />
                    <path d="M221.5 74 L225 77.5 L231 70.5" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>

                  {/* Data Packets traveling between nodes */}
                  <ellipse className="pk1" cx="475" cy="110" rx="5.5" ry="7.5" fill="#E9A93B" stroke="#FFFFFF" strokeWidth="2" />
                  <ellipse className="pk2" cx="756" cy="110" rx="5.5" ry="7.5" fill="#E9A93B" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* Scorebox Overlay with Counting Score */}
                <div
                  className="scorebox"
                  style={{
                    position: "absolute",
                    left: "325px",
                    top: "84px",
                    width: "150px",
                    height: "44px",
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: "4px",
                    opacity: 0
                  }}
                >
                  <div className="num" style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1, color: "#F7F8F3" }}>
                    <span className="sc-val">{score > 0 ? score : ""}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#9BD67A" }}>
                    /100
                  </div>
                </div>
              </div>

              {/* Status Message Sequence */}
              <div style={{ position: "relative", width: "700px", height: "54px", textAlign: "center" }}>
                <div className="msg m1">
                  <div style={{ fontSize: "21px", fontWeight: 500, color: "#121714" }}>
                    The seller uploads the seed lab certificate…
                  </div>
                  <div style={{ marginTop: "6px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#5C8A5F" }}>
                    UPLOAD // LAB_REPORT_PINNED
                  </div>
                </div>

                <div className="msg" style={{ animationDelay: "1.75s" }}>
                  <div style={{ fontSize: "21px", fontWeight: 500, color: "#121714" }}>
                    AI checks germination, purity and vigor…
                  </div>
                  <div style={{ marginTop: "6px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#5C8A5F" }}>
                    ML // SEED_QUALITY_SCORE
                  </div>
                </div>

                <div className="msg" style={{ animationDelay: "3.5s" }}>
                  <div style={{ fontSize: "21px", fontWeight: 500, color: "#121714" }}>
                    The seed batch is saved on the blockchain…
                  </div>
                  <div style={{ marginTop: "6px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#5C8A5F" }}>
                    SEPOLIA // BATCH_HASH_STORED
                  </div>
                </div>

                <div className="msg" style={{ animationDelay: "5.25s" }}>
                  <div style={{ fontSize: "21px", fontWeight: 500, color: "#121714" }}>
                    The buyer sees a verified seed lot, escrow-ready…
                  </div>
                  <div style={{ marginTop: "6px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".12em", color: "#5C8A5F" }}>
                    ESCROW // READY_FOR_PURCHASE
                  </div>
                </div>
              </div>

              {/* 4 Process Step Pills */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div className="pill p1"><b>1</b>Seller uploads</div>
                <div className="pill p2"><b>2</b>AI grades seed</div>
                <div className="pill p3"><b>3</b>Batch on-chain</div>
                <div className="pill p4"><b>4</b>Buyer verifies</div>
              </div>

              {/* Live Progress Bar Container */}
              <div style={{ width: "480px", marginTop: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: ".1em",
                    color: "#163A24"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="live"></span>
                    SEED VERIFICATION IN PROGRESS
                  </span>
                  <span className="pct" style={{ fontWeight: 500 }}>
                    <span className="pct-val">{pct}%</span>
                  </span>
                </div>

                <div
                  style={{
                    position: "relative",
                    height: "8px",
                    borderRadius: "99px",
                    background: "#DCE5CF",
                    overflow: "hidden"
                  }}
                >
                  <div
                    className="fill"
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "99px",
                      background: "linear-gradient(90deg, #6AB547, #B7E08F)"
                    }}
                  />
                  <div className="shine" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS Keyframes & Styles matching the exact HTML spec */}
      <style>{`
        @property --sc { syntax: '<integer>'; initial-value: 0; inherits: false; }
        @property --pct { syntax: '<integer>'; initial-value: 0; inherits: false; }

        .num { animation: xCount 7s linear infinite; }
        .num::after { counter-reset: s var(--sc); content: counter(s); }
        .num .sc-val { display: none; }
        @supports not (counter-reset: s var(--sc)) {
          .num::after { content: ''; }
          .num .sc-val { display: inline; }
        }

        .pct { animation: xPct 7s linear infinite; }
        .pct::after { counter-reset: p var(--pct); content: counter(p) '%'; }
        .pct .pct-val { display: none; }
        @supports not (counter-reset: p var(--pct)) {
          .pct::after { content: ''; }
          .pct .pct-val { display: inline; }
        }

        @keyframes xCount { 0%, 26% { --sc: 0; } 48%, 100% { --sc: 94; } }
        @keyframes xPct { 0% { --pct: 0; } 96%, 100% { --pct: 100; } }

        .fill { transform-origin: 0 50%; animation: xFill 7s linear infinite; }
        @keyframes xFill { 0% { transform: scaleX(0); } 96%, 100% { transform: scaleX(1); } }

        .shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 8px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .7), transparent);
          animation: xShine 1.4s linear infinite;
        }
        @keyframes xShine { 0% { transform: translateX(-100px); } 100% { transform: translateX(520px); } }

        .msg {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          opacity: 0;
          animation: xMsg 7s ease-in-out infinite;
        }
        @keyframes xMsg {
          0% { opacity: 0; transform: translateY(8px); }
          3%, 21% { opacity: 1; transform: translateY(0); }
          24%, 100% { opacity: 0; transform: translateY(-8px); }
        }

        .fb { transform-box: fill-box; transform-origin: 50% 50%; }

        .flow { stroke-dasharray: 4 8; animation: xFlow .6s linear infinite; }
        @keyframes xFlow { to { stroke-dashoffset: -12; } }

        .xr { animation: xRing 7s ease-out infinite; }
        @keyframes xRing { 0% { transform: scale(1); opacity: .7; } 10% { transform: scale(1.5); opacity: 0; } 100% { transform: scale(1.5); opacity: 0; } }

        .pack { animation: xPack 7s cubic-bezier(.4, 0, .2, 1) infinite; }
        @keyframes xPack {
          0%, 2% { transform: translateX(0) scale(0); opacity: 0; }
          8% { transform: translateX(0) scale(1); opacity: 1; }
          13% { transform: translateX(0) scale(1); }
          24% { transform: translateX(128px) scale(.95); opacity: 1; }
          28%, 100% { transform: translateX(146px) scale(.3); opacity: 0; }
        }

        .mlg { animation: xMlg 7s ease-in-out infinite; }
        @keyframes xMlg { 0%, 22% { opacity: 0; } 28%, 48% { opacity: .9; } 54%, 100% { opacity: 0; } }

        .beam { animation: xBeam .9s ease-in-out infinite alternate; }
        @keyframes xBeam { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }

        .ret { transform-origin: 400px 60px; animation: xRot 3s linear infinite; }
        @keyframes xRot { to { transform: rotate(360deg); } }

        .sgrp, .scorebox { animation: xScore 7s ease-in-out infinite; }
        @keyframes xScore { 0%, 24% { opacity: 0; } 28%, 92% { opacity: 1; } 96%, 100% { opacity: 0; } }

        .bar { transform-box: fill-box; transform-origin: 0 50%; }
        .b1 { animation: xB1 7s ease-out infinite; }
        .b2 { animation: xB2 7s ease-out infinite; }
        .b3 { animation: xB3 7s ease-out infinite; }
        @keyframes xB1 { 0%, 27% { transform: scaleX(0); } 36%, 100% { transform: scaleX(.96); } }
        @keyframes xB2 { 0%, 31% { transform: scaleX(0); } 40%, 100% { transform: scaleX(.98); } }
        @keyframes xB3 { 0%, 35% { transform: scaleX(0); } 44%, 100% { transform: scaleX(.91); } }

        .pk1 { animation: xPk1 7s linear infinite; }
        @keyframes xPk1 { 0%, 50% { transform: translateX(0); opacity: 0; } 51% { opacity: 1; } 62% { transform: translateX(235px); opacity: 1; } 63%, 100% { transform: translateX(235px); opacity: 0; } }

        .pk2 { animation: xPk2 7s linear infinite; }
        @keyframes xPk2 { 0%, 74% { transform: translateX(0); opacity: 0; } 75% { opacity: 1; } 88% { transform: translateX(68px); opacity: 1; } 89%, 100% { transform: translateX(68px); opacity: 0; } }

        .blk { animation: xBlk 7s cubic-bezier(.4, 0, .2, 1) infinite; }
        @keyframes xBlk { 0%, 62% { transform: scale(0); opacity: 1; } 66% { transform: scale(1.2); } 70%, 95% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }

        .hash { animation: xHash 7s ease-in-out infinite; }
        @keyframes xHash { 0%, 64% { opacity: 0; } 68%, 92% { opacity: 1; } 96%, 100% { opacity: 0; } }

        .bdg { animation: xBdg 7s cubic-bezier(.4, 0, .2, 1) infinite; }
        @keyframes xBdg { 0%, 88% { transform: scale(0); opacity: 1; } 92% { transform: scale(1.25); } 95%, 97% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }

        .buy { animation: xBuy 7s ease-out infinite; }
        @keyframes xBuy { 0%, 88% { transform: scale(1); opacity: 0; } 91% { opacity: .8; } 100% { transform: scale(1.35); opacity: 0; } }

        .sway { transform-box: fill-box; transform-origin: 50% 100%; animation: xSway 3s ease-in-out infinite alternate; }
        @keyframes xSway { 0% { transform: rotate(-3deg); } 100% { transform: rotate(3deg); } }

        .pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 99px;
          border: 1px solid #D9E2CC;
          font-size: 13px;
          font-weight: 500;
          background: #EAF0DF;
          color: #163A24;
          transition: background 0.3s, color 0.3s;
        }
        .pill b {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          background: #6AB547;
          color: #121714;
        }

        .p1 { animation: xP1 7s linear infinite; }
        .p2 { animation: xP2 7s linear infinite; }
        .p3 { animation: xP3 7s linear infinite; }
        .p4 { animation: xP4 7s linear infinite; }
        @keyframes xP1 { 0%, 23% { background: #163A24; color: #F7F8F3; } 25%, 100% { background: #EAF0DF; color: #163A24; } }
        @keyframes xP2 { 0%, 24% { background: #EAF0DF; color: #163A24; } 26%, 48% { background: #163A24; color: #F7F8F3; } 50%, 100% { background: #EAF0DF; color: #163A24; } }
        @keyframes xP3 { 0%, 49% { background: #EAF0DF; color: #163A24; } 51%, 73% { background: #163A24; color: #F7F8F3; } 75%, 100% { background: #EAF0DF; color: #163A24; } }
        @keyframes xP4 { 0%, 74% { background: #EAF0DF; color: #163A24; } 76%, 95% { background: #163A24; color: #F7F8F3; } 97%, 100% { background: #EAF0DF; color: #163A24; } }

        .live {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6AB547;
          animation: xLive 1.2s ease-out infinite;
        }
        @keyframes xLive { 0% { box-shadow: 0 0 0 0 rgba(106, 181, 71, .55); } 100% { box-shadow: 0 0 0 8px rgba(106, 181, 71, 0); } }

        @media (prefers-reduced-motion: reduce) {
          .num, .pct, .fill, .shine, .msg, .flow, .xr, .pack, .mlg, .beam, .ret, .sgrp, .scorebox, .b1, .b2, .b3, .pk1, .pk2, .blk, .hash, .bdg, .buy, .sway, .p1, .p2, .p3, .p4, .live {
            animation: none !important;
          }
          .num { --sc: 94; }
          .pct { --pct: 100; }
          .m1 { opacity: 1; }
          .xr, .pack, .pk1, .pk2, .buy { opacity: 0; }
          .b1 { transform: scaleX(.96); }
          .b2 { transform: scaleX(.98); }
          .b3 { transform: scaleX(.91); }
        }
      `}</style>
    </div>
  );
};
