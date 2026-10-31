import { defineConfig } from "vitest/config"; 
import path from "path"; 
export default defineConfig({ 
  test: { 
    globals: true, 
    environment: "node", 
    fileParallelism: false, 
    env: { MOCK_API: "false", NODE_ENV: "test", DATABASE_URL: "postgresql://loopos:loopos_secret_password@localhost:5433/loopos_dev?schema=public" }, 
    include: ["tests/integration/**/*.itest.ts"], 
  }, 
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } }, 
}); 
