import React from "react";
import { Check, ShieldCheck, Truck, Package, ThumbsUp, Lock } from "lucide-react";

export type OrderStep =
  | "ordered"
  | "escrowed"
  | "shipped"
  | "delivered"
  | "released"
  | "reviewed";

export interface StatusStepperProps {
  currentStep?: OrderStep;
  className?: string;
  onStepSelect?: (step: OrderStep) => void;
}

const STEPS: {
  key: OrderStep;
  title: string;
  plainDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "ordered",
    title: "Ordered",
    plainDesc: "Farmer selects certified seed batch and confirms purchase order quantity.",
    icon: Package
  },
  {
    key: "escrowed",
    title: "Payment held safely",
    plainDesc: "Payment is locked securely in the smart contract. The seller cannot touch it.",
    icon: Lock
  },
  {
    key: "shipped",
    title: "Shipped",
    plainDesc: "Seller attaches cryptographic QR tag to seed bags and hands over to carrier.",
    icon: Truck
  },
  {
    key: "delivered",
    title: "Delivered & Scanned",
    plainDesc: "Farmer receives bags, scans QR to verify lab certificate authenticity.",
    icon: ShieldCheck
  },
  {
    key: "released",
    title: "Payment released",
    plainDesc: "Farmer confirms seed viability; smart contract automatically transfers funds to seller.",
    icon: Check
  },
  {
    key: "reviewed",
    title: "Review & Trust Score",
    plainDesc: "Farmer rates seed germination; AI trust engine updates seller reliability score.",
    icon: ThumbsUp
  }
];

export const StatusStepper: React.FC<StatusStepperProps> = ({
  currentStep = "escrowed",
  className = "",
  onStepSelect
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className={`bg-white rounded-[20px] border border-[#E1E6DA] p-6 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5B665F]">
            Transparent Order Escrow Timeline
          </span>
          <h4 className="text-base font-extrabold text-[#121714]">
            How Your Payment is Protected Every Step
          </h4>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF3E6] text-[#2E9E57] border border-[#B8E4C7]">
          Step {currentIndex + 1} of {STEPS.length}
        </span>
      </div>

      {/* Stepper horizontal track */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-[#EEF3E6] hidden sm:block -z-0" />
        {/* Active progress fill */}
        <div
          className="absolute top-5 left-6 h-1 bg-[#6AB547] transition-all duration-500 hidden sm:block -z-0"
          style={{
            width: `${(currentIndex / (STEPS.length - 1)) * 90}%`
          }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const StepIcon = step.icon;

            return (
              <button
                type="button"
                key={step.key}
                onClick={() => onStepSelect?.(step.key)}
                className={`text-left sm:text-center flex flex-col sm:items-center group p-2 rounded-xl transition-all cursor-pointer ${
                  isCurrent ? "bg-[#EEF3E6]/60" : "hover:bg-[#F7F8F3]"
                }`}
              >
                {/* Step Circle Indicator */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs mb-2 ${
                    isCompleted
                      ? "bg-[#6AB547] text-white"
                      : isCurrent
                      ? "bg-[#121714] text-white ring-4 ring-[#6AB547]/30"
                      : "bg-white text-[#5B665F] border-2 border-[#E1E6DA]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>

                {/* Step Title */}
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? "text-[#121714]"
                      : isCompleted
                      ? "text-[#6AB547]"
                      : "text-[#5B665F]"
                  }`}
                >
                  {step.title}
                </p>

                {/* Plain Description (visible on desktop or active) */}
                <p className="text-[11px] text-[#5B665F] mt-1 leading-snug hidden lg:block">
                  {step.plainDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active step highlighted plain language callout box */}
      <div className="mt-6 p-4 rounded-xl bg-[#EEF3E6] border border-[#D2ECC3] flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#6AB547] text-white flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#121714]">
            Current Stage: {STEPS[currentIndex].title}
          </p>
          <p className="text-xs text-[#5B665F] mt-0.5">
            {STEPS[currentIndex].plainDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
