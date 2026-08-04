import forms from "@tailwindcss/forms";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
		"./storage/framework/views/*.php",
		"./resources/views/**/*.blade.php",
		"./resources/js/**/*.jsx",
	],

	theme: {
		screens: {
			sm: "600px",
			md: "900px",
			lg: "1200px",
		},
		extend: {
			colors: {
				bg: "#FAF7F2",
				card: "#F0E8DC",
				espresso: "#3B1F0E",
				brown: "#5C3317",
				caramel: {
					DEFAULT: "#C47B3A",
					hover: "#B36B2C",
				},
				mocha: "#7A6152",
				line: "#E8DDD4",
				success: "#3A7A3A",
				successbg: "#EEF7EE",
				successborder: "#C3E0C3",
				error: "#C0392B",
			},
			fontFamily: {
				display: ['"Playfair Display"', "Georgia", "serif"],
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				display: ["42px", { lineHeight: "1.15", letterSpacing: "-0.5px" }],
				"display-sm": ["28px", { lineHeight: "1.2" }],
			},
			borderRadius: {
				sm: "6px",
				md: "8px",
				lg: "12px",
				xl: "16px",
				"2xl": "20px",
			},
			boxShadow: {
				card: "0 2px 16px rgba(59,31,14,0.08)",
				"card-hover": "0 10px 28px rgba(59,31,14,0.15)",
				lift: "0 4px 12px rgba(196,123,58,0.3)",
				modal:
					"0 24px 64px rgba(59,31,14,0.22), 0 8px 24px rgba(59,31,14,0.12), 0 0 0 1px rgba(59,31,14,0.06)",
				ring: "0 0 0 3px rgba(196,123,58,0.12)",
			},
			spacing: {
				13: "52px",
				14: "56px",
				15: "60px",
			},
		},
	},

	plugins: [forms],
};
