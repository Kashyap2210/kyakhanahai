/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      zIndex: {
        9999: 9999,
      },
      height: {
        "calc-100vh-minus-80": "calc(100vh - 80px)",
      },
      minHeight: {
        "calc-100vh-minus-80": "calc(100vh - 80px)",
      },
    },
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
