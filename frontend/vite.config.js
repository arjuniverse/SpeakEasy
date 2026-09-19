import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pythonBridge } from "./vite-plugin-python.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

export default defineConfig({
  plugins: [react(), pythonBridge()],
  server: {
    port: 5173,
    host: true,
    fs: { allow: [projectRoot] },
  },
  preview: {
    port: 5173,
    host: true,
  },
});
