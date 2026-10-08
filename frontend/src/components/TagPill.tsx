import React from "react";
import { Sparkles } from "lucide-react";

export interface TagPillProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const TagPill: React.FC<TagPillProps> = ({
  children,
  icon = <Sparkles className="w-3.5 h-3.5 text-[#6AB547]" />,
  className = ""
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121714] text-white text-xs font-semibold tracking-wide shadow-xs select-none ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </div>
  );
};
