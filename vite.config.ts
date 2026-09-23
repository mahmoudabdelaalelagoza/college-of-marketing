import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const base = process.env.BASE_PATH || "/";
const isPreview = process.env.IS_PREVIEW ? true : false;

export default defineConfig({
  root: "frontend",
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
  },
  plugins: [react()],
  base,
  build: {
    sourcemap: isPreview,
    outDir: "../out",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./frontend/src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
