/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.{html,js,ejs}"],
  theme: {
    screens: {
      sm: "480px",
      mmd: "600px", // mid-medium
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        primary: "#228be6",
        primaryLight: "#74c0fc",
        primaryDark: "#1864ab",
        secondary: "#2b8a3e",
        secondaryLight: "#40c057",

        blueDark1: "hsl(240, 80%, 30%)",
        blueDark2: "hsl(240, 10%, 20%)",

        greyLight1: "#f8f9fa",
        greyLight2: "#e9ecef",
        greyLight3: "#dee2e6",
        greyLight4: "#ced4da",

        greyDark1: "#868e96",
        greyDark2: "#495057",
        greyDark3: "#343a40",
        greyDark4: "#212529",
      },
    },
  },
  plugins: [],
};
