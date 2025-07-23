import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		sourcemap: false,
	},
	server: {
		port: 9000, // Replace 3001 with your desired port
	},
});
