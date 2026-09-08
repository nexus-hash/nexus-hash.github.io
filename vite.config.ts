import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `base: "./"` emits relative asset URLs in the build, so the site works
// identically at username.github.io/ (root) or username.github.io/repo-name/
// (project page) with zero config changes either way.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
