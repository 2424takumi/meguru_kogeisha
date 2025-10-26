import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./docs/**/*.{md,mdx}",
  ],
  corePlugins: {
    backgroundImage: false,
    gradientColorStops: false,
  },
}

export default config
