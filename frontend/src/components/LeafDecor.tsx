import React from "react";

export interface LeafDecorProps {
  position?: "left" | "right" | "bottom-left" | "top-right";
  className?: string;
  variant?: "branch" | "sprout" | "fern" | "spray";
}

/**
 * Hand-drawn botanical line-art decorative leaves.
 * Designed with elegant organic curves, subtle veins, and translucent botanical tints.
 */
export const LeafDecor: React.FC<LeafDecorProps> = ({
  className = "",
  variant = "branch"
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none transition-opacity duration-700 ${className}`}
    >
      {variant === "branch" && (
        <svg
          viewBox="0 0 160 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Main graceful arching stem */}
          <path
            d="M 25 210 C 35 160, 60 110, 135 25"
            stroke="#2E6238"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Leaf 1 - Lower Left */}
          <g className="opacity-90">
            <path
              d="M 38 180 C 12 175, 4 145, 24 135 C 44 140, 48 165, 38 180 Z"
              fill="#6AB547"
              fillOpacity="0.12"
              stroke="#437E36"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 38 180 C 28 165, 20 152, 24 135"
              stroke="#437E36"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Leaf 2 - Mid Right */}
          <g className="opacity-90">
            <path
              d="M 68 145 C 95 140, 115 120, 108 98 C 88 95, 70 120, 68 145 Z"
              fill="#6AB547"
              fillOpacity="0.12"
              stroke="#2E6238"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 68 145 C 85 130, 98 115, 108 98"
              stroke="#2E6238"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Leaf 3 - Mid Left */}
          <g className="opacity-90">
            <path
              d="M 80 115 C 55 105, 50 80, 68 70 C 85 75, 88 98, 80 115 Z"
              fill="#6AB547"
              fillOpacity="0.14"
              stroke="#437E36"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 80 115 C 72 100, 66 88, 68 70"
              stroke="#437E36"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Leaf 4 - Upper Right */}
          <g className="opacity-90">
            <path
              d="M 108 80 C 130 75, 145 58, 140 40 C 122 38, 110 58, 108 80 Z"
              fill="#6AB547"
              fillOpacity="0.12"
              stroke="#2E6238"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 108 80 C 122 68, 132 54, 140 40"
              stroke="#2E6238"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Tip Leaflet */}
          <g className="opacity-95">
            <path
              d="M 135 25 C 148 12, 155 18, 148 32 C 140 38, 134 32, 135 25 Z"
              fill="#6AB547"
              fillOpacity="0.18"
              stroke="#2E6238"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )}

      {variant === "sprout" && (
        <svg
          viewBox="0 0 140 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Main shoot */}
          <path
            d="M 70 170 C 70 120, 68 85, 70 45"
            stroke="#2E6238"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Left Cotyledon Leaf */}
          <path
            d="M 69 95 C 42 88, 20 95, 24 118 C 38 128, 62 112, 69 95 Z"
            fill="#6AB547"
            fillOpacity="0.15"
            stroke="#437E36"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M 69 95 C 48 102, 35 110, 24 118"
            stroke="#437E36"
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Right Cotyledon Leaf */}
          <path
            d="M 71 80 C 98 72, 120 78, 116 102 C 102 112, 78 98, 71 80 Z"
            fill="#6AB547"
            fillOpacity="0.15"
            stroke="#2E6238"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M 71 80 C 92 86, 105 94, 116 102"
            stroke="#2E6238"
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Tender Top Baby Leaf */}
          <path
            d="M 70 45 C 64 28, 76 28, 70 45 Z"
            fill="#6AB547"
            fillOpacity="0.2"
            stroke="#2E6238"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {variant === "fern" && (
        <svg
          viewBox="0 0 160 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Stem curving left to right */}
          <path
            d="M 135 210 C 125 160, 95 110, 25 25"
            stroke="#2E6238"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Right lower leaflet */}
          <g className="opacity-90">
            <path
              d="M 122 180 C 148 175, 156 145, 136 135 C 116 140, 112 165, 122 180 Z"
              fill="#6AB547"
              fillOpacity="0.12"
              stroke="#437E36"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 122 180 C 132 165, 140 152, 136 135"
              stroke="#437E36"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Left mid leaflet */}
          <g className="opacity-90">
            <path
              d="M 92 145 C 65 140, 45 120, 52 98 C 72 95, 90 120, 92 145 Z"
              fill="#6AB547"
              fillOpacity="0.12"
              stroke="#2E6238"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 92 145 C 75 130, 62 115, 52 98"
              stroke="#2E6238"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Right mid leaflet */}
          <g className="opacity-90">
            <path
              d="M 80 115 C 105 105, 110 80, 92 70 C 75 75, 72 98, 80 115 Z"
              fill="#6AB547"
              fillOpacity="0.14"
              stroke="#437E36"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 80 115 C 88 100, 94 88, 92 70"
              stroke="#437E36"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Upper left leaflet */}
          <g className="opacity-90">
            <path
              d="M 52 80 C 30 75, 15 58, 20 40 C 38 38, 50 58, 52 80 Z"
              fill="#6AB547"
              fillOpacity="0.12"
              stroke="#2E6238"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 52 80 C 38 68, 28 54, 20 40"
              stroke="#2E6238"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Tip Leaflet */}
          <g className="opacity-95">
            <path
              d="M 25 25 C 12 12, 5 18, 12 32 C 20 38, 26 32, 25 25 Z"
              fill="#6AB547"
              fillOpacity="0.18"
              stroke="#2E6238"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )}

      {variant === "spray" && (
        <svg
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <path
            d="M 20 160 Q 80 120 160 30"
            stroke="#2E6238"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 55 135 C 38 120, 36 102, 52 98 C 68 105, 68 125, 55 135 Z"
            fill="#6AB547"
            fillOpacity="0.12"
            stroke="#437E36"
            strokeWidth="1.4"
          />
          <path
            d="M 95 100 C 112 85, 128 92, 120 108 C 105 116, 92 110, 95 100 Z"
            fill="#6AB547"
            fillOpacity="0.12"
            stroke="#2E6238"
            strokeWidth="1.4"
          />
          <path
            d="M 130 65 C 118 48, 130 38, 144 48 C 146 62, 136 68, 130 65 Z"
            fill="#6AB547"
            fillOpacity="0.14"
            stroke="#437E36"
            strokeWidth="1.4"
          />
        </svg>
      )}
    </div>
  );
};
