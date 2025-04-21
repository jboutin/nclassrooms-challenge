/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["nord"],
		base: true,
		styled: true,
		utils: true,
	},
};