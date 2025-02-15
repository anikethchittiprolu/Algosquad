module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: "#00FFFF",
          500: "#00CCCC",
        },
        purple: {
          400: "#BF40BF",
          500: "#9C27B0",
        },
        pink: {
          500: "#FF00FF",
          600: "#E600E6",
        },
      },
      boxShadow: {
        "neon-glow": "0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4)",
        "profile-glow": "0 0 20px rgba(0, 255, 255, 0.4)",
      },
      animation: {
        "holo-ring": "holo-ring 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 12s linear infinite",
        "rotate-medium": "rotate-slow 8s linear infinite reverse",
        "rotate-fast": "rotate-slow 4s linear infinite",
      },
      keyframes: {
        "holo-ring": {
          "0%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.05)" },
          "100%": { opacity: "0.2", transform: "scale(1)" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};