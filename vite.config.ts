import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import commonjs from "@rollup/plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    // 将 CommonJS 模块转换为 ES6
    commonjs(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
  },
  optimizeDeps: {
    include: ["ckeditor5-custom-build"],
  },
  build: {
    commonjsOptions: { exclude: ["ckeditor5-custom-build"], include: [] },
  },
});
