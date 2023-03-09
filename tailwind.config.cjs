/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontSize: {
        xs: "0.65rem",
      },
    },
  },
  darkMode: "class",
  plugins: [require("flowbite/plugin")],
};
