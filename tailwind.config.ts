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
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
