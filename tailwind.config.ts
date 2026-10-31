import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary, #4F46E5)",
          hover: "var(--primary-hover, #4338CA)",
        },
        accent: "var(--accent, #8B5CF6)",
        background: "var(--background, #0A0D14)",
        surface: "var(--surface, #121722)",
        border: "var(--border, #242E42)",
        "text-main": "var(--text-main, #F1F5F9)",
        "text-muted": "var(--text-muted, #94A3B8)",
        "text-dim": "var(--text-dim, #64748B)",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "16px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
