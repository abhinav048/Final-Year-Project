/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Backdrop Palette (#0F2A1D -> #1E4D2B)
        backdrop: {
          start: '#0F2A1D',
          end: '#1E4D2B',
          deep: '#163A24'
        },
        // Warm Sheet / Surface
        sheet: {
          DEFAULT: '#F7F8F3',
          sage: '#EEF3E6',
          sand: '#F1EFE6',
          card: '#FFFFFF'
        },
        // Primary Leaf Green
        leaf: {
          DEFAULT: '#6AB547',
          hover: '#5AA23A',
          pressed: '#4D8E31',
          subtle: '#EEF7E8',
          deep: '#163A24'
        },
        // Ink & Slate Typography
        ink: {
          DEFAULT: '#121714',
          muted: '#5B665F',
          border: '#E1E6DA',
          soft: '#85928B'
        },
        // Accent Colors
        accent: {
          amber: '#E9A93B',
          red: '#D8503F',
          teal: '#2F8F83'
        },
        // Trust Rating Multi-Tier Colors
        trust: {
          excellent: '#2E9E57',
          trusted: '#6AB547',
          moderate: '#E9A93B',
          low: '#E27B3C',
          risk: '#D8503F'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: {
        'sheet': '28px',
        'card': '20px'
      },
      boxShadow: {
        'sheet': '0 8px 30px rgba(15, 42, 29, 0.08)',
        'card': '0 4px 20px rgba(15, 42, 29, 0.05)',
        'card-hover': '0 12px 32px rgba(15, 42, 29, 0.12)'
      }
    },
  },
  plugins: [],
}
