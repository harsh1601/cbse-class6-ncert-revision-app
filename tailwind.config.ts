import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        paper: "#f8fbff",
        moss: "#16a34a",
        coral: "#ef4444",
        amber: "#f59e0b",
        lagoon: "#0ea5e9",
        plum: "#a855f7",
      },
      boxShadow: {
        soft: "0 18px 55px rgba(20, 33, 61, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
