import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    // MapLibre creates its own web worker and must stay out of Vite's dev pre-bundle.
    exclude: ["maplibre-gl"],
  },
  build: {
    outDir: "dist",
  },
});
