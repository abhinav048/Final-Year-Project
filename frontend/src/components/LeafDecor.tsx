import React from "react";

export interface LeafDecorProps {
  position?: "left" | "right" | "bottom-left" | "top-right";
  className?: string;
  variant?: "branch" | "sprout" | "fern" | "spray" | "monstera";
}

/**
 * Hand-drawn botanical line-art decorative leaves.
 * Faithful reproduction of the authentic botanical sprig with 4 leaves,
 * terminal stem droplet bulb, lateral branching veins, and micro-dewdrop details.
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
      {/* 1. Botanical Sprig (Exact structure as shown in reference image) */}
      {variant === "branch" && (
        <svg
          viewBox="0 0 160 270"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_16px_rgba(46,111,64,0.12)]"
        >
          <defs>
            <linearGradient id="leafGradImg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBEAD2" stopOpacity="0.88" />
              <stop offset="55%" stopColor="#AEE0BA" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#86CF97" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="stemGradImg" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E4D2B" />
              <stop offset="50%" stopColor="#2A6237" />
              <stop offset="100%" stopColor="#377846" />
            </linearGradient>
            <radialGradient id="dewdropGradImg" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#E0F5E8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#A2D7AF" stopOpacity="0.65" />
            </radialGradient>
          </defs>

          {/* Background subtle wavy contour lines (as seen in the reference image) */}
          <g opacity="0.22" stroke="#6AB547" strokeWidth="0.85" fill="none">
            <path d="M -10 36 Q 35 22 80 36 T 170 36" />
            <path d="M -10 86 Q 40 72 85 86 T 170 86" />
            <path d="M -10 138 Q 35 124 80 138 T 170 138" />
            <path d="M -10 190 Q 40 176 85 190 T 170 190" />
            <path d="M -10 242 Q 35 228 80 242 T 170 242" />
          </g>

          {/* Main Stem curving gracefully from bottom to top-right */}
          <path
            d="M 48 266 C 46 216, 56 160, 92 100 C 108 72, 122 54, 132 44"
            stroke="url(#stemGradImg)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Terminal Droplet / Bud Loop at the very top tip of the stem */}
          <g>
            <path
              d="M 132 44 C 136 34, 147 32, 151 40 C 155 49, 145 58, 138 56 C 133 54, 131 48, 132 44 Z"
              fill="url(#dewdropGradImg)"
              stroke="#275C34"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* White highlight glint on terminal droplet */}
            <circle cx="145" cy="41" r="2.2" fill="#FFFFFF" fillOpacity="0.95" />
            <ellipse cx="140" cy="48" rx="2.8" ry="1.4" fill="#FFFFFF" fillOpacity="0.45" />
          </g>

          {/* Leaf 1 (Bottom Left - pointing outward and upward to the left) */}
          <g>
            <path
              d="M 50 218 C 24 218, 14 194, 25 170 C 42 162, 55 190, 50 218 Z"
              fill="url(#leafGradImg)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Central Midrib */}
            <path d="M 50 218 C 38 200, 30 184, 25 170" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            {/* Lateral Veins */}
            <path d="M 42 204 Q 30 202, 22 192" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 35 190 Q 27 186, 21 178" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 40 198 Q 48 188, 50 180" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
          </g>

          {/* Leaf 2 (Mid Left - pointing upward-left) */}
          <g>
            <path
              d="M 74 148 C 52 142, 42 120, 56 96 C 75 92, 86 118, 74 148 Z"
              fill="url(#leafGradImg)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Central Midrib */}
            <path d="M 74 148 C 66 130, 60 112, 56 96" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            {/* Lateral Veins */}
            <path d="M 68 134 Q 56 128, 48 120" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 63 120 Q 56 114, 52 105" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 68 128 Q 76 118, 78 108" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
          </g>

          {/* Leaf 3 (Mid Right - pointing DOWNWARD and right, exactly as in image!) */}
          <g>
            <path
              d="M 76 146 C 96 150, 116 168, 78 190 C 80 168, 78 152, 76 146 Z"
              fill="url(#leafGradImg)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Central Midrib */}
            <path d="M 76 146 C 88 160, 90 176, 78 190" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            {/* Lateral Veins */}
            <path d="M 82 158 Q 98 162, 108 168" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 84 170 Q 94 176, 92 184" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 79 162 Q 74 172, 72 180" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            {/* Glistening Micro-Dewdrop on leaf blade */}
            <ellipse cx="94" cy="162" rx="3.4" ry="3.2" fill="#FFFFFF" fillOpacity="0.9" stroke="#275C34" strokeWidth="0.8" />
            <circle cx="93" cy="161" r="1.4" fill="#FFFFFF" />
            <ellipse cx="95" cy="164" rx="2" ry="0.8" fill="#1C4524" fillOpacity="0.25" />
          </g>

          {/* Leaf 4 (Upper Right - pointing upward-right towards the tip) */}
          <g>
            <path
              d="M 102 92 C 114 70, 138 62, 136 86 C 128 104, 110 102, 102 92 Z"
              fill="url(#leafGradImg)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Central Midrib */}
            <path d="M 102 92 C 114 82, 126 74, 136 86" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            {/* Lateral Veins */}
            <path d="M 112 86 Q 122 78, 128 72" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 118 92 Q 126 86, 132 80" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 112 94 Q 118 100, 120 104" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
          </g>
        </svg>
      )}

      {/* 2. Mirrored Inward-Leaning Botanical Sprig (for right-hand balance) */}
      {variant === "fern" && (
        <svg
          viewBox="0 0 160 270"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_16px_rgba(46,111,64,0.12)]"
        >
          <defs>
            <linearGradient id="leafGradFernMirrored" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CBEAD2" stopOpacity="0.88" />
              <stop offset="55%" stopColor="#AEE0BA" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#86CF97" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="stemGradFernMirrored" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1E4D2B" />
              <stop offset="50%" stopColor="#2A6237" />
              <stop offset="100%" stopColor="#377846" />
            </linearGradient>
            <radialGradient id="dewdropGradFernMirrored" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#E0F5E8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#A2D7AF" stopOpacity="0.65" />
            </radialGradient>
          </defs>

          {/* Background subtle wavy contour lines */}
          <g opacity="0.22" stroke="#6AB547" strokeWidth="0.85" fill="none">
            <path d="M 170 36 Q 125 22 80 36 T -10 36" />
            <path d="M 170 86 Q 120 72 75 86 T -10 86" />
            <path d="M 170 138 Q 125 124 80 138 T -10 138" />
            <path d="M 170 190 Q 120 176 75 190 T -10 190" />
            <path d="M 170 242 Q 125 228 80 242 T -10 242" />
          </g>

          {/* Main Stem curving inward to the top-left */}
          <path
            d="M 112 266 C 114 216, 104 160, 68 100 C 52 72, 38 54, 28 44"
            stroke="url(#stemGradFernMirrored)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Terminal Droplet Loop at top-left tip */}
          <g>
            <path
              d="M 28 44 C 24 34, 13 32, 9 40 C 5 49, 15 58, 22 56 C 27 54, 29 48, 28 44 Z"
              fill="url(#dewdropGradFernMirrored)"
              stroke="#275C34"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="15" cy="41" r="2.2" fill="#FFFFFF" fillOpacity="0.95" />
            <ellipse cx="20" cy="48" rx="2.8" ry="1.4" fill="#FFFFFF" fillOpacity="0.45" />
          </g>

          {/* Leaf 1 (Bottom Right) */}
          <g>
            <path
              d="M 110 218 C 136 218, 146 194, 135 170 C 118 162, 105 190, 110 218 Z"
              fill="url(#leafGradFernMirrored)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M 110 218 C 122 200, 130 184, 135 170" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            <path d="M 118 204 Q 130 202, 138 192" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 125 190 Q 133 186, 139 178" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 120 198 Q 112 188, 110 180" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
          </g>

          {/* Leaf 2 (Mid Right) */}
          <g>
            <path
              d="M 86 148 C 108 142, 118 120, 104 96 C 85 92, 74 118, 86 148 Z"
              fill="url(#leafGradFernMirrored)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M 86 148 C 94 130, 100 112, 104 96" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            <path d="M 92 134 Q 104 128, 112 120" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 97 120 Q 104 114, 108 105" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 92 128 Q 84 118, 82 108" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
          </g>

          {/* Leaf 3 (Mid Left - pointing DOWNWARD and left with dewdrop) */}
          <g>
            <path
              d="M 84 146 C 64 150, 44 168, 82 190 C 80 168, 82 152, 84 146 Z"
              fill="url(#leafGradFernMirrored)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M 84 146 C 72 160, 70 176, 82 190" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            <path d="M 78 158 Q 62 162, 52 168" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 76 170 Q 66 176, 68 184" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 81 162 Q 86 172, 88 180" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <ellipse cx="66" cy="162" rx="3.4" ry="3.2" fill="#FFFFFF" fillOpacity="0.9" stroke="#275C34" strokeWidth="0.8" />
            <circle cx="67" cy="161" r="1.4" fill="#FFFFFF" />
            <ellipse cx="65" cy="164" rx="2" ry="0.8" fill="#1C4524" fillOpacity="0.25" />
          </g>

          {/* Leaf 4 (Upper Left) */}
          <g>
            <path
              d="M 58 92 C 46 70, 22 62, 24 86 C 32 104, 50 102, 58 92 Z"
              fill="url(#leafGradFernMirrored)"
              stroke="#275C34"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M 58 92 C 46 82, 34 74, 24 86" stroke="#275C34" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
            <path d="M 48 86 Q 38 78, 32 72" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 42 92 Q 34 86, 28 80" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
            <path d="M 48 94 Q 42 100, 40 104" stroke="#275C34" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.75" />
          </g>
        </svg>
      )}

      {/* 3. Sprout / Seedling */}
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
              <stop offset="100%" stopColor="#3B7D4B" />
            </linearGradient>
            <linearGradient id="sproutGradLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8EAD0" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#A8DEB3" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#81C784" stopOpacity="0.4" />
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
              stroke="#2E6238"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M 69 105 C 44 116, 26 126, 18 132" stroke="#2E6238" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.75" />
            <circle cx="28" cy="122" r="2.2" fill="#FFFFFF" fillOpacity="0.85" />
          </g>

          {/* Right Leaf */}
          <g>
            <path
              d="M 71 85 C 108 72, 130 84, 124 110 C 104 122, 78 104, 71 85 Z"
              fill="url(#sproutGradLeaf)"
              stroke="#2E6238"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M 71 85 C 96 95, 114 104, 124 110" stroke="#2E6238" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.75" />
            <circle cx="112" cy="98" r="2.2" fill="#FFFFFF" fillOpacity="0.85" />
          </g>

          {/* Top Sprout Tip Bulb */}
          <circle cx="70" cy="34" r="3.2" fill="#6AB547" stroke="#2E6238" strokeWidth="1.2" />
          <circle cx="69" cy="33" r="1.2" fill="#FFFFFF" fillOpacity="0.9" />
        </svg>
      )}

      {/* 4. Spray */}
      {variant === "spray" && (
        <svg
          viewBox="0 0 160 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(46,111,64,0.1)]"
        >
          <path
            d="M 25 210 C 40 150, 90 90, 140 20"
            stroke="#2E6238"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <g>
            <ellipse cx="60" cy="155" rx="20" ry="8" transform="rotate(-35 60 155)" fill="#C8EAD0" fillOpacity="0.7" stroke="#2E6238" strokeWidth="1.4" />
            <path d="M 50 162 L 70 148" stroke="#2E6238" strokeWidth="0.8" strokeOpacity="0.7" />
          </g>
          <g>
            <ellipse cx="82" cy="120" rx="22" ry="9" transform="rotate(25 82 120)" fill="#C8EAD0" fillOpacity="0.7" stroke="#2E6238" strokeWidth="1.4" />
            <path d="M 70 115 L 94 125" stroke="#2E6238" strokeWidth="0.8" strokeOpacity="0.7" />
            <circle cx="88" cy="116" r="2" fill="#FFFFFF" fillOpacity="0.9" />
          </g>
          <g>
            <ellipse cx="105" cy="80" rx="18" ry="7" transform="rotate(-30 105 80)" fill="#C8EAD0" fillOpacity="0.7" stroke="#2E6238" strokeWidth="1.4" />
            <path d="M 96 85 L 114 75" stroke="#2E6238" strokeWidth="0.8" strokeOpacity="0.7" />
          </g>
          <g>
            <ellipse cx="125" cy="46" rx="15" ry="6" transform="rotate(20 125 46)" fill="#C8EAD0" fillOpacity="0.7" stroke="#2E6238" strokeWidth="1.4" />
          </g>
        </svg>
      )}

      {/* 5. Monstera */}
      {variant === "monstera" && (
        <svg
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_6px_16px_rgba(46,111,64,0.12)]"
        >
          <path
            d="M 100 210 C 100 150, 102 70, 100 15"
            stroke="#2E6238"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M 100 20 
               C 125 25, 150 40, 165 65 C 150 70, 135 75, 125 80 C 145 88, 168 95, 172 120 C 150 122, 132 122, 122 126 C 140 138, 155 152, 145 178 C 128 172, 115 162, 105 156
               C 100 190, 100 210, 100 210
               C 100 210, 100 190, 95 156 C 85 162, 72 172, 55 178 C 45 152, 60 138, 78 126 C 68 122, 50 122, 28 120 C 32 95, 55 88, 75 80 C 65 75, 50 70, 35 65 C 50 40, 75 25, 100 20 Z"
            fill="#C8EAD0"
            fillOpacity="0.65"
            stroke="#2E6238"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M 100 65 Q 120 70 140 68" stroke="#2E6238" strokeWidth="1.2" strokeOpacity="0.75" />
          <path d="M 100 100 Q 125 106 150 105" stroke="#2E6238" strokeWidth="1.2" strokeOpacity="0.75" />
          <path d="M 100 140 Q 120 146 135 152" stroke="#2E6238" strokeWidth="1.2" strokeOpacity="0.75" />
          <path d="M 100 65 Q 80 70 60 68" stroke="#2E6238" strokeWidth="1.2" strokeOpacity="0.75" />
          <path d="M 100 100 Q 75 106 50 105" stroke="#2E6238" strokeWidth="1.2" strokeOpacity="0.75" />
          <path d="M 100 140 Q 80 146 65 152" stroke="#2E6238" strokeWidth="1.2" strokeOpacity="0.75" />
          <circle cx="120" cy="55" r="2.6" fill="#FFFFFF" fillOpacity="0.9" />
          <circle cx="75" cy="90" r="2.6" fill="#FFFFFF" fillOpacity="0.9" />
        </svg>
      )}
    </div>
  );
};
