import React from "react";
import { Sprout } from "lucide-react";
import { PillButton } from "./PillButton";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <Sprout className="w-8 h-8 text-[#6AB547]" />
}) => {
  return (
    <div className="p-10 text-center rounded-[24px] bg-white border border-[#E1E6DA] max-w-md mx-auto my-6 shadow-xs">
      <div className="w-16 h-16 rounded-full bg-[#EEF3E6] border border-[#D2ECC3] flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-black text-[#121714] mb-1">{title}</h4>
      <p className="text-xs text-[#5B665F] leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <PillButton variant="primary" size="sm" withArrow onClick={onAction}>
          {actionLabel}
        </PillButton>
      )}
    </div>
  );
};
