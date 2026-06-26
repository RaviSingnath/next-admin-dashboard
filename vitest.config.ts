import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  test: {
    globals: true,

    // Default for business logic tests
    environment: "node",

    setupFiles: ["./vitest.setup.ts"],

    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
