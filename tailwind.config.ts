import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        background: "#0F172A", // Deep Slate
        foreground: "#F8FAFC", // Slate 50
        brand: {
          dark: "#0F172A",
          slate: "#1E293B",
        },
        risk: {
          safe: "#10B981", // Emerald 500
          elevated: "#F59E0B", // Amber 500
          high: "#EF4444", // Red 500 (Crimson-ish)
        },
        card: {
          DEFAULT: "#1E293B",
          foreground: "#F8FAFC",
        },
        popover: {
          DEFAULT: "#0F172A",
          foreground: "#F8FAFC",
        },
        primary: {
          DEFAULT: "#F8FAFC",
          foreground: "#0F172A",
        },
        secondary: {
          DEFAULT: "#334155",
          foreground: "#F8FAFC",
        },
        muted: {
          DEFAULT: "#334155",
          foreground: "#94A3B8",
        },
        accent: {
          DEFAULT: "#334155",
          foreground: "#F8FAFC",
        },
        destructive: {
          DEFAULT: "#7F1D1D",
          foreground: "#F8FAFC",
        },
        border: "#334155",
        input: "#334155",
        ring: "#F59E0B", // Amber ring for focus
        chart: {
          "1": "#10B981",
          "2": "#F59E0B",
          "3": "#EF4444",
          "4": "#3B82F6",
          "5": "#8B5CF6",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
        'radar-gradient': "radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
      }
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      "scan-horizontal": "scan-horizontal 2s linear infinite",
      "terminal-scroll": "terminal-scroll 15s linear infinite",
      "fade-in-up": "fade-in-up 0.8s ease-out forwards",
      "radar-expand": "radar-expand 3s ease-out infinite"
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
      "scan-horizontal": {
        "0%": { transform: "translateX(-100%)", opacity: "0" },
        "50%": { opacity: "1" },
        "100%": { transform: "translateX(100%)", opacity: "0" },
      },
      "terminal-scroll": {
        "0%": { transform: "translateY(0)" },
        "100%": { transform: "translateY(-50%)" },
      },
      "fade-in-up": {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      "radar-expand": {
        "0%": { transform: "scale(0.8)", opacity: "0.5" },
        "100%": { transform: "scale(1.5)", opacity: "0" }
      }
    },
  },

  plugins: [require("tailwindcss-animate")],
} satisfies Config;
