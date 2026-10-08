import React from "react";

export interface LeafDecorProps {
  position?: "left" | "right" | "bottom-left" | "top-right";
  className?: string;
  variant?: "branch" | "sprout" | "fern";
}

export const LeafDecor: React.FC<LeafDecorProps> = ({
  position = "left",
  className = "",
  variant = "branch"
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      {variant === "branch" && (
        <svg
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#121714] animate-leaf-draw"
        >
          {/* Main stem curve */}
          <path
            d="M 20 220 C 40 160, 90 90, 160 30"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Leaf 1 (Left low) */}
          <path
            d="M 45 170 C 20 150, 15 125, 45 120 C 65 125, 75 145, 45 170 Z"
            stroke="#6AB547"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 45 170 C 35 145, 30 130, 45 120"
            stroke="#6AB547"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Leaf 2 (Right mid) */}
          <path
            d="M 85 130 C 120 115, 135 90, 120 70 C 95 80, 85 105, 85 130 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 85 130 C 105 105, 115 85, 120 70"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Leaf 3 (Left high) */}
          <path
            d="M 120 80 C 100 55, 95 35, 125 30 C 140 38, 145 60, 120 80 Z"
            stroke="#6AB547"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Leaf 4 (Tip sprout) */}
          <path
            d="M 160 30 C 180 15, 195 20, 185 40 C 170 50, 155 45, 160 30 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {variant === "sprout" && (
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#6AB547] animate-leaf-draw"
        >
          <path
            d="M 80 145 C 80 100, 78 70, 80 40"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Left seed leaf */}
          <path
            d="M 80 75 C 50 65, 30 75, 35 95 C 50 105, 75 90, 80 75 Z"
            stroke="#121714"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right seed leaf */}
          <path
            d="M 80 60 C 110 50, 130 60, 125 80 C 110 90, 85 75, 80 60 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Top bud */}
          <path
            d="M 80 40 C 72 25, 88 25, 80 40 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {variant === "fern" && (
        <svg
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#121714] animate-leaf-draw"
        >
          <path
            d="M 20 160 Q 80 110 160 40"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 50 140 C 40 125, 45 110, 60 120 C 65 125, 60 135, 50 140 Z"
            stroke="#6AB547"
            strokeWidth="1.4"
          />
          <path
            d="M 85 110 C 100 95, 115 105, 105 115 C 95 120, 90 115, 85 110 Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M 120 75 C 110 60, 125 50, 135 65 C 135 75, 125 75, 120 75 Z"
            stroke="#6AB547"
            strokeWidth="1.4"
          />
        </svg>
      )}
    </div>
  );
};
