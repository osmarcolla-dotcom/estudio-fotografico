/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#F6F4EF",
          card: "#FFFFFF",
          dark: "#17212B",
          text: "#17212B",
          muted: "#5E6973",
          emerald: "#315B52",
          terracotta: "#C98576",
          border: "#E6E1D8",
          sand: "#D9D1C2",
          sandLight: "#ECE7DF",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
