import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pythonBridge } from "./vite-plugin-python.js";

export default defineConfig({
  plugins: [react(), pythonBridge()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
});
