/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#0B1220",
          card: "#121A2B",
          soft: "#1B2438",
          text: "#F3F4F6",
          muted: "#9CA3AF",
          accent: "#E50914"
        }
      },
      boxShadow: {
        glow: "0 10px 30px rgba(229, 9, 20, 0.25)"
      },
      animation: {
        "fade-in": "fadeIn 500ms ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
