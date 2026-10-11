import React from "react";

export interface VerificationStepsCardProps {
  currentStep?: 1 | 2 | 3 | 4; // 1 = reading blockchain, 2 = checking cert hash, 3 = calculating seller score, 4 = all done
  progress?: number; // 0 to 100
  showSkeletonAndButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const VerificationStepsCard: React.FC<VerificationStepsCardProps> = ({
  currentStep = 1,
  progress = 35,
  showSkeletonAndButton = true,
  buttonText = "Confirm in your wallet…",
  onButtonClick,
  className = ""
}) => {
  const steps = [
    { id: 1, label: "Reading the blockchain record", detail: "Querying Sepolia smart registry" },
    { id: 2, label: "Checking certificate hash", detail: "Validating ICAR SHA-256 lab fingerprint" },
    { id: 3, label: "Calculating seller score", detail: "Evaluating multi-factor reliability rating" }
  ];

  return (
    <div className={`w-full max-w-[500px] flex flex-col gap-6 text-left select-none ${className}`}>
      {/* 1. Verification Steps Card */}
      <div className="rounded-[28px] bg-[#EEF3E6] border border-[#E1E6DA] p-7 sm:p-8 flex flex-col justify-center relative shadow-sm">
        <div className="text-[13px] font-bold text-[#5B665F] tracking-[0.08em] uppercase">
          Verification steps
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:gap-4.5">
          {steps.map((step) => {
            const isDone = currentStep > step.id || currentStep === 4;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="flex items-center gap-3.5 text-base sm:text-[17px] font-medium text-[#163A24] transition-opacity"
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

                <div className="flex flex-col">
                  <span className={isActive ? "font-bold text-[#163A24]" : ""}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#D9E2CC] mt-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-[#6AB547] transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Skeleton and Button Card */}
      {showSkeletonAndButton && (
        <div className="rounded-[28px] bg-[#F7F8F3] border border-[#E1E6DA] p-7 sm:p-8 flex flex-col justify-center gap-5 relative shadow-sm">
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
          <button
            onClick={onButtonClick}
            type="button"
            className="inline-flex self-start items-center gap-3.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#6AB547] text-[#121714] text-base sm:text-[17px] font-extrabold shadow-sm hover:bg-[#5FA33E] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
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
            <span>{buttonText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
