import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function gitSha(): string {
  const fromCi = process.env.GITHUB_SHA;
  if (fromCi) return fromCi.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

// `base: "./"` emits relative asset URLs in the build, so the site works
// identically at username.github.io/ (root) or username.github.io/repo-name/
// (project page) with zero config changes either way.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_SHA__: JSON.stringify(gitSha()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
});
