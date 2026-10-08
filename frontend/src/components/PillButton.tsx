import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  withArrow?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary:
      "bg-[#6AB547] text-white hover:bg-[#5AA23A] active:bg-[#4D8E31] shadow-sm hover:shadow-md border border-[#5AA23A]",
    secondary:
      "bg-white text-[#121714] border border-[#E1E6DA] hover:border-[#6AB547] hover:bg-[#EEF3E6] active:bg-[#E1E6DA]",
    dark:
      "bg-[#121714] text-white hover:bg-[#1E2922] active:bg-[#0A0E0C] shadow-sm hover:shadow-md border border-[#121714]",
    ghost:
      "bg-transparent text-[#121714] hover:bg-[#EEF3E6] active:bg-[#E1E6DA] border border-transparent"
  }[variant];

  // Size styles with tap targets >= 48px for md & lg
  const sizeStyles = {
    sm: "min-h-[38px] px-4 py-1.5 text-xs font-semibold gap-2",
    md: "min-h-[48px] px-5 py-2.5 text-sm font-bold gap-2.5",
    lg: "min-h-[54px] px-7 py-3 text-base font-bold gap-3"
  }[size];

  // Arrow chip container style
  const arrowChipStyles = {
    primary: "bg-white/20 text-white",
    secondary: "bg-[#121714]/10 text-[#121714]",
    dark: "bg-white/20 text-white",
    ghost: "bg-[#121714]/10 text-[#121714]"
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}

      <span>{children}</span>

      {withArrow && !isLoading && (
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-1 transition-transform group-hover:translate-x-0.5 ${arrowChipStyles}`}
        >
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      )}
    </button>
  );
};
