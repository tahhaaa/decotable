import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#C4A484",
        ink: "#000000",
        cream: "#F8F4EE",
        sand: "#E7D8C8",
        stone: "#76685C",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      boxShadow: {
        luxe: "0 24px 80px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(196, 164, 132, 0.22), transparent 32%), linear-gradient(180deg, rgba(248,244,238,1) 0%, rgba(255,255,255,1) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
