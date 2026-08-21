/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deshi: {
          blue:        "#0F4C81",
          "blue-dark":  "#0A3357",
          "blue-mid":   "#1a6bb5",
          "blue-light": "#2563EB",
          red:         "#DC2626",
          "red-dark":   "#991B1B",
          "red-mid":    "#c41f1f",
          "red-light":  "#EF4444",
          green:       "#006A4E",
          gold:        "#D97706",
          "gold-light": "#F59E0B",
        },
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Sora", "Inter", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-blue":    "0 0 20px rgba(15,76,129,0.25), 0 4px 12px rgba(15,76,129,0.15)",
        "glow-blue-lg": "0 0 40px rgba(15,76,129,0.35), 0 8px 24px rgba(15,76,129,0.2)",
        "glow-red":     "0 0 20px rgba(220,38,38,0.25), 0 4px 12px rgba(220,38,38,0.15)",
        "glow-red-lg":  "0 0 40px rgba(220,38,38,0.35), 0 8px 24px rgba(220,38,38,0.2)",
        "glow-gold":    "0 0 20px rgba(217,119,6,0.3), 0 4px 12px rgba(217,119,6,0.15)",
        "card":         "0 4px 24px rgba(15,76,129,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        "card-lg":      "0 12px 48px rgba(15,76,129,0.12), 0 4px 12px rgba(0,0,0,0.06)",
        "inner-shine":  "inset 0 1px 0 rgba(255,255,255,0.15)",
      },
      animation: {
        "fade-in":       "fadeIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        "slide-up":      "slideUpIn 0.45s cubic-bezier(0.4,0,0.2,1) forwards",
        "pop-in":        "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "countdown":     "countdownPulse 1s ease-in-out infinite",
        "ring-glow":     "ringGlow 2.5s ease-in-out infinite",
        "glow-blue":     "glowPulseBlue 2.4s ease-in-out infinite",
        "glow-red":      "glowPulseRed 2.4s ease-in-out infinite",
        "float":         "floatGentle 3s ease-in-out infinite",
        "shimmer":       "shimmerText 4s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      scale: {
        98: "0.98",
        102: "1.02",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
