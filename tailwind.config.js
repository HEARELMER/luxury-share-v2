/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "primary-l": {
          100: "#FFEDED",
          300: "#FF6363",
          500: "#FF0000",
        },
        primary: {
          50: "#fff0f0",
          100: "#ffdddd",
          200: "#ffc0c0",
          300: "#ff9494",
          400: "#ff5757",
          500: "#ff2323",
          600: "#ff0000",
          700: "#d70000",
          800: "#b10303",
          900: "#920a0a",
          950: "#500000",
        },
        danger: {
          100: "#EF4444",
        },
        icons: {
          100: "#C4C6CE",
        },
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
