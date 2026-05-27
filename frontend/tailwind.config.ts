import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          0: "hsl(222 47% 4%)",
          1: "hsl(222 47% 6%)",
          2: "hsl(222 32% 9%)",
          3: "hsl(222 24% 13%)",
        },
        line: "hsl(220 14% 18%)",
        text: {
          DEFAULT: "hsl(210 20% 96%)",
          muted: "hsl(220 12% 65%)",
          dim: "hsl(220 10% 45%)",
        },
        accent: {
          DEFAULT: "hsl(152 76% 50%)",
          soft: "hsl(152 76% 50% / 0.16)",
        },
        intel: {
          DEFAULT: "hsl(220 90% 64%)",
          soft: "hsl(220 90% 64% / 0.14)",
        },
        warn: "hsl(42 96% 60%)",
        danger: "hsl(0 84% 62%)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(220 14% 18%), 0 30px 80px -30px hsl(152 76% 50% / 0.20)",
        card: "0 1px 0 0 hsl(220 14% 22% / 0.5) inset, 0 30px 60px -30px hsl(0 0% 0% / 0.7)",
      },
      backgroundImage: {
        grid: "linear-gradient(hsl(220 14% 18% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(220 14% 18% / 0.5) 1px, transparent 1px)",
        radial: "radial-gradient(1200px 600px at 50% -10%, hsl(152 76% 50% / 0.10), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
