import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A5F",
          light:   "#2A517F",
          dark:    "#152C48",
          50:      "#EBF0F7",
          100:     "#C2D2E7",
        },
        secondary: {
          DEFAULT: "#2D6A4F",
          light:   "#3A8463",
          dark:    "#1F4D38",
          50:      "#EAF4EF",
          100:     "#B8DECA",
        },
        accent: {
          DEFAULT: "#E07B39",
          light:   "#E9924F",
          dark:    "#C4682A",
          50:      "#FDF2EB",
          100:     "#F5CBA7",
        },
      },
      fontFamily: {
        heading: ["var(--font-inter)", "sans-serif"],
        body:    ["var(--font-source-sans)", "sans-serif"],
      },
      boxShadow: {
        card:  "0 2px 16px rgba(30,58,95,0.08)",
        hover: "0 8px 32px rgba(30,58,95,0.18)",
        cta:   "0 4px 24px rgba(224,123,57,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
