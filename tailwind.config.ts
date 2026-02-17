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
        ink: "#1A1A2E",
        plum: "#4A2D6B",
        violet: {
          DEFAULT: "#7B61FF",
          light: "#9B8AFF",
        },
        coral: {
          DEFAULT: "#FF6B6B",
          soft: "rgba(255, 107, 107, 0.08)",
        },
        teal: {
          DEFAULT: "#2DD4BF",
          soft: "rgba(45, 212, 191, 0.08)",
        },
        amber: "#FBBF24",
        grey: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
        full: "9999px",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #1A1A2E 0%, #4A2D6B 50%, #7B61FF 100%)",
        "violet-gradient":
          "linear-gradient(135deg, #7B61FF 0%, #9B8AFF 100%)",
        "deep-gradient":
          "linear-gradient(135deg, #1A1A2E 0%, #4A2D6B 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 20s ease-in-out infinite",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
