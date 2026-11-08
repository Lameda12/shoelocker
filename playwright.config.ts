import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e", timeout: 30_000, reporter: "list", use: { baseURL: "http://localhost:3100", trace: "off", launchOptions: { executablePath: process.env.PW_CHROMIUM ?? undefined } },
  webServer: { command: "npm run build && npx next start -p 3100", url: "http://localhost:3100", reuseExistingServer: true, timeout: 240_000 },
});
