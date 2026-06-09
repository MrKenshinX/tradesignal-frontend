import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        space: {
          950: "#020509",
          900: "#060B18",
          800: "#0A1128",
          700: "#0D1535",
          600: "#111B42",
          500: "#162050",
        },
        cyan: {
          neon: "#00D4FF",
          glow: "#00AACC",
          dim: "#007A99",
          pale: "#CCF5FF",
        },
        purple: {
          neon: "#7B2FFF",
          glow: "#6020DD",
          dim: "#3D1588",
          pale: "#E0CCFF",
        },
        green: {
          neon: "#00E676",
          glow: "#00B85C",
          dim: "#007A3D",
          pale: "#CCFFE8",
        },
        red: {
          neon: "#FF4757",
          glow: "#CC3344",
          dim: "#881F2A",
          pale: "#FFD0D5",
        },
        gold: {
          neon: "#FFD700",
          glow: "#CCAA00",
          dim: "#886E00",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Orbitron", "Space Grotesk", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-gradient": "linear-gradient(135deg, #060B18 0%, #0A1128 50%, #060B18 100%)",
        "glow-cyan": "radial-gradient(circle at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)",
        "glow-purple": "radial-gradient(circle at center, rgba(123, 47, 255, 0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.15)",
        "glow-cyan-sm": "0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)",
        "glow-purple": "0 0 20px rgba(123, 47, 255, 0.4), 0 0 60px rgba(123, 47, 255, 0.15)",
        "glow-green": "0 0 20px rgba(0, 230, 118, 0.4), 0 0 60px rgba(0, 230, 118, 0.15)",
        "glow-red": "0 0 20px rgba(255, 71, 87, 0.4), 0 0 60px rgba(255, 71, 87, 0.15)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 212, 255, 0.08)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 212, 255, 0.2), 0 0 20px rgba(0, 212, 255, 0.1)",
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "number-up": "number-up 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "border-glow": "border-glow 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(0, 212, 255, 0.3)" },
        },
        "scan-line": {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "number-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in-up": {
          from: { transform: "translateY(30px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(0, 212, 255, 0.3)" },
          "50%": { borderColor: "rgba(0, 212, 255, 0.8)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
