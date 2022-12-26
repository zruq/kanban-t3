/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      tablet: "620px",
      desktop: "1000px",
    },

    extend: {},
    colors: {
      purple: "#635FC7",
      purpleHover: "#A8A4FF",
      black: "#000112",
      veryDarkGrey: "#20212C",
      darkGrey: "#2B2C37",
      linesDark: "#3E3F4E",
      mediumGrey: "#828FA3",
      linesLight: "#E4EBFA",
      lightGrey: "#F4F7FD",
      white: "#fff",
      red: "#EA5555",
      redHover: "#FF9898",
    },
    fontFamily: {
      sans: ["Plus Jakarta Sans", "sans-serif"],
    },
    fontSize: {
      hxl: ["24px", { lineHeight: "30px", fontWeight: 700 }],
      hl: ["18px", { lineHeight: "23px", fontWeight: 700 }],
      hm: ["15px", { lineHeight: "19px", fontWeight: 700 }],
      hs: [
        "12px",
        { lineHeight: "15px", fontWeight: 700, letterSpacing: "2.4px" },
      ],
      bodyl: ["13px", { lineHeight: "23px", fontWeight: 500 }],
      bodym: ["12px", { lineHeight: "15px", fontWeight: 500 }],
    },
  },

  plugins: [],
};
