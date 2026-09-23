/** @type {import('tailwindcss').Config} */
const withAlpha = (v: string) => `oklch(var(${v}) / <alpha-value>)`;

const scale = (role: string) => ({
  50: withAlpha(`--${role}-50`),
  100: withAlpha(`--${role}-100`),
  200: withAlpha(`--${role}-200`),
  300: withAlpha(`--${role}-300`),
  400: withAlpha(`--${role}-400`),
  500: withAlpha(`--${role}-500`),
  600: withAlpha(`--${role}-600`),
  700: withAlpha(`--${role}-700`),
  800: withAlpha(`--${role}-800`),
  900: withAlpha(`--${role}-900`),
  950: withAlpha(`--${role}-950`),
});

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: scale("background"),
        foreground: scale("foreground"),
        primary: scale("primary"),
        accent: scale("accent"),
        secondary: scale("secondary"),
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        body: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
        display: ["var(--font-heading)"],
        serif: ["var(--font-heading)"],
        label: ["var(--font-label)"],
        num: ["var(--font-num)"],
      },
      boxShadow: {
        soft: "0 12px 35px rgba(49,17,36,.07)",
        medium: "0 20px 50px rgba(49,17,36,.09)",
        large: "0 30px 90px rgba(49,17,36,.16)",
        menu: "0 32px 90px rgba(36,12,26,.30)",
        sm: "0 6px 20px rgba(49,17,36,.06)",
        md: "0 18px 50px rgba(49,17,36,.10)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 700ms cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
}