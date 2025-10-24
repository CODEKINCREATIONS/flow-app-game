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
        primary: "#7B61FF",
        secondary: "#3A8DFF",
        textPrimary: "#FFFFFF",
        accent: "#4CC9F0",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(123, 97, 255, 0.4)",
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
