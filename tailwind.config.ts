import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 1. THIS SAFELIST FORCES THE COLORS TO EXIST
  safelist: [
    "bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500", "bg-yellow-500",
    "bg-blue-100", "text-blue-700", "border-blue-200", "hover:border-blue-400",
    "bg-red-100", "text-red-700", "border-red-200", "hover:border-red-400",
    "bg-green-100", "text-green-700", "border-green-200", "hover:border-green-400",
    "bg-purple-100", "text-purple-700", "border-purple-200", "hover:border-purple-400",
    "bg-yellow-100", "text-yellow-800", "border-yellow-200", "hover:border-yellow-400",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;