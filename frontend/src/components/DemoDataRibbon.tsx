import React from "react";
import { Info, ExternalLink, Sprout } from "lucide-react";

export interface DemoDataRibbonProps {
  onReplayLoader?: () => void;
}

export const DemoDataRibbon: React.FC<DemoDataRibbonProps> = ({ onReplayLoader }) => {
  return (
    <div className="bg-[#121714] text-white py-1.5 px-4 text-xs font-medium border-b border-[#2A372F] relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6AB547] animate-pulse" />
          <span className="font-bold text-[#6AB547]">Prototype Demo:</span>
          <span className="text-[#E1E6DA]">
            Ethereum Sepolia / Local Test Network (Demo Data Only — Not Real Currency)
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#A2B1A8]">
          {onReplayLoader && (
            <button
              onClick={onReplayLoader}
              className="hover:text-[#6AB547] text-[#D2ECC3] flex items-center gap-1.5 cursor-pointer transition-colors bg-white/10 px-2.5 py-0.5 rounded-full"
              title="Preview AgriTech Seed & Seller Verification Animation"
            >
              <Sprout className="w-3.5 h-3.5 text-[#6AB547]" />
              <span className="font-medium">Preview AgriTech Animation</span>
            </button>
          )}
          <span className="hidden sm:inline">Demo Rate: 1 ETH ≈ ₹2,80,000 INR</span>
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1 underline underline-offset-2"
          >
            <span>Sepolia Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

