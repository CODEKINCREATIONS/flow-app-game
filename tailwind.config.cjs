/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F111A",
        surface: "#1A1C25",
        primary: "#4CC9F0",
        secondary: "#3A8DFF",
        gradientStart: "#7B61FF",
        gradientEnd: "#3A8DFF",
        textPrimary: "#FFFFFF",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [],
};
