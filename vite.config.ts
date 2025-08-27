import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "use-reactive",
      fileName: (format) => `use-reactive.${format}.js`,
      formats: ["es", "umd"],
    },
  },
  plugins: [react()],
});
