import React, { useEffect, useState } from "react";
import { X, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { PillButton } from "./PillButton";

export interface ExecutionStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  batchNumber?: string;
  txHash?: string;
  onExecutionComplete?: () => void;
}

export const ExecutionStepsModal: React.FC<ExecutionStepsModalProps> = ({
  isOpen,
  onClose,
  title = "Cryptographic Batch Verification & Escrow Lock",
  batchNumber = "HD-2967 // PB-2026-0819",
  txHash = "0x7f4e91a82d3c9048a12e56c39b8201a4",
  onExecutionComplete
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setProgress(15);
      setIsCompleted(false);
      return;
    }

    // Auto-advance through the 3 verification steps
    const t1 = setTimeout(() => {
      setProgress(42);
      setCurrentStep(2); // Step 1 complete, Step 2 active
    }, 900);

    const t2 = setTimeout(() => {
      setProgress(78);
      setCurrentStep(3); // Step 1 & 2 complete, Step 3 active
    }, 1900);

    const t3 = setTimeout(() => {
      setProgress(100);
      setCurrentStep(4); // All complete
      setIsCompleted(true);
      if (onExecutionComplete) onExecutionComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onExecutionComplete]);

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: "Reading the blockchain record" },
    { id: 2, label: "Checking certificate hash" },
    { id: 3, label: "Calculating seller score" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[32px] max-w-[540px] w-full p-6 sm:p-8 shadow-2xl relative select-none animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#E1E6DA] text-[#5B665F] hover:text-[#121714] flex items-center justify-center cursor-pointer shadow-xs transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 text-left pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEF3E6] border border-[#D2ECC3] text-[11px] font-bold text-[#2E9E57] mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>On-Chain Execution Protocol</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#121714] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-[#5B665F] mt-0.5 font-mono">
            Lot: {batchNumber}
          </p>
        </div>

        {/* ==================================================== */}
        {/* EXACT USER SPEC CONTAINER: 2 CARDS                   */}
        {/* ==================================================== */}
        <div className="w-full flex flex-col gap-5 text-left">
          
          {/* Card 1: VERIFICATION STEPS */}
          <div className="rounded-[28px] bg-[#EEF3E6] border border-[#E1E6DA] p-6 sm:p-7 flex flex-col justify-center relative shadow-xs">
            <div className="text-[13px] font-bold text-[#5B665F] tracking-[0.08em] uppercase mb-4">
              Verification steps
            </div>

            <div className="flex flex-col gap-4">
              {steps.map((step) => {
                const isDone = currentStep > step.id || currentStep === 4;
                const isActive = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-3.5 text-base sm:text-[17px] font-medium text-[#163A24]"
                  >
                    <div className="relative w-7 h-7 shrink-0">
                      {/* Inactive Base Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#C9D5BA]" />

                      {/* Active Spinner */}
                      {isActive && (
                        <div className="absolute inset-0">
                          <div className="w-full h-full rounded-full border-2 border-transparent border-t-[#6AB547] ss-rot" />
                        </div>
                      )}

                      {/* Done State Checkmark */}
                      {isDone && (
                        <div className="absolute inset-0 rounded-full bg-[#6AB547] flex items-center justify-center transition-all duration-300">
                          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                            <path
                              d="M3.5 8.5 L6.8 11.5 L12.5 4.8"
                              fill="none"
                              stroke="#163A24"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <span className={isActive ? "font-bold text-[#163A24]" : "text-[#163A24]"}>
                      {step.label}
                    </span>
                  </div>
                );
              })}

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#D9E2CC] mt-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#6AB547] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: SKELETON AND BUTTON */}
          <div className="rounded-[28px] bg-[#F7F8F3] border border-[#E1E6DA] p-6 sm:p-7 flex flex-col justify-center gap-4.5 relative shadow-xs">
            <div className="text-[13px] font-bold text-[#5B665F] tracking-[0.08em] uppercase">
              Skeleton and button
            </div>

            {/* Shimmer Placeholder */}
            <div className="flex gap-4 items-center">
              <div className="shim w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-[18px] shrink-0" />
              <div className="flex-1 flex flex-col gap-2.5">
                <div className="shim h-3 rounded-full w-[80%]" />
                <div className="shim h-3 rounded-full w-[56%]" />
                <div className="shim h-5 rounded-full w-[34%]" />
              </div>
            </div>

            {/* Sprout Pulse Action Button */}
            <div className="pt-1">
              {isCompleted ? (
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#163A24] text-white text-sm sm:text-base font-extrabold shadow-sm animate-in zoom-in-95">
                  <CheckCircle2 className="w-5 h-5 text-[#6AB547]" />
                  <span>Execution Verified On-Chain</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#6AB547] text-[#121714] text-base sm:text-[17px] font-extrabold shadow-sm">
                  {/* 3-Sprout Pulse SVG Wave */}
                  <svg viewBox="0 0 54 24" width="54" height="24" aria-hidden="true" className="shrink-0">
                    <g className="sspulse">
                      <path d="M9 22 V10" stroke="#163A24" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                      <path d="M9 14 C4 14 2 10 2 6 C6.5 6 8.6 9.5 9 14 Z M9 11 C9 6 12 3 16 3 C16 8 13 11 9 11 Z" fill="#163A24" />
                    </g>
                    <g className="sspulse" style={{ animationDelay: "0.18s" }}>
                      <path d="M27 22 V10" stroke="#163A24" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                      <path d="M27 14 C22 14 20 10 20 6 C24.5 6 26.6 9.5 27 14 Z M27 11 C27 6 30 3 34 3 C34 8 31 11 27 11 Z" fill="#163A24" />
                    </g>
                    <g className="sspulse" style={{ animationDelay: "0.36s" }}>
                      <path d="M45 22 V10" stroke="#163A24" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                      <path d="M45 14 C40 14 38 10 38 6 C42.5 6 44.6 9.5 45 14 Z M45 11 C45 6 48 3 52 3 C52 8 49 11 45 11 Z" fill="#163A24" />
                    </g>
                  </svg>
                  <span>Confirm in your wallet…</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-[#E1E6DA] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#5B665F]">
            <span>Contract:</span>
            <span className="font-mono text-[#121714] font-bold">
              {txHash ? `${txHash.slice(0, 8)}...${txHash.slice(-6)}` : "0x7f4e...01a4"}
            </span>
          </div>

          <PillButton
            variant={isCompleted ? "primary" : "secondary"}
            size="sm"
            onClick={onClose}
          >
            {isCompleted ? "Done" : "Cancel"}
          </PillButton>
        </div>

      </div>
    </div>
  );
};
