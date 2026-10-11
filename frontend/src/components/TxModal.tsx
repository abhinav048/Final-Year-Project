import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ExternalLink, X, ChevronDown, RotateCcw } from "lucide-react";
import { PillButton } from "./PillButton";
import { VerificationStepsCard } from "./VerificationStepsCard";

export type TxStatus = "idle" | "preparing" | "pending" | "confirmed" | "failed";

export interface TxModalProps {
  isOpen: boolean;
  status: TxStatus;
  title: string;
  whatWillHappen: string;
  txHash?: string;
  errorMessage?: string;
  rawError?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export const TxModal: React.FC<TxModalProps> = ({
  isOpen,
  status,
  title,
  whatWillHappen,
  txHash,
  errorMessage,
  rawError,
  onClose,
  onRetry
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!isOpen) return null;

  const currentStep = status === "preparing" ? 1 : status === "pending" ? 2 : status === "confirmed" ? 4 : 1;
  const progress = status === "preparing" ? 40 : status === "pending" ? 85 : status === "confirmed" ? 100 : 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#E1E6DA] text-[#5B665F] hover:text-[#121714] flex items-center justify-center cursor-pointer shadow-xs transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-left pt-1 pb-4">
          <h3 className="text-xl sm:text-2xl font-black text-[#121714] tracking-tight">
            {status === "preparing" && "Waiting for Wallet Approval"}
            {status === "pending" && "Safely Processing on Blockchain"}
            {status === "confirmed" && "Transaction Confirmed!"}
            {status === "failed" && "Transaction Could Not Complete"}
          </h3>

          <p className="text-xs text-[#5B665F] mt-1 font-medium">{title}</p>
        </div>

        {/* Verification Steps & Button Component during Execution */}
        {(status === "preparing" || status === "pending" || status === "confirmed") && (
          <div className="my-3">
            <VerificationStepsCard
              currentStep={currentStep}
              progress={progress}
              showSkeletonAndButton={status !== "confirmed"}
              buttonText="Confirm in your wallet…"
            />
          </div>
        )}

        {/* Confirmed State Icon & Notice */}
        {status === "confirmed" && (
          <div className="p-4 rounded-2xl bg-[#EEF8F1] border border-[#B8E4C7] text-xs text-[#2E9E57] space-y-1 my-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E9E57] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#163A24]">Smart Escrow Payment Locked</p>
              <p className="text-[#2E9E57]">Funds are safely held until you confirm delivery & seed vigor.</p>
            </div>
          </div>
        )}

        {/* Failed State Display */}
        {status === "failed" && (
          <div className="mb-4">
            <div className="w-14 h-14 rounded-full bg-[#FDF1F0] border-2 border-[#F7B8B2] flex items-center justify-center mx-auto mb-3 text-[#D8503F]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FDF1F0] border border-[#F7B8B2] text-xs text-[#D8503F] space-y-1">
              <p className="font-bold">
                {errorMessage ||
                  "The transaction was rejected or network conditions changed."}
              </p>
              <p className="text-[11px] text-[#5B665F]">
                Your funds were not deducted. You can safely try again.
              </p>
            </div>

            {rawError && (
              <div className="mt-2 text-left">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="text-[11px] font-bold text-[#5B665F] hover:text-[#121714] flex items-center gap-1 cursor-pointer"
                >
                  <span>Technical details</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      showTechnicalDetails ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showTechnicalDetails && (
                  <pre className="mt-1 p-2 rounded-xl bg-slate-100 text-[10px] text-slate-700 font-mono overflow-x-auto max-h-24">
                    {rawError}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* What Will Happen Explanation Box */}
        <div className="p-4 rounded-2xl bg-white border border-[#E1E6DA] text-xs space-y-2 mb-4">
          <span className="font-bold uppercase tracking-wider text-[10px] text-[#5B665F]">
            What is happening:
          </span>
          <p className="text-[#121714] leading-relaxed">{whatWillHappen}</p>

          {txHash && (
            <div className="pt-2 border-t border-[#F1EFE6] flex items-center justify-between">
              <span className="text-[#5B665F]">Transaction Hash:</span>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-[#6AB547] hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>
                  {txHash.slice(0, 6)}...{txHash.slice(-4)}
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E1E6DA]">
          {status === "failed" && onRetry && (
            <PillButton
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onRetry}
            >
              Try Again
            </PillButton>
          )}

          <PillButton
            variant={status === "confirmed" ? "primary" : "dark"}
            size="sm"
            onClick={onClose}
          >
            {status === "confirmed" ? "Done" : "Close"}
          </PillButton>
        </div>
      </div>
    </div>
  );
};

