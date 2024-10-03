import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Use the static adapter to generate a build directory
    adapter: adapter({
      pages: "build", // The directory to output the HTML files
      assets: "build", // The directory to output static assets
      fallback: "index.html", // No fallback for SPA routing
    }),
  },
  preprocess: vitePreprocess(),
};

export default config;
