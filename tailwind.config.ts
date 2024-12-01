import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "0rem",
      screens: {
        "2xl": "1792px",
        "3xl": "2048px",
      },
    },
    extend: {
      colors: {
        primary_dark: "hsl(var(--matte-black))",
        primary_light: "hsl(var(--l-gray))",
        secondary_dark: "hsl(var(--lgray))",
        card_dark: "hsl(var(--dark-gray))",
        primary_text: "hsl(var(--orange))",
        secondary_text: "hsl(var(--medium-blue))",
        vl_blue: "hsl(var(--vl-blue))",
        blue: "hsl(var(--blue))",
        greenish_blue: "hsl(var(--greenish-blue))",
        deep_blue: "hsl(var(--deep-blue))",
        dark_blue: "hsl(var(--dark-blue))",
        btn_blue: "hsl(var(--btn-blue))",
        purple: "hsl(var(--purple))",
        shadow_gray: "hsl(var(--shadow-gray))",
        l_orange: "hsl(var(--l-orange))",
        bg_gray: "hsl(var(--light-gray))",
        vll_gray: "hsl(var(--vl-gray))",
        vl_gray: "hsl(var(--v-l-gray))",
        text_gray: "hsl(var(--text-gray))",
        grayy: "hsl(var(--grayy))",
        sidebar_gray: "hsl(var(--sidebar-gray))",
        sidebar_blue: "hsl(var(--sidebar-blue))",
        teal: "hsl(var(--teal))",
        deep_teal: "hsl(var(--deep-teal))",
        light_sea_green: "hsl(var(--light-sea-green))",
        deep_red: "hsl(var(--deep-red))",
        charcoal: "hsl(var(--charcoal))",
        olivedrab: "hsl(var(--olivedrab))",
        beige: "hsl(var(--beige))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
