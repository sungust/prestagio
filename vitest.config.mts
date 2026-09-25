import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(process.cwd(), "src"), "server-only": path.resolve(process.cwd(), "tests/server-only-stub.ts") } },
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
});
