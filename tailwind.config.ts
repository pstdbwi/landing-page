import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "corporate-pattern": "url('/assets/corporate-pattern.svg')",
        "corporate-pattern-2": "url('/assets/corporate-pattern-2.svg')",
        "radial-gradient": "radial-gradient(#2A3B8C, #14193A)",
        "highlight-pattern": "url('/assets/bg-highlight.png')",
        "fesyar-gold":
          "linear-gradient(90deg, #FFE7A1 0%, #DAB95A 19.47%, #F0D398 38.94%, #DAB95A 59%, #FFE7A1 79%, rgba(218, 185, 90, 0.85) 100%)",
        "fesyar-green":
          "linear-gradient(267deg, #0B4043 -9.22%, #1C7060 3.1%, #0B4043 21.87%, #0B4043 39.58%, #0B4043 63.98%, #1C7060 100.58%, #0B4043 112.79%)",
      },
      fontFamily: {
        sans: ["var(--exo)"],
        mono: ["var(--exo)"],
      },
      colors: {
        primary: {
          50: "rgb(var(--tw-color-primary-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-primary-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-primary-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-primary-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-primary-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-primary-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-primary-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-primary-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-primary-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-primary-900) / <alpha-value>)",
        },
        secondary: {
          50: "rgb(var(--tw-color-secondary-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-secondary-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-secondary-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-secondary-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-secondary-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-secondary-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-secondary-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-secondary-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-secondary-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-secondary-900) / <alpha-value>)",
        },
        orange: {
          50: "rgb(var(--tw-color-orange-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-orange-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-orange-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-orange-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-orange-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-orange-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-orange-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-orange-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-orange-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-orange-900) / <alpha-value>)",
        },
        gray: {
          50: "rgb(var(--tw-color-gray-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-gray-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-gray-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-gray-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-gray-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-gray-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-gray-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-gray-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-gray-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-gray-900) / <alpha-value>)",
        },
        danger: {
          50: "rgb(var(--tw-color-danger-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-danger-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-danger-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-danger-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-danger-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-danger-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-danger-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-danger-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-danger-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-danger-900) / <alpha-value>)",
        },
        warning: {
          50: "rgb(var(--tw-color-warning-50) / <alpha-value>)",
          100: "rgb(var(--tw-color-warning-100) / <alpha-value>)",
          200: "rgb(var(--tw-color-warning-200) / <alpha-value>)",
          300: "rgb(var(--tw-color-warning-300) / <alpha-value>)",
          400: "rgb(var(--tw-color-warning-400) / <alpha-value>)",
          500: "rgb(var(--tw-color-warning-500) / <alpha-value>)",
          600: "rgb(var(--tw-color-warning-600) / <alpha-value>)",
          700: "rgb(var(--tw-color-warning-700) / <alpha-value>)",
          800: "rgb(var(--tw-color-warning-800) / <alpha-value>)",
          900: "rgb(var(--tw-color-warning-900) / <alpha-value>)",
        },
        fesyar: {
          green: {
            50: "rgb(232, 236, 236)",
            100: "rgb(182, 195, 195)",
            200: "rgb(147, 165, 166)",
            300: "rgb(98, 124, 126)",
            400: "rgb(68, 99, 101)",
            500: "rgb(21, 60, 62)",
            600: "rgb(19, 55, 56)",
            700: "rgb(15, 43, 44)",
            800: "rgb(12, 33, 34)",
            900: "rgb(9, 25, 26)",
          },
          red: {
            50: "rgb(239, 234, 235)",
            100: "rgb(204, 189, 191)",
            200: "rgb(180, 157, 161)",
            300: "rgb(145, 112, 118)",
            400: "rgb(121, 84, 91)",
            500: "rgb(91, 41, 50)",
            600: "rgb(83, 37, 46)",
            700: "rgb(69, 29, 39)",
            800: "rgb(50, 23, 28)",
            900: "rgb(38, 17, 21)",
          },
          yellow: {
            50: "rgb(251, 248, 239)",
            100: "rgb(244, 233, 204)",
            200: "rgb(228, 223, 179)",
            300: "rgb(230, 208, 144)",
            400: "rgb(225, 193, 129)",
            500: "rgb(218, 185, 90)",
            600: "rgb(203, 168, 82)",
            700: "rgb(191, 153, 64)",
            800: "rgb(176, 132, 57)",
            900: "rgb(162, 78, 38)",
          },
        },
      },
      keyframes: {
        "accordion-down": {
          //@ts-ignore
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          //@ts-ignore
          to: { height: 0 },
        },
        "spin-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-rotate": "spin-rotate	1s linear infinite",
      },
    },

    // backgroundImage: {
    //   'onboarding-background-1': "url('/assets/onboarding-background-1.jpg')",
    // }
  },
  plugins: [],
};
export default config;
