import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { PillButton } from "./PillButton";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-[#EEF3E6] rounded-xl ${className}`}
    />
  );
};

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "Could not connect to the local node or remote API. Please check your network and try again.",
  onRetry
}) => {
  return (
    <div className="p-8 text-center rounded-[24px] bg-[#FDF1F0] border border-[#F7B8B2] max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-xs text-[#D8503F]">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-extrabold text-[#D8503F] mb-1">{title}</h4>
      <p className="text-xs text-[#5B665F] leading-relaxed mb-5">{description}</p>
      {onRetry && (
        <PillButton
          variant="secondary"
          size="sm"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Retry Request
        </PillButton>
      )}
    </div>
  );
};
