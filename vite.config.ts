import solid from "solid-start/vite";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [solid(), eslint()],
});
