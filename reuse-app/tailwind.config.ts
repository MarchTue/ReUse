import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#007AFF", // iOS Blue
          foreground: "#FFFFFF",
          50: "#E6F3FF",
          100: "#CCE7FF",
          500: "#007AFF",
          600: "#0056CC",
          700: "#004499",
        },
        secondary: {
          DEFAULT: "#F3F3F4", // iOS Gray
          foreground: "#1C1C1E",
        },
        destructive: {
          DEFAULT: "#FF3B30", // iOS Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F3F4",
          foreground: "#8E8E93",
        },
        accent: {
          DEFAULT: "#F3F3F4",
          foreground: "#1C1C1E",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C1C1E",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C1C1E",
        },
        // iOS 시스템 컬러
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          indigo: "#5856D6",
          orange: "#FF9500",
          pink: "#FF2D92",
          purple: "#AF52DE",
          red: "#FF3B30",
          teal: "#5AC8FA",
          yellow: "#FFCC00",
          gray: "#8E8E93",
          gray2: "#AEAEB2",
          gray3: "#C7C7CC",
          gray4: "#D1D1D6",
          gray5: "#E5E5EA",
          gray6: "#F2F2F7",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // iOS 스타일 radius
        ios: "10px",
        "ios-lg": "16px",
        "ios-xl": "20px",
        "ios-2xl": "24px",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        "ios-caption2": ["11px", { lineHeight: "13px", fontWeight: "400" }],
        "ios-caption1": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "ios-footnote": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "ios-subheadline": ["15px", { lineHeight: "20px", fontWeight: "400" }],
        "ios-callout": ["16px", { lineHeight: "21px", fontWeight: "400" }],
        "ios-body": ["17px", { lineHeight: "22px", fontWeight: "400" }],
        "ios-headline": ["17px", { lineHeight: "22px", fontWeight: "600" }],
        "ios-title3": ["20px", { lineHeight: "25px", fontWeight: "400" }],
        "ios-title2": ["22px", { lineHeight: "28px", fontWeight: "700" }],
        "ios-title1": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        "ios-large-title": ["34px", { lineHeight: "41px", fontWeight: "700" }],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "bounce-gentle": "bounce-gentle 0.6s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "bounce-gentle": {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0,-8px,0)" },
          "70%": { transform: "translate3d(0,-4px,0)" },
          "90%": { transform: "translate3d(0,-2px,0)" },
        },
      },
      backdropBlur: {
        ios: "20px",
      },
      boxShadow: {
        ios: "0 1px 3px rgba(0, 0, 0, 0.1)",
        "ios-lg": "0 4px 16px rgba(0, 0, 0, 0.1)",
        "ios-xl": "0 8px 32px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
