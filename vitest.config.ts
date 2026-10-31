import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      MOCK_API: "true",
      DATABASE_URL: "postgresql://loopos:loopos_secret@localhost:5432/loopos_db?schema=public",
      NODE_ENV: "test",
    },
    include: ["src/**/__tests__/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["node_modules", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/modules": path.resolve(__dirname, "./src/modules"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/contracts": path.resolve(__dirname, "./src/contracts"),
      "@/app": path.resolve(__dirname, "./src/app"),
    },
  },
});
