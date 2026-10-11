import React from "react";

export interface LeafDecorProps {
  position?: "left" | "right" | "bottom-left" | "top-right";
  className?: string;
  variant?: "branch" | "sprout" | "fern" | "spray" | "monstera";
}

/**
 * Hand-drawn botanical line-art decorative leaves.
 * Designed with elegant organic curves, subtle veins, gradient botanical tints, and micro-dewdrops.
 */
export const LeafDecor: React.FC<LeafDecorProps> = ({
  className = "",
  variant = "branch"
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none transition-transform duration-500 ${className}`}
    >
      {variant === "branch" && (
        <svg
          viewBox="0 0 180 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(46,111,64,0.12)]"
        >
          <defs>
            <linearGradient id="leafGradBranch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#81C784" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#4CAF50" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="stemGradBranch" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B4D28" />
              <stop offset="100%" stopColor="#4A8C40" />
            </linearGradient>
          </defs>

          {/* Graceful Arching Main Stem */}
          <path
            d="M 30 250 C 35 180, 70 110, 155 20"
            stroke="url(#stemGradBranch)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Leaf 1 - Bottom Left */}
          <g>
            <path
              d="M 42 215 C 10 205, -2 165, 25 150 C 50 158, 54 195, 42 215 Z"
              fill="url(#leafGradBranch)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 42 215 C 30 195, 20 178, 25 150"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 36 195 Q 24 190 16 182" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 32 178 Q 22 172 14 165" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 38 190 Q 44 182 48 174" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          </g>

          {/* Leaf 2 - Mid Right */}
          <g>
            <path
              d="M 75 170 C 112 162, 138 135, 128 108 C 104 104, 78 138, 75 170 Z"
              fill="url(#leafGradBranch)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 75 170 C 96 150, 114 130, 128 108"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 88 155 Q 98 142 106 132" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 82 148 Q 72 138 68 126" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 102 138 Q 115 130 122 120" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <circle cx="106" cy="120" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="107" cy="119" r="1" fill="#2E6F40" fillOpacity="0.4" />
          </g>

          {/* Leaf 3 - Mid Left */}
          <g>
            <path
              d="M 90 135 C 58 120, 52 88, 74 76 C 96 82, 100 114, 90 135 Z"
              fill="url(#leafGradBranch)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 90 135 C 79 116, 72 100, 74 76"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 84 120 Q 72 112 62 104" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 80 105 Q 70 96 64 88" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 86 114 Q 92 104 96 95" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          </g>

          {/* Leaf 4 - Upper Right */}
          <g>
            <path
              d="M 122 92 C 150 84, 168 62, 160 40 C 138 38, 122 64, 122 92 Z"
              fill="url(#leafGradBranch)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 122 92 C 140 76, 152 58, 160 40"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 135 80 Q 148 72 155 60" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 130 72 Q 120 62 116 52" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          </g>

          {/* Tip Leaflet */}
          <g>
            <path
              d="M 155 20 C 172 6, 180 14, 172 30 C 162 36, 154 28, 155 20 Z"
              fill="url(#leafGradBranch)"
              stroke="#2E6F40"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="166" cy="18" r="1.8" fill="#FFFFFF" fillOpacity="0.9" />
          </g>
        </svg>
      )}

      {variant === "fern" && (
        <svg
          viewBox="0 0 180 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(46,111,64,0.12)]"
        >
          <defs>
            <linearGradient id="leafGradFern" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#81C784" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#4CAF50" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="stemGradFern" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1B4D28" />
              <stop offset="100%" stopColor="#4A8C40" />
            </linearGradient>
          </defs>

          {/* Symmetrical Arching Main Stem curving inward to the left */}
          <path
            d="M 150 250 C 145 180, 110 110, 25 20"
            stroke="url(#stemGradFern)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Leaf 1 - Bottom Right */}
          <g>
            <path
              d="M 138 215 C 170 205, 182 165, 155 150 C 130 158, 126 195, 138 215 Z"
              fill="url(#leafGradFern)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 138 215 C 150 195, 160 178, 155 150"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 144 195 Q 156 190 164 182" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 148 178 Q 158 172 166 165" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 142 190 Q 136 182 132 174" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          </g>

          {/* Leaf 2 - Mid Left */}
          <g>
            <path
              d="M 105 170 C 68 162, 42 135, 52 108 C 76 104, 102 138, 105 170 Z"
              fill="url(#leafGradFern)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 105 170 C 84 150, 66 130, 52 108"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 92 155 Q 82 142 74 132" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 98 148 Q 108 138 112 126" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 78 138 Q 65 130 58 120" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <circle cx="74" cy="120" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="73" cy="119" r="1" fill="#2E6F40" fillOpacity="0.4" />
          </g>

          {/* Leaf 3 - Mid Right */}
          <g>
            <path
              d="M 90 135 C 122 120, 128 88, 106 76 C 84 82, 80 114, 90 135 Z"
              fill="url(#leafGradFern)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 90 135 C 101 116, 108 100, 106 76"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 96 120 Q 108 112 118 104" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 100 105 Q 110 96 116 88" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 94 114 Q 88 104 84 95" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          </g>

          {/* Leaf 4 - Upper Left */}
          <g>
            <path
              d="M 58 92 C 30 84, 12 62, 20 40 C 42 38, 58 64, 58 92 Z"
              fill="url(#leafGradFern)"
              stroke="#2E6F40"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 58 92 C 40 76, 28 58, 20 40"
              stroke="#2E6F40"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path d="M 45 80 Q 32 72 25 60" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <path d="M 50 72 Q 60 62 64 52" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          </g>

          {/* Tip Leaflet */}
          <g>
            <path
              d="M 25 20 C 8 6, 0 14, 8 30 C 18 36, 26 28, 25 20 Z"
              fill="url(#leafGradFern)"
              stroke="#2E6F40"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="14" cy="18" r="1.8" fill="#FFFFFF" fillOpacity="0.9" />
          </g>
        </svg>
      )}

      {variant === "sprout" && (
        <svg
          viewBox="0 0 140 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(46,111,64,0.12)]"
        >
          <defs>
            <linearGradient id="sproutGradStem" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1E4D2B" />
              <stop offset="100%" stopColor="#4A8C40" />
            </linearGradient>
            <linearGradient id="sproutGradLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3E635" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#6AB547" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2E6F40" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Central Stem */}
          <path
            d="M 70 170 C 70 120, 68 85, 70 35"
            stroke="url(#sproutGradStem)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Left Leaf */}
          <g>
            <path
              d="M 69 105 C 32 96, 12 108, 18 132 C 38 144, 64 122, 69 105 Z"
              fill="url(#sproutGradLeaf)"
              stroke="#2E6F40"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 69 105 C 44 116, 26 126, 18 132" stroke="#2E6F40" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="28" cy="122" r="2" fill="#FFFFFF" fillOpacity="0.8" />
          </g>

          {/* Right Leaf */}
          <g>
            <path
              d="M 71 85 C 108 72, 130 84, 124 110 C 104 122, 78 104, 71 85 Z"
              fill="url(#sproutGradLeaf)"
              stroke="#2E6F40"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 71 85 C 96 95, 114 104, 124 110" stroke="#2E6F40" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="112" cy="98" r="2" fill="#FFFFFF" fillOpacity="0.8" />
          </g>

          {/* Top Sprout Tip */}
          <circle cx="70" cy="34" r="3" fill="#6AB547" />
        </svg>
      )}

      {variant === "spray" && (
        <svg
          viewBox="0 0 160 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(46,111,64,0.1)]"
        >
          <defs>
            <linearGradient id="sprayGradStem" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E4D2B" />
              <stop offset="100%" stopColor="#52A332" />
            </linearGradient>
            <linearGradient id="sprayGradLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#4ADE80" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Gently Sinuous Stem */}
          <path
            d="M 25 210 C 40 150, 90 90, 140 20"
            stroke="url(#sprayGradStem)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Leaflets arranged in elegant sprays */}
          <g>
            <ellipse cx="60" cy="155" rx="20" ry="8" transform="rotate(-35 60 155)" fill="url(#sprayGradLeaf)" stroke="#2E6F40" strokeWidth="1.3" />
            <path d="M 50 162 L 70 148" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.7" />
          </g>
          <g>
            <ellipse cx="82" cy="120" rx="22" ry="9" transform="rotate(25 82 120)" fill="url(#sprayGradLeaf)" stroke="#2E6F40" strokeWidth="1.3" />
            <path d="M 70 115 L 94 125" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.7" />
            <circle cx="88" cy="116" r="1.8" fill="#FFFFFF" fillOpacity="0.85" />
          </g>
          <g>
            <ellipse cx="105" cy="80" rx="18" ry="7" transform="rotate(-30 105 80)" fill="url(#sprayGradLeaf)" stroke="#2E6F40" strokeWidth="1.3" />
            <path d="M 96 85 L 114 75" stroke="#2E6F40" strokeWidth="0.8" strokeOpacity="0.7" />
          </g>
          <g>
            <ellipse cx="125" cy="46" rx="15" ry="6" transform="rotate(20 125 46)" fill="url(#sprayGradLeaf)" stroke="#2E6F40" strokeWidth="1.3" />
          </g>
        </svg>
      )}

      {variant === "monstera" && (
        <svg
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_6px_16px_rgba(46,111,64,0.15)]"
        >
          <defs>
            <linearGradient id="monsteraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#22C55E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Central Stem */}
          <path
            d="M 100 210 C 100 150, 102 70, 100 15"
            stroke="#2E6F40"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Monstera Body with deep natural botanical cuts */}
          <path
            d="M 100 20 
               C 125 25, 150 40, 165 65 C 150 70, 135 75, 125 80 C 145 88, 168 95, 172 120 C 150 122, 132 122, 122 126 C 140 138, 155 152, 145 178 C 128 172, 115 162, 105 156
               C 100 190, 100 210, 100 210
               C 100 210, 100 190, 95 156 C 85 162, 72 172, 55 178 C 45 152, 60 138, 78 126 C 68 122, 50 122, 28 120 C 32 95, 55 88, 75 80 C 65 75, 50 70, 35 65 C 50 40, 75 25, 100 20 Z"
            fill="url(#monsteraGrad)"
            stroke="#2E6F40"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Lateral Fenestrations / Ribs */}
          <path d="M 100 65 Q 120 70 140 68" stroke="#2E6F40" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 100 100 Q 125 106 150 105" stroke="#2E6F40" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 100 140 Q 120 146 135 152" stroke="#2E6F40" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

          <path d="M 100 65 Q 80 70 60 68" stroke="#2E6F40" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 100 100 Q 75 106 50 105" stroke="#2E6F40" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M 100 140 Q 80 146 65 152" stroke="#2E6F40" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

          {/* Micro Dewdrop Accents */}
          <circle cx="120" cy="55" r="2.5" fill="#FFFFFF" fillOpacity="0.85" />
          <circle cx="75" cy="90" r="2" fill="#FFFFFF" fillOpacity="0.85" />
        </svg>
      )}
    </div>
  );
};

