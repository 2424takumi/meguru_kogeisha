import { defineConfig } from "vitest/config"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: false,
  },
  plugins: [
    {
      name: "vitest-topojson-loader",
      load(id) {
        const [filepath] = id.split("?")
        if (!filepath.endsWith(".topojson")) {
          return null
        }
        const source = readFileSync(filepath, "utf8")
        return {
          code: `export default ${source}`,
          map: null,
        }
      },
    },
  ],
  esbuild: {
    jsx: "automatic",
    jsxDev: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
