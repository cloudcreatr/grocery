/** @type {import('tailwindcss').Config} */
const { join } = require("path");
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    join(__dirname, "../../packages/ui/components/**/*.{js,ts,jsx,tsx}"),
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
