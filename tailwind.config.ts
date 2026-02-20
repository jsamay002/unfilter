import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, approachable palette — not clinical, not childish
        sand: {
          50: "#faf8f5",
          100: "#f3f0ea",
          200: "#e8e2d8",
          300: "#d5cbbe",
          400: "#b8a99a",
          500: "#9a8b7a",
          600: "#7d6e5f",
          700: "#635747",
          800: "#4a4035",
          900: "#342d25",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e4ece4",
          200: "#c8d9c8",
          300: "#a3bfa3",
          400: "#7da37d",
          500: "#5c875c",
          600: "#476b47",
          700: "#3a553a",
          800: "#2f432f",
          900: "#253525",
        },
        coral: {
          50: "#fef5f3",
          100: "#fde8e3",
          200: "#fcd4cb",
          300: "#f8b4a6",
          400: "#f28b75",
          500: "#e8664d",
          600: "#d44a32",
          700: "#b23a26",
          800: "#933222",
          900: "#7a2d21",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
