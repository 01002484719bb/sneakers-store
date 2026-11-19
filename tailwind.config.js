/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      colors: {
        white: v("white"),
        stone: {
          50: v("s50"),
          100: v("s100"),
          200: v("s200"),
          300: v("s300"),
          400: v("s400"),
          500: v("s500"),
          600: v("s600"),
          700: v("s700"),
          800: v("s800"),
          900: v("s900"),
        },
        accent: "#f97316",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.45)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.3s ease-out both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        pop: "pop 0.35s ease-out",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};