import { fileURLToPath } from "node:url";
import { wayfinder } from "@laravel/vite-plugin-wayfinder";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		laravel({
			input: "resources/js/app.jsx",
			refresh: true,
		}),
		react(),
		wayfinder(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./resources/js", import.meta.url)),
		},
	},
});
