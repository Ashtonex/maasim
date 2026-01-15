import type { Config } from "tailwindcss"; // <--- FIXED: Import from tailwindcss

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your Custom "Velcro" Palette
        maasim: {
          pink: '#F48FB1',    // Soft Pink
          magenta: '#D81B60', // Deep Pink/Red
          lime: '#C6FF00',    // Electric Green
          yellow: '#FFD600',  // Sunny Yellow
          cyan: '#00E5FF',    // Bright Blue
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'], 
      },
      // --- NEW ANIMATION SETTINGS ---
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      // -----------------------------
    },
  },
  plugins: [],
};

export default config;