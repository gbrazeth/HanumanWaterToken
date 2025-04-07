/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
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
        background: "#E8E4D9", // Beige background from logo
        foreground: "#1A1A1A",
        primary: {
          DEFAULT: "#8B0000", // Deep red from logo
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#DAA520", // Gold from logo
          foreground: "#1A1A1A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F5F2E8", // Lighter beige
          foreground: "#4A4A4A",
        },
        accent: {
          DEFAULT: "#8B0000", // Deep red from logo
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#E8E4D9",
          foreground: "#1A1A1A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

